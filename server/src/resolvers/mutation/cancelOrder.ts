import database from '../../../lib/database';
import stripe from '../../../lib/stripe';
import Order, { OrderStatus } from '../../entity/Order';

const cancelOrderMutation = async (obj: never, args: {id: number}, context: never, info: never) => {
  const orderRepo = database.getRepository(Order);
  const order = await orderRepo.findOne({where: {id: args.id}});

  if (!order) {
    return 'We are unable to locate the order you are trying to cancel';
  }


  if ([OrderStatus.UNPAID, OrderStatus.COMPLETED].indexOf(order.status) !== -1) {
    let cancelMessage = 'Your order has been cancelled';
    let expireError;
    if (order.stripeCheckoutSessionId) {
      try {
        await stripe.checkout.sessions.expire(order.stripeCheckoutSessionId);
      } catch (e) {
        // The expire call can return an error if the checkout session is already complete
        // if that's the reason for the error, we don't want to throw it, as we handle that below.
        // To handle other errors, we save the error, and then throw it if the checkout session's status is "open" below
        expireError = e;
      }

      const checkoutSession = await stripe.checkout.sessions.retrieve(order.stripeCheckoutSessionId);
      if (checkoutSession.status === 'open' && expireError != undefined) {
        throw expireError;
      } else if (checkoutSession.status === 'complete') {
        // The payment was completed and we need to refund it
        await stripe.refunds.create({
          payment_intent: (typeof(checkoutSession.payment_intent) === 'string' ? checkoutSession.payment_intent : checkoutSession.payment_intent!.id),
          reason: 'requested_by_customer'
        });

        cancelMessage = 'Your order has been cancelled, and a refund has been issued back to your payment method.';
      }
    }
    order.status = OrderStatus.CANCELLED;
    await orderRepo.save(order);
    return cancelMessage;
  } else {
    return 'Your order has already been cancelled';
  }
}

export default cancelOrderMutation;