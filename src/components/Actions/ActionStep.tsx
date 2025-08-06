import { IconChevronDown } from "@tabler/icons-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Step } from "./types";
import { ActionStepDropdown } from "./ActionStepDropdown";
import { CheckCircleIcon } from "lucide-react";

type Props = {
  step: Step;
  order: number;
  isOpen?: boolean;
  handleOpenChange?: () => void;
};

export function ActionStep({ step, order, isOpen, handleOpenChange }: Props) {
  return (
    <Card
      className="flex flex-col py-3 px-4"
      style={{
        opacity: step.disabled ? 0.5 : 1,
        pointerEvents: step.disabled ? "none" : "auto",
        cursor: step.disabled ? "not-allowed" : "pointer",
        rowGap: 0,
      }}
      onClick={handleOpenChange}
    >
      <CardHeader className="flex items-center p-0">
        <CardTitle className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="flex gap-2 items-center min-w-max">
              {step.completed ? (
                <span className="flex items-center justify-center w-6 h-6 p-0">
                  <CheckCircleIcon
                    className="p-0 m-0"
                    color="hsl(149, 88%, 66%)"
                  />
                </span>
              ) : (
                <span className="flex items-center justify-center w-6 h-6 border-gray-400 text-gray-400 border-[1.5px] rounded-full font-semibold text-md">
                  {order}
                </span>
              )}
              <span>{step.title}</span>
            </div>
            <CardDescription className="hidden [@media(min-width:830px)]:block">
              {step.description}
            </CardDescription>
          </div>
          <IconChevronDown
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 250ms ease-in-out",
            }}
          />
        </CardTitle>
      </CardHeader>
      <ActionStepDropdown isOpen={isOpen}>{step.children}</ActionStepDropdown>
    </Card>
  );
}
