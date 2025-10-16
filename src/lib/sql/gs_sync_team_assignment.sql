-- Function to update table game_state when a team is assigned to a table
-- This trigger ensures that when a team's table_id is updated, the team is added to the table's game_state.players array

CREATE OR REPLACE FUNCTION update_table_game_state_on_team_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log for debugging (optional - comment out if not needed)
  RAISE NOTICE 'Trigger fired for team %: OLD.table_id = "%" (is null: %), NEW.table_id = "%" (is null: %)', 
    NEW.id, OLD.table_id, (OLD.table_id IS NULL), NEW.table_id, (NEW.table_id IS NULL);
  
  RAISE NOTICE 'Condition 1 check: (OLD.table_id IS NULL OR OLD.table_id != NEW.table_id) = %, AND (NEW.table_id IS NOT NULL) = %',
    (OLD.table_id IS NULL OR (OLD.table_id IS NOT NULL AND NEW.table_id IS NOT NULL AND OLD.table_id != NEW.table_id)), 
    (NEW.table_id IS NOT NULL);
  
  -- Only process if table_id has changed to a non-NULL value
  IF NEW.table_id IS NOT NULL AND (OLD.table_id IS NULL OR OLD.table_id != NEW.table_id) THEN
    RAISE NOTICE 'CONDITION MET: Adding team % to table %', NEW.id, NEW.table_id;
    
    -- Update the game_state to include the new team in the players array
    -- Only add if not already present
    UPDATE tables
    SET game_state = jsonb_set(
      COALESCE(game_state, '{}'::jsonb),
      '{players}',
      CASE 
        WHEN COALESCE(game_state->'players', '[]'::jsonb) @> to_jsonb(NEW.id::text)
        THEN COALESCE(game_state->'players', '[]'::jsonb)
        ELSE COALESCE(game_state->'players', '[]'::jsonb) || to_jsonb(NEW.id::text)
      END,
      true
    )
    WHERE id = NEW.table_id;
    
    RAISE NOTICE 'UPDATE executed for table %', NEW.table_id;
  END IF;
  
  -- If table_id was changed from a non-NULL value to a different value or NULL,
  -- remove the team from the old table's players array
  IF OLD.table_id IS NOT NULL AND (NEW.table_id IS NULL OR OLD.table_id != NEW.table_id) THEN
    RAISE NOTICE 'Removing team % from table %', OLD.id, OLD.table_id;
    
    UPDATE tables
    SET game_state = jsonb_set(
      game_state,
      '{players}',
      COALESCE(
        (
          SELECT jsonb_agg(elem)
          FROM jsonb_array_elements(game_state->'players') elem
          WHERE elem::text != ('"' || OLD.id::text || '"')
        ),
        '[]'::jsonb
      ),
      true
    )
    WHERE id = OLD.table_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS team_table_assignment_trigger ON teams;

-- Create the trigger
CREATE TRIGGER team_table_assignment_trigger
AFTER UPDATE OF table_id ON teams
FOR EACH ROW
EXECUTE FUNCTION update_table_game_state_on_team_assignment();
