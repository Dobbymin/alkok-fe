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
    <div className="prose-alkok space-y-4 text-base leading-[1.7] text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h2: ({ children }) => {
            const text = String(children);
            return (
              <h2
                id={slugifyHeading(text)}
                className="mt-8 scroll-mt-20 text-xl font-bold tracking-tight text-foreground"
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
                className="mt-6 scroll-mt-20 text-lg font-semibold text-foreground"
              >
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="text-base leading-[1.7] text-foreground">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1.5 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1.5 pl-5">{children}</ol>
          ),
          code: ({ children }) => (
            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              {children}
            </code>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
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
