# [Redis](https://redis.io/)

Redis is a dependency of many Task/Worker queues.

This repository provides a test Redis server using [Docker](https://hub.docker.com/_/redis).

See the scripts in [docker/](./docker).

## TODO

1. Make sure the Redis server is running in _["protected
   mode"](https://redis.io/docs/manual/security/#protected-mode)_. I believe
   that I followed the instructions on the
   [DockerHub](https://hub.docker.com/_/redis) page, but BullMQ was able to
   connect without credentials--which may be because it is using the loopback
   interface.
