import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpgradeToPremium: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setIsFetching(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.user) {
          setIsAuthenticated(true);
          setIsSubscribed(data.user.isPremium || false);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Failed to check user status', err);
        setIsAuthenticated(false);
      } finally {
        setIsFetching(false);
      }
    };

    checkAuth();
  }, [token]);

  const resetState = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  const handleUpgrade = async () => {
    resetState();

    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (isSubscribed) {
      setError('You are already subscribed to Premium.');
      return;
    }

    setIsLoading(true);
    try {
      navigate('/billing');
    } catch (err) {
      setError('Upgrade failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-primary/10">
      <h3 className="text-lg font-semibold text-primary mb-4">Upgrade to Premium</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <button
        onClick={handleUpgrade}
        disabled={isLoading || isSubscribed}
        className="w-full flex items-center justify-center px-4 py-2 bg-gold text-primary rounded-md hover:bg-gold/90 transition-colors duration-200 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : isSubscribed ? (
          'Already Subscribed'
        ) : (
          'Upgrade Now'
        )}
      </button>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>Get access to:</p>
        <ul className="space-y-1">
          <li>• Unlimited recipe generations</li>
          <li>• Save favorite recipes</li>
          <li>• Advanced cooking techniques</li>
          <li>• Priority support</li>
          <li>• Downloadable du'a PDF book</li>
          <li>• 10% of proceeds donated to charity</li>
        </ul>
      </div>
    </div>
  );
};

export default UpgradeToPremium;
