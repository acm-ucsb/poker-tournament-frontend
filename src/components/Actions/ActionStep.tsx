import { IconChevronDown } from "@tabler/icons-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Step } from "./types";
import { ActionStepDropdown } from "./ActionStepDropdown";

type Props = {
  step: Step;
  isOpen?: boolean;
  handleOpenChange?: () => void;
};

export function ActionStep({ step, isOpen, handleOpenChange }: Props) {
  return (
    <Card
      className="flex flex-col py-3 px-4"
      style={{
        opacity: step.disabled ? 0.5 : 1,
        pointerEvents: step.disabled ? "none" : "auto",
        cursor: step.disabled ? "not-allowed" : "pointer",
        rowGap: 0,
      }}
    >
      <CardHeader className="flex items-center p-0">
        <CardTitle className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            <span className="flex items-center justify-center w-6 h-6 border-gray-400 text-gray-400 border-[1.5px] rounded-full font-semibold text-md">
              {step.order}
            </span>
            <span>{step.title}</span>
            <CardDescription>{step.description}</CardDescription>
          </div>
          <IconChevronDown
            onClick={handleOpenChange}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </CardTitle>
      </CardHeader>
      <ActionStepDropdown isOpen={isOpen}>{step.children}</ActionStepDropdown>
    </Card>
  );
}
