DO
$DO$
BEGIN

INSERT INTO scheduled_events(
  booking_type, starts_at, ends_at, scheduled_by, description, proposal_booking_id, instrument_id)
  VALUES ('MAINTENANCE', '2020-9-21 12:00:00', '2020-9-21 14:00:00', 100, NULL, NULL, 1);

INSERT INTO scheduled_events(
  booking_type, starts_at, ends_at, scheduled_by, description, proposal_booking_id, instrument_id)
  VALUES ('MAINTENANCE', '2020-9-21 10:00:00', '2020-9-21 12:00:00', 101, NULL, NULL, 2);

END;
$DO$
LANGUAGE plpgsql;
