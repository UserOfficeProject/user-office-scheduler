DO
$DO$
BEGIN

  INSERT INTO proposal_bookings(
    proposal_booking_id, proposal_id, call_id, created_at, updated_at, status, allocated_time, instrument_id) 
    VALUES (
      1, 1, 1, now(), NOW(), 'DRAFT', 2*24*60*60, 1
    );

END;
$DO$
LANGUAGE plpgsql;

