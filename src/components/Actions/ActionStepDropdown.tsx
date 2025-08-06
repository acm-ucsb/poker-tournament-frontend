import { useViewportSize } from "@mantine/hooks";
import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

type ActionStepDropdownProps = {
  isOpen?: boolean;
  children: React.ReactNode;
};

export function ActionStepDropdown({
  isOpen,
  children,
}: ActionStepDropdownProps) {
  // Ref and state to track content height for smooth collapse
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Update height on content resize (e.g. form errors) or initial render
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // set initial height
    setHeight(el.scrollHeight);
    // observe resize
    const observer = new ResizeObserver(() => {
      setHeight(el.scrollHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      style={{
        overflow: "hidden",
        height: isOpen ? `${height}px` : "0px",
        opacity: isOpen ? 1 : 0,
        transition:
          "height 250ms ease-in-out, opacity 250ms ease-in-out, margin-top 250ms ease-in-out",
      }}
    >
      <div className="px-4 pb-4" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
