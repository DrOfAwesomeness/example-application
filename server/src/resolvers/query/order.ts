import database from '../../../lib/database';
import stripe from '../../../lib/stripe';
import Order, { OrderStatus } from '../../entity/Order';

const productsResolver = async (obj: never, args: { id: number }, ctx: never, info: never) => {
  const orderRepo = database.getRepository(Order);
  const order = await orderRepo.findOne({where: {id: args.id}});
  if (!order) {
    return null;
  }

  if (order.status === OrderStatus.UNPAID && order.stripeCheckoutSessionId) {
    const checkoutSession = await stripe.checkout.sessions.retrieve(order.stripeCheckoutSessionId);

    if (checkoutSession.status === 'complete') {
      order.status = OrderStatus.COMPLETED;
    } else if (checkoutSession.status === 'expired') {
      order.status = OrderStatus.CANCELLED;
    }

    await orderRepo.save(order);
  }

  return order.toGraphQLObject();
}

export default productsResolver;