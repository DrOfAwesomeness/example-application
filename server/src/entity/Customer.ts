import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar', length: 255})
  @Index({unique: true})
  emailAddress!: string;

  @Column({type: 'text'})
  fullName!: string;

  @Column({type: 'varchar', length: 255, collation: 'utf8_bin'})
  stripeCustomerId!: string;
}