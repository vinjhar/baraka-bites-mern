import React, { useEffect, useState } from 'react';
import { subscribeUser, cancelSubscription } from '../utils/stripe';
import { Loader2, X } from 'lucide-react';

const BillingPage = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStatus = async () => {
      setFetching(true);
      try {
        const res = await fetch(`http://localhost:7001/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIsPremium(data.user?.isPremium || false);
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setFetching(false);
      }
    };
    fetchStatus();
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setMessage('');
      const priceId = 'price_1RgBMBC1TUee5AwtLKuvteIn';
      await subscribeUser(priceId, token!);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = async () => {
    try {
      setLoading(true);
      setMessage('');
      const msg = await cancelSubscription(token!);
      setMessage(msg);
      setIsPremium(false);
      setShowConfirmModal(false);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
        <h2 className="text-3xl font-bold text-primary text-center mb-4">Billing & Subscription</h2>

        {fetching ? (
          <div className="flex justify-center my-8">
            <Loader2 className="animate-spin w-6 h-6 text-primary" />
          </div>
        ) : (
          <>
            <p className="text-center text-lg mb-6">
              Your current status:
              <span className={`ml-2 font-semibold ${isPremium ? 'text-green-600' : 'text-red-500'}`}>
                {isPremium ? 'Premium Member' : 'Free Member'}
              </span>
            </p>

            {message && (
              <p className="text-center mb-4 text-sm text-blue-600 font-medium">{message}</p>
            )}

            <div className="flex justify-center">
              {!isPremium ? (
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
                >
                  {loading ? 'Redirecting...' : 'Upgrade to Premium'}
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-red-600 mb-4 text-center">Cancel Subscription?</h3>
            <p className="text-gray-700 text-sm text-center mb-6">
              Are you sure you want to cancel your premium subscription? You won't be able to resume it later.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmCancel}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-5 rounded-lg"
              >
                Keep Premium
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
