"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarInput,
} from "@/components/ui/sidebar";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

function highlightMatch(text: string, query: string): React.ReactNode {
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
	icon?: React.ComponentType;
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
}

function flattenNavItems(navMain: NavItem[]): SearchResult[] {
	return navMain.reduce((acc: SearchResult[], item) => {
		const results: SearchResult[] = [];

		const getContent = (url: string): string | undefined => {
			try {
				const element = document.querySelector(`[id="${url.split("#")[1]}"]`);
				return element?.textContent || undefined;
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
				});
			}
		} else {
			results.push({
				title: item.title,
				url: item.url,
				content: getContent(item.url),
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
	const searchResults = React.useMemo(() => {
		const results = flattenNavItems(navMain);
		if (!searchTerm) return results;

		return results.filter((result) => {
			const titleMatch = result.title
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const contentMatch = result.content
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const sectionMatch = result.section
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());

			return titleMatch || contentMatch || sectionMatch;
		});
	}, [navMain, searchTerm]);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const handleSelect = React.useCallback(
		(result: SearchResult) => {
			setOpen(false);
			const url = new URL(result.url, window.location.origin);

			if (searchTerm && result.content) {
				// If there's a content match, try to find the closest section
				const sections = document.querySelectorAll("section[id]");
				for (const section of sections) {
					if (
						section.textContent
							?.toLowerCase()
							.includes(searchTerm.toLowerCase())
					) {
						url.hash = section.id;
						break;
					}
				}
			}

			router.push(url.toString());
		},
		[router, searchTerm],
	);

	return (
		<div {...props}>
			<SidebarGroup className="py-0">
				<SidebarGroupContent className="relative">
					<Label htmlFor="search" className="sr-only">
						Search
					</Label>
					<SidebarInput
						id="search"
						placeholder="Search the docs... (⌘K)"
						className="pl-8 cursor-pointer"
						onClick={() => setOpen(true)}
						readOnly
					/>
					<Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
				</SidebarGroupContent>
			</SidebarGroup>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder="Type to search..."
					value={searchTerm}
					onValueChange={setSearchTerm}
				/>
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{Object.entries(
						searchResults.reduce(
							(groups: Record<string, SearchResult[]>, result) => {
								const section = result.section || "General";
								if (!groups[section]) {
									groups[section] = [];
								}
								groups[section].push(result);
								return groups;
							},
							{},
						),
					).map(([section, items]) => (
						<CommandGroup key={section} heading={section}>
							{items.map((result) => (
                <CommandItem
                  key={result.url}
                  onSelect={() => handleSelect(result)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <div className="flex flex-col gap-1">
                    <span>
                      {searchTerm ? highlightMatch(result.title, searchTerm) : result.title}
                    </span>
                    {searchTerm && result.content && (
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {highlightMatch(result.content, searchTerm)}
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
