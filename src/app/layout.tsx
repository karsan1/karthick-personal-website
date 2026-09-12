import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Karthick Sankar — Software Engineer & Product Builder",
    template: "%s · Karthick Sankar",
  },
  description:
    "The portfolio of Karthick Sankar, a software engineer and product builder creating clear, thoughtful digital experiences.",
  authors: [{ name: "Karthick Sankar" }],
  creator: "Karthick Sankar",
  openGraph: {
    type: "website",
    title: "Karthick Sankar — Software Engineer & Product Builder",
    description:
      "Selected work and experience from software engineer and product builder Karthick Sankar.",
    siteName: "Karthick Sankar",
  },
  twitter: {
    card: "summary",
    title: "Karthick Sankar — Software Engineer & Product Builder",
    description:
      "Selected work and experience from software engineer and product builder Karthick Sankar.",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07120f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
