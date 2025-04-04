"use client";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"; // Import Radix primitives via shadcn
import { Label } from "@/components/ui/label";
import {
	SidebarGroup,
	SidebarGroupContent,
	// SidebarInput, // Removed as it's replaced by button
} from "@/components/ui/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

function highlightMatch(text: string, query: string): React.ReactNode {
	if (!query) return text;
	const index = text.toLowerCase().indexOf(query.toLowerCase());
	if (index === -1) return text;

	const before = text.slice(0, index);
	const match = text.slice(index, index + query.length);
	const after = text.slice(index + query.length);

	return (
		<>
			{before}
			<span className="bg-yellow-200 dark:bg-yellow-800">{match}</span>
			{after}
		</>
	);
}

interface NavItem {
	title: string;
	url: string;
	icon?: React.ComponentType<{ className?: string }>;
	items?: Array<{
		title: string;
		url: string;
	}>;
}

interface SearchResult {
	title: string;
	url: string;
	section?: string;
	content?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

function flattenNavItems(navMain: NavItem[]): SearchResult[] {
	return navMain.reduce((acc: SearchResult[], item) => {
		const results: SearchResult[] = [];

		const getContent = (url: string): string | undefined => {
			if (!url.includes("#")) {
				return undefined;
			}
			try {
				const id = url.split("#")[1];
				if (!id) return undefined;
				if (typeof document !== "undefined") {
					const element = document.querySelector(`[id="${CSS.escape(id)}"]`);
					return element?.textContent?.trim() || undefined;
				}
				return undefined;
			} catch {
				return undefined;
			}
		};

		if (item.items && item.items.length > 0) {
			for (const subItem of item.items) {
				results.push({
					title: subItem.title,
					url: subItem.url,
					section: item.title,
					content: getContent(subItem.url),
					icon: item.icon,
				});
			}
		} else {
			results.push({
				title: item.title,
				url: item.url,
				content: getContent(item.url),
				icon: item.icon,
			});
		}

		acc.push(...results);
		return acc;
	}, []);
}

export function SearchForm({
	navMain,
	...props
}: { navMain: NavItem[] } & React.ComponentProps<"div">) {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState("");

	const allSearchableItems = React.useMemo(() => {
		if (typeof window === "undefined") {
			return [];
		}
		return flattenNavItems(navMain);
	}, [navMain]);

	const searchResults = React.useMemo(() => {
		// If search term is empty, return all items
		if (!searchTerm) {
			return allSearchableItems; // <-- CHANGE: Return all items here
		}

		// Proceed with filtering if there is a search term
		if (!allSearchableItems || allSearchableItems.length === 0) {
			return [];
		}

		const lowerCaseSearchTerm = searchTerm.toLowerCase();

		return allSearchableItems.filter((result) => {
			const titleMatch = result.title
				.toLowerCase()
				.includes(lowerCaseSearchTerm);
			const contentMatch = result.content
				?.toLowerCase()
				.includes(lowerCaseSearchTerm);
			const sectionMatch = result.section
				?.toLowerCase()
				.includes(lowerCaseSearchTerm);

			return titleMatch || contentMatch || sectionMatch;
		});
	}, [allSearchableItems, searchTerm]); // Dependencies remain the same

	const groupedResults = React.useMemo(() => {
		return searchResults.reduce(
			// This will now process all items when searchTerm is empty
			(groups: Record<string, SearchResult[]>, result) => {
				const section = result.section || "General";
				if (!groups[section]) {
					groups[section] = [];
				}
				groups[section].push(result);
				return groups;
			},
			{},
		);
	}, [searchResults]); // Depends on searchResults, which now contains all items initially

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
				if (
					e.target instanceof HTMLElement &&
					(e.target.isContentEditable ||
						["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName))
				) {
					return;
				}
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false);
		// Reset search term when an item is selected or dialog is closed implicitly
		setSearchTerm(""); // <-- ADDED: Reset search term
		command();
	}, []); // Removed setSearchTerm from dependencies as it causes infinite loop if included directly

	const handleSelect = React.useCallback(
		(result: SearchResult) => {
			runCommand(() => router.push(result.url));
		},
		[router, runCommand],
	);

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setSearchTerm(""); // Reset search term when dialog is closed
		}
	};

	return (
		<div {...props}>
			<SidebarGroup className="py-0">
				<SidebarGroupContent className="relative">
					<Label htmlFor="search-trigger-button" className="sr-only">
						Search Documentation
					</Label>
					<button
						type="button"
						id="search-trigger-button"
						onClick={() => setOpen(true)}
						className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground text-left relative cursor-pointer group"
					>
						<span className="truncate">Search the docs...</span>
						<kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex group-hover:opacity-80">
							<span className="text-xs">⌘</span>K
						</kbd>
					</button>
					<Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
				</SidebarGroupContent>
			</SidebarGroup>

			{/* Pass handleOpenChange to manage state and reset term */}
			<CommandDialog open={open} onOpenChange={handleOpenChange}>
				<VisuallyHidden>
					<DialogTitle>Search Documentation</DialogTitle>
					<DialogDescription>
						Search documentation content, titles, or section names. Use Command
						K to open. Start typing to filter results.
					</DialogDescription>
				</VisuallyHidden>

				<CommandInput
					id="search-input"
					placeholder="Type to search..."
					value={searchTerm}
					onValueChange={setSearchTerm}
				/>
				<CommandList>
					{/* Only show "No results found." when a search term is entered *and* there are no results */}
					<CommandEmpty>
						{searchTerm && Object.keys(groupedResults).length === 0
							? "No results found."
							: null}
						{/* Previously: {searchTerm ? "No results found." : "Type something to search."} */}
					</CommandEmpty>
					{Object.entries(groupedResults).map(([section, items]) => (
						<CommandGroup key={section} heading={section}>
							{items.map((result) => (
								<CommandItem
									key={result.url}
									onSelect={() => handleSelect(result)}
									value={`${section} ${result.title} ${result.content || ""}`}
								>
									{result.icon ? (
										<result.icon
											className="mr-2 h-4 w-4 flex-shrink-0"
											aria-hidden="true"
										/>
									) : (
										<Search
											className="mr-2 h-4 w-4 flex-shrink-0"
											aria-hidden="true"
										/>
									)}
									<div className="flex flex-col gap-0 overflow-hidden">
										<span className="truncate">
											{highlightMatch(result.title, searchTerm)}
										</span>
										{/* Only highlight content if search term is present */}
										{searchTerm && result.content && (
											<span className="text-xs text-muted-foreground line-clamp-1">
												{highlightMatch(result.content, searchTerm)}
											</span>
										)}
										{/* Show non-highlighted content snippet if search term is empty but content exists */}
										{!searchTerm && result.content && (
											<span className="text-xs text-muted-foreground line-clamp-1">
												{result.content}
											</span>
										)}
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					))}
				</CommandList>
			</CommandDialog>
		</div>
	);
}
