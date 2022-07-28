import database from '../../../lib/database';
import Product from '../../entity/Product';

const productsResolver = async (obj: never, ctx: never, args: never, info: never) => {
  const productsRepo = database.getRepository(Product);
  const products = await productsRepo.find({
    order: {
      sortIndex: 'ASC'
    }
  });
  return products;
}

export default productsResolver;