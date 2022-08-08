import { join } from "path";

const etlReposRoot = join(__dirname, "../../../../../");

export default {
  "avail-datasources-watcher:downloadedExportsIntoSqlite": join(
    etlReposRoot,
    "avail-datasources-watcher/tasks/downloadedExportsIntoSqlite/src/createExportSqliteDb.ts"
  ),
};
