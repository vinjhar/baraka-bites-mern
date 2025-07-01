import React, { useState } from 'react';
import { signin } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Leaf } from 'lucide-react';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signin(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signin error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div >
        <div className="flex justify-center items-center">
            <Leaf className="w-8 h-8 text-primary rotate-45" />
            <div className="flex flex-col ml-2">
              <span className="text-3xl font-serif text-primary">Baraka</span>
              <span className="text-sm font-medium tracking-wider text-primary/80">BITES</span>
            </div>
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            Sign in to your account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to Baraka Bites
          </p>

        <form onSubmit={handleSubmit}>
          
          <label htmlFor="email" className="mt-4 block text-sm font-medium text-gray-700">
                  Email address
                </label>
          <input 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          type="email" 
          id='email'
          name='email'
          autoComplete='email'
          placeholder="Email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
          required

          />

          <label htmlFor="password" className="mt-4 block text-sm font-medium text-gray-700">
              Password
          </label>
          <input type="password" 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Password" 
          value={form.password} 
          id='password'
          name='password'
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </button>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/resend-verification')}
                  className="font-medium text-primary hover:text-primary/80 text-sm mt-2"
                >
                  Didn't get your verification email?
                </button>

              </div>

          <button 
            className="mt-5 *:flex items-center font-semibold justify-center w-full text-sm bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition-colors duration-200"
            type="submit"
          >
            Sign In
          </button>
        </form>

         <hr className='m-5'/>
          <GoogleLoginButton />

        <p className='mt-3 text-center text-sm text-gray-600'>
          Don't have an account?
          <button
                type="button"
                onClick={()=>navigate('/SignUp')}
                className="ml-1 font-medium text-primary hover:text-primary/80"
              >Sign Up</button>
        </p>


        {message && (
        <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{message}</p>
        </div>
      )}
        
       </div>
      </div>
    </div>
  );
};

export default SignIn;
