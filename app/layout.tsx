import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Quizzy AI | The Core Intelligence for Learning",
  description: "Transform your notes into intelligent, adaptive quizzes and flashcards. Designed for elite students and competitive exam preparation.",
  openGraph: {
    title: "Quizzy AI | The Core Intelligence for Learning",
    description: "Personal AI tutor for elite exam preparation.",
    url: "https://quizzy-ai.vercel.app",
    siteName: "Quizzy AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizzy AI",
    description: "Adaptive learning for the modern student.",
  },
};

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import AuthGuard from "@/components/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthGuard>
              {children}
            </AuthGuard>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
