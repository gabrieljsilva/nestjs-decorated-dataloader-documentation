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
import { useEffect, useState } from "react";

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
				"sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between px-4 transition-all duration-200",
				isScrolled
					? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm"
					: "bg-background border-b",
			)}
		>
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>Documentation</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="flex items-center gap-4">
				<a
					href="https://github.com/gabrieljsilva/nestjs-decorated-dataloaders"
					target="_blank"
					rel="noopener noreferrer"
					className="text-foreground hover:text-foreground/80"
				>
					<SiGithub className="h-5 w-5" />
				</a>
				<ThemeSwitcher />
			</div>
		</header>
	);
}
