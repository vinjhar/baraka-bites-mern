import React, { useState } from 'react';
import { resendVerification } from '../api/authApi';

const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await resendVerification({ email });
      setMessage('Verification email sent successfully.');
      setStatus('success');
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || err?.response?.data?.error || 'Something went wrong.';
      setMessage(errMsg);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-4">Resend Verification</h2>
        <p className="mb-4 text-sm text-gray-600">
          Enter your email below and we'll send you a new verification link.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring focus:border-primary"
            placeholder="example@email.com"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
          >
            {status === 'loading' ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResendVerificationPage;
