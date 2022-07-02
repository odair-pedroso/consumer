import { PrimaryColumn, Column, Entity } from "typeorm";

@Entity()
export class Candidate {

  @PrimaryColumn()
  partyNumber: number;

  @Column()
  name: string;

  @Column()
  photo: string

}