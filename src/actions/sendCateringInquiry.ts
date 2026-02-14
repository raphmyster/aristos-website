"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import CateringInquiryEmail from "@/emails/CateringInquiry";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Rate limiting (in-memory, resets on cold start) ──
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];

  // Remove expired entries
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// Periodically clean up stale entries (every 100 calls)
let callCount = 0;
function maybeCleanup() {
  callCount++;
  if (callCount % 100 !== 0) return;
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recent);
    }
  }
}

// ── Validation ──
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message: string;
  website: string; // honeypot
}

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function sendCateringInquiry(
  data: InquiryFormData,
): Promise<ActionResult> {
  // Honeypot check — silently "succeed" if bot filled it
  if (data.website) {
    return { success: true };
  }

  // Rate limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  maybeCleanup();

  if (isRateLimited(ip)) {
    return {
      success: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  // Server-side validation
  if (!data.name.trim()) {
    return { success: false, error: "Name is required." };
  }
  if (!data.email.trim() || !EMAIL_REGEX.test(data.email.trim())) {
    return { success: false, error: "A valid email is required." };
  }
  if (!data.phone.trim()) {
    return { success: false, error: "Phone number is required." };
  }
  if (!data.eventDate.trim()) {
    return { success: false, error: "Event date is required." };
  }
  if (!data.guestCount.trim()) {
    return { success: false, error: "Guest count is required." };
  }

  // Send email
  const siteEmail = process.env.SITE_CONTACT_EMAIL || "hello@aristos.com";

  const { error } = await resend.emails.send({
    from: "Aristos Website <onboarding@resend.dev>",
    to: siteEmail,
    subject: `Catering Inquiry from ${data.name.trim()}`,
    react: CateringInquiryEmail({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      eventDate: data.eventDate.trim(),
      guestCount: data.guestCount.trim(),
      message: data.message.trim() || undefined,
    }),
  });

  if (error) {
    console.error("Resend error:", error);
    return {
      success: false,
      error: "Failed to send your inquiry. Please try again.",
    };
  }

  return { success: true };
}
