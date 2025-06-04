import React, { useState } from 'react';
import axios from 'axios';
import './PaymentForm.css';

interface PaymentFormProps {
    campaignId: string;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
}

type PaymentMethod = 'card' | 'bank_transfer' | 'qrcode' | 'ussd' | 'pay_attitude';

const PaymentForm: React.FC<PaymentFormProps> = ({ campaignId, onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        amount: '',
        paymentReference: '',
        paymentMethods: 'card' as PaymentMethod,
        customerEmail: '',
        customerName: '',
        currency: 'NGN',
        description: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/payment/initiate', {
                ...formData,
                amount: parseFloat(formData.amount),
                campaign_id: campaignId,
            });

            if (response.data.requestSuccessful) {
                onSuccess?.(response.data);
            } else {
                setError(response.data.responseMessage || 'Payment initiation failed');
                onError?.(response.data);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.responseMessage || err.message || 'An error occurred';
            setError(errorMessage);
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    const renderPaymentMethodUI = () => {
        switch (formData.paymentMethods) {
            case 'card':
                return (
                    <div className="payment-method-details card-details">
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />
                        </div>
                        <div className="card-details-row">
                            <div className="form-group">
                                <label htmlFor="cardExpiry">Expiry Date</label>
                                <input
                                    type="text"
                                    id="cardExpiry"
                                    name="cardExpiry"
                                    value={formData.cardExpiry}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cardCVV">CVV</label>
                                <input
                                    type="text"
                                    id="cardCVV"
                                    name="cardCVV"
                                    value={formData.cardCVV}
                                    onChange={handleChange}
                                    placeholder="123"
                                    maxLength={3}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'bank_transfer':
                return (
                    <div className="payment-method-details bank-transfer-details">
                        <div className="bank-info">
                            <h3>Bank Transfer Details</h3>
                            <div className="bank-detail-item">
                                <span className="label">Bank Name:</span>
                                <span className="value">Ercas Bank</span>
                            </div>
                            <div className="bank-detail-item">
                                <span className="label">Account Number:</span>
                                <span className="value">7170015192</span>
                                <button className="copy-button" onClick={() => navigator.clipboard.writeText('7170015192')}>
                                    Copy
                                </button>
                            </div>
                            <div className="bank-detail-item">
                                <span className="label">Account Name:</span>
                                <span className="value">CrowdFundMe</span>
                            </div>
                            <p className="note">Please use your name as the transfer reference</p>
                        </div>
                    </div>
                );
            case 'qrcode':
                return (
                    <div className="payment-method-details qrcode-details">
                        <div className="qrcode-container">
                            <div className="qrcode-placeholder">
                                {/* Replace with actual QR code component */}
                                <div className="qrcode-image">
                                    <img src="/path-to-qrcode.png" alt="Payment QR Code" />
                                </div>
                            </div>
                            <p className="qrcode-note">Scan this QR code with your mobile banking app to make the payment</p>
                        </div>
                    </div>
                );
            case 'ussd':
                return (
                    <div className="payment-method-details ussd-details">
                        <div className="ussd-info">
                            <h3>USSD Payment Instructions</h3>
                            <div className="ussd-steps">
                                <p>1. Dial *737*7170015192*Amount#</p>
                                <p>2. Enter your PIN</p>
                                <p>3. Confirm the transaction</p>
                            </div>
                            <div className="ussd-note">
                                <p>Example: To pay ₦5,000, dial *737*7170015192*5000#</p>
                            </div>
                        </div>
                    </div>
                );
            case 'pay_attitude':
                return (
                    <div className="payment-method-details pay-attitude-details">
                        <div className="pay-attitude-info">
                            <h3>Pay Attitude Instructions</h3>
                            <div className="pay-attitude-steps">
                                <p>1. Open your Pay Attitude app</p>
                                <p>2. Enter the amount: ₦{formData.amount || '0'}</p>
                                <p>3. Scan the QR code or enter the account number: 7170015192</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="payment-form-container">
            <form onSubmit={handleSubmit} className="payment-form">
                <h2>Make a Donation</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="amount">Amount (NGN)</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1"
                        step="0.01"
                        placeholder="Enter amount"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerName">Full Name</label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerEmail">Email</label>
                    <input
                        type="email"
                        id="customerEmail"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="paymentMethods">Payment Method</label>
                    <select
                        id="paymentMethods"
                        name="paymentMethods"
                        value={formData.paymentMethods}
                        onChange={handleChange}
                        required
                    >
                        <option value="card">Credit/Debit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="qrcode">QR Code</option>
                        <option value="ussd">USSD</option>
                        <option value="pay_attitude">Pay Attitude</option>
                    </select>
                </div>

                {renderPaymentMethodUI()}

                <div className="form-group">
                    <label htmlFor="description">Message (Optional)</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add a message with your donation"
                        rows={3}
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Donate Now'}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm; 