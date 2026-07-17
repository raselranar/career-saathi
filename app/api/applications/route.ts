import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const userId = new ObjectId(session.user.id);

    // Fetch applications
    const applications = await db
      .collection("application")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();

    // Populate job details for each application
    const populatedApplications = await Promise.all(
      applications.map(async (app) => {
        let job = null;
        if (app.jobId) {
          job = await db
            .collection("jobPosting")
            .findOne({ _id: new ObjectId(app.jobId) });
        }
        return {
          ...app,
          job,
        };
      }),
    );

    return NextResponse.json(populatedApplications);
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, title, company, location, category, employmentType, fullDescription, status } = body;

    const db = await getDb();
    const userId = new ObjectId(session.user.id);

    let finalJobId: ObjectId;

    // If a standard jobId was passed, use it. Otherwise, create a custom jobPosting entry
    if (jobId && ObjectId.isValid(jobId)) {
      finalJobId = new ObjectId(jobId);
    } else {
      // Validate custom job posting inputs
      if (!title || !company || !fullDescription) {
        return NextResponse.json(
          { error: "Missing required fields for custom job posting" },
          { status: 400 },
        );
      }

      const customJob = {
        title,
        company,
        location: location || "Remote",
        category: category || "Engineering",
        employmentType: employmentType || "full-time",
        shortDescription: fullDescription.substring(0, 150) + "...",
        fullDescription,
        postedAt: new Date(),
      };

      const jobResult = await db.collection("jobPosting").insertOne(customJob);
      finalJobId = jobResult.insertedId;
    }

    // Check if user already has this job tracked
    const existing = await db.collection("application").findOne({
      userId,
      jobId: finalJobId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You are already tracking this job application" },
        { status: 400 },
      );
    }

    // Create the application
    const newApplication = {
      userId,
      jobId: finalJobId,
      status: status || "saved",
      notes: "",
      generatedCoverLetter: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const appResult = await db.collection("application").insertOne(newApplication);

    return NextResponse.json({
      _id: appResult.insertedId,
      ...newApplication,
    });
  } catch (error) {
    console.error("Failed to create application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}
