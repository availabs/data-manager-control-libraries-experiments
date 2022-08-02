process.on("message", (event) => {
  if (event.type == "PONG") {
    setTimeout(
      () =>
        process.send({
          type: "PING",
        }),
      1000
    );
  }
});
