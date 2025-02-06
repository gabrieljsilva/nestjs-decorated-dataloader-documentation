import type { Metadata } from "next";
import "../styles/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
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
					<div className="flex min-h-screen flex-col">
						<main className="flex-1 relative">
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset className="w-full px-4 sm:px-6 lg:px-8">
									{children}
								</SidebarInset>
							</SidebarProvider>
						</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
