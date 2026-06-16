interface TimelineItemData {
  type: "freelance" | "employed" | "education";
  date: string;
  title: string;
  company: string;
  impact: string;
}

export interface ProcessedTimelineItem extends TimelineItemData {
  isOffset: boolean;
  gridRow: number;
}

export function processTimelineData(data: TimelineItemData[]): ProcessedTimelineItem[] {
  let cursorRow = 0;
  const grid: { left?: boolean; right?: boolean }[] = [];

  // Step 1: Assign grid rows to each item using Grid Auto-Placement simulation
  const mapped = data.map((item) => {
    const isLeft = item.type === "freelance" || item.type === "education";
    const side = isLeft ? "left" : "right";

    let row = cursorRow;
    while (grid[row] && grid[row][side]) {
      row++;
    }

    if (!grid[row]) {
      grid[row] = {};
    }
    grid[row][side] = true;
    cursorRow = row;

    return {
      ...item,
      gridRow: row,
    };
  });

  // Step 2: Mark items as offset if they share a row with an item that came earlier (lower index)
  return mapped.map((item, index) => {
    const counterpart = mapped.find(
      (other, otherIdx) => other.gridRow === item.gridRow && otherIdx < index
    );

    return {
      type: item.type,
      date: item.date,
      title: item.title,
      company: item.company,
      impact: item.impact,
      isOffset: !!counterpart,
      gridRow: item.gridRow,
    };
  });
}

