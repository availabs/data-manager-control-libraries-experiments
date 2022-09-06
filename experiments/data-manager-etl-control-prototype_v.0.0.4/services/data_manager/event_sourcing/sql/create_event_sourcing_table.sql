CREATE SCHEMA IF NOT EXISTS _data_manager_admin ;

CREATE TABLE IF NOT EXISTS _data_manager_admin.event_store_prototype (
  event_id    SERIAL PRIMARY KEY,
  type        TEXT NOT NULL,
  payload     JSONB,
  meta        JSONB,
  error       JSONB
) ;
