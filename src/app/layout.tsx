import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeautyBook CRM — Mini Beauty CRM",
  description: "Премиальная онлайн-запись и мини-CRM для салона красоты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
