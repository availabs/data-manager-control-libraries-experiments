#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";

import { createDbConnection } from "../../database";

const sqlFile = join(__dirname, "./sql/create_metadata_tables.sql");
const initSQL = readFileSync(sqlFile, { encoding: "utf8" });

export default function createMetadataTables(db = createDbConnection()) {
  db.exec(initSQL);
}
