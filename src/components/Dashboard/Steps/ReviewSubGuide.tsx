import { ButtonWrapper } from "@/components/ButtonWrapper";
import { useLocalStorage } from "@mantine/hooks";
import { CheckCircleIcon, ChevronDownIcon } from "lucide-react";
import Markdown from "react-markdown";
import { submitGuide } from "./submitGuide";
import { useRef, useState, useEffect } from "react";
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

export function ReviewSubGuide() {
  const [hasReadSubmissionGuide, setHasReadSubmissionGuide] = useLocalStorage({
    key: "read-submission-guide",
    defaultValue: false,
    deserialize: (value) => value === "true",
    serialize: (value) => (value ? "true" : "false"),
  });
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const guidelineContainerRef = useRef<HTMLDivElement>(null);

  // Function to check if user has scrolled to the bottom
  const handleScroll = () => {
    if (guidelineContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        guidelineContainerRef.current;
      // Consider "bottom" when user is within 20px of the actual bottom
      const isBottom = scrollTop + clientHeight >= scrollHeight - 20;
      setHasScrolledToBottom(isBottom);
    }
  };

  // Reset scroll state when component mounts if guideline haven't been accepted yet
  useEffect(() => {
    if (!hasReadSubmissionGuide) {
      setHasScrolledToBottom(false);
    }
  }, [hasReadSubmissionGuide]);

  return (
    <section className="flex flex-col gap-3">
      <AlertDialog>
        <AlertDialogTrigger asChild className="w-full">
          {!hasReadSubmissionGuide ? (
            <ButtonWrapper className="mt-1">Review Guidelines</ButtonWrapper>
          ) : (
            <ButtonWrapper variant={"outline"} className="w-full">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              Review Guidelines
            </ButtonWrapper>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="min-w-3/5">
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Guidelines</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="bg-background rounded-2xl shadow-lg">
                <div
                  className="px-5 py-3 rounded-md max-h-[80vh] overflow-y-auto border"
                  ref={guidelineContainerRef}
                  onScroll={handleScroll}
                >
                  <Markdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-2xl font-bold mt-2 mb-4"
                          {...props}
                        />
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
                      a: ({ node, ...props }) => (
                        <a
                          className="text-green-500 hover:text-green-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {submitGuide}
                  </Markdown>
                </div>
                {!hasReadSubmissionGuide && !hasScrolledToBottom && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground animate-pulse mt-4">
                    <ChevronDownIcon className="h-4 w-4 mr-1" />
                    Please scroll to the bottom to accept the guidelines
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              {!hasReadSubmissionGuide && (
                <ButtonWrapper
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 grow"
                  disabled={!hasScrolledToBottom}
                  onClick={() => {
                    setHasReadSubmissionGuide(true);
                  }}
                >
                  Accept Guidelines
                </ButtonWrapper>
              )}
            </AlertDialogAction>
            <AlertDialogCancel
              style={{
                width: hasReadSubmissionGuide ? "100%" : undefined,
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
