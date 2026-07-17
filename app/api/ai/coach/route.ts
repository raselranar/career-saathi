import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { buildCoachSystemPrompt } from "@/lib/coach-prompt";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
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
      fullDescription: jobDetails?.fullDescription || "A mock interview to practice general professional, soft, and problem-solving skills.",
    };

    const systemPrompt = buildCoachSystemPrompt(mockContext);

    // Format messages for Vercel AI SDK
    // The client sends messages array from useChat: [{ id, role, content }]
    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // If conversationId is passed, save history after streaming completes
    // Note: Better to let the client save or handle persistence. Let's persist
    // the user's latest chat turn in the DB asynchronously or via client.
    if (conversationId && ObjectId.isValid(conversationId)) {
      const dbMessages = messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: new Date(),
      }));

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

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      messages: formattedMessages,
      // When the stream finishes, we can save the final turn if needed
      onFinish: async ({ text }) => {
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

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Failed in mock coach API:", error);
    return NextResponse.json(
      { error: "Failed to process chat turn" },
      { status: 500 },
    );
  }
}
