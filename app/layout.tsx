import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import type { Layout } from "@/interfaces";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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
						<main className="flex-1">
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset>
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
