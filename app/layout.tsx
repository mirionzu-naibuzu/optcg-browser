import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPTCG Browser",
  description: "Browse One Piece TCG cards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}