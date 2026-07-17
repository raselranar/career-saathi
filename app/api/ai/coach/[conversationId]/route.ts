import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const { conversationId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const userId = new ObjectId(session.user.id);

    // If "new" is requested, check if we need to create one, or return a new ID
    if (conversationId === "new") {
      const jobId = request.nextUrl.searchParams.get("jobId");
      
      const newConversation = {
        userId,
        jobId: jobId && ObjectId.isValid(jobId) ? new ObjectId(jobId) : undefined,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection("coachConversation").insertOne(newConversation);
      return NextResponse.json({
        _id: result.insertedId,
        ...newConversation,
      });
    }

    if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 });
    }

    const conv = await db
      .collection("coachConversation")
      .findOne({ _id: new ObjectId(conversationId) });

    if (!conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conv.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(conv);
  } catch (error) {
    console.error("Failed to fetch conversation history:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation history" },
      { status: 500 },
    );
  }
}
