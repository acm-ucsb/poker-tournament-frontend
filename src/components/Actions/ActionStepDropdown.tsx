import React, { useRef, useState, useLayoutEffect } from "react";

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

  useLayoutEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div
      style={{
        marginTop: isOpen ? "1rem" : "0",
        overflow: "hidden",
        height: isOpen ? `${height}px` : "0px",
        opacity: isOpen ? 1 : 0,
        transition:
          "height 250ms ease-in-out, opacity 250ms ease-in-out, margin-top 250ms ease-in-out",
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
