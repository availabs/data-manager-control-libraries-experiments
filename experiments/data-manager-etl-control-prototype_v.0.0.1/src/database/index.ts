import { mkdirSync } from "fs";
import { join } from "path";

import DB, { Database } from "better-sqlite3";
import dedent from "dedent";

export type SQLiteDatabaseConnection = Database;

const defaultDbDir = join(__dirname, "../../data");

mkdirSync(defaultDbDir, { recursive: true });

enum DatabaseSchemas {
  root = "root",
  metadata = "metadata",
  staging = "staging",
  archive = "archive",
}

function getSchemaFilePath(
  schema: DatabaseSchemas,
  etlId = null,
  dir = defaultDbDir
) {
  const fileName =
    etlId === null ? `${schema}.sqlite3` : `${schema}_${etlId}.sqlite3`;

  const filePath = join(`${dir}`, fileName);

  return filePath;
}

const getRootSchemaFilePath = getSchemaFilePath.bind(
  null,
  DatabaseSchemas.root,
  null
);
const getMetadataSchemaFilePath = getSchemaFilePath.bind(
  null,
  DatabaseSchemas.metadata,
  null
);
const getStagingSchemaFilePath = getSchemaFilePath.bind(
  null,
  DatabaseSchemas.staging
);
const getArchiveSchemaFilePath = getSchemaFilePath.bind(
  null,
  DatabaseSchemas.archive
);

export function createDbConnection(dir = defaultDbDir) {
  const rootSchemaPath = getRootSchemaFilePath(dir);
  const metadataSchemaPath = getMetadataSchemaFilePath(dir);

  const db = new DB(rootSchemaPath);

  db.exec(`ATTACH DATABASE '${metadataSchemaPath}' AS metadata;`);

  db.pragma("foreign_keys = ON;");
  db.pragma("journal_mode = WAL");

  return db;
}

export function createEtlDbConnection(etlId: number, dir = defaultDbDir) {
  const stagingSchemaFilePath = getStagingSchemaFilePath(etlId, dir);

  const rootSchemaPath = getRootSchemaFilePath(dir);
  const metadataSchemaPath = getMetadataSchemaFilePath(dir);

  const archivingSchemaFilePath = getArchiveSchemaFilePath(etlId, dir);

  // staging tables will have precedence over root tables
  //   so all
  const db = new DB(stagingSchemaFilePath);

  // TODO:  Figure out how to make public schema ReadOnly.
  //        See:
  //              * https://sqlite.org/forum/info/0a422313857f7b1f
  //              * https://www.sqlite.org/uri.html
  //              * https://github.com/WiseLibs/better-sqlite3/blob/0c42307437140dbe5217a097739e418a7bd88f01/docs/compilation.md
  //                > SQLITE_USE_URI=0
  //
  db.exec(`ATTACH DATABASE '${rootSchemaPath}' AS public;`);
  db.exec(`ATTACH DATABASE '${metadataSchemaPath}' AS metadata;`);
  db.exec(`ATTACH DATABASE '${archivingSchemaFilePath}' AS archive;`);

  db.pragma("foreign_keys = ON;");
  db.pragma("journal_mode = WAL");

  return db;
}

export function isStagingConnection(db: SQLiteDatabaseConnection) {
  return db
    .prepare(
      dedent(`
        SELECT EXISTS (
          SELECT
              1
            FROM pragma_database_list
            WHERE name = 'public'
        )
      `)
    )
    .pluck()
    .get();
}
