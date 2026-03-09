import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iKouen - みんなで育てる公園情報",
  description: "未就学児を持つ保護者・保育士・自治体をつなぐ公園情報プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
