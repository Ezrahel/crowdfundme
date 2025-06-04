import React from 'react';
import './FundraisingLayout.css';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isNextDisabled = false,
  nextButtonText = 'Next'
}) => {
  return (
    <div className="navigation-buttons">
      {currentStep > 1 && (
        <button
          onClick={onBack}
          className="back-button"
        >
          Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`next-button ${isNextDisabled ? 'disabled' : ''}`}
      >
        {currentStep === totalSteps ? 'Submit' : nextButtonText}
      </button>
    </div>
  );
};

export default NavigationButtons; 