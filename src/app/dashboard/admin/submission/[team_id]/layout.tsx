import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Submission",
  description: "View team's submitted code",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
