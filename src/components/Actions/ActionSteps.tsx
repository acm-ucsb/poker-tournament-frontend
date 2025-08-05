"use client";

import { Step } from "./types";
import { ActionStep } from "./ActionStep";
import { useEffect, useState } from "react";
import { useData } from "@/providers/DataProvider";

type Props = {
  steps: Step[];
};

// Each action step is a numbered step with a title, description, and children content. Once the previous steps are completed, the next step becomes available.
export function ActionSteps({ steps }: Props) {
  const { data } = useData();

  // Find the LAST step that is not disabled to determine the current step.
  const currentStepIndex = steps.findLastIndex((step) => !step.disabled);
  const [openStep, setOpenStep] = useState<number>(currentStepIndex); // current open step

  useEffect(() => {
    // when data is updated, reset the open step to the last non-disabled step
    const lastNonDisabledStepIndex = steps.findLastIndex(
      (step) => !step.disabled
    );
    setOpenStep(lastNonDisabledStepIndex);
  }, [data]);

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <ActionStep
          key={step.order}
          step={step}
          isOpen={openStep === index}
          handleOpenChange={() => {
            if (openStep === index) {
              setOpenStep(-1);
            } else {
              setOpenStep(index);
            }
          }}
        />
      ))}
    </div>
  );
}
