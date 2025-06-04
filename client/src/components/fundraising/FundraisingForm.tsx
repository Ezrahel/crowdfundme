import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFundraising } from '../../contexts/FundraisingContext';
import LocationAndCategory from './LocationAndCategory';
import WhoFor from './WhoFor';
import Goal from './Goal';
import CampaignDetails from './CampaignDetails';
import AccountDetails from './AccountDetails';
import NavigationButtons from './NavigationButtons';
import './FundraisingLayout.css';

const FundraisingForm: React.FC = () => {
  const navigate = useNavigate();
  const { submitData, isLoading, error } = useFundraising();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    whoFor: '',
    accountDetails: {
      name: '',
      email: '',
      phone: ''
    },
    campaignDetails: {
      title: '',
      description: '',
      story: '',
      duration: 30,
      coverImage: ''
    },
    goal: {
      amount: '',
      currency: 'NGN'
    },
    locationAndCategory: {
      location: '',
      category: ''
    }
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
      // Navigate to campaign page after successful submission
      navigate(`/campaign/123`); // Replace with actual campaign ID
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WhoFor value={formData.whoFor} onChange={(value) => handleInputChange('whoFor', value)} />;
      case 2:
        return <AccountDetails value={formData.accountDetails} onChange={(value) => handleInputChange('accountDetails', value)} />;
      case 3:
        return <CampaignDetails value={formData.campaignDetails} onChange={(value) => handleInputChange('campaignDetails', value)} />;
      case 4:
        return <Goal value={formData.goal} onChange={(value) => handleInputChange('goal', value)} />;
      case 5:
        return <LocationAndCategory value={formData.locationAndCategory} onChange={(value) => handleInputChange('locationAndCategory', value)} />;
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !formData.whoFor;
      case 2:
        return !formData.accountDetails.name || !formData.accountDetails.email;
      case 3:
        return !formData.campaignDetails.title || !formData.campaignDetails.description;
      case 4:
        return !formData.goal.amount;
      case 5:
        return !formData.locationAndCategory.location || !formData.locationAndCategory.category;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    await submitData();
  };

  return (
    <div className="fundraising-container">
      <div className="fundraising-form">
        <h2 className="text-2xl font-bold mb-6">Create Your Fundraiser</h2>
        <div className="form-content">
          {renderStep()}
        </div>
        <div className="navigation-section">
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onBack={handleBack}
            isNextDisabled={isNextDisabled()}
          />
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundraisingForm; 