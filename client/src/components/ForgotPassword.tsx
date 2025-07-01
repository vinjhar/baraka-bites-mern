import React, { useState } from 'react';
import { forgotPassword } from '../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await forgotPassword({ email });
      setMessage('A reset link has been sent to your email.');
      setStatus('success');
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Something went wrong.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-4">Forgot Password</h2>
        <p className="mb-4 text-sm text-gray-600">
          Enter your registered email address. We'll send you a link to reset your password.
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
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
