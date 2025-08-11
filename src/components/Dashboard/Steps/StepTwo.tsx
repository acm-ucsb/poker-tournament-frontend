import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/providers/DataProvider";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function StepTwo() {
  const { data } = useData();
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-semibold">Your Tournament Submission</h2>
        <p className="mt-0 text-gray-300 text-sm">
          Please ensure that your code follows our{" "}
          {/* TODO: implement a submission guidelines page */}
          <Link
            href="/submission-guidelines"
            className="inline-flex items-center gap-1 p-0 m-0 hover:underline text-white font-semibold"
            style={{
              cursor: "pointer",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            submission guidelines
            <ExternalLink size={14} />
          </Link>
          .
        </p>
        <p className="mt-0 text-red-300 text-sm">
          Once you submit your code, you will be able to view your previous
          submission and re-submit your code at any time before the submission
          deadline.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full gap-2">
          <Input
            type="file"
            placeholder="Upload your bot code"
            accept=".zip,.tar,.gz,.py,.cpp"
          />
          <Button type="submit">Submit</Button>
        </div>
        {/* TODO: implement a way to get previous submission */}
        {data?.team?.has_submitted_code && (
          <Button variant="outline">View Previous Submission</Button>
        )}
      </div>
    </section>
  );
}
