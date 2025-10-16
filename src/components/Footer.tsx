import { HEADER_HEIGHT_PX } from "@/lib/constants";

export function Footer() {
  return (
    <footer
      className="flex items-center justify-center w-full border-t"
      style={{ height: HEADER_HEIGHT_PX }}
    >
      <p className="text-muted-foreground">
        Made by the ACM Development Branch @ UCSB.
      </p>
    </footer>
  );
}
