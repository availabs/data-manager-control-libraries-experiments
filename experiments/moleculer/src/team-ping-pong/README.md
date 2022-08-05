# PING-PONG

Authenticated services communicate over encrypted NATS EventBus.

Multiple instances of services can enter and leave the game.
Games resume if at least 1 ping and 1 pong.
(Sometimes. Under some conditions, games hang.)

TODO: Read the documenation for a higher level ways of accomplishing this.

1. This experiment uses the [NATS experiment server](../../../nats/docker).
   Make sure the certificates are created and the server is running.

2. Start the ping-pong game:

As many times as you like...

```sh
./start ping
```

As many times as you like...

```sh
./start pong
```

- [Moleculer: Networking: NATS Transporter](https://moleculer.services/docs/0.14/networking.html#NATS-Transporter)
- [CA Certificate Authorization](https://stackoverflow.com/a/16311147/3970755)
