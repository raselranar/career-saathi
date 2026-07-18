import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { streamTextWithFallback } from "@/lib/ai-models";

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      company,
      skills,
      tone,
      outputType,
      length,
      fullDescription,
    } = body;

    if (!title || !fullDescription) {
      return NextResponse.json(
        { error: "Job title and description are required" },
        { status: 400 },
      );
    }

    const lengthGuide =
      length === "short"
        ? "Keep it very concise, around 1-2 paragraphs or 5 bullet points."
        : length === "long"
          ? "Make it detailed and comprehensive, around 4-5 paragraphs or 10 bullet points."
          : "Make it a standard medium length, around 3 paragraphs or 6-8 bullet points.";

    const toneGuide =
      tone === "formal"
        ? "Use a professional, polite, and polished tone suited for traditional corporate settings."
        : tone === "friendly"
          ? "Use a warm, approachable, and engaging tone that showcases personality."
          : "Use a confident, energetic, and value-driven tone highlighting achievements.";

    let outputTypeGuide = "";
    if (outputType === "Cover Letter") {
      outputTypeGuide =
        "Format the output as a fully drafted cover letter including sender/recipient placeholders, an engaging opening, body paragraphs mapping the candidate's skills to the job description, and a strong call-to-action closing.";
    } else if (outputType === "Resume Bullets") {
      outputTypeGuide =
        "Format the output as a list of high-impact resume bullet points starting with strong action verbs. Quantify achievements where possible, mapping candidate skills directly to key responsibilities in the job description.";
    } else {
      outputTypeGuide =
        "Format the output as a professional LinkedIn summary/About section. Write in the first person, make it engaging and narrative-driven, showing what the candidate does, their skills, and how they help companies succeed.";
    }

    const prompt = `You are an expert career coach helping a candidate apply for the following role:
Job Title: ${title}
Company: ${company || "Target Company"}

Here is the Job Description:
---
${fullDescription}
---

Here are the candidate's key skills, experiences, and notes:
---
${skills || "A passionate professional matching the requirements of the job."}
---

Your task is to write a tailored: ${outputType}
Guidelines:
1. Tone: ${toneGuide}
2. Length: ${lengthGuide}
3. ${outputTypeGuide}
4. Focus strictly on mapping the candidate's skills to the specific requirements of the job posting. Do not invent details not supported by the candidate's skills, but present their skills in the best possible light relative to the JD.
5. Provide ONLY the final generated content without any introductory or concluding chatter.`;

    const result = await streamTextWithFallback({
      prompt,
    });
    console.log(result.toTextStreamResponse());
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Failed to generate content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    );
  }
}
