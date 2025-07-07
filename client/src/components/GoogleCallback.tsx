import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');

    if (token) {
      
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }).catch(() => {
        alert("Failed to log in via Google");
        navigate('/');
      });
    } else {
      alert("Token not found from Google login");
      navigate('/');
    }
  }, [navigate]);

  return <p className="text-center mt-20 text-lg text-gray-700">Signing you in...</p>;
};

export default GoogleCallback;
