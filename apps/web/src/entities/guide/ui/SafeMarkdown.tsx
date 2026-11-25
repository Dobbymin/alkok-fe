import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-");
}

export const SafeMarkdown = ({ content }: { content: string }) => {
  return (
    <div className="prose-alkok max-w-prose space-y-4 text-base leading-[1.7] text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h2: ({ children }) => {
            const text = String(children);
            return (
              <h2
                id={slugifyHeading(text)}
                className="mt-8 scroll-mt-20 text-balance text-xl font-bold leading-[1.25] tracking-[-0.015em] text-foreground md:scroll-mt-8"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            return (
              <h3
                id={slugifyHeading(text)}
                className="mt-6 scroll-mt-20 text-balance text-lg font-semibold leading-[1.3] tracking-[-0.01em] text-foreground md:scroll-mt-8"
              >
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="text-pretty text-base leading-[1.7] text-foreground">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 ps-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 ps-5">{children}</ol>
          ),
          code: ({ children }) => (
            <code className="rounded-sm bg-muted px-2 py-1 font-mono text-[13px] text-foreground">
              {children}
            </code>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4 [text-underline-position:from-font] decoration-from-font"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
