# Flexible ETL Launcher

Launch ETL processes from command line atomically, or from a server JobQueue.

## API Usage

```sh
$ rm data/foo
$ curl 'http://localhost:3000/transformations/add?f=foo&n=2'
$ cat data/foo
2
$ curl 'http://localhost:3000/transformations/multiply?f=foo&n=3'
$ cat data/foo
6
$ curl 'http://localhost:3000/transformations/multiply?f=foo&n=bar'
{"name":"Error","message":"Invalid multiplier: bar","code":500}
$ cat data/foo
6
```

## CLI Usage

```sh
./run --help
```

```sh
$ mkdir -p data/
$ rm data/foo
$ ./run add -f data/foo -n 1
$ cat data/foo
1
$ ./run multiply -f data/foo -n 3
$ cat data/foo
3
$ ./run add -f data/foo -n 2
$ cat data/foo
5
$ ./run multiply -f data/foo -n 2
$ cat data/foo
10
```
