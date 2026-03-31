import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface ContactSubmission {
  name: string;
  company?: string;
  email: string;
  type: string;
  message: string;
  locale: string;
  submittedAt: string;
}

// Store submissions in a local JSON file (simple file-based approach)
const SUBMISSIONS_FILE = path.join(process.cwd(), "public", "contact-submissions.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const submission: ContactSubmission = {
      name: body.name ?? "",
      company: body.company ?? "",
      email: body.email ?? "",
      type: body.type ?? "",
      message: body.message ?? "",
      locale: body.locale ?? "en",
      submittedAt: new Date().toISOString(),
    };

    // Basic validation
    if (!submission.name || !submission.email || !submission.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Read existing submissions
    let submissions: ContactSubmission[] = [];
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      try {
        submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf-8"));
      } catch {
        submissions = [];
      }
    }

    // Append and save
    submissions.push(submission);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([]);
  }
}
