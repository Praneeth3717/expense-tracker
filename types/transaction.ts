export interface Transaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
