export interface IOrder {
  items: {
    id: string;
    amount: number;
  }[];
  details: {
    name: string;
    address: string;
    phone: string;
    timeToDeliver: string;
    comment: string;
  };
}
