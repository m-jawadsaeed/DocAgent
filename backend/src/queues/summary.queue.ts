import { Queue } from "bullmq";
import { bullmqConnection } from "../config/bullmq.js";
export interface SummaryJob {
  documentId: string;
}
export const summaryQueue = new Queue<SummaryJob>("document-summary", {
  connection: bullmqConnection,
});
