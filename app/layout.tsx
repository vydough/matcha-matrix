import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RMC's Matcha Matrix",
  description: "A live community rating matrix for Melbourne's best matcha cafes. Rated by taste and style.",
  openGraph: {
    title: "RMC's Matcha Matrix",
    description: "Live community ratings of Melbourne's matcha cafes — Sweet vs Bitter, Traditional vs Creative.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
