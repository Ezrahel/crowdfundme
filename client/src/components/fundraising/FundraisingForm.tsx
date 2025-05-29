import React, { useState } from 'react';
import { useFundraising } from '../../contexts/FundraisingContext';
import LocationAndCategory from './LocationAndCategory';
import WhoFor from './WhoFor';
import Goal from './Goal';
import CampaignDetails from './CampaignDetails';
import AccountDetails from './AccountDetails';
import './FundraisingLayout.css';

const FundraisingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { submitData, isLoading, error } = useFundraising();

  const steps = [
    { id: 1, title: 'Location & Category', component: LocationAndCategory },
    { id: 2, title: 'Who You\'re Fundraising For', component: WhoFor },
    { id: 3, title: 'Goal', component: Goal },
    { id: 4, title: 'Campaign Details', component: CampaignDetails },
    { id: 5, title: 'Account Details', component: AccountDetails },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    await submitData();
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="fundraising-setup">
      <aside className="fixed-sidebar">
        <div className="sidebar-content">
          <div className="logo">CrowdFundMe</div>
          <div className="setup-intro">
            <h3>Step {currentStep} of {steps.length}</h3>
            <h1>{steps[currentStep - 1].title}</h1>
            <p>We're here to guide you every step of the way.</p>
          </div>
        </div>
      </aside>

      <main className="scrollable-main">
        <div className="bg-white shadow rounded-lg p-6">
          <CurrentStepComponent />
        </div>

        <div className="mt-6 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default FundraisingForm; 