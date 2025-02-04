import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
	code: string;
	language?: string;
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
	return (
		// @ts-expect-error Class component error
		<SyntaxHighlighter
			language={language}
			style={oneDark}
			customStyle={{
				borderRadius: "0.375rem",
				padding: "1rem",
				fontSize: "0.875rem",
				lineHeight: "1.25rem",
			}}
		>
			{code.trim()}
		</SyntaxHighlighter>
	);
}
