import database from '../../lib/database';
import OrderLineItem from '../entity/OrderLineItem';
export default {
  lineItems: async (obj: {id: number}, args: never, context: never, info: never) => {
    const lineItemRepo = database.getRepository(OrderLineItem);
    return await lineItemRepo.find({where: {orderId: obj.id}});
  }
}