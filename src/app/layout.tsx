import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BeePulse - O Raio-X Digital do seu Hotel | Omnibees",
  description: "Descubra como seu site está performando e conquiste mais reservas diretas. Análise completa de performance digital para hotéis, pousadas e resorts.",
  keywords: "análise de performance, hotel, reservas diretas, SEO hoteleiro, otimização de site, BeePulse, Omnibees",
  authors: [{ name: "Omnibees" }],
  creator: "Omnibees",
  publisher: "Omnibees",
  openGraph: {
    title: "BeePulse - O Raio-X Digital do seu Hotel",
    description: "Descubra como seu site está performando e conquiste mais reservas diretas.",
    url: "https://beepulse.omnibees.com",
    siteName: "BeePulse",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeePulse - O Raio-X Digital do seu Hotel",
    description: "Descubra como seu site está performando e conquiste mais reservas diretas.",
    creator: "@omnibees",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
