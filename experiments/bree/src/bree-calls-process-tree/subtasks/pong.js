process.on("message", (event) => {
  if (event.type === "PING") {
    setTimeout(
      () =>
        process.send({
          type: "PONG",
        }),
      1000
    );
  }
});
