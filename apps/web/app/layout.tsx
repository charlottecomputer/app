import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "../components/smooth-scroll";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  weight: ["400"],
  display: "swap",
});

import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "Applause Clone",
  description: "A clone of applause.studiofreight.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} ${ebGaramond.variable}`}>
        <SmoothScroll>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SmoothScroll>
      </body>
    </html>
  );
}
