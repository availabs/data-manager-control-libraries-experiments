# Bree Experiments

> Bree was created to give you fine-grained control with simplicity, and has
> built-in support for workers, sandboxed processes, graceful reloading, cron
> jobs, dates, human-friendly time representations, and much more.
>
> We recommend you to query a persistent database in your jobs, to prevent
> specific operations from running more than once.
>
> Bree does not force you to use an additional database layer of Redis or
> MongoDB to manage job state.
>
> In doing so, you should manage boolean job states yourself using queries. For
> instance, if you have to send a welcome email to users, only send a welcome
> email to users that do not have a Date value set yet for
> welcome_email_sent_at.

- [Bree](https://jobscheduler.net/)

- [breejs/bree](https://github.com/breejs/bree)
