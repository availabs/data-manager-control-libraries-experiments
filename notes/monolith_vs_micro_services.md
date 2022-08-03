# Monolith vs MicroServices

## Monolith with a JobQueue

Similar to the Rail's [delayed_job queue](https://github.com/collectiveidea/delayed_job).

Properties:

- A monolith repository containing all tasks definitions.
- The JobQueue executes these high-level task definitions.
- The defintions are responsible for executing sub-tasks.
  - The JobQueue does not provide any functionality for
    decomposing tasks into subtasks and managing their execution.
- Tasks may possibly be legacy code written in other languages
  callable in some way from the monolith repository. It is up
  to the task definition to implement the calling mechanism.

The JobQueue is concerned ONLY with task automation.
Control flow automation is the responsibility of individual tasks,
which they perform without any assistance or governance from the JobQueue.
(See
[Task vs Control Flow Automation](https://www.google.com/books/edition/Practical_Process_Automation/Go4lEAAAQBAJ?hl=en&gbpv=1&dq=task+automation+vs+control+flow+automation&pg=PT12&printsec=frontcover).)

This design could be implemented using Clean Architecture Patterns where the
task definition's main function is oblivious to whether it is executed within a
command line script, HTTP server controller, or a JobQueue Worker.

## Orchestration & Microservices

### The Need for Orchestration

When the relationships between datasets are simple, control flow automation is
simple. The more complex the relationships become, the more complex control
flow automation becomes, and the more tedious, error-prone, and time-consuming
managing datasource update subtasks become.

The larger the DataSource dependency graphs and the more complex the logic
governing DataSource dependency relationships, the greater the need for a
system to assist with task orchestration (consistent patterns and provided
tooling) and governance (repeatablity, monitoring, consistency enforcement, etc).

If the orchestration solution is recursive in structure,
and does not have a hard dependency on external processes or servers,
task decomposition with centralized assistance and governance
can be arbitrarily deep. The same tooling used to observe and analyze
the highest level tasks would work for the lowest level tasks.

### Microservices and Gradual Integration

Existing independent ETL repositories remain independent and function as Services.
They can remain on separate machines (servers, laptops, etc) and work
together or independently. If we want to combine ETL repositories into
larger repositories, it is an optional and gradual process rather than
all or nothing endeavor.

Integrating existing codebases would require no modification to code bases,
only an simple extension. Adding a Service module that connects the existing
ETL code to the Microservices EventBroker and calls the existing code
should be sufficient to start.

Furthermore, services can
[register](https://moleculer.services/docs/0.14/registry.html#Dynamic-service-discovery)
with the Microservices system. Adding services would not require modifying
outside code or metadata. There would be no need to update a registry in a
central control service. Adding DataManager metadata to integrate the service
into the DataManager would remain optional.

## Combining both

The above architectures could co-exist.

Any Monolith could include a module that connects it to the Microservices
EventBroker, making the Monolith a Service. The microservices system could then
queue jobs on the Monolith. The Monolith, in turn, could use its Service Module to
connect the the JobsQueue to the EventBroker and start external services.

