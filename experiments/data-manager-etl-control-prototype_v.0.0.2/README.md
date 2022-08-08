# data-manager-etl-control-prototype_v.0.0.2

Prototype for Aggregate ETL Controllers.

[AggregateNpmrdsUpdateTask](./src/controllers/AggregateNpmrdsUpdateTask.ts)
coordinates the execution of the following [ETL Tasks](./src/tasks):

- [availabs/avail-datasources-watcher/tasks/downloadedExportsIntoSqlite](https://github.com/availabs/avail-datasources-watcher/tree/main/tasks/downloadedExportsIntoSqlite)
- [availabs/NPMRDS_Database/src/npmrds/npmrds_travel_times](https://github.com/availabs/NPMRDS_Database/tree/master/src/npmrds/npmrds_travel_times)
- [availabs/NPMRDS_Database/src/npmrds/tmc_identification](https://github.com/availabs/NPMRDS_Database/tree/master/src/npmrds/tmc_identification)

## run it

This is a proof of concept.
Actually running the code requires the following dependencies:

- A running instance of the [NPMRDS_Database development database](https://github.com/availabs/NPMRDS_Database/tree/master/docker)
- An NPMRDS Export download named 'npmrdsx_vt_201601_v20220307T175956' in the
  local avail-datasources-watcher repository.

```sh
./run
```

Sample output:

```sh
$ ./run
run timestamp: 20220808T182650
makeStepGenerator
--------------------

STEP: 1

==> task npmrds_load_travel_times: awaiting npmrds_transform_export
==> task npmrds_load_tmc_identification: awaiting npmrds_transform_export
==> task npmrds_transform_export: all dependencies met. Proceeding with ETL.

loading TMC_Identification
loading TMC_Identification: 33.097ms
loading ALL_VEHICLES
        ALL_VEHICLES: 15.123s
loading PASSENGER_VEHICLES
        PASSENGER_VEHICLES: 14.411s
loading TRUCKS
        TRUCKS: 13.304s
--------------------

STEP: 2

==> task npmrds_load_tmc_identification: all dependencies met. Proceeding with ETL.

psql:./root/create_root_year_tmc_identification_table.sql:47: NOTICE:  relation "tmc_identification_2016" already ex
ists, skipping

==> task npmrds_load_travel_times: all dependencies met. Proceeding with task.

psql:./createRootNPMRDSDataTable.sql:12: NOTICE:  relation "npmrds" already exists, skipping
psql:./createStateNPMRDSDataTable.sql:75: NOTICE:  schema "vt" already exists, skipping
ALL UPDATES COMPLETED
```
