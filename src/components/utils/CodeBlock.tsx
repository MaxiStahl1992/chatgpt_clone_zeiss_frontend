import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon } from 'lucide-react';

interface CodeBlockProps {
  inline: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * CodeBlock component for rendering code snippets with syntax highlighting and a copy-to-clipboard option.
 * 
 * Props:
 * - `inline`: Determines if the code should be displayed inline or in a block format.
 * - `className`: Optional class name to specify the language for syntax highlighting.
 * - `children`: The code content to be displayed.
 * 
 * Methods:
 * - `copyToClipboard`: Copies the code content to the clipboard when the copy button is clicked.
 * 
 * Features:
 * - Uses `react-syntax-highlighter` with `vscDarkPlus` theme for syntax highlighting.
 * - Displays a clipboard icon for copying code, which becomes visible on hover.
 */
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