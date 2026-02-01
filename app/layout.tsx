import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap'
});

const geistSans = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const geistSerif = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Vector Database Benchmark Results",
  description: "Performance analysis of RAG pipeline across Pinecone, PostgreSQL, and ChromaDB vector databases",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1f1f" },
  ],
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistSerif.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body
        className="font-sans antialiased"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-background text-foreground rounded-md px-3 py-2 absolute left-2 top-2 z-50"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
