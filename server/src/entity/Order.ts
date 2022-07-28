import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Customer from './Customer';
import OrderLineItem from './OrderLineItem';

export enum OrderStatus {
  UNPAID = 'unpaid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity({name: 'order'})
export default class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(x => Customer)
  customer!: Customer;

  @Column()
  customerId!: number;

  @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.UNPAID})
  status!: OrderStatus;

  @OneToMany(x => OrderLineItem, li => li.order)
  lineItems!: OrderLineItem[];

  @Column({type: 'int'})
  totalPrice!: number;

  @Column({type: 'varchar', length: 500, nullable: true})
  paymentUrl?: string;

  @Column({type: 'varchar', length: 255, collation: 'utf8_bin', nullable: true})
  stripeCheckoutSessionId?: string;

  public toGraphQLObject() {
    return {
      id: this.id,
      status: this.status.toUpperCase(),
      totalPrice: this.totalPrice,
      paymentUrl: this.paymentUrl
    }
  }
}