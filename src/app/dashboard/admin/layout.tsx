import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin panel for managing the tournament",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
