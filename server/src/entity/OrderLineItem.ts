import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Order from './Order';
import Product from './Product';

@Entity({name: 'order_line_item'})
export default class OrderLineItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(x => Order, o => o.lineItems)
  order!: Order;

  @Column()
  orderId!: number;

  @ManyToOne(x => Product, {nullable: true})
  product?: Product;

  @Column({nullable: true})
  productId?: number;

  @Column({type: 'varchar', length: 255})
  text!: string;

  @Column({type: 'int'})
  price!: number;
}