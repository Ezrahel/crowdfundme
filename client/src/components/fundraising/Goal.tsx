import React from 'react';

interface GoalData {
  amount: string;
  currency: string;
}

interface GoalProps {
  value: GoalData;
  onChange: (value: GoalData) => void;
}

const Goal: React.FC<GoalProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof GoalData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({
      ...value,
      [field]: e.target.value
    });
  };

  return (
    <div className="form-group">
      <label htmlFor="amount">Goal Amount</label>
      <div className="amount-input">
        <input
          type="number"
          id="amount"
          value={value.amount}
          onChange={handleChange('amount')}
          className="form-control"
          min="0"
          step="0.01"
          required
        />
        <select
          id="currency"
          value={value.currency}
          onChange={handleChange('currency')}
          className="form-control"
        >
          <option value="NGN">NGN</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </div>
  );
};

export default Goal; 