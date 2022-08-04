# NATS docker

USAGE:

1. Create the TLS certificates: [`./createCertificates`](./createCertificates)

2. Configure the server: [`./config/nats-server.conf`](./config/nats-server.conf)

3. Configure the Docker container: [`./nats.env`](./nats.env)

4. Start the NATS server: [`./start`](./start)

## References

- [dockerhub](https://hub.docker.com/_/nats)

- [Create Self-Signed Certificates and Keys with OpenSSL](https://mariadb.com/docs/security/data-in-transit-encryption/create-self-signed-certificates-keys-openssl/)
