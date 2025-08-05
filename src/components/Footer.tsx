import { HEADER_HEIGHT_PX } from "@/lib/constants";

export function Footer() {
  return (
    <footer
      className="flex items-center justify-center w-full border-t"
      style={{ height: HEADER_HEIGHT_PX }}
    >
      <p className="text-muted-foreground">
        UCSB ACM Development Branch Poker Tournament
      </p>
    </footer>
  );
}
