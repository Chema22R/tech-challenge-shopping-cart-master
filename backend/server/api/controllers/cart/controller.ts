import ProductsService from '../../services/cart.service';
import { Request, Response } from 'express';

export class Controller {
  cart(req: Request, res: Response): void {
    const cart = req.body;
    ProductsService.cart(cart).then((r) => {
      if (r) res.status(200).json(r);
      else res.status(404).end();
    });
  }
}
export default new Controller();
