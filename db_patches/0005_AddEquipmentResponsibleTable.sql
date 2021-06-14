DO
$DO$
BEGIN
  IF register_patch('AddEquipmentResponsibleTable.sql', 'Martin Trajanovski', 'AddEquipmentResponsibleTable', '2021-06-02 13:30:00.000000+00') THEN
  BEGIN

    CREATE TABLE "equipment_responsible" (
        "equipment_responsible_id" SERIAL PRIMARY KEY
      , "equipment_id" int NOT NULL
      , "user_id" int NOT NULL
    );

    ALTER TABLE "equipment_responsible" ADD CONSTRAINT equipment_responsible_equipment_id_fkey 
      FOREIGN KEY ("equipment_id") 
      REFERENCES "equipments" ("equipment_id")
      ON DELETE CASCADE;

  END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
