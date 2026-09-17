'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
  isDistorted?: boolean;
}

export function MarkdownRenderer({ content, isDistorted = false }: MarkdownRendererProps) {
  return (
    <div
      className={`prose prose-sm max-w-none break-words ${
        isDistorted
          ? 'prose-invert text-red-200 font-mono [&_.katex]:text-red-300 [&_.katex-display]:my-2 [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1'
          : 'prose-slate dark:prose-invert text-slate-800 dark:text-slate-200 [&_.katex]:text-sky-700 dark:[&_.katex]:text-sky-300 [&_.katex-display]:my-2 [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1 [&_.katex-display]:px-2 [&_.katex-display]:rounded [&_.katex-display]:bg-slate-50 dark:[&_.katex-display]:bg-slate-900/60'
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong
              className={`font-bold ${
                isDistorted ? 'text-red-300 anomaly-glow-blood' : 'text-slate-900 dark:text-white'
              }`}
            >
              {children}
            </strong>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                    isDistorted
                      ? 'bg-red-950/80 text-red-200 border border-red-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre
                className={`p-3 rounded-md overflow-x-auto text-xs font-mono my-2 ${
                  isDistorted
                    ? 'bg-[#0a0505] border border-red-900 text-red-200'
                    : 'bg-slate-900 text-slate-100 border border-slate-800'
                }`}
              >
                <code>{children}</code>
              </pre>
            );
          },
          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
