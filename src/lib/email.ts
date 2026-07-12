import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const FROM = process.env.EMAIL_FROM ?? "alerts@media-monitor.local";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
  });
}

/**
 * Sends an email via SMTP when configured; otherwise "sends" it by logging
 * to the console and recording it in EmailLog so it's visible in the app.
 * This lets the whole alert pipeline run end-to-end with no external
 * credentials, while staying a one-env-var swap away from real delivery.
 */
export async function sendEmail({
  to,
  subject,
  body,
  savedSearchId,
}: {
  to: string;
  subject: string;
  body: string;
  savedSearchId?: string;
}) {
  const transport = getTransport();

  if (!transport) {
    console.log(`[email:logged] to=${to} subject="${subject}"`);
    await prisma.emailLog.create({
      data: { to, subject, body, status: "LOGGED", savedSearchId },
    });
    return { status: "LOGGED" as const };
  }

  try {
    await transport.sendMail({ from: FROM, to, subject, html: body });
    await prisma.emailLog.create({
      data: { to, subject, body, status: "SENT", savedSearchId },
    });
    return { status: "SENT" as const };
  } catch (err) {
    console.error("[email:failed]", err);
    await prisma.emailLog.create({
      data: { to, subject, body, status: "FAILED", savedSearchId },
    });
    return { status: "FAILED" as const };
  }
}
