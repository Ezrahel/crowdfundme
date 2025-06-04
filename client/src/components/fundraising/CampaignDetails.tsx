import React from 'react';
import { useFundraising } from '../../contexts/FundraisingContext';

interface CampaignDetailsData {
  title: string;
  description: string;
  story: string;
  duration: number;
  coverImage: string;
}

interface CampaignDetailsProps {
  value: CampaignDetailsData;
  onChange: (value: CampaignDetailsData) => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof CampaignDetailsData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onChange({
      ...value,
      [field]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Campaign Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={value.title}
          onChange={handleChange('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Short Description
        </label>
        <input
          type="text"
          name="description"
          id="description"
          value={value.description}
          onChange={handleChange('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="story" className="block text-sm font-medium text-gray-700">
          Your Story
        </label>
        <textarea
          name="story"
          id="story"
          rows={6}
          value={value.story}
          onChange={handleChange('story')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Campaign Duration (days)
        </label>
        <select
          name="duration"
          id="duration"
          value={value.duration}
          onChange={handleChange('duration')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
          <option value="60">60 days</option>
          <option value="90">90 days</option>
        </select>
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
          Cover Image URL
        </label>
        <input
          type="url"
          name="coverImage"
          id="coverImage"
          value={value.coverImage}
          onChange={handleChange('coverImage')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
};

export default CampaignDetails; 