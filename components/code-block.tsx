import type React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{
        borderRadius: '0.375rem',
        padding: '1rem',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
      }}
    >
      {code.trim()}
    </SyntaxHighlighter>
  );
};
