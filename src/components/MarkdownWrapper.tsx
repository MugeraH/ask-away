import React from "react";
import markdownit from "markdown-it";
import DOMPurify from "dompurify";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

type Props = {
  content: string;
};

// Import languages
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php";
import ruby from "react-syntax-highlighter/dist/esm/languages/prism/ruby";
import swift from "react-syntax-highlighter/dist/esm/languages/prism/swift";
import scala from "react-syntax-highlighter/dist/esm/languages/prism/scala";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";


// Register languages
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("scala", scala);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("c++", c);

const supportedLanguages = [
  "javascript",
  "python",
  "jsx",
  "csharp",
  "css",
  "go",
  "java",
  "typescript",
  "bash",
  "php",
  "ruby",
  "swift",
  "scala",
  "rust",
  "c++",
];

// Create markdown-it instance without custom highlighting
// We'll handle code blocks separately in React
const md = new markdownit({
  html: true,
  breaks: true,
  linkify: true,
});

// Custom component to render code blocks with syntax highlighting
const CodeBlock = ({ children, language }: { children: string; language?: string }) => {
  const lang = language?.toLowerCase();
  
  if (lang && supportedLanguages.includes(lang)) {
    return (
      <div className="my-4">
        <SyntaxHighlighter
          language={lang}
          style={prism}
          customStyle={{
            margin: 0,
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    );
  }

  // Fallback for unsupported languages
  return (
    <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto my-4">
      <code>{children}</code>
    </pre>
  );
};

// Parse markdown and extract code blocks and math equations for separate rendering
const parseMarkdownWithSpecialBlocks = (content: string) => {
  if (!content || typeof content !== "string") {
    return [];
  }

  const parts: Array<{ type: 'text' | 'code' | 'math-block' | 'math-inline'; content: string; language?: string }> = [];
  
  // Combined regex for code blocks, display math, and inline math
  const combinedRegex = /(```(\w+)?\n([\s\S]*?)```)|(\$\$[\s\S]*?\$\$)|(\$[^$\n]+?\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(content)) !== null) {
    // Add text before special block
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index);
      if (textContent.trim()) {
        parts.push({ type: 'text', content: textContent });
      }
    }

    if (match[1]) {
      // Code block
      parts.push({
        type: 'code',
        content: match[3].trim(),
        language: match[2] || 'text'
      });
    } else if (match[4]) {
      // Display math ($$...$$)
      parts.push({
        type: 'math-block',
        content: match[4].slice(2, -2).trim()
      });
    } else if (match[5]) {
      // Inline math ($...$)
      parts.push({
        type: 'math-inline',
        content: match[5].slice(1, -1).trim()
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingContent = content.slice(lastIndex);
    if (remainingContent.trim()) {
      parts.push({ type: 'text', content: remainingContent });
    }
  }

  return parts;
};

function MarkdownWrapper({ content }: Props) {
  if (content == null) {
    console.warn("MarkdownWrapper received null or undefined content");
    return <div className="text-gray-500">No content to display</div>;
  }

  if (typeof content !== "string") {
    console.error("MarkdownWrapper received non-string content:", content);
    return <div className="text-red-500">Error: Invalid content type</div>;
  }

  const parts = parseMarkdownWithSpecialBlocks(content);

  return (
    <div className="markdown-body overflow-x-hidden prose prose-slate max-w-none">
      <style jsx>{`
        .markdown-body h1 {
          color: #3b82f6;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        .markdown-body h2 {
          color: #059669;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          margin-top: 1.25rem;
        }
        .markdown-body h3 {
          color: #dc2626;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }
        .markdown-body h4 {
          color: #7c3aed;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 0.75rem;
        }
        .markdown-body h5, .markdown-body h6 {
          color: #ea580c;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 0.75rem;
        }
        .markdown-body strong {
          color: #1f2937;
          font-weight: 700;
        }
        .markdown-body em {
          color: #4b5563;
          font-style: italic;
        }
        .markdown-body ul, .markdown-body ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .markdown-body li {
          margin: 0.25rem 0;
          line-height: 1.6;
        }
        .markdown-body blockquote {
          border-left: 4px solid #3b82f6;
          background: #f8fafc;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 0.375rem;
        }
        .markdown-body table {
          border-collapse: collapse;
          margin: 1rem 0;
          width: 100%;
        }
        .markdown-body th {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          font-weight: 600;
          color: #1e293b;
        }
        .markdown-body td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
        }
        .markdown-body p {
          margin: 0.75rem 0;
          line-height: 1.7;
        }
      `}</style>
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock key={index} language={part.language}>
              {part.content}
            </CodeBlock>
          );
        } else if (part.type === 'math-block') {
          return (
            <div key={index} className="my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <BlockMath math={part.content} />
            </div>
          );
        } else if (part.type === 'math-inline') {
          return (
            <span key={index} className="inline-block px-1 py-0.5 bg-blue-100 rounded">
              <InlineMath math={part.content} />
            </span>
          );
        } else {
          // Render markdown text (excluding code blocks and math)
          const htmlContent = md.render(part.content);
          const sanitizedHtml = DOMPurify.sanitize(htmlContent);
          
          return (
            <div
              key={index}
              className="max-w-none overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          );
        }
      })}
    </div>
  );
}

