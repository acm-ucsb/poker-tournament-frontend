import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Human Actions Panel",
  description: "Panel for managing human actions within the tournament",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
