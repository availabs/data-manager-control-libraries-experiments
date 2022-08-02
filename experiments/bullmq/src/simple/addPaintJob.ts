import { Queue } from "bullmq";

const queue = new Queue("Paint");

export default function addPaintJob(color: string) {
  queue.add("cars", { color });
}
