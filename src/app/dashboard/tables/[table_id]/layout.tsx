import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Tournament Table",
  description: "Watch the bots compete live on the tournament table",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
