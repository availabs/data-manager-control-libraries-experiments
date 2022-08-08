BEGIN;

CREATE TABLE IF NOT EXISTS metadata.data_sources (
  source_id     INTEGER PRIMARY KEY,
  --  source_name   TEXT NOT NULL,

  dependencies  TEXT NOT NULL,

  metadata      TEXT,

  CHECK (
    json_type( dependencies ) = 'array'
  ),

  CHECK (
    json_valid(
      COALESCE(
        metadata,
        '{}'
      )
    )
  )
) ;

/*
CREATE TABLE IF NOT EXISTS metadata.data_views (
  source_id     INTEGER NOT NULL,
  version_id    INTEGER NOT NULL,
  table_name    TEXT NOT NULL UNIQUE,
  dependencies  TEXT,

  metadata      TEXT,

  publish_ts    TEXT NOT NULL CHECK (publish_ts IS DATE(publish_ts)),
  unpublish_ts  TEXT CHECK (publish_ts IS DATE(publish_ts)),

  PRIMARY KEY (source_id, version_id),
  FOREIGN KEY (source_id) REFERENCES data_sources(source_id),

  CHECK (
    json_type(
      COALESCE(
        dependencies,
        '[]'
      )
    ) = 'array'
  ),

  CHECK (
    json_valid(
      COALESCE(
        metadata,
        '{}'
      )
    )
  )
) ;
*/

COMMIT;
