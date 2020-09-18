DO
$DO$
BEGIN
  IF register_patch('Init.sql', 'unknown', 'Init', '2020-09-14 00:00:00.000000+00') THEN
  BEGIN

    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TABLE scheduled_events (
        scheduled_event_id serial PRIMARY KEY
      , created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      , updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      , booking_type varchar(30) NOT NULL
      , scheduled_from TIMESTAMP NOT NULL
      , ends_at TIMESTAMP NOT NULL
      , scheduled_by int NOT NULL -- comes from a different db?
      , description varchar(200) DEFAULT NULL
    );

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON scheduled_events
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
