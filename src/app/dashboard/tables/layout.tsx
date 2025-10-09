import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Menu",
  description: "View all tournament tables, leaderboard, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
