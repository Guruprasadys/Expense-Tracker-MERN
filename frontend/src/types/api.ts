export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date?: string;       // optional
  imageUrl?: string;   // optional
}


// src/types/api.ts
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
export interface Income {
  _id: string;
  title: string;
  amount: number;
  date: string;
  user: string;
}