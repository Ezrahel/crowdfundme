import React from 'react';
import { useFundraising } from '../../contexts/FundraisingContext';

const AccountDetails: React.FC = () => {
  const { data, updateData } = useFundraising();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700">
          Account Holder Name
        </label>
        <input
          type="text"
          name="accountHolder"
          id="accountHolder"
          value={data.accountHolder}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
          Bank Name
        </label>
        <input
          type="text"
          name="bankName"
          id="bankName"
          value={data.bankName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
          Account Number
        </label>
        <input
          type="text"
          name="accountNumber"
          id="accountNumber"
          value={data.accountNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <select
          name="accountType"
          id="accountType"
          value={data.accountType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select account type</option>
          <option value="checking">Checking Account</option>
          <option value="savings">Savings Account</option>
          <option value="business">Business Account</option>
        </select>
      </div>
    </div>
  );
};

export default AccountDetails; 