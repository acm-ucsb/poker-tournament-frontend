import { ButtonWrapper } from "@/components/ButtonWrapper";
import { useLocalStorage } from "@mantine/hooks";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  SquareArrowOutUpRight,
  BookOpen,
} from "lucide-react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { submitGuide } from "./submitGuide";
import { pokerGuide } from "./pokerGuide";
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
import { Button } from "@/components/ui/button";

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
      <div className="flex gap-2 w-full">
        <a
          href="https://github.com/acm-ucsb/poker-bot-starter-code"
          target="_blank"
          className="flex-1"
        >
          <Button className="w-full text-center" variant={"outline"}>
            Starter Code <SquareArrowOutUpRight className="ml-1 h-4 w-4" />
          </Button>
        </a>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex-1" variant={"outline"}>
              <BookOpen className="mr-1 h-4 w-4" />
              Poker Guide
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="min-w-3/5">
            <AlertDialogHeader>
              <AlertDialogTitle>Poker Guide & Tournament Ruleset</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="bg-background rounded-2xl shadow-lg">
                  <div className="px-5 py-3 rounded-md max-h-[80vh] overflow-y-auto border">
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
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-lg font-semibold mt-4 mb-2"
                            {...props}
                          />
                        ),
                        h4: ({ node, ...props }) => (
                          <h4
                            className="text-base font-semibold mt-3 mb-2"
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
                        a: ({ node, href, ...props }) => {
                          const isInternalDashboardLink = href?.includes(
                            "acm-poker-tournament.vercel.app/dashboard",
                          );
                          return (
                            <a
                              className="text-green-500 hover:text-green-600 underline"
                              href={href}
                              target={
                                isInternalDashboardLink ? undefined : "_blank"
                              }
                              rel={
                                isInternalDashboardLink
                                  ? undefined
                                  : "noopener noreferrer"
                              }
                              {...props}
                            />
                          );
                        },
                        code: ({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }: any) => {
                          const match = /language-(\w+)/.exec(className || "");
                          const language = match ? match[1] : "";
                          return !inline && language ? (
                            <code
                              className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <code
                              className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {pokerGuide}
                    </Markdown>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
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
                      a: ({ node, href, ...props }) => {
                        const isInternalDashboardLink = href?.includes(
                          "acm-poker-tournament.vercel.app/dashboard",
                        );
                        return (
                          <a
                            className="text-green-500 hover:text-green-600 underline"
                            href={href}
                            target={
                              isInternalDashboardLink ? undefined : "_blank"
                            }
                            rel={
                              isInternalDashboardLink
                                ? undefined
                                : "noopener noreferrer"
                            }
                            {...props}
                          />
                        );
                      },
                      pre: ({ node, ...props }) => (
                        <div className="my-4">{props.children}</div>
                      ),
                      code: ({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }: any) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : "";
                        return !inline && language ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={language}
                            PreTag="div"
                            className="rounded-lg shadow-lg !my-0"
                            customStyle={{
                              margin: 0,
                              borderRadius: "0.5rem",
                              fontSize: "0.875rem",
                              lineHeight: "1.5",
                              boxSizing: "border-box",
                              width: "100%",
                              whiteSpace: "pre",
                              overflowX: "auto",
                              minWidth: 0,
                            }}
                            codeTagProps={{
                              style: {
                                display: "block",
                                boxSizing: "border-box",
                                fontFamily:
                                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                                whiteSpace: "pre-wrap",
                                wordBreak: 'break-word',
                                overflowWrap: "normal",
                              },
                            }}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
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
