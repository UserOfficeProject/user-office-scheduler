DO
$DO$
BEGIN
  IF register_patch('AddProposalBooking.sql', 'Peter Asztalos', 'AddProposalBooking', '2020-09-30 11:00:00.000000+00') THEN
  BEGIN

    CREATE TABLE "proposal_bookings" (
        "proposal_booking_id" SERIAL PRIMARY KEY
      , "proposal_id" int NOT NULL
      , "call_id" int NOT NULL
      , "created_at" TIMESTAMP NOT NULL DEFAULT (NOW())
      , "updated_at" TIMESTAMP NOT NULL DEFAULT (NOW())
      , "status" varchar(30) NOT NULL
      , "allocated_time" int NOT NULL
      , "instrument_id" int NOT NULL
    );

    CREATE UNIQUE INDEX ON "proposal_bookings" ("proposal_id", "call_id");

    CREATE INDEX ON "proposal_bookings" ("instrument_id");

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "proposal_bookings"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
