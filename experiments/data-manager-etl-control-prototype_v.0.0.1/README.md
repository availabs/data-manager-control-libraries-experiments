# data-manager-etl-control-prototype_v.0.0.1

## run it

```sh
$ ./run
```

Sample output:

```sh
--------------------

STEP: 1

==> task 53 is still awaiting 2,8,9,11,12,15,16,17,18,21,27,28,32,33,34,38,39,41
==> task 72 is still awaiting 2,3,6,7,8,10,11,12,13,15,16,20,21,22,23,24,29,30,32,33,39,40,41,43,44,49,51,54,59,60
==> task 83 is still awaiting 2,5,7,11,12,13,14,15,16,18,19,20,22,23,24,25,26,29,31,34,35,38,39,40,42,46,48,51,53,54,57,59,62,63,64,67,72,73
==> task 41 is still awaiting 2,4,6,7,8,9,14,17,18,20,22,23,24,25,26,29,30,32,33
==> task 47 is still awaiting 1,5,12,13,16,17,18,19,21,22,24,25,26,27,30,31,35,36,37,38,39,44,45,46
==> task 65 is still awaiting 1,2,6,8,9,10,11,12,14,15,16,17,20,24,25,26,32,33,35,36,40,41,44,45,47,48,49,52,53,55,56,57,59
==> task 45 is still awaiting 1,3,6,7,8,10,11,14,15,16,19,23,26,27,28,30,31,33

.
.
.


--------------------

STEP: 9

==> task 117 done
==> task 125 done
==> task 113 done
==> task 119 done
==> task 118 done
==> task 111 done
==> task 123 done
==> task 126 done
==> task 124 done
==> task 110 done
==> task 114 done
==> task 116 done
==> task 109 done
==> task 121 done
==> task 120 done
==> task 122 done
==> task 115 done
ALL UPDATES COMPLETED
```

## How it works

- DataSource dependencies are declared in the `metadata.data_sources` table

```sql
metadata.sqlite3> select * from data_sources limit 25;
+-----------+------------------------------------------+
| source_id | dependencies                             |
+-----------+------------------------------------------+
| 1         | []                                       |
| 2         | []                                       |
| 3         | []                                       |
| 4         | []                                       |
| 5         | []                                       |
| 6         | []                                       |
| 7         | []                                       |
| 8         | []                                       |
| 9         | []                                       |
| 10        | []                                       |
| 11        | [1,6]                                    |
| 12        | [1,2,5,9]                                |
| 13        | [1,4,5,7,9]                              |
| 14        | [2,3,4,5,6,7,9,10]                       |
| 15        | [3,4,8]                                  |
| 16        | [2,6,8,9,10]                             |
| 17        | [4,5,7]                                  |
| 18        | [1,4,6,7]                                |
| 19        | [2,3,4,5,7,8,10]                         |
| 20        | [2,3,4,5,6]                              |
| 21        | [1,2,3,6,7,8,9]                          |
| 22        | [1,2,3,4,5,7,8,11,13,14,18,19,20]        |
| 23        | [1,2,5,6,8,9,10,11,13,14,16,17]          |
| 24        | [3,4,5,7,8,9,11,12,13,14,15,18,19,20,21] |
| 25        | [2,3,8,10,11,12,13,15,16,17,20]          |
+-----------+------------------------------------------+
25 rows in set
Time: 0.007s
```

- [ETL Controller](https://github.com/availabs/data-manager-control-libraries-experiments/blob/6ff279289c4de8303ba76d075ced632c5d8c428e/experiments/data-manager-etl-control-prototype_v.0.0.1/src/updating/SuperStepEtlController/index.ts#L87-L105) coordinates [ETL Tasks](https://github.com/availabs/data-manager-control-libraries-experiments/blob/05cfe4403ed4cad72aa836bd3bd3237797d3a5fd/experiments/data-manager-etl-control-prototype_v.0.0.1/src/updating/SuperStepUpdateTask/index.ts#L34-L62)
