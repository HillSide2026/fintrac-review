import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FINTRAC Effectiveness Review — Levine Legal",
  description:
    "Intake form for Canadian reporting entities seeking a FINTRAC AML/ATF compliance program effectiveness review.",
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
