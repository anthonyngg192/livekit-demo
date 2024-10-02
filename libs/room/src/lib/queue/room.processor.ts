import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('room')
export class RoomProcessor extends WorkerHost {
  async process(job: Job<any, any, string>) {
    console.log(job.data);
  }
}
