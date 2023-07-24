DO
$DO$
BEGIN
  IF register_patch('AddStatusToScheduledEvents.sql', 'Martin Trajanovski', 'AddStatusToScheduledEvents', '2021-08-24 11:00:00.000000+00') THEN
  BEGIN

    ALTER TABLE scheduled_events ADD status varchar(30) NOT NULL DEFAULT 'DRAFT';

    UPDATE scheduled_events
    SET status=proposal_bookings.status
    FROM proposal_bookings
    WHERE scheduled_events.proposal_booking_id = proposal_bookings.proposal_booking_id;

    DROP TABLE IF EXISTS lost_time;
    CREATE TABLE "lost_time" (
        "lost_time_id" SERIAL PRIMARY KEY
      , "proposal_booking_id" int NOT NULL
      , "scheduled_event_id" int NOT NULL
      , "created_at" TIMESTAMPTZ NOT NULL DEFAULT (NOW())
      , "updated_at" TIMESTAMPTZ NOT NULL DEFAULT (NOW())
      , "starts_at" TIMESTAMP NOT NULL
      , "ends_at" TIMESTAMP NOT NULL
    );

    ALTER TABLE "lost_time" ADD CONSTRAINT lost_time_proposal_booking_id_fkey 
      FOREIGN KEY ("proposal_booking_id") 
      REFERENCES "proposal_bookings" ("proposal_booking_id")
      ON DELETE CASCADE;
    ALTER TABLE "lost_time" ADD CONSTRAINT lost_time_scheduled_event_id_fkey 
      FOREIGN KEY ("scheduled_event_id") 
      REFERENCES "scheduled_events" ("scheduled_event_id")
      ON DELETE CASCADE;

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "lost_time"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
