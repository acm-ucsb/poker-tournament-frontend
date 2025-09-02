import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function ButtonWrapper({
  children,
  loading,
  disabled,
  href,
  ...props
}: React.ComponentProps<typeof Button> & { loading?: boolean; href?: string }) {
  return href && !disabled ? (
    <Link
      href={href}
      style={{
        display: props.className?.includes("hidden") ? "none" : "auto",
      }}
    >
      <Button
        {...props}
        style={{
          pointerEvents: disabled || loading ? "none" : "auto",
          opacity: disabled || loading ? 0.5 : 1,
        }}
      >
        {loading ? <Loader2Icon className="animate-spin" /> : children}
      </Button>
    </Link>
  ) : (
    <Button
      {...props}
      style={{
        pointerEvents: disabled || loading ? "none" : "auto",
        opacity: disabled || loading ? 0.5 : 1,
      }}
    >
      {loading ? <Loader2Icon className="animate-spin" /> : children}
    </Button>
  );
}
