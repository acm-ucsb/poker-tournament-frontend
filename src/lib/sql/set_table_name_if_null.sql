
DECLARE
  max_n integer;
  next_n integer;
  lock_key bigint := 987654321; -- arbitrary advisory lock key
BEGIN
  IF TG_OP <> 'INSERT' THEN
    RETURN NEW;
  END IF;

  IF NEW.name IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- serialize across transactions to avoid duplicate names
  PERFORM pg_advisory_xact_lock(lock_key);

  -- find max numeric suffix in names like 'Table 123'
  SELECT MAX((regexp_replace(name, '^.*Table\s+([0-9]+)$', '\1'))::int)
    INTO max_n
    FROM public.tables
    WHERE name ~ '^Table\s+[0-9]+$';

  IF max_n IS NULL THEN
    next_n := 1;
  ELSE
    next_n := max_n + 1;
  END IF;

  NEW.name := format('Table %s', next_n);

  RETURN NEW;
END;
