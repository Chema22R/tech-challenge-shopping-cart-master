import L from '../../common/logger';
import { Product } from '../../common/interfaces';
import { increaseId, products } from '../../common/database';

export class ProductsService {
  all(): Promise<Product[]> {
    L.info(products, 'fetch all products');
    return Promise.resolve(products);
  }

  byId(id: number): Promise<Product> {
    L.info(`fetch product with id ${id}`);
    return this.all().then((r) => r[id - 1]);
  }

  create(name: string, customerPrice: number, cost: number): Promise<Product> {
    L.info(`create product with name ${name}`);
    const product: Product = {
      id: increaseId(),
      name,
      customerPrice,
      cost,
    };
    products.push(product);
    return Promise.resolve(product);
  }
}

export default new ProductsService();
