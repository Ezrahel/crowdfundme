import React from 'react';

interface WhoForProps {
  value: string;
  onChange: (value: string) => void;
}

const WhoFor: React.FC<WhoForProps> = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor="whoFor">Who are you fundraising for?</label>
      <select
        id="whoFor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-control"
      >
        <option value="">Select an option</option>
        <option value="myself">Myself</option>
        <option value="someone-else">Someone Else</option>
        <option value="charity">Charity</option>
        <option value="business">Business</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
};

export default WhoFor; 