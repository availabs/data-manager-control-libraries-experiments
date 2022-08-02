import { QueueEvents } from "bullmq";

let listening = false;

export default function listenForQueueEvents() {
  if (listening) {
    return;
  }

  const queueEvents = new QueueEvents("Paint");

  queueEvents.on("completed", ({ jobId }) => {
    console.log("done painting; jobId:", jobId);
  });

  queueEvents.on(
    "failed",
    ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
      console.error("error painting; jobId:", jobId);
      console.error(failedReason);
    }
  );

  listening = true;
}
