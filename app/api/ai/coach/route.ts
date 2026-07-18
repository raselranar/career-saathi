import { NextRequest, NextResponse } from "next/server";
import { toUIMessageStream, createUIMessageStreamResponse } from "ai";
import { getDb } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { ObjectId } from "mongodb";
import { buildCoachSystemPrompt } from "@/lib/coach-prompt";
import { streamTextWithFallback } from "@/lib/ai-models";

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, jobId, conversationId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Conversation history (messages) is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const userId = new ObjectId(session.user.id);

    // Retrieve job details to scope the interviewer persona
    let jobDetails = null;
    if (jobId && ObjectId.isValid(jobId)) {
      jobDetails = await db
        .collection("jobPosting")
        .findOne({ _id: new ObjectId(jobId) });
    }
    // Default mock context if no job found/passed
    const mockContext = {
      title: jobDetails?.title || "General Professional",
      company: jobDetails?.company || "Interviewer Corp",
      category: jobDetails?.category || "Engineering",
      employmentType: jobDetails?.employmentType || "full-time",
      fullDescription:
        jobDetails?.fullDescription ||
        "A mock interview to practice general professional, soft, and problem-solving skills.",
    };

    const systemPrompt = buildCoachSystemPrompt(mockContext);

    // Format messages for Vercel AI SDK
    // useChat v5 sends UIMessage format with `parts` array, not flat `content`
    const formattedMessages = messages
      .map((m: { role: string; content?: string; parts?: Array<{ type: string; text?: string }> }) => {
        // Extract text from parts array (useChat v5 format)
        const textFromParts = m.parts
          ?.filter((p) => p.type === "text")
          .map((p) => p.text ?? "")
          .join("") ?? "";

        const content = textFromParts || m.content || "";
        return { role: m.role as "user" | "assistant", content };
      })
      .filter((m) => m.content.length > 0);

    // If conversationId is passed, save history after streaming completes
    // Note: Better to let the client save or handle persistence. Let's persist
    // the user's latest chat turn in the DB asynchronously or via client.
    if (conversationId && ObjectId.isValid(conversationId)) {
      const dbMessages = messages
        .map((m: { role: string; content?: string; parts?: Array<{ type: string; text?: string }> }) => {
          const textFromParts = m.parts
            ?.filter((p) => p.type === "text")
            .map((p) => p.text ?? "")
            .join("") ?? "";
          const content = textFromParts || m.content || "";
          return {
            role: m.role as "user" | "assistant",
            content,
            createdAt: new Date(),
          };
        })
        .filter((m) => m.content.length > 0);

      // Async update in DB
      db.collection("coachConversation").updateOne(
        { _id: new ObjectId(conversationId), userId },
        {
          $set: {
            messages: dbMessages,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    }

    const result = await streamTextWithFallback({
      system: systemPrompt,
      messages: formattedMessages,
      onFinish: async ({ text }: { text: string }) => {
        if (conversationId && ObjectId.isValid(conversationId)) {
          // Append the final assistant response to the conversation in the database
          const assistantMsg = {
            role: "assistant" as const,
            content: text,
            createdAt: new Date(),
          };
          await db.collection("coachConversation").updateOne(
            { _id: new ObjectId(conversationId), userId },
            {
              $push: { messages: assistantMsg } as never,
              $set: { updatedAt: new Date() },
            },
          );
        }
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("Failed in mock coach API:", error);
    return NextResponse.json(
      { error: "Failed to process chat turn" },
      { status: 500 },
    );
  }
}
