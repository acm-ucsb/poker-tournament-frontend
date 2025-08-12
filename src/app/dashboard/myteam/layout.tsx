import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Team",
  description: "Your team's dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
