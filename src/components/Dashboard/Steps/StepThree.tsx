import { ButtonWrapper } from "@/components/ButtonWrapper";
import { useLocalStorage } from "@mantine/hooks";
import { CheckCircleIcon, ChevronDownIcon } from "lucide-react";
import Markdown from "react-markdown";
import { rules } from "./rules";
import { useRef, useState, useEffect } from "react";

export function StepThree() {
  const [hasAcknowledgedRules, setHasAcknowledgedRules] = useLocalStorage({
    key: "ack-tournament-rules",
    defaultValue: false,
    deserialize: (value) => value === "true",
    serialize: (value) => (value ? "true" : "false"),
  });
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const rulesContainerRef = useRef<HTMLDivElement>(null);

  // Function to check if user has scrolled to the bottom
  const handleScroll = () => {
    if (rulesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        rulesContainerRef.current;
      // Consider "bottom" when user is within 20px of the actual bottom
      const isBottom = scrollTop + clientHeight >= scrollHeight - 20;
      setHasScrolledToBottom(isBottom);
    }
  };

  // Reset scroll state when component mounts if rules haven't been accepted yet
  useEffect(() => {
    if (!hasAcknowledgedRules) {
      setHasScrolledToBottom(false);
    }
  }, [hasAcknowledgedRules]);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Tournament Rules</h2>
      <div
        className="px-5 py-3 rounded-md max-h-96 overflow-y-auto border"
        ref={rulesContainerRef}
        onScroll={handleScroll}
      >
        <Markdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold mt-2 mb-4" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-xl font-bold mt-6 mb-3 pb-1 border-b"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 my-3" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 my-3" {...props} />
            ),
            li: ({ node, ...props }) => <li className="my-1" {...props} />,
          }}
        >
          {rules}
        </Markdown>
      </div>
      {!hasAcknowledgedRules ? (
        <>
          {!hasScrolledToBottom && (
            <div className="flex items-center justify-center text-sm text-muted-foreground animate-pulse mt-1">
              <ChevronDownIcon className="h-4 w-4 mr-1" />
              Please scroll to the bottom to accept the rules
            </div>
          )}
          <ButtonWrapper
            className="mt-1"
            onClick={() => setHasAcknowledgedRules(true)}
            disabled={!hasScrolledToBottom}
          >
            Accept Rules
          </ButtonWrapper>
        </>
      ) : (
        <ButtonWrapper variant={"outline"} className="mt-1" disabled>
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
          Rules Accepted
        </ButtonWrapper>
      )}
    </section>
  );
}
