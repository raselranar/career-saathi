import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, generatedCoverLetter } = body;

    const db = await getDb();
    const userId = new ObjectId(session.user.id);
    const appId = new ObjectId(id);

    // Find application first to verify ownership
    const app = await db.collection("application").findOne({ _id: appId });

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (app.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (generatedCoverLetter !== undefined)
      updateData.generatedCoverLetter = generatedCoverLetter;

    await db
      .collection("application")
      .updateOne({ _id: appId }, { $set: updateData });

    return NextResponse.json({ message: "Application updated successfully" });
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const userId = new ObjectId(session.user.id);
    const appId = new ObjectId(id);

    // Verify ownership
    const app = await db.collection("application").findOne({ _id: appId });

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (app.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("application").deleteOne({ _id: appId });

    return NextResponse.json({ message: "Application removed successfully" });
  } catch (error) {
    console.error("Failed to delete application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 },
    );
  }
}
