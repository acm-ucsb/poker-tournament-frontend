DECLARE
  total_count INTEGER := 0;
  table_record RECORD;
  held_money_array INTEGER[];
  chip_value INTEGER;
BEGIN
  -- Loop through all tables
  FOR table_record IN 
    SELECT game_state 
    FROM public.tables
    WHERE status = 'active'
  LOOP
    -- Extract the held_money array from the game_state JSON
    held_money_array := ARRAY(
      SELECT jsonb_array_elements_text(table_record.game_state->'held_money')::INTEGER
    );
    
    -- Count how many players have chips > 0 in this table
    FOREACH chip_value IN ARRAY held_money_array
    LOOP
      IF chip_value > 0 THEN
        total_count := total_count + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN total_count;
END;