import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export const prerender = false;

// Simple in-memory rate limiter (Resets on server restart)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email({ message: "Invalid email address" }).max(100),
  message: z.string().min(10, "Message is too short").max(3000),
  fax: z.string().max(100).optional(), // Honeypot field
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  console.log("--> API /contact reached!", { method: request.method, url: request.url });
  try {
    // 1. Rate Limiting
    let ip = 'unknown';
    try {
      ip = clientAddress || 'unknown';
    } catch (e) {
      console.warn("Failed to get clientAddress:", e);
    }
    const now = Date.now();
    const clientRecord = rateLimit.get(ip);
    
    if (clientRecord) {
      if (now - clientRecord.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (clientRecord.count >= MAX_REQUESTS_PER_WINDOW) {
          return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        clientRecord.count++;
      } else {
        rateLimit.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // 2. CSRF / Origin Check
    const origin = request.headers.get('origin');
    // In production, enforce origin matching
    if (import.meta.env.PROD && origin) {
      const allowedDomains = ['davideiken.com', 'davideiken.de', 'localhost'];
      const isAllowed = allowedDomains.some(domain => origin.includes(domain));
      if (!isAllowed) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
      }
    }

    // 3. Parse and Validate Body
    const formData = await request.formData();
    const data = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      fax: formData.get('fax')?.toString() || '',
    };

    const validatedData = contactSchema.parse(data);

    // 4. Honeypot Check
    if (validatedData.fax) {
      // Silently succeed to trick the bot
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. Send Email
    const smtpHost = process.env.SMTP_HOST || import.meta.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || import.meta.env.SMTP_PORT) || 587;
    const smtpSecure = (process.env.SMTP_SECURE || import.meta.env.SMTP_SECURE) === 'true';
    const smtpUser = process.env.SMTP_USER || import.meta.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || import.meta.env.SMTP_PASS;
    const contactEmail = process.env.CONTACT_EMAIL || import.meta.env.CONTACT_EMAIL || smtpUser;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${validatedData.name}" <${smtpUser}>`, // Send via authenticated user
      replyTo: validatedData.email,
      to: contactEmail,
      subject: `Contact Request: ${validatedData.name}`,
      text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\n\nMessage:\n${validatedData.message}`,
    });

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully!" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Contact Form Error:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid form data.", details: error.issues }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error. Please try again later." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
