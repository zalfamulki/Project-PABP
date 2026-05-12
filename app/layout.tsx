import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { ToastContainer } from "@/components/ui/toast";
import { PushNotificationRegistry } from "@/components/push-notification-registry";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartQueue F&B+",
  description: "Modern food and beverage queue management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${outfit.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ToastContainer />
        <PushNotificationRegistry />
      </body>
    </html>
  );
}
