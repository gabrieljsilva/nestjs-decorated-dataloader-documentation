import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Nestjs Decorated Dataloaders',
  description: 'Documentation for nestjs-decorated-dataloaders package',
  icons: {
    icon: '/white-rabbit.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
