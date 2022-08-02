# Ping-Pong Fail

pg-boss apparently does not broadcast events.

This means that either

- We can make sure events arrive at nodes with the appropriate handlers.
  I was unable to implement this, but it may be possible using this library
  using either queue names or the subscribe/publish functionality.
- There must be an orchestrator node that then broadcasts events and
  accepts offers to handle events.

Also, if we wanted to use an event-based approach to manage local sub-tasks, we
would need to send all events from the lowest level workers to PostgreSQL
server. This seems undesirable for two reasons: 1) during production workflows,
we would potentially pollute the central event store with possibly debug-level events
and 2) running simple tests would require a running server.
