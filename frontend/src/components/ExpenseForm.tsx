import React, { useState } from 'react';

interface Props {
  onAdd: (data: FormData) => void;
}

const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('amount', amount);
    formData.append('category', category);
    if (file) formData.append('image', file);
    onAdd(formData);

    setTitle('');
    setAmount('');
    setCategory('');
    setFile(null);
  };

  const fields = [
    { label: 'Title', value: title, setter: setTitle, type: 'text' },
    { label: 'Amount (₹)', value: amount, setter: setAmount, type: 'number' },
    { label: 'Category', value: category, setter: setCategory, type: 'text' },
  ];

  return (
    <div className="max-w-lg mx-auto mt-12">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 rounded-3xl shadow-2xl border border-gray-200 space-y-6"
      >
        <h3 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
          Add New Expense
        </h3>

        {/* Floating Label Inputs */}
        {fields.map((field) => (
          <div key={field.label} className="relative">
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder=" "
              className="peer w-full p-4 pt-6 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition"
              required
            />
            <label
              className={`absolute left-4 text-gray-400 text-sm transition-all
                ${field.value
                  ? 'top-1 text-indigo-500 text-sm'
                  : 'top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm'
                }`}
            >
              {field.label}
            </label>
          </div>
        ))}

        {/* File Upload */}
        <div className="relative">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 transition bg-white shadow-sm hover:shadow-md"
          >
            <span className="text-gray-500">{file ? file.name : 'Upload Image (Optional)'}</span>
            <span className="text-indigo-500 font-semibold">Browse</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
