import React from 'react';

interface AccountDetailsData {
  name: string;
  email: string;
  phone: string;
}

interface AccountDetailsProps {
  value: AccountDetailsData;
  onChange: (value: AccountDetailsData) => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof AccountDetailsData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...value,
      [field]: e.target.value
    });
  };

  return (
    <div className="form-group">
      <label htmlFor="name">Full Name</label>
      <input
        type="text"
        id="name"
        value={value.name}
        onChange={handleChange('name')}
        className="form-control"
        required
      />

      <label htmlFor="email">Email Address</label>
      <input
        type="email"
        id="email"
        value={value.email}
        onChange={handleChange('email')}
        className="form-control"
        required
      />

      <label htmlFor="phone">Phone Number</label>
      <input
        type="tel"
        id="phone"
        value={value.phone}
        onChange={handleChange('phone')}
        className="form-control"
        required
      />
    </div>
  );
};

export default AccountDetails; 