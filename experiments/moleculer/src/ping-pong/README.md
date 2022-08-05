# PING-PONG

Authenticated services communicate over encrypted NATS EventBus.

1. This experiment uses the [NATS experiment server](../../../nats/docker).
   Make sure the certificates are created and the server is running.

2. Start the ping-pong game:

```sh
./start
```

- [Moleculer: Networking: NATS Transporter](https://moleculer.services/docs/0.14/networking.html#NATS-Transporter)
- [CA Certificate Authorization](https://stackoverflow.com/a/16311147/3970755)
