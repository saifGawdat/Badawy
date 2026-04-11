"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="blog-markdown text-secondary/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src || ""}
              alt={alt || ""}
              className="my-8 w-full max-h-[560px] rounded-2xl object-cover border border-secondary/10 shadow-sm"
              loading="lazy"
            />
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline underline-offset-2 hover:text-gold-dark transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          h2: ({ children }) => (
            <h2 className="mt-12 mb-4 text-2xl font-serif text-secondary">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-10 mb-3 text-xl font-serif text-secondary">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-5 leading-relaxed text-base">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 list-disc ps-6 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 list-decimal ps-6 space-y-2">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-8 border-s-4 border-primary/40 ps-6 italic text-secondary/70">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="my-6 overflow-x-auto rounded-xl bg-secondary/5 p-4 text-sm font-mono border border-secondary/10">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="rounded bg-secondary/10 px-1.5 py-0.5 text-sm font-mono">
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
