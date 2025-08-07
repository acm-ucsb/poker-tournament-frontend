import { HEADER_HEIGHT_PX } from "@/lib/constants";

export function Footer() {
  return (
    <footer
      className="flex items-center justify-center w-full border-t mt-6"
      style={{ height: HEADER_HEIGHT_PX }}
    >
      <p className="text-muted-foreground">
        Made by UCSB's ACM Development Branch
      </p>
    </footer>
  );
}
