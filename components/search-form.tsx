"use client";

import * as React from "react";
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/ui/sidebar';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

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
}

function flattenNavItems(navMain: NavItem[]): SearchResult[] {
  return navMain.reduce((acc: SearchResult[], item) => {
    const results: SearchResult[] = [];
    
    if (item.items && item.items.length > 0) {
      for (const subItem of item.items) {
        results.push({
          title: subItem.title,
          url: subItem.url,
          section: item.title,
        });
      }
    } else {
      results.push({ title: item.title, url: item.url });
    }
    
    acc.push(...results);
    return acc;
  }, []);
}

export function SearchForm({ navMain, ...props }: { navMain: NavItem[] } & React.ComponentProps<'div'>) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const searchResults = React.useMemo(() => flattenNavItems(navMain), [navMain]);

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

  const handleSelect = React.useCallback((url: string) => {
    setOpen(false);
    router.push(url);
  }, [router]);

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
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(
            searchResults.reduce((groups: Record<string, SearchResult[]>, result) => {
              const section = result.section || "General";
              if (!groups[section]) {
                groups[section] = [];
              }
              groups[section].push(result);
              return groups;
            }, {})
          ).map(([section, items]) => (
            <CommandGroup key={section} heading={section}>
              {items.map((result) => (
                <CommandItem
                  key={result.url}
                  onSelect={() => handleSelect(result.url)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {result.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
