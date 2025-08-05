import React from "react";

type ActionStepDropdownProps = {
  isOpen?: boolean;
  children: React.ReactNode;
};

export function ActionStepDropdown({
  isOpen,
  children,
}: ActionStepDropdownProps) {
  return (
    <div
      style={{
        marginTop: isOpen ? "1rem" : "0",
        overflow: "hidden",
        transition: "all 250ms ease-in-out",
        maxHeight: isOpen ? "1000px" : "0",
        opacity: isOpen ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
