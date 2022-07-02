import { Queues } from '../enums';
import BaseQueue from './base.queue'
import { Vote } from '../entity/vote.entity';
import Mysql from '../mysql';
import RedisCli from '../redis'
import { socketIo } from '../server';

const redis = RedisCli.getInstance();

export default class VoteQueue extends BaseQueue {
  private static instance: VoteQueue;
  public static getInstance(): VoteQueue {
    if (!VoteQueue.instance) {
      VoteQueue.instance = new VoteQueue();
    }
    return VoteQueue.instance;
  }
  private constructor() {
    super(Queues.vote);
    this.queue.process((data) => this.process(data));
  }
  private async process({ data }) {
    console.log(data);
    const { partyNumber } = data;
    await this.saveVote(partyNumber);
  }
  private async saveVote(
    partyNumber: number,
  ) {
    console.log('Criando novo candidato')
    const vote = new Vote();

    vote.partyNumber = partyNumber;


    await Mysql.manager.save(vote);

    console.log(`Voto ${partyNumber} criado com sucesso.`);

    const votes = await Mysql.manager.countBy(Vote, { partyNumber });
    await redis.setJSON('votes', votes);
  }
  private async setVotes(partyNumber: number, votesQuantity: number) {
    let votes = await redis.getJSON('votes');
    if (votes === undefined) {
      votes = {};
    }
    if (!votes[partyNumber]) {
      votes[partyNumber] = 0;
    }
    votes[partyNumber] = votesQuantity;
    await redis.setJSON('votes', votes);


  }
}