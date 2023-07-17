DO
$DO$
BEGIN
  IF register_patch('ChangeStausNamesForUsageImprovement.sql', 'Martin Trajanovski', 'Rename closed event status to completed and booked to active for better usability', '2021-09-10 13:00:00.000000+00') THEN
  BEGIN

    UPDATE scheduled_events
    SET status = 'COMPLETED'
    WHERE status = 'CLOSED';
    UPDATE scheduled_events
    SET status = 'ACTIVE'
    WHERE status = 'BOOKED';

    UPDATE proposal_bookings
    SET status = 'COMPLETED'
    WHERE status = 'CLOSED';
    UPDATE proposal_bookings
    SET status = 'ACTIVE'
    WHERE status = 'BOOKED';

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
