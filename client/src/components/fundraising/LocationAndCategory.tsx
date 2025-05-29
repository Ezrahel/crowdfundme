import React from 'react';
import { useFundraising } from '../../contexts/FundraisingContext';

const LocationAndCategory: React.FC = () => {
  const { data, updateData } = useFundraising();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          name="country"
          id="country"
          value={data.country}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
          Postcode
        </label>
        <input
          type="text"
          name="postcode"
          id="postcode"
          value={data.postcode}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          id="category"
          value={data.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select a category</option>
          <option value="medical">Medical</option>
          <option value="education">Education</option>
          <option value="emergency">Emergency</option>
          <option value="memorial">Memorial</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
};

export default LocationAndCategory; 