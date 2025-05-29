import React, { createContext, useContext, useState } from 'react';

const FundraisingContext = createContext();

export const useFundraising = () => {
  const context = useContext(FundraisingContext);
  if (!context) {
    throw new Error('useFundraising must be used within a FundraisingProvider');
  }
  return context;
};

export const FundraisingProvider = ({ children }) => {
  const [fundraisingData, setFundraisingData] = useState({
    // Step 1: Location and Category
    country: '',
    postcode: '',
    category: '',
    
    // Step 2: Who you're fundraising for
    whoFor: '',
    
    // Step 3: Goal
    goal: '',
    currency: 'GBP',
    
    // Step 4: Campaign Details
    title: '',
    description: '',
    story: '',
    duration: 30,
    coverImage: null,
    
    // Step 5: Account Details
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    accountType: '',
  });

  const updateFundraisingData = (newData) => {
    setFundraisingData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const submitFundraisingData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fundraisingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit fundraising data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting fundraising data:', error);
      throw error;
    }
  };

  return (
    <FundraisingContext.Provider value={{ 
      fundraisingData, 
      updateFundraisingData,
      submitFundraisingData 
    }}>
      {children}
    </FundraisingContext.Provider>
  );
}; 