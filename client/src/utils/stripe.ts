export const subscribeUser = async (priceId: string, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/payment/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ priceId, mode: 'subscription' }),
  });

  const data = await res.json();
  if (res.ok) {
    window.location.href = data.url;
  } else {
    throw new Error(data.error || 'Checkout failed');
  }
};

export const cancelSubscription = async (token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/payment/cancel-subscription`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to cancel subscription');
  }
  return data.message;
};
