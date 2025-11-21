import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import type{ Expense } from '../types/api';

export const exportPDF = (expenses: Expense[]) => {
  const doc = new jsPDF();
  doc.text('Expense Report', 10, 10);
  let y = 20;
  expenses.forEach(e => {
    doc.text(`${e.title} | ${e.category} | $${e.amount}`, 10, y);
    y += 10;
  });
  doc.save('expenses.pdf');
};
