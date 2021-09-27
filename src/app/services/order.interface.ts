export interface IOrder {
  items: {
    id: string;
    amount: number;
    price: number;
    name: string;
  }[];
  details: {
    name: string;
    address: string;
    phone: string;
    timeToDeliver: string;
    comment: string;
    totalPrice: number;
  };
}
