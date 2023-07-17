DO
$DO$
BEGIN
  IF register_patch('AddEquipmentInstrumentsTable.sql', 'Martin Trajanovski', 'Connection between equipment and instruments that this equipment can be assigned to', '2022-01-31 10:30:00.000000+00') THEN
  BEGIN

    CREATE TABLE "equipment_instruments" (
      "equipment_id" int NOT NULL
      , "instrument_id" int NOT NULL
      , PRIMARY KEY("equipment_id", "instrument_id")
    );

    ALTER TABLE "equipment_instruments" ADD CONSTRAINT equipment_instruments_equipment_id_fkey
      FOREIGN KEY ("equipment_id") 
      REFERENCES "equipments" ("equipment_id")
      ON DELETE CASCADE;

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
