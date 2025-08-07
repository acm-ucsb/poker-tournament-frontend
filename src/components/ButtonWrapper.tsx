import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";

export function ButtonWrapper({
  children,
  loading,
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return (
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
