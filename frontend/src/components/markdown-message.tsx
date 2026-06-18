import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter";

import { oneDark }
from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  content: string;
}

export function MarkdownMessage({
  content,
}: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({
          children,
          className,
        }) {
          const match =
            /language-(\w+)/.exec(
              className || "",
            );

          if (!match) {
            return (
              <code className="bg-zinc-800 px-1 py-0.5 rounded">
                {children}
              </code>
            );
          }

          return (
            <SyntaxHighlighter
              language={match[1]}
              style={oneDark}
            >
              {String(children)}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
