import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../pages/api/contact";

// Use vi.hoisted to declare and initialize the mock function BEFORE mock hoisting occurs!
const { mockSendMail } = vi.hoisted(() => {
  return {
    mockSendMail: vi.fn().mockResolvedValue({}),
  };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: mockSendMail,
    }),
  },
}));

function jsonRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Contact API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return status 400 for invalid form data", async () => {
    const request = jsonRequest({
      name: "",
      email: "invalid-email",
      message: "short", // min 10 required
    });

    const response = await POST({
      request,
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid form data.");
    expect(body.details).toBeDefined();
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("should catch honeypot bot submission and return status 200 silently without sending mail", async () => {
    const request = jsonRequest({
      name: "Spam Bot",
      email: "bot@spam.com",
      message: "This is a spam message that is long enough.",
      fax: "bot-detector", // Honeypot field filled!
    });

    const response = await POST({
      request,
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("should send email and return status 200 for valid form submission", async () => {
    const request = jsonRequest({
      name: "David Eiken",
      email: "david@eiken.com",
      message:
        "Hello! This is a valid message that meets the length requirements.",
    });

    const response = await POST({
      request,
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: "david@eiken.com",
        subject: "Contact Request: David Eiken",
      }),
    );
  });

  it("should return status 400 for an invalid JSON body", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not valid json",
    });

    const response = await POST({
      request,
      clientAddress: "127.0.0.1",
    } as any);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid JSON body.");
    expect(mockSendMail).not.toHaveBeenCalled();
  });
});
