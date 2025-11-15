import moment from "moment";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { TeamData } from "../AdminPanel/sections/ManageTeams";
import { ButtonWrapper } from "../ButtonWrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { toggleQualification } from "@/lib/server-actions/admin/toggleQualification";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Props = {
  team: TeamData;
  mutate: () => void;
};

export function TeamCard({ team, mutate }: Props) {
  const [qualificationLoading, setQualificationLoading] = useState(false);

  return (
    <Card key={team.id} className="flex justify-center p-0 w-full h-full">
      <CardContent className="flex flex-wrap justify-between items-center gap-3 p-3">
        <CardTitle className="flex justify-center items-center gap-3 ml-2">
          <div className="flex justify-center items-center gap-2">
            {team.name}{" "}
            <span className="text-sm text-gray-500 hidden lg:block">
              Created {moment(team.created_at).fromNow()}
            </span>
          </div>
          <div className="flex gap-2">
            <Badge className="xs:block hidden" variant={"info"}>
              {team.members.length}{" "}
              {team.members.length === 1 ? "member" : "members"}
            </Badge>
            {team.table_id ? (
              <Badge variant="success">Seated</Badge>
            ) : team.num_chips > 0 ? (
              <Badge variant="warning">Not Seated</Badge>
            ) : (
              <Badge variant="error">Eliminated</Badge>
            )}
            {team.is_disqualified && (
              <Badge variant="error">Disqualified</Badge>
            )}
          </div>
        </CardTitle>
        <div className="grid w-full md:w-auto md:flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ButtonWrapper
                variant={team.is_disqualified ? "outline" : "destructive"}
                loading={qualificationLoading}
                className="min-w-28"
              >
                {team.is_disqualified ? "Reinstate" : "Disqualify"}
              </ButtonWrapper>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {team.is_disqualified ? (
                    <span>
                      This will reinstate the team <strong>{team.name}</strong>{" "}
                      back into the tournament.
                    </span>
                  ) : (
                    <span>
                      This will disqualify the team <strong>{team.name}</strong>{" "}
                      from the tournament.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setQualificationLoading(true);
                    if (team.is_disqualified) {
                      toast.info(
                        `Reinstating team ${team.name}, please wait...`,
                        {
                          richColors: true,
                          duration: 10000,
                        }
                      );
                    } else {
                      toast.info(
                        `Disqualifying team ${team.name}, please wait...`,
                        {
                          richColors: true,
                          duration: 10000,
                        }
                      );
                    }

                    const res = await toggleQualification({ teamId: team.id });

                    if (res.success) {
                      if (team.is_disqualified) {
                        toast.success(`Reinstated team ${team.name}`, {
                          richColors: true,
                        });
                      } else {
                        toast.success(`Disqualified team ${team.name}`, {
                          richColors: true,
                        });
                      }
                      mutate();
                    } else {
                      toast.error(res.error?.message, {
                        richColors: true,
                      });
                    }
                    setQualificationLoading(false);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog>
            <DialogTrigger asChild>
              <ButtonWrapper
                className="lg:block md:hidden sm:block"
                variant={"outline"}
              >
                View Members
              </ButtonWrapper>
            </DialogTrigger>
            <DialogContent className="min-w-max">
              <DialogHeader>
                <DialogTitle>{team.name}'s members</DialogTitle>
                <DialogDescription className="flex flex-col mt-2">
                  {team.members
                    .sort((a, b) => {
                      if (a.id === team.owner_id) return -1;
                      if (b.id === team.owner_id) return 1;
                      return a.name.localeCompare(b.name);
                    })
                    .map((member) => (
                      <span key={member.id} className="flex items-center gap-1">
                        <span className="text-white text-md w-max">
                          {member.name}
                        </span>
                        <span className="text-gray-400">
                          (<span className="text-ellipsis">{member.email}</span>
                          )
                        </span>
                        {member.id === team.owner_id && (
                          <Badge className="ml-1" variant="success">
                            Owner
                          </Badge>
                        )}
                      </span>
                    ))}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <ButtonWrapper
            disabled={!team.has_submitted_code}
            className="md:w-auto w-full min-w-28"
            variant={"outline"}
            href={
              team.has_submitted_code
                ? `/dashboard/admin/submission/${team.id}`
                : `#`
            }
          >
            View Code
          </ButtonWrapper>

          <ButtonWrapper
            disabled={!team.table_id}
            className="md:w-auto w-full min-w-28"
            variant={"outline"}
            href={team.table_id ? `/dashboard/tables/${team.table_id}` : `#`}
          >
            View Table
          </ButtonWrapper>
        </div>
      </CardContent>
    </Card>
  );
}
