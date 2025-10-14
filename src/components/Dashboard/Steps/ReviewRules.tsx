import { ButtonWrapper } from "@/components/ButtonWrapper";
import { useLocalStorage } from "@mantine/hooks";
import { CheckCircleIcon, ChevronDownIcon } from "lucide-react";
import Markdown from "react-markdown";
import { rules } from "./rules";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ReviewRules() {
  const [hasAcknowledgedRules, setHasAcknowledgedRules] = useLocalStorage({
    key: "ack-tournament-rules",
    defaultValue: false,
    deserialize: (value) => value === "true",
    serialize: (value) => (value ? "true" : "false"),
  });
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [showRulePopup, setShowRulePopup] = useState(false);
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

  // Prevent scrolling when popup is open
  useEffect(() => {
    if (showRulePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup just in case the component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [showRulePopup]);

  return (
    <section className="flex flex-col gap-3">
      {!hasAcknowledgedRules ? (
        <ButtonWrapper className="mt-1" onClick={() => setShowRulePopup(true)}>
          Review Rules
        </ButtonWrapper>
      ) : (
        <>
          <ButtonWrapper
            variant={"outline"}
            className="mt-1"
            onClick={() => setShowRulePopup(true)}
          >
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            Review Rules
          </ButtonWrapper>
        </>
      )}

      {showRulePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-background rounded-2xl p-6 shadow-lg w-[80vw]">
              {!hasAcknowledgedRules && (
                <div className="flex items-center justify-center text-sm text-muted-foreground animate-pulse mb-2">
                  <ChevronDownIcon className="h-4 w-4 mr-1" />
                  Please scroll to the bottom to accept the rules
                </div>
              )}
              <div
                className="px-5 py-3 rounded-md max-h-[80vh] overflow-y-auto border"
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
                    li: ({ node, ...props }) => (
                      <li className="my-1" {...props} />
                    ),
                  }}
                >
                  {rules}
                </Markdown>
              </div>
              <div className="flex justify-center gap-3 pt-3">
                <ButtonWrapper
                  className="mt-1"
                  onClick={() => setShowRulePopup(false)}
                >
                  Close
                </ButtonWrapper>
                {!hasAcknowledgedRules && (
                  <ButtonWrapper
                    variant="default"
                    className="mt-1 bg-[#22c55e]"
                    disabled={!hasScrolledToBottom}
                    onClick={() => {
                      setShowRulePopup(false);
                      setHasAcknowledgedRules(true);
                    }}
                  >
                    Accept Rules
                  </ButtonWrapper>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
