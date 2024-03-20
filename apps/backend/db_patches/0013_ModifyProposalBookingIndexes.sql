DO
$DO$
BEGIN
  IF register_patch('0013_ModifyProposalBookingIndexes.sql', 'Martin Trajanovski', 'ModifyProposalBookingIndexes', '2024-02-16 14:00:00.000000+00') THEN
  BEGIN

    DROP INDEX proposal_bookings_proposal_id_call_id_idx;
    DROP INDEX proposal_bookings_instrument_id_idx;

    CREATE UNIQUE INDEX ON "proposal_bookings" ("proposal_pk", "call_id", "instrument_id");

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
