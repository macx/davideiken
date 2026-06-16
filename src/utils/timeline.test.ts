import { describe, it, expect } from "vitest";
import { processTimelineData } from "./timeline";

describe("processTimelineData", () => {
  it("should assign correct grid rows and handles offsets", () => {
    const mockData = [
      {
        type: "freelance" as const,
        date: "2023",
        title: "Freelance Developer",
        company: "Self",
        impact: "Built stuff",
      },
      {
        type: "employed" as const,
        date: "2024",
        title: "Senior Dev",
        company: "Tech Corp",
        impact: "Lead teams",
      },
      {
        type: "education" as const,
        date: "2024",
        title: "M.Sc. Computer Science",
        company: "University",
        impact: "Graduated",
      },
    ];

    const result = processTimelineData(mockData);

    expect(result).toHaveLength(3);

    // First item: freelance (left side). Should be at row 0, no offset.
    expect(result[0].gridRow).toBe(0);
    expect(result[0].isOffset).toBe(false);

    // Second item: employed (right side). Should be at row 0 (since right side is empty), but it comes later, so isOffset is true.
    expect(result[1].gridRow).toBe(0);
    expect(result[1].isOffset).toBe(true);

    // Third item: education (left side). Row 0 is occupied on the left. So it moves to row 1.
    expect(result[2].gridRow).toBe(1);
    expect(result[2].isOffset).toBe(false);
  });
});
