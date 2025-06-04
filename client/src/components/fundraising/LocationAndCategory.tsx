import React from 'react';

interface LocationAndCategoryData {
  location: string;
  category: string;
}

interface LocationAndCategoryProps {
  value: LocationAndCategoryData;
  onChange: (value: LocationAndCategoryData) => void;
}

const LocationAndCategory: React.FC<LocationAndCategoryProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof LocationAndCategoryData) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onChange({
      ...value,
      [field]: e.target.value
    });
  };

  return (
    <div className="form-group">
      <label htmlFor="location">Location</label>
      <select
        id="location"
        value={value.location}
        onChange={handleChange('location')}
        className="form-control"
        required
      >
        <option value="">Select location</option>
        <option value="lagos">Lagos</option>
        <option value="abuja">Abuja</option>
        <option value="port-harcourt">Port Harcourt</option>
        <option value="ibadan">Ibadan</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={value.category}
        onChange={handleChange('category')}
        className="form-control"
        required
      >
        <option value="">Select category</option>
        <option value="medical">Medical</option>
        <option value="education">Education</option>
        <option value="emergency">Emergency</option>
        <option value="nonprofit">Non-Profit</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
};

export default LocationAndCategory; 