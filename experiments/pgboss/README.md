# pg-boss

> pg-boss is a job queue built in Node.js on top of PostgreSQL in order to
> provide background processing and reliable asynchronous execution to Node.js
> applications.
>
> pg-boss relies on SKIP LOCKED, a feature added to postgres specifically for
> message queues, in order to resolve record locking challenges inherent with
> relational databases. This brings the safety of guaranteed atomic commits of
> a relational database to your asynchronous job processing.
>
> This will likely cater the most to teams already familiar with the simplicity
> of relational database semantics and operations (SQL, querying, and backups).
> It will be especially useful to those already relying on PostgreSQL that want
> to limit how many systems are required to monitor and support in their
> architecture.

[timgit/pg-boss](https://github.com/timgit/pg-boss)

## Deployment

pg-boss requires a PostgreSQL server.

```sh
cd docker
./startDevDatabase
```

## Opinion 2022/08/02

I think this library has promise backing a single orchestrator node.

We could implement a [Redux](https://redux.js.org/)-like event-based system
where nodes dispatch events to the orchestrator via local instances of
pg-boss. Importantly, event-dispatch and database updates can happen withing
ATOMIC transactions if we use the same DB connection/transaction to stage work
in the database and dispatch events.

For further details on ATOMIC DB Updates and Event dispatch, see

- pg-boss [options.db](https://github.com/timgit/pg-boss/blob/master/docs/readme.md#newoptions)
- [Use database table as a message queue](https://youtu.be/YPbGW3Fnmbc?t=2607)

However, we would not want to send ALL events throught the system to the
orchestrator. I think it makes sense to limit global-level events to ONLY those events
concerning global data. For example, local work nodes that wish to use the event-based
model will need their own event network to manage subtasks. We would not want
the silly-level logging events of subtasks sent to the production database
and possibly broadcast throughout the entire network of workers/handlers.

Also, we need to find/implement the distributed and local event bus architecture
as well as the work allocation logic.

NOTE: We MUST handle:

- the case of multiple nodes running with handlers for a given event.
  - Versioning? Handlers of different versions and consistency for an Aggregate UPDATE.
    - If there is a set of VIEW updates (EG monthly calculations for a year)
      we MUST not use inconsistent handler versions.
  - dev laptops in dev environment **MUST NOT** accidentally be assigned events.
