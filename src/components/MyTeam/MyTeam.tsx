import { useAuth } from "@/providers/AuthProvider";
import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { joinTeam } from "@/lib/server-actions/joinTeam";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function MyTeam({}) {
  const auth = useAuth();
  const router = useRouter();
  const { data, mutate } = useData();

  // Check if user is invited to a team via URL
  const params = useSearchParams();
  const teamInviteId = params.get("invite");

  useEffect(() => {
    if (teamInviteId && !data?.team) {
      joinTeam({ teamId: teamInviteId }).then((data) => {
        if (data.success) {
          toast.success("Successfully joined the team!", {
            richColors: true,
          });
        } else {
          toast.error(data.error?.message || "Failed to join team", {
            richColors: true,
          });
        }

        mutate();
        router.push("/dashboard");
      });
    }
  }, [data?.team]);

  if (teamInviteId) {
    return (
      <main className="flex flex-col items-center justify-center grow w-full max-w-7xl self-center">
        <Loader2 className="animate-spin text-green-300" size={40} />
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full max-w-7xl self-center">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Dashboard", link: "/dashboard" },
        ]}
        currentPage={{ title: "My Team", link: "/dashboard/myteam" }}
      />
      {/* Team Information */}
      <section className="flex flex-col mt-6">
        <h1 className="flex items-center gap-1.5 text-2xl font-bold mb-4">
          My Team
        </h1>
      </section>
    </main>
  );
}