export default MarkdownWrapper;

// import React from "react";
// import ReactDOMServer from "react-dom/server";
// import MarkdownIt from "markdown-it";
// import DOMPurify from "dompurify";
// import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
// import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

// // Import languages
// import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
// import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
// import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
// import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";

// // Register languages
// SyntaxHighlighter.registerLanguage("jsx", jsx);
// SyntaxHighlighter.registerLanguage("javascript", javascript);
// SyntaxHighlighter.registerLanguage("js", javascript);
// SyntaxHighlighter.registerLanguage("python", python);
// SyntaxHighlighter.registerLanguage("typescript", typescript);

// interface MarkdownWrapperProps {
//   content: string;
//   className?: string;
// }

// const cleanMarkdown = (content: string): string => {
//   // Fix common markdown issues
//   let cleanContent = content
//     // Ensure proper spacing around code blocks
//     .replace(/```(\w+)(?!\n)/g, "```$1\n")
//     .replace(/(?<!\n)```/g, "\n```")

//     // Fix numbered lists that might be malformed
//     .replace(/(\d+)\.\s*/g, "$1. ")

//     // Ensure proper spacing around headings
//     .replace(/(?<!\n)#/g, "\n#")

//     // Fix inline code blocks
//     .replace(/`([^`]+)`/g, (match) => {
//       // Preserve existing proper inline code
//       if (match.includes("\n")) {
//         return match.split("\n").join("`\n`");
//       }
//       return match;
//     })

//     // Remove extra spaces before/after code blocks
//     .replace(/\n\s*```/g, "\n```")

//     // Normalize line endings
//     .replace(/\r\n/g, "\n")

//     // Remove multiple consecutive blank lines
//     .replace(/\n{3,}/g, "\n\n")

//     // Ensure code blocks are closed
//     .replace(/```\w+\n((?!```)[\s\S])*$/g, (match) => {
//       if (!match.endsWith("```")) {
//         return match + "\n```";
//       }
//       return match;
//     });

//   return cleanContent;
// };

// const md = new MarkdownIt({
//   html: true,
//   linkify: true,
//   typographer: true,
//   highlight: function (str: string, lang: string): string {
//     // Default to javascript for code blocks without a language
//     const language = lang || "javascript";

//     try {
//       const Component = () => (
//         <SyntaxHighlighter
//           language={language}
//           style={prism}
//           customStyle={{
//             margin: "0",
//             borderRadius: "4px",
//             background: "#f6f8fa",
//           }}
//           PreTag="div"
//           codeTagProps={{
//             style: {
//               fontFamily:
//                 "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
//               fontSize: "14px",
//               lineHeight: "1.5",
//             },
//           }}
//         >
//           {str.trim()}
//         </SyntaxHighlighter>
//       );

//       return ReactDOMServer.renderToString(<Component />);
//     } catch (error) {
//       console.error("Syntax highlighting failed:", error);
//       // Fallback to basic code block
//       return `<pre class="overflow-x-auto p-4 bg-gray-50 rounded"><code>${md.utils.escapeHtml(
//         str
//       )}</code></pre>`;
//     }
//   },
// });

// // Configure markdown-it options
// md.set({
//   breaks: true,
//   linkify: true,
//   html: true,
//   xhtmlOut: true,
// });

// const MarkdownWrapper: React.FC<MarkdownWrapperProps> = ({
//   content,
//   className = "",
// }) => {
//   const renderContent = () => {
//     if (!content) {
//       console.warn("MarkdownWrapper received empty content");
//       return "";
//     }

//     if (typeof content !== "string") {
//       console.error("MarkdownWrapper received non-string content:", content);
//       return "Error: Invalid content type";
//     }

//     try {
//       // Clean up the markdown content first
//       const cleanedContent = cleanMarkdown(content);

//       // Check if the content is HTML
//       const isHTML = /<[a-z][\s\S]*>/i.test(cleanedContent);

//       let processedContent;
//       if (isHTML) {
//         processedContent = cleanedContent;
//       } else {
//         processedContent = md.render(cleanedContent);
//       }

//       // Sanitize the content
//       return DOMPurify.sanitize(processedContent, {
//         ADD_TAGS: ["iframe"],
//         ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
//       });
//     } catch (error) {
//       console.error("Error rendering content:", error);
//       return "Error rendering content";
//     }
//   };

//   return (
//     <div className={`markdown-body prose prose-slate  max-w-none ${className}`}>
//       <div
//         className="overflow-x-hidden"
//         dangerouslySetInnerHTML={{ __html: renderContent() }}
//       />
//       <style jsx global>{`
//         .markdown-body {
//           color: white;
//           font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
//             sans-serif;
//           font-size: 16px;
//           line-height: 1.5;
//         }
//         .markdown-body pre {
//           margin: 1em 0;
//           padding: 1em;
//           background-color: #f6f8fa;
//           border-radius: 6px;
//           overflow-x: auto;
//         }
//         .markdown-body code {
//           font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
//             monospace;
//           font-size: 0.9em;
//           padding: 0.2em 0.4em;
//           border-radius: 3px;

//           color: #7af7f0;
//         }
//         .markdown-body pre code {
//           padding: 0;
//           background-color: transparent;
//         }
//         .markdown-body pre div {
//           background: #f6f8fa !important;
//         }
//         .markdown-body h1,
//         .markdown-body h2,
//         .markdown-body h3,
//         .markdown-body h4,
//         .markdown-body h5,
//         .markdown-body h6 {
//           margin-top: 24px;
//           margin-bottom: 16px;
//           font-weight: 600;
//           line-height: 1.25;
//         }
//         .markdown-body h1 {
//           font-size: 2em;
//           padding-bottom: 0.3em;
//           border-bottom: 1px solid #d0d7de;
//         }
//         .markdown-body h2 {
//           font-size: 1.5em;
//           padding-bottom: 0.3em;
//           border-bottom: 1px solid #d0d7de;
//         }
//         .markdown-body p {
//           margin-top: 0;
//           margin-bottom: 16px;
//         }
//         .markdown-body ul,
//         .markdown-body ol {
//           margin-top: 0;
//           margin-bottom: 16px;
//           padding-left: 2em;
//         }
//         .markdown-body li {
//           margin: 0.25em 0;
//         }
//         .markdown-body blockquote {
//           margin: 0;
//           padding-left: 1em;
//           color: #57606a;
//           border-left: 0.25em solid #d0d7de;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MarkdownWrapper;
