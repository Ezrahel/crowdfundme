import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface FundraisingData {
  // Step 1: Location and Category
  country: string;
  postcode: string;
  category: string;
  
  // Step 2: Who you're fundraising for
  whoFor: string;
  
  // Step 3: Goal
  goal: number;
  currency: string;
  
  // Step 4: Campaign Details
  title: string;
  description: string;
  story: string;
  duration: number;
  coverImage: string;
  
  // Step 5: Account Details
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
}

interface FundraisingContextType {
  data: FundraisingData;
  updateData: (newData: Partial<FundraisingData>) => void;
  submitData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const defaultData: FundraisingData = {
  country: '',
  postcode: '',
  category: '',
  whoFor: '',
  goal: 0,
  currency: 'USD',
  title: '',
  description: '',
  story: '',
  duration: 30,
  coverImage: '',
  accountHolder: '',
  bankName: '',
  accountNumber: '',
  accountType: '',
};

const FundraisingContext = createContext<FundraisingContextType | undefined>(undefined);

export const FundraisingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FundraisingData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = (newData: Partial<FundraisingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const submitData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/campaigns', data);
      console.log('Campaign created successfully:', response.data);
      // You might want to handle success (e.g., redirect to success page)
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FundraisingContext.Provider value={{ data, updateData, submitData, isLoading, error }}>
      {children}
    </FundraisingContext.Provider>
  );
};

export const useFundraising = () => {
  const context = useContext(FundraisingContext);
  if (context === undefined) {
    throw new Error('useFundraising must be used within a FundraisingProvider');
  }
  return context;
}; 