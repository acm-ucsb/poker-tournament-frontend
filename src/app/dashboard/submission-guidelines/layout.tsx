import { HEADER_HEIGHT_PX } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submissions Guidelines",
  description: "Tournament submissions guidelines and rules",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col px-6"
      style={{
        minHeight: `calc(100vh - ${HEADER_HEIGHT_PX}px)`,
        paddingTop: HEADER_HEIGHT_PX,
      }}
    >
      {children}
    </div>
  );
}
