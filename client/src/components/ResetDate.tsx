import React, { useEffect, useState } from 'react';

const ResetDate = () => {
  const [nextResetDate, setNextResetDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchResetDate = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (data.nextResetDate) {
          setNextResetDate(new Date(data.nextResetDate));
        }
      } catch (err) {
        console.error('Failed to fetch reset date', err);
      }
    };

    fetchResetDate();
  }, []);

  return (
    <div>
      {nextResetDate ? (
        <p className="text-sm text-gray-500 mt-2">
          Free recipe limit resets on:{' '}
          <span className="text-primary font-semibold">
            {nextResetDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </p>
      ) : (
        <p className="text-sm text-gray-400 mt-2">Loading reset date...</p>
      )}
    </div>
  );
};

export default ResetDate;
