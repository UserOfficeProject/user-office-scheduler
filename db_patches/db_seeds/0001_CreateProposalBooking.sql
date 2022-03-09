DO
$DO$
BEGIN

  INSERT INTO proposal_bookings(
    proposal_booking_id, proposal_pk, call_id, created_at, updated_at, status, allocated_time, instrument_id) 
    VALUES (
      1, 1, 1, now(), NOW(), 'DRAFT', 2*24*60*60, 1
    );

  -- add propopsal_booking that references a not existing proposal
  INSERT INTO proposal_bookings(
    proposal_booking_id, proposal_pk, call_id, created_at, updated_at, status, allocated_time, instrument_id) 
    VALUES (
      2, 999, 1, now(), NOW(), 'DRAFT', 2*24*60*60, 3
    );

END;
$DO$
LANGUAGE plpgsql;
