import L from '../../common/logger';
import {
  CartProduct,
  Offer,
  CartOutput,
  CartOutputFormatted,
} from '../../common/interfaces';
import { products } from '../../common/database';

function applyOffers(
  cart: Array<CartProduct>,
  grandTotal: number
): Promise<CartOutput> {
  L.info('apply offers to cart');

  // The following line would replace all the following 4 const if the target was set on es2019+
  // const quantities = Object.fromEntries(cart.map(({ name, quantity }) => [name, quantity]));
  const soups = cart.filter(({ name }) => name === 'Soup')[0]?.quantity;
  const breads = cart.filter(({ name }) => name === 'Bread')[0]?.quantity;
  const cheese = cart.filter(({ name }) => name === 'Cheese')[0]?.quantity;
  const milk = cart.filter(({ name }) => name === 'Milk')[0]?.quantity;
  let appliedOffers = false;

  if (soups && breads) {
    const offer: Offer = {
      name: 'Soup And Bread BOGOF',
      description:
        'Buy a loaf of bread and a can of soup and get another soup for free. Maximum 3 free soups per customer.',
    };
    const maxFreeSoups = 3;

    cart.some(({ name }, i) => {
      if (name === 'Soup') {
        cart[i].quantity += Math.min(soups, breads, maxFreeSoups);
        cart[i].totalPriceWithOffer = cart[i].totalPrice;

        cart[i].offers
          ? cart[i].offers.push(offer)
          : (cart[i].offers = [offer]);

        return true;
      }
    });

    appliedOffers = true;
  }

  if (soups && new Date().getDay() === 0) {
    const offer = {
      name: 'Sunday Soup Sale',
      description: 'Buy any can of soup on a Sunday and get 10% off.',
    };
    const soupDiscount = 0.9;

    cart.some(({ name }, i) => {
      if (name === 'Soup') {
        cart[i].totalPriceWithOffer = cart[i].totalPrice * soupDiscount;

        cart[i].offers
          ? cart[i].offers.push(offer)
          : (cart[i].offers = [offer]);

        return true;
      }
    });

    appliedOffers = true;
  } else if (cheese && milk) {
    const offer = {
      name: 'Dairy Delicious',
      description:
        "Buy a block of cheese and we'll let you buy as much milk as you like, at the price we pay! " +
        'Offer not valid when the customer is participating in the Sunday Soup Sale.',
    };
    const milkCost = products.filter(({ name }) => name === 'Milk')[0].cost;

    cart.some(({ name }, i) => {
      if (name === 'Milk') {
        cart[i].totalPriceWithOffer = cart[i].quantity * milkCost;

        cart[i].offers
          ? cart[i].offers.push(offer)
          : (cart[i].offers = [offer]);

        return true;
      }
    });

    appliedOffers = true;
  }

  const grandTotalWithOffers = cart.reduce(
    (acc, { totalPrice: a, totalPriceWithOffer: b }) => acc + (b || a),
    0
  );

  return Promise.resolve({
    cart,
    grandTotal,
    grandTotalWithOffers: appliedOffers ? grandTotalWithOffers : undefined,
  });
}

function formatOutput(
  cart: Array<CartProduct>,
  grandTotal: number,
  grandTotalWithOffers: number
): Promise<CartOutputFormatted> {
  L.info('format cart to reflect prices with legible format');

  const cartFormatted = cart.map(
    ({ individualPrice, totalPrice, totalPriceWithOffer, ...rest }) => ({
      ...rest,
      individualPrice: `$${individualPrice / 100}`,
      totalPrice: `$${totalPrice / 100}`,
      totalPriceWithOffer: totalPriceWithOffer
        ? `$${totalPriceWithOffer / 100}`
        : undefined,
    })
  );

  return Promise.resolve({
    cart: cartFormatted,
    grandTotal: `$${grandTotal / 100}`,
    grandTotalWithOffers: grandTotalWithOffers
      ? `$${grandTotalWithOffers / 100}`
      : undefined,
  });
}

export class ProductsService {
  cart(cart: Array<CartProduct>): Promise<CartOutputFormatted> {
    L.info(
      `calculate the prices for ${cart.length} products and their grand total`
    );

    let grandTotal = 0;

    const state = cart.every((cartProduct, i) => {
      products.some((product) => {
        if (product.name === cartProduct.name) {
          cart[i].individualPrice = product.customerPrice;
          cart[i].totalPrice = product.customerPrice * cartProduct.quantity;
          grandTotal += cart[i].totalPrice;

          return true;
        }
      });

      return cart[i].individualPrice;
    });

    if (!state) {
      return Promise.resolve(null);
    }

    return Promise.resolve(
      applyOffers(cart, grandTotal).then((r) =>
        formatOutput(r.cart, r.grandTotal, r.grandTotalWithOffers).then(
          (r) => r
        )
      )
    );
  }
}

export default new ProductsService();
