import { IconChevronDown } from "@tabler/icons-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CheckCircleIcon, CircleMinus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Step } from "./types";
import { ActionStepDropdown } from "./ActionStepDropdown";

type Props = {
  step: Step;
  order: number;
  isOpen?: boolean;
  handleOpenChange?: () => void;
};

export function ActionStep({ step, order, isOpen, handleOpenChange }: Props) {
  return (
    <Card
      className="flex flex-col p-0"
      style={{
        opacity: step.disabled ? 0.5 : 1,
        pointerEvents: step.disabled ? "none" : "auto",
        rowGap: 0,
      }}
    >
      <CardHeader
        onClick={handleOpenChange}
        style={{
          cursor: step.disabled ? "not-allowed" : "pointer",
        }}
        className="flex items-center p-3"
      >
        <CardTitle className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="flex gap-2 items-center min-w-max">
              {step.completed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center justify-center w-6 h-6 p-0">
                      <CheckCircleIcon
                        className="p-0 m-0"
                        color="hsl(149, 88%, 66%)"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Completed!</p>
                  </TooltipContent>
                </Tooltip>
              ) : step.incomplete ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center justify-center w-6 h-6 p-0">
                      <CircleMinus
                        className="p-0 m-0"
                        color="hsl(32, 88%, 66%)"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Completed!</p>
                  </TooltipContent>
                </Tooltip>
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
      {step.disabled ? null : (
        <ActionStepDropdown isOpen={isOpen}>{step.children}</ActionStepDropdown>
      )}
    </Card>
  );
}
