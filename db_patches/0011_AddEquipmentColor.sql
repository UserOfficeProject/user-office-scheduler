DO
$DO$
BEGIN
  IF register_patch('AddEquipmentColor.sql', 'Martin Trajanovski', 'Add equipment color', '2021-12-20 13:00:00.000000+00') THEN
  BEGIN

    ALTER TABLE "equipments"
    ADD COLUMN IF NOT EXISTS "color" varchar(20) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS "backgroundColor" varchar(20) DEFAULT NULL;

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
