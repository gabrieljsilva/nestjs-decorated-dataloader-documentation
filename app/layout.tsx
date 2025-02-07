import type { Metadata } from "next";
import "../styles/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { FloatingHeader } from "@/components/floating-header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Layout } from "@/interfaces";

export const metadata: Metadata = {
	title: "Decorated Dataloaders",
	description: "Documentation for nestjs-decorated-dataloaders package",
	icons: {
		icon: "/white-rabbit.svg",
	},
};

export default function RootLayout({ children }: Layout) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<SidebarProvider>
						<AppSidebar />
						<div className="flex min-h-screen flex-col overflow-hidden">
							<main className="flex-1 relative overflow-hidden">
								<FloatingHeader />
								<SidebarInset className="w-full px-4 sm:px-6 lg:px-8 overflow-x-hidden">
									{children}
								</SidebarInset>
							</main>
							<Footer />
						</div>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
