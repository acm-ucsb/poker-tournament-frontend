import { ButtonWrapper } from "@/components/ButtonWrapper";
import { useLocalStorage } from "@mantine/hooks";
import { CheckCircleIcon, ChevronDownIcon } from "lucide-react";
import Markdown from "react-markdown";
import { rules } from "./rules";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ReviewRules() {
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
      <AlertDialog>
        <AlertDialogTrigger asChild className="w-full">
          {!hasAcknowledgedRules ? (
            <ButtonWrapper className="mt-1">Review Rules</ButtonWrapper>
          ) : (
            <ButtonWrapper variant={"outline"} className="w-full">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              Review Rules
            </ButtonWrapper>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="min-w-3/5">
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Rules</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="bg-background rounded-2xl shadow-lg">
                <div
                  className="px-5 py-3 rounded-md max-h-[70vh] overflow-y-auto border"
                  ref={rulesContainerRef}
                  onScroll={handleScroll}
                >
                  <Markdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-2xl font-bold mt-2 mb-4 text-left"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-xl font-bold mt-6 mb-3 pb-1 border-b text-left"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc pl-6 my-3 text-left"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal pl-6 my-3 text-left"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="my-1 text-left" {...props} />
                      ),
                    }}
                  >
                    {rules}
                  </Markdown>
                </div>
                {!hasAcknowledgedRules && !hasScrolledToBottom && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground animate-pulse mt-4">
                    <ChevronDownIcon className="h-4 w-4 mr-1" />
                    Please scroll to the bottom to accept the rules
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              {!hasAcknowledgedRules && (
                <ButtonWrapper
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 grow"
                  disabled={!hasScrolledToBottom}
                  onClick={() => {
                    setHasAcknowledgedRules(true);
                  }}
                >
                  Accept Rules
                </ButtonWrapper>
              )}
            </AlertDialogAction>
            <AlertDialogCancel
              style={{
                width: hasAcknowledgedRules ? "100%" : undefined,
              }}
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
