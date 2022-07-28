import { ValidationError } from 'apollo-server';
import config from '../../../lib/config';
import database from '../../../lib/database';
import stripe from '../../../lib/stripe';
import Customer from '../../entity/Customer';
import Order from '../../entity/Order';
import OrderLineItem from '../../entity/OrderLineItem';
import Product from '../../entity/Product';

type PurchaseProductInput = {productId: number, customerName: string, customerEmail: string};
const purchaseProductMutation = async (obj: never, args: {input: PurchaseProductInput}, context: never, info: never) => {
  const productRepo = database.getRepository(Product);
  const customerRepo = database.getRepository(Customer);
  const product = await productRepo.findOne({where: {id: args.input.productId}});
  let customer = await customerRepo.findOne({where: {emailAddress: args.input.customerEmail}});

  if (product && product.stripeProductId) {
    if (!customer) {
      const stripeCustomer = await stripe.customers.create({
        name: args.input.customerName,
        email: args.input.customerEmail
      });
      customer = new Customer();
      customer.emailAddress = args.input.customerEmail;
      customer.fullName = args.input.customerName;
      customer.stripeCustomerId = stripeCustomer.id;
      await customerRepo.save(customer);
    }

    const order = new Order();
    order.customer = customer;
    order.totalPrice = product.price;

    const lineItem = new OrderLineItem();
    lineItem.product = product;
    lineItem.text = product.name;
    lineItem.price = product.price;

    await database.transaction(async trx => {
      await trx.save(order);

      lineItem.order = order;
      await trx.save(lineItem);

      const checkoutSession = await stripe.checkout.sessions.create({
        cancel_url: `${config.frontendUrl}/order/${order.id}/cancel`,
        success_url: `${config.frontendUrl}/order/${order.id}/success`,
        mode: 'payment',
        client_reference_id: order.id.toString(),
        customer: customer!.stripeCustomerId,
        line_items: [
          {
            price_data: {
              product: product.stripeProductId,
              unit_amount: product.price,
              currency: 'USD'
            },
            quantity: 1
          }
        ]
      });

      order.paymentUrl = checkoutSession.url!;
      order.stripeCheckoutSessionId = checkoutSession.id;
      await trx.save(order);
    });

    return order.toGraphQLObject();
  } else {
    throw new ValidationError('Product not found or not purchasable');
  }
}

export default purchaseProductMutation;