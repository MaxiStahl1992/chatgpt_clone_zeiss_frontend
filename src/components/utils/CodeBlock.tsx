// src/components/utils/CodeBlock.tsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon } from 'lucide-react';

interface CodeBlockProps {
  inline: boolean;
  className?: string;
  children: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const language = className?.replace('language-', '') || 'plaintext';

  const copyToClipboard = (text: React.ReactNode) => {
    if (text === null || text === undefined) return;
    const textToCopy = Array.isArray(text) ? text.join('') : text.toString();
    navigator.clipboard
      .writeText(textToCopy)
      .catch((err) => console.error('Failed to copy text:', err));
  };

  return inline ? (
    <code className="inline-code">{children}</code>
  ) : (
    <div className="relative group">
      <button
        onClick={() => copyToClipboard(children)}
        className="absolute top-1 right-1 p-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded shadow">
        <ClipboardIcon size={16} />
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}>
        {String(children).trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;