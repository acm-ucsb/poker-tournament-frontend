import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Team's Submission",
  description: "Your team's code submission for the tournament",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
