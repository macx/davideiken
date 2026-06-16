import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./contact";

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

describe("Contact API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return status 400 for invalid form data", async () => {
    const formData = new FormData();
    formData.append("name", "");
    formData.append("email", "invalid-email");
    formData.append("message", "short"); // min 10 required

    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: formData,
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
    const formData = new FormData();
    formData.append("name", "Spam Bot");
    formData.append("email", "bot@spam.com");
    formData.append("message", "This is a spam message that is long enough.");
    formData.append("fax", "bot-detector"); // Honeypot field filled!

    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: formData,
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
    const formData = new FormData();
    formData.append("name", "David Eiken");
    formData.append("email", "david@eiken.com");
    formData.append("message", "Hello! This is a valid message that meets the length requirements.");

    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: formData,
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
      })
    );
  });
});
