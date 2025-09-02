import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  styles?: React.CSSProperties;
};

export function LoaderComponent({ styles }: Props) {
  return (
    <div className="flex items-center justify-center grow" style={styles}>
      <Loader2 className="animate-spin text-green-300" size={40} />
    </div>
  );
}
