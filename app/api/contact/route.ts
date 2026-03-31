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

// Store submissions in a local JSON file (backup / admin reference)
const SUBMISSIONS_FILE = path.join(process.cwd(), "public", "contact-submissions.json");

async function sendEmailNotification(submission: ContactSubmission) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return; // Skip if not configured

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2C1A0E;">
      <div style="background: #2C1A0E; padding: 24px 32px; margin-bottom: 0;">
        <h1 style="color: #FAF7F2; font-size: 20px; font-weight: 300; letter-spacing: 0.15em; margin: 0;">
          SOFIE GULLSTRÖM
        </h1>
        <p style="color: rgba(250,247,242,0.5); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 6px 0 0; font-family: sans-serif;">
          Ny kontaktförfrågan
        </p>
      </div>
      <div style="background: #FAF8F4; padding: 32px; border: 1px solid #DBC9A8;">
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
          <tr style="border-bottom: 1px solid #DBC9A8;">
            <td style="padding: 12px 0; color: #722F37; font-weight: 600; width: 35%; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Namn</td>
            <td style="padding: 12px 0;">${submission.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #DBC9A8;">
            <td style="padding: 12px 0; color: #722F37; font-weight: 600; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Företag</td>
            <td style="padding: 12px 0;">${submission.company || "—"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #DBC9A8;">
            <td style="padding: 12px 0; color: #722F37; font-weight: 600; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">E-post</td>
            <td style="padding: 12px 0;"><a href="mailto:${submission.email}" style="color: #2C1A0E;">${submission.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #DBC9A8;">
            <td style="padding: 12px 0; color: #722F37; font-weight: 600; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Typ</td>
            <td style="padding: 12px 0;">${submission.type || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #722F37; font-weight: 600; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; vertical-align: top;">Meddelande</td>
            <td style="padding: 12px 0; line-height: 1.6;">${submission.message.replace(/\n/g, "<br>")}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; font-family: sans-serif; font-size: 11px; color: #8B6F5E; letter-spacing: 0.05em;">
          Skickat: ${new Date(submission.submittedAt).toLocaleString("sv-SE")}
        </p>
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #DBC9A8;">
          <a href="mailto:${submission.email}?subject=Re: Din förfrågan"
            style="display: inline-block; background: #722F37; color: #FAF7F2; padding: 10px 24px; text-decoration: none; font-family: sans-serif; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">
            Svara
          </a>
        </div>
      </div>
    </div>
  `;

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || "portfolio@sofiegullstrom.com";
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Sofie Portfolio <${fromEmail}>`,
        to: ["sofie@scalegroups.com"],
        reply_to: submission.email,
        subject: `Ny förfrågan: ${submission.name}${submission.company ? ` (${submission.company})` : ""} – ${submission.type || "Kontakt"}`,
        html,
      }),
    });
  } catch (err) {
    // Log but don't fail the request — submission is already saved
    console.error("Email notification failed:", err);
  }
}

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

    // Send email notification (non-blocking)
    await sendEmailNotification(submission);

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
