import { useAuth } from "@/providers/AuthProvider";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { useData } from "@/providers/DataProvider";
import { useState } from "react";
import { toast } from "sonner";
import { removeTeamMember } from "@/lib/server-actions";
import {
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { ButtonWrapper } from "../ButtonWrapper";

type Props = {
  member: User;
};

export function UserCard({ member }: Props) {
  const auth = useAuth();
  const { data, tourneyData, mutate } = useData();
  const [removeLoading, setRemoveLoading] = useState(false);

  // Remove member method
  const handleRemoveMember = async () => {
    if (!data?.team) return;

    setRemoveLoading(true);

    // Call server action to remove member
    const response = await removeTeamMember({
      teamId: data.team.id,
      userId: member.id,
    });

    if (response.success) {
      toast.success("Member removed successfully!", {
        richColors: true,
      });
      mutate(); // Refresh data
    } else {
      toast.error(response.error?.message || "Failed to remove member", {
        richColors: true,
      });
    }

    setRemoveLoading(false);
  };

  return (
    <Card key={member.id} className="p-0">
      <CardContent className="flex gap-3 justify-between items-center px-4 py-3">
        <div>
          <CardTitle className="flex items-center gap-1">
            {member.name}{" "}
            <span className="text-sm text-gray-400">
              {member.id === auth.user?.id &&
                member.id !== data?.team.owner.id &&
                "(you)"}
              {member.id === auth.user?.id &&
                member.id === data?.team.owner.id &&
                "(you, owner)"}
              {member.id !== auth.user?.id &&
                member.id === data?.team.owner.id &&
                "(owner)"}
            </span>
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            {member.email}
          </CardDescription>
        </div>
        {data?.team.owner.id === auth.user?.id &&
          member.id !== auth.user?.id &&
          !tourneyData?.teams_disabled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <ButtonWrapper variant={"destructive"} loading={removeLoading}>
                  Remove
                </ButtonWrapper>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove {member.name} from the team. They
                    can be re-invited later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemoveMember}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
      </CardContent>
    </Card>
  );
}
