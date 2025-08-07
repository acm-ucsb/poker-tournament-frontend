"use client";

import { Step } from "./types";
import { ActionStep } from "./ActionStep";
import { useEffect, useState } from "react";
import { useData } from "@/providers/DataProvider";
import { Skeleton } from "../ui/skeleton";

type Props = {
  steps: Step[];
  loading?: boolean;
};

// Each action step is a numbered step with a title, description, and children content. Once the previous steps are completed, the next step becomes available.
export function ActionSteps({ steps, loading }: Props) {
  const { data } = useData();

  // Find the LAST step that is not disabled to determine the current step.
  const currentStepIndex = steps.findLastIndex((step) => !step.disabled);
  const [openStep, setOpenStep] = useState<number>(currentStepIndex || -1); // current open step

  useEffect(() => {
    // when data is updated, reset the open step to the last non-disabled step
    const lastNonDisabledStepIndex = steps.findLastIndex(
      (step) => !step.disabled
    );
    setOpenStep(lastNonDisabledStepIndex);
  }, [data]);

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, index) =>
        loading ? (
          <Skeleton key={index} className="h-[50px] rounded-2xl" />
        ) : (
          <ActionStep
            key={index}
            step={step}
            order={index + 1}
            isOpen={openStep === index}
            handleOpenChange={() => {
              if (openStep === index) {
                setOpenStep(-1);
              } else {
                setOpenStep(index);
              }
            }}
          />
        )
      )}
    </div>
  );
}
