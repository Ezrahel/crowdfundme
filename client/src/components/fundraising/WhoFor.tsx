import React from 'react';
import { useFundraising } from '../../contexts/FundraisingContext';

const WhoFor: React.FC = () => {
  const { data, updateData } = useFundraising();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    updateData({ whoFor: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="whoFor" className="block text-sm font-medium text-gray-700">
          Who are you fundraising for?
        </label>
        <select
          name="whoFor"
          id="whoFor"
          value={data.whoFor}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select an option</option>
          <option value="myself">Myself</option>
          <option value="someone_else">Someone Else</option>
          <option value="charity">Charity</option>
          <option value="business">Business</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
};

export default WhoFor; 