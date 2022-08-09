# data-manager-etl-control-prototype_v.0.0.2

Prototype for Aggregate ETL Controllers.

[AggregateNpmrdsUpdateTask](./src/controllers/AggregateNpmrdsUpdateTask.ts)
coordinates the execution of the following [ETL Tasks](./src/tasks):

- NpmrdsUpdateRequest
- MockNpmrdsRequestExport
- MockNpmrdsExportReady
- MockDownloadExport
- DownloadedNpmrdsExportIntoSqlite
- LoadNpmrdsTmcIdenfification
- LoadNpmrdsTravelTimes
- MockNpmrdsPrepublishQA
- MockNpmrdsPublishTmcIdentification
- MockNpmrdsPublishTravelTimes
- MockPythonTask

## run it

This is a proof of concept.
Actually running the code requires the following dependencies:

- A running instance of the [NPMRDS_Database development database](https://github.com/availabs/NPMRDS_Database/tree/master/docker)
- An NPMRDS Export download named 'npmrdsx_vt_201601_v20220307T175956' in the
  local avail-datasources-watcher repository.

```sh
./admin-server/start
```
