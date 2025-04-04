"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface InstallationCodeProps {
	packageName: string;
	className?: string;
}

const packageManagers = [
	{ name: "npm", command: "npm install" },
	{ name: "yarn", command: "yarn add" },
	{ name: "pnpm", command: "pnpm install" },
] as const;

export function InstallationCode({
	packageName,
	className,
}: InstallationCodeProps) {
	const { copied, copyToClipboard } = useClipboard();

	return (
		<div
			className={cn(
				"relative rounded-lg border border-input bg-muted/50 p-6",
				className,
			)}
		>
			<Tabs defaultValue="npm" className="w-full">
				<TabsList className="w-full justify-start gap-2 rounded-lg bg-transparent p-0">
					{packageManagers.map((pm) => (
						<TabsTrigger
							key={pm.name}
							value={pm.name}
							className="rounded-sm border border-input bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:border-ring data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
						>
							{pm.name}
						</TabsTrigger>
					))}
				</TabsList>
				{packageManagers.map((pm) => (
					<TabsContent
						key={pm.name}
						value={pm.name}
						className="relative mt-4 rounded-lg border border-input bg-muted p-4"
					>
						<pre className="overflow-x-auto text-sm">
							<code className="font-mono text-foreground">{`${pm.command} ${packageName}`}</code>
						</pre>
						<Button
							size="icon"
							variant="ghost"
							className="absolute right-3 top-3 h-8 w-8 rounded-full hover:bg-muted-foreground/10"
							onClick={() => copyToClipboard(`${pm.command} ${packageName}`)}
						>
							{copied ? (
								<Check className="h-4 w-4 text-primary" />
							) : (
								<Copy className="h-4 w-4 text-muted-foreground" />
							)}
						</Button>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
