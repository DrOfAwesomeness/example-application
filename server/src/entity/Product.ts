import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'product'})
export default class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar', length: 255})
  name!: string;

  @Column({type: 'text'})
  description!: string;

  @Column({type: 'varchar', collation: 'utf8_bin', length: 255, nullable: true})
  stripeProductId?: string;

  @Column({type: 'int'})
  price!: number;

  @Column({type: 'int'})
  sortIndex!: number;
}