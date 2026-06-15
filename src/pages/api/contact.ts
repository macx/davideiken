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
  try {
    // 1. Rate Limiting
    const ip = clientAddress || 'unknown';
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
      const allowedDomains = ['davideiken.com', 'localhost'];
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
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: Number(import.meta.env.SMTP_PORT) || 587,
      secure: import.meta.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${validatedData.name}" <${import.meta.env.SMTP_USER}>`, // Send via authenticated user
      replyTo: validatedData.email,
      to: import.meta.env.CONTACT_EMAIL || import.meta.env.SMTP_USER,
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
