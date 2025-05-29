import React from 'react';
import { useFundraising } from '../../contexts/FundraisingContext';

const Goal: React.FC = () => {
  const { data, updateData } = useFundraising();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'goal') {
      updateData({ [name]: parseFloat(value) || 0 });
    } else {
      updateData({ [name]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
          Fundraising Goal
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="goal"
            id="goal"
            value={data.goal}
            onChange={handleChange}
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
          Currency
        </label>
        <select
          name="currency"
          id="currency"
          value={data.currency}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="CAD">CAD (C$)</option>
          <option value="AUD">AUD (A$)</option>
        </select>
      </div>
    </div>
  );
};

export default Goal; 