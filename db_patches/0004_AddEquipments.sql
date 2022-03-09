DO
$DO$
BEGIN
  IF register_patch('AddEquipments.sql', 'Peter Asztalos', 'AddEquipments', '2020-12-07 12:00:00.000000+00') THEN
    BEGIN

      CREATE TABLE "equipments" (
          "equipment_id" SERIAL PRIMARY KEY
        , "owner_id" int NOT NULL
        , "created_at" TIMESTAMPTZ NOT NULL DEFAULT (NOW())
        , "updated_at" TIMESTAMPTZ NOT NULL DEFAULT (NOW())
        , "name" varchar(100) NOT NULL
        , "maintenance_starts_at" TIMESTAMP DEFAULT NULL
        , "maintenance_ends_at" TIMESTAMP DEFAULT NULL
        , "auto_accept" boolean NOT NULL
      );

      CREATE INDEX ON "equipments" ("owner_id");
      CREATE INDEX ON "equipments" ("maintenance_starts_at");
      CREATE INDEX ON "equipments" ("maintenance_ends_at");

      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON "equipments"
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();

      CREATE TABLE "scheduled_events_equipments" (
          "scheduled_event_id" int NOT NULL
        , "equipment_id" int NOT NULL
        , "status" varchar(50) NOT NULL
        , PRIMARY KEY("scheduled_event_id", "equipment_id")
      );

    ALTER TABLE "scheduled_events_equipments" ADD CONSTRAINT scheduled_events_equipments_scheduled_event_id_fkey 
      FOREIGN KEY ("scheduled_event_id") 
      REFERENCES "scheduled_events" ("scheduled_event_id")
      ON DELETE CASCADE;

    ALTER TABLE "scheduled_events_equipments" ADD CONSTRAINT scheduled_events_equipments_equipment_id_fkey 
      FOREIGN KEY ("equipment_id") 
      REFERENCES "equipments" ("equipment_id")
      ON DELETE CASCADE;

    END;
  END IF;
END;
$DO$
LANGUAGE plpgsql;
