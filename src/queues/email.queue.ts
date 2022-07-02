import { Queues } from '../enums';
import BaseQueue from './base.queue'
import Transport from '../email';
import configs from '../configs';
import * as Bull from 'bull';

export default class EmailQueue extends BaseQueue {
  private static instance: EmailQueue;
  public static getInstance(): EmailQueue {
    if (!EmailQueue.instance) {
      EmailQueue.instance = new EmailQueue();
    }
    return EmailQueue.instance;
  }
  private constructor() {
    super(Queues.email);
    this.queue.process(this.process);
  }
  private async process(job: Bull.Job) {
    console.log(job.data);
    //await job.progress(40)
    setTimeout(async () => {
      await Transport.sendMail({
        to: configs.mail.default.to,
        from: configs.mail.default.from,
        subject: 'Você ganhou R$ 100.000,00 no pix , confia!',
        text: JSON.stringify(job.data),
      })
      console.log('E-mail enviado com sucesso :)');
      //await job.progress(100);
    }, 10000);

  }
}