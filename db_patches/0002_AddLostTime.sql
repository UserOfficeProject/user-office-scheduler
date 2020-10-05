DO
$DO$
BEGIN
  IF register_patch('AddLostTime.sql', 'Peter Asztalos', 'AddLostTime', '2020-09-30 11:00:00.000000+00') THEN
  BEGIN

    CREATE TABLE "lost_time" (
        "lost_time_id" SERIAL PRIMARY KEY
      , "proposal_booking_id" int NOT NULL
      , "created_at" TIMESTAMP NOT NULL DEFAULT (NOW())
      , "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
      , "total" int NOT NULL
    );

    ALTER TABLE "lost_time" ADD CONSTRAINT lost_time_proposal_booking_id_fkey 
      FOREIGN KEY ("proposal_booking_id") 
      REFERENCES "proposal_bookings" ("proposal_booking_id")
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
