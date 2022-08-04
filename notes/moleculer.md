# [Moleculer](https://moleculer.services/)

> Moleculer is a fast, modern and powerful microservices framework for Node.js.
> It helps you to build efficient, reliable & scalable services. Moleculer
> provides many features for building and managing your microservices.
>
> Features
>
> - Promise-based solution (async/await compatible)
> - request-reply concept
> - support event driven architecture with balancing
> - built-in service registry & dynamic service discovery
> - load balanced requests & events (round-robin, random, cpu-usage, latency, sharding)
> - many fault tolerance features (Circuit Breaker, Bulkhead, Retry, Timeout, Fallback)
> - plugin/middleware system
> - support versioned services
> - support Streams
> - service mixins
> - built-in caching solution (Memory, MemoryLRU, Redis)
> - pluggable loggers (Console, File, Pino, Bunyan, Winston, Debug, Datadog, Log4js)
> - pluggable transporters (TCP, NATS, MQTT, Redis, NATS Streaming, Kafka, AMQP 0.9, AMQP 1.0)
> - pluggable serializers (JSON, Avro, MsgPack, Protocol Buffer, Thrift)
> - pluggable parameter validator
> - multiple services on a node/server
> - master-less architecture, all nodes are equal
> - parameter validation with fastest-validator
> - built-in metrics feature with reporters (Console, CSV, Datadog, Event, Prometheus, StatsD)
> - built-in tracing feature with exporters (Console, Datadog, Event, Jaeger, Zipkin)
> - official API gateway, Database access and many other modules…

## [Broker](https://moleculer.services/docs/0.14/broker.html)

## [moleculer-cli](https://moleculer.services/docs/0.14/moleculer-cli.html)

[Custom templates](https://moleculer.services/docs/0.14/moleculer-cli.html#Custom-templates)

> **Custom templates**
>
> ```sh
> $ moleculer init username/repo my-project
> ```
>
> Where username/repo is the GitHub repo shorthand for your fork.
>
> The shorthand repo notation is passed to download-git-repo so it can be
> bitbucket:username/repo for a Bitbucket repo and username/repo#branch for
> tags or branches.
>
> Local Templates
> Instead of a GitHub repo, use a template from local filesystem:
>
> ```sh
> $ moleculer init ./path/to-custom-template my-project`
> ```

### Test Run

Followed the instructions on
[Create a Moleculer project](https://moleculer.services/docs/0.14/usage.html#Create-a-Moleculer-project).

NOTE: Selected all defaults in the below menu.

```sh
../../node_modules/.bin/moleculer init project moleculer-cli-output
Template repo: moleculerjs/moleculer-template-project
Downloading template...
? Add API Gateway (moleculer-web) service? Yes
? Would you like to communicate with other nodes? Yes
? Select a transporter NATS (recommended)
? Would you like to use cache? No
? Add DB sample service? Yes
? Would you like to enable metrics? Yes
? Would you like to enable tracing? Yes
? Add Docker & Kubernetes sample files? Yes
? Use ESLint to lint your code? Yes
Create 'moleculer-cli-output' folder...
? Would you like to run 'npm install'? Yes

Running 'npm install'...
```

```sh
cd moleculer-cli-output
npm run dev
```

Very simple.

## References

- [moleculerjs/awesome-moleculer](https://github.com/moleculerjs/awesome-moleculer)
