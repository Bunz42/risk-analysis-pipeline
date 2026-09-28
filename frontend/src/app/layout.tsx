import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Risk Analytics",
  description:
    "AI-powered customer sentiment analysis and churn risk dashboard. Upload customer feedback CSVs for real-time NLP insights via Amazon Comprehend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
