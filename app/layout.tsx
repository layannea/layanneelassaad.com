import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const description =
  "ML engineer working on inference performance, retrieval, and agent systems.";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.layanneelassaad.com"),
  title: {
    default: "Layanne El Assaad",
    template: "%s · Layanne El Assaad",
  },
  description,
  openGraph: {
    title: "Layanne El Assaad",
    description,
    url: "https://www.layanneelassaad.com",
    siteName: "Layanne El Assaad",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}