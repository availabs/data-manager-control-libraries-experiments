# Moleculer Simple Online Store Example

This example was implemented following the instructions found in
[Moleculer Core Concepts: Architecture](https://moleculer.services/docs/0.14/concepts.html#Architecture)

1. Install the depenencies:

```sh
npm install
```

2. Start the NATS server:

```sh
docker run -p 4222:4222 -ti nats:latest
```

3. Start the application:

```sh
node ./index.js
```

4. View the response: [http://localhost:3000/products](http://localhost:3000/products)
