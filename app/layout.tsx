import type { Metadata } from "next";
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
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
