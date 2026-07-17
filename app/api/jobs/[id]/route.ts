import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const db = await getDb();
    const job = await db
      .collection("jobPosting")
      .findOne({ _id: new ObjectId(id) });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Fetch related jobs (same category, excluding current)
    const relatedJobs = await db
      .collection("jobPosting")
      .find({
        _id: { $ne: new ObjectId(id) },
        category: job.category,
      })
      .limit(3)
      .toArray();

    return NextResponse.json({ job, relatedJobs });
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 },
    );
  }
}
