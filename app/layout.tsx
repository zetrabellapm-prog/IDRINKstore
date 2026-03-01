import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "iDrink - Bebidas entregues em minutos",
  description:
    "O marketplace futurista de bebidas. Peca suas bebidas favoritas e receba em minutos na sua porta.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("[v0] RootLayout rendering");
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen pb-20 pt-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
