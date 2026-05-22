import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tuxedo Shop | Alterations, Embroidery & Formalwear",
  description: "A polished demo website for Tuxedo Shop, featuring alterations, embroidery, custom sewing, and formalwear fittings.",
  openGraph: {
    title: "Tuxedo Shop | Alterations, Embroidery & Formalwear",
    description: "A polished demo website for Tuxedo Shop, featuring alterations, embroidery, custom sewing, and formalwear fittings.",
    siteName: "Tuxedo Shop",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
