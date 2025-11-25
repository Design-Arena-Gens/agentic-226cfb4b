import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MT5 Strategy & EA Dashboard",
  description: "Estratégias de Trading e Expert Advisors para MetaTrader 5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
