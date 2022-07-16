export interface Product {
  id: number;
  name: string;
  customerPrice: number;
  cost: number;
}

export interface CartProduct {
  name: string;
  quantity: number;
  individualPrice: number;
  totalPrice: number;
  totalPriceWithOffer?: number;
  offers?: Array<Offer>;
}

export interface CartProductFormatted {
  name: string;
  quantity: number;
  individualPrice: string;
  totalPrice: string;
  totalPriceWithOffer?: string;
  offers?: Array<Offer>;
}

export interface Offer {
  name: string;
  description: string;
}

export interface CartOutput {
  cart: Array<CartProduct>;
  grandTotal: number;
  grandTotalWithOffers?: number;
}

export interface CartOutputFormatted {
  cart: Array<CartProductFormatted>;
  grandTotal: string;
  grandTotalWithOffers?: string;
}
