"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
	extension?: string;
}

export function CodeBlock({
	code,
	language = "typescript",
	filename,
	extension,
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const displayLanguage =
		extension || language.charAt(0).toUpperCase() + language.slice(1);

	const onCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	}, [code]);

	return (
		<div className="w-full rounded-lg overflow-hidden bg-[#282c34] text-sm">
			{filename && (
				<div className="flex items-center justify-between px-4 py-2 border-b ">
					<div className="flex items-center gap-2">
						<span className="text-gray-400">{filename}</span>
						<span className="text-gray-500">{displayLanguage}</span>
					</div>
					<Button variant={"ghost"} onClick={onCopy} className="bg-transparent">
						{copied ? (
							<Check className="h-4 w-4 text-green-500" aria-hidden="true" />
						) : (
							<Copy className="h-4 w-4 text-gray-400" aria-hidden="true" />
						)}
					</Button>
				</div>
			)}
			<div className="relative overflow-x-auto">
				{/*// @ts-ignore*/}
				<SyntaxHighlighter
					language={language}
					style={oneDark}
					customStyle={{
						margin: 0,
						padding: "1rem",
						background: "transparent",
					}}
				>
					{code}
				</SyntaxHighlighter>
			</div>
		</div>
	);
}
