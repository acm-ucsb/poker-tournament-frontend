import { TEAM_MAX_MEMBERS } from "@/lib/constants";

export function StepOne() {
  return (
    <div>
      <h2>Step 1: Create or join a team</h2>
      <p>
        Make sure all your teammates join the same team. Max {TEAM_MAX_MEMBERS}{" "}
        members per team.
      </p>
    </div>
  );
}
