"use client";

import type * as React from "react";

import { SearchForm } from "./search-form";
import { VersionSwitcher } from "./version-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

import { Rocket, Settings, ArrowRight } from "lucide-react";

const data = {
	versions: ["1.0.3", "0.1.2-alpha.0"],
	navMain: [
		{
			title: "Getting Started",
			url: "#",
			icon: Rocket,
			items: [
				{
					title: "GraphQL",
					url: "#graphql",
				},
				{
					title: "Dataloaders",
					url: "#dataloaders",
				},
				{
					title: "Nestjs",
					url: "#nestjs",
				},
			],
		},
		{
			title: "Quick Start",
			url: "#",
			icon: ArrowRight,
			items: [
				{
					title: "Installation",
					url: "#installation",
				},
				{
					title: "Module Configuration",
					url: "#quick-start",
				},
				{
					title: "Defining Entities",
					url: "#defining-entities",
				},
				{
					title: "Dataloader Handlers",
					url: "#dataloader-handlers",
				},
				{
					title: "Usage in resolvers",
					url: "#using-dataloaders",
				},
			],
		},
		{
			title: "Advanced Concepts",
			url: "#",
			icon: Settings,
			items: [
				{
					title: "Handling Circular Dependencies",
					url: "#handling-circular-dependencies",
				},
				{
					title: "Aliases",
					url: "#aliases",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<VersionSwitcher
					versions={data.versions}
					defaultVersion={data.versions[0]}
				/>
				<SearchForm navMain={data.navMain} />
			</SidebarHeader>
			<SidebarContent>
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>
							<span className="flex items-center">
								{item.icon && <item.icon className="mr-2 h-4 w-4" />}
								{item.title}
							</span>
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.length > 0 ? (
									item.items.map((subItem) => (
										<SidebarMenuItem key={subItem.title}>
											<SidebarMenuButton asChild>
												<a href={subItem.url}>{subItem.title}</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))
								) : (
									<SidebarMenuItem>
										<SidebarMenuButton asChild>
											<a href={item.url}>{item.title}</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
