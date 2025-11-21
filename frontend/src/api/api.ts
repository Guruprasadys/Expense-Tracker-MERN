import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { SignupData, LoginData } from '../types/api';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Updated AuthResponse to include balance
export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  balance: number; // ← added balance
}

export const signup = (data: SignupData): Promise<AxiosResponse<AuthResponse>> =>
  API.post('/auth/signup', data, {
    headers: { 'Content-Type': 'application/json' },
  });

export const login = (data: LoginData): Promise<AxiosResponse<AuthResponse>> =>
  API.post('/auth/login', data, {
    headers: { 'Content-Type': 'application/json' },
  });

export const addExpense = (data: FormData, token: string) =>
  API.post('/expenses', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getExpenses = (token: string) =>
  API.get('/expenses', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addIncome = (payload: { title: string; amount: number; date?: string }, token: string) =>
  API.post('/income', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

export const getIncome = (token: string) =>
  API.get('/income', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Convenience: fetch balance only
export const getBalance = async (token: string) => {
  const res = await getIncome(token);
  return res.data.balance;
};

export default API;
