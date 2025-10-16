-- 1) Create trigger function
CREATE OR REPLACE FUNCTION public.tables_update_sync_team_chips()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  old_held jsonb;
  new_held jsonb;
  new_players jsonb;
  len_old int;
  len_new int;
  idx int;
  player_id uuid;
  team_id uuid;
  held_val numeric;
BEGIN
  -- If either game_state is null, nothing to do
  IF (TG_OP <> 'UPDATE') THEN
    RETURN NEW;
  END IF;

  IF (OLD.game_state IS NULL OR NEW.game_state IS NULL) THEN
    RETURN NEW;
  END IF;

  old_held := OLD.game_state -> 'held_money';
  new_held := NEW.game_state -> 'held_money';
  new_players := NEW.game_state -> 'players';

  -- If held_money unchanged, exit
  IF old_held IS NOT DISTINCT FROM new_held THEN
    RETURN NEW;
  END IF;

  -- Ensure arrays; if not arrays, exit
  IF jsonb_typeof(new_held) IS DISTINCT FROM 'array' OR jsonb_typeof(new_players) IS DISTINCT FROM 'array' THEN
    RETURN NEW;
  END IF;

  len_old := jsonb_array_length(old_held);
  len_new := jsonb_array_length(new_held);

  -- iterate up to max length (only indexes present in new_held matter)
  FOR idx IN 0 .. (len_new - 1) LOOP
    -- Compare element-by-element. If old index doesn't exist, treat as changed.
    IF idx < len_old THEN
      IF (old_held -> idx) IS NOT DISTINCT FROM (new_held -> idx) THEN
        CONTINUE; -- no change at this index
      END IF;
    END IF;

    -- Get the corresponding player id from new_players at same index
    IF idx < jsonb_array_length(new_players) THEN
      player_id := (new_players ->> idx)::uuid;
    ELSE
      CONTINUE; -- no player at this index; skip
    END IF;

    -- Lookup player's team
    SELECT team_id INTO team_id FROM public.users WHERE id = player_id LIMIT 1;
    IF team_id IS NULL THEN
      CONTINUE; -- player not on a team; skip
    END IF;

    -- Extract numeric held money value
    -- Use COALESCE to handle JSON nulls; cast to numeric
    held_val := (new_held ->> idx)::numeric;

    -- Update the team's num_chips to the held_val (replace). Adjust logic here if you want delta instead.
    UPDATE public.teams
    SET num_chips = held_val
    WHERE id = team_id
      AND table_id = NEW.id;

    -- Note: If you prefer to update without requiring teams.table_id = NEW.id, remove that clause.
  END LOOP;

  RETURN NEW;
END;
$$;


-- 2) Create AFTER UPDATE trigger on public.tables to call the function
DROP TRIGGER IF EXISTS tables_sync_team_chips_trg ON public.tables;

CREATE TRIGGER tables_sync_team_chips_trg
AFTER UPDATE OF game_state ON public.tables
FOR EACH ROW
WHEN (OLD.game_state IS DISTINCT FROM NEW.game_state)
EXECUTE FUNCTION public.tables_update_sync_team_chips();