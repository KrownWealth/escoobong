import type { Metadata, Viewport } from "next";
import "./globals.css";
import DynamicSeo from "@/utils/Dynamic_Seo";


const appColor = "#0F52BA";

export const viewport: Viewport = {
  themeColor: appColor,
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};

export const metadata: Metadata = DynamicSeo(0);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
