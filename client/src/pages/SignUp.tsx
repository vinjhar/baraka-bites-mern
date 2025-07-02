import React, { useState } from 'react';
import { signup } from '../api/authApi';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
  const res = await signup(form);
  setMessage({ text: res.data.message, type: 'success' });
} catch (err) {
  setMessage({
    text: err.response?.data?.message || 'Error',
    type: 'error'
  });
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
            Create your account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Join Baraka Bites today
          </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Sign Up Requirements:</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Password must be at least 8 characters long</li>
                <li>Email must be unique and not already registered</li>
                <li>You will need to confirm your email after signing up</li>
              </ul>
            </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="mt-4 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
          <input 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Name"
          type='text'
          required
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          id='name'
          name='name'
          />
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
          <button 
  className="mt-5 *:flex items-center font-semibold justify-center w-full text-sm bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition-colors duration-200"
  type="submit"
>
  Sign Up
</button>
          <hr className='m-5'/>
          <GoogleLoginButton />
        </form>

        <p className='mt-3 text-center text-sm text-gray-600'>
          Already have an account? 
          <button
                type="button"
                onClick={()=>navigate('/SignIn')}
                className="ml-1 font-medium text-primary hover:text-primary/80"
              >Sign In</button>
        </p>

         {message && (
        <div
          className={`mt-3 border-l-4 p-4 mb-4 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-700'
              : 'bg-red-50 border-red-500 text-red-700'
          }`}
        >
          <p>{message.text}</p>
        </div>
      )}
       </div>
      </div>
    </div>
  );
};

export default SignUp;
