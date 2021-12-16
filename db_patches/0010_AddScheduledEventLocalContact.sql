DO
$DO$
BEGIN
  IF register_patch('AddScheduledEventLocalContact.sql', 'Martin Trajanovski', 'Add local contact person to the scheduled event', '2021-12-07 10:00:00.000000+00') THEN
  BEGIN

    ALTER TABLE "scheduled_events"
    ADD COLUMN IF NOT EXISTS "local_contact" int DEFAULT NULL; -- comes from a different db?

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
