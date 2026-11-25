import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyableCodeBlock } from "./CopyableCodeBlock";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { SplitPane } from "./SplitPane";

describe("shared/ui patterns", () => {
  it("renders EmptyState and ErrorState with retry callback", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <div>
        <EmptyState title="자료가 없습니다" description="검색어를 바꿔보세요." />
        <ErrorState onRetry={onRetry} />
      </div>,
    );

    expect(screen.getByText("자료가 없습니다")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("copies code in CopyableCodeBlock and shows feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<CopyableCodeBlock title="테스트 프롬프트" code="요약해줘: [문서]" />);
    await user.click(screen.getByRole("button", { name: "테스트 프롬프트 복사" }));

    expect(writeText).toHaveBeenCalledWith("요약해줘: [문서]");
    expect(await screen.findByText("복사됨")).toBeInTheDocument();
  });

  it("renders SplitPane left and right sections", () => {
    render(<SplitPane left={<div>원문</div>} right={<div>초안</div>} />);
    expect(screen.getByText("원문")).toBeInTheDocument();
    expect(screen.getByText("초안")).toBeInTheDocument();
  });

  it("contains zero hardcoded hex colors, bg-white, or text-black in ui src", () => {
    const uiRoot = path.resolve(process.cwd(), "src");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) {
          files.push(full);
        }
      }
    };
    walk(uiRoot);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      expect(content).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(content).not.toMatch(/\b(bg-white|text-black)\b/);
    }
  });

  it("enforces UI layout rules (no absolute, negative margins, half-step spacing, or arbitrary px sizing)", () => {
    const uiRoot = path.resolve(process.cwd(), "src");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.") && !entry.name.includes(".stories.")) {
          files.push(full);
        }
      }
    };
    walk(uiRoot);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      expect(content, `${file} absolute`).not.toMatch(/\b(?:[a-z0-9-]+:)?absolute\b|position:\s*absolute/);
      expect(content, `${file} negative margin`).not.toMatch(/(?:^|[\s"'`:])-(?:m|mx|my|mt|mb|ml|mr|ms|me|inset|inset-x|inset-y|translate-x|translate-y)-[a-z0-9.[\]]+/);
      expect(content, `${file} half-step spacing`).not.toMatch(/\b(?:[a-z0-9:[\]>-]+:)?(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y)-(?:0\.5|1\.5|2\.5|3\.5)\b/);
      expect(content, `${file} arbitrary px sizing`).not.toMatch(/\b(?:[a-z0-9:[\]>-]+:)?(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y|w|h|min-w|max-w|min-h|max-h|top|bottom|left|right|start|end|inset)-\[[^\]]*px[^\]]*\]/);
    }
  });
});
