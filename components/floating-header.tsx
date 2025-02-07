"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ArrowRight, Rocket, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";

const data = {
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

export function FloatingHeader() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between px-2 sm:px-4 transition-all duration-200 text-sm sm:text-base",
				isScrolled
					? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm"
					: "bg-background border-b",
			)}
		>
			{/* Left section */}
			<div className="flex items-center gap-1 sm:gap-2 w-fit">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
			</div>

			{/* Center section */}
			<div className="flex justify-center flex-1 mx-2 sm:mx-4">
				<div className="w-full max-w-[180px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]">
					<SearchForm navMain={data.navMain} />
				</div>
			</div>

			{/* Right section */}
			<div className="flex items-center justify-end gap-2 sm:gap-4 w-fit">
				<Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
				<a
					href="https://github.com/gabrieljsilva/nestjs-decorated-dataloaders"
					target="_blank"
					rel="noopener noreferrer"
					className="text-foreground hover:text-foreground/80"
				>
					<SiGithub className="h-4 w-4 sm:h-5 sm:w-5" />
				</a>
				<ThemeSwitcher />
			</div>
		</header>
	);
}
