DO
$DO$
BEGIN

  INSERT INTO equipments
      (owner_id, name, maintenance_starts_at, maintenance_ends_at, auto_accept)
    VALUES 
      (1, 'Available equipment 1 - no auto accept', null, null, false),
      (1, 'Available equipment 2 - auto accept', null, null, true),
      (1, 'Under maintenance indefinitely 1 - not started yet', '2020-09-24 08:00:00', null, false),
      (1, 'Under maintenance indefinitely 2 - already started', '2020-09-20 08:00:00', null, false),
      (1, 'Under maintenance 1 - not started yet', '2020-09-19 08:00:00', '2020-09-20 08:00:00', false),
      (1, 'Under maintenance 2 - already started', '2020-09-19 08:00:00', '2020-09-30 08:00:00', false),
      (1, 'Under maintenance 3 - finished', '2020-09-19 08:00:00', '2020-09-20 08:00:00', false);

END;
$DO$
LANGUAGE plpgsql;
