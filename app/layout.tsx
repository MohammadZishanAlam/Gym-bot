import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gymbot AI - Personal Trainer & Workout Coach",
  description: "AI-powered workout plans and fitness advice powered by Google Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
