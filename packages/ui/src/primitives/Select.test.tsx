import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

describe("Select", () => {
  it("applies consistent optical right padding, gap, truncation, and shrink-0 chevron", () => {
    render(
      <Select defaultValue="all">
        <SelectTrigger aria-label="필터">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="free">무료</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole("combobox", { name: "필터" });
    expect(trigger.className).toContain("pl-3");
    expect(trigger.className).toContain("pr-2");
    expect(trigger.className).toContain("gap-2");
    expect(trigger.className).toContain("[&>span]:truncate");

    const chevron = trigger.querySelector("svg");
    expect(chevron).not.toBeNull();
    expect(chevron?.getAttribute("class")).toContain("shrink-0");
  });

  it("opens options and updates selected value on click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select defaultValue="all" onValueChange={onValueChange}>
        <SelectTrigger aria-label="필터">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="free">무료</SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole("combobox", { name: "필터" }));
    await user.click(await screen.findByRole("option", { name: "무료" }));

    expect(onValueChange).toHaveBeenCalledWith("free");
    expect(screen.getByRole("combobox", { name: "필터" })).toHaveTextContent(
      "무료",
    );
  });
});
