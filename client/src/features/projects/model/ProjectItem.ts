export interface ProjectItem {
  id: string;
  description: string;
  total: number;
  category: {
    id: string;
    description: string;
  };
  orders: {
    id: string;
    quantity: number;
    price: number;
    status: string;
    purchasedAt: Date | null;
    vendor: {
      id: string;
      name: string;
      paymentDay: number | null;
    };
  }[];
}
