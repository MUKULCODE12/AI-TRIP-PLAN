import { ClerkProvider } from "@clerk/nextjs";
import { UserDetailProvider } from "./provider";
import Header from "./_components/Header";
import "./globals.css";
import { Outfit } from "next/font/google";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Plan Me a Trip | AI-Powered Trip Planner",
  description:
    "Plan your next adventure with AI. Get personalized trip itineraries, budget estimates, and destination recommendations powered by AI.",
  keywords: [
    "trip planner",
    "AI travel",
    "itinerary generator",
    "travel planning",
    "vacation planner",
  ],
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Providers>
            <UserDetailProvider>
              <Header />
              <main>{children}</main>
            </UserDetailProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}