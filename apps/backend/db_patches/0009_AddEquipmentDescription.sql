DO
$DO$
BEGIN
  IF register_patch('AddEquipmentDescription.sql', 'Martin Trajanovski', 'Add equipment description', '2021-09-24 13:00:00.000000+00') THEN
  BEGIN

    ALTER TABLE "equipments"
    ADD COLUMN IF NOT EXISTS "description" varchar(500) DEFAULT NULL;

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
