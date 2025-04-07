import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaGoogle, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const { translate, direction } = useContext(LanguageContext);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleMethodChange = (method) => {
    setLoginMethod(method);
    setError('');
  };

  const validateForm = () => {
    if (loginMethod === 'email') {
      if (!formData.email) {
        setError(translate('email_required'));
        return false;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError(translate('invalid_email'));
        return false;
      }
    } else if (loginMethod === 'phone') {
      if (!formData.phone) {
        setError(translate('phone_required'));
        return false;
      }
      
      // Basic phone validation
      const phoneRegex = /^\+?[0-9\s\-]{8,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError(translate('invalid_phone'));
        return false;
      }
    }
    
    if (!formData.password) {
      setError(translate('password_required'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Mock authentication process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a user object based on login method
      const userData = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: loginMethod === 'email' ? 'User' : 'Phone User',
        email: loginMethod === 'email' ? formData.email : null,
        phone: loginMethod === 'phone' ? formData.phone : null,
        role: 'user'
      };
      
      // Use the login function from AuthContext
      await login(userData);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(translate('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Mock Google authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: 'Google User',
        email: 'google.user@gmail.com',
        role: 'user'
      };
      
      // Use the login function from AuthContext
      await login(userData);
      
      navigate('/dashboard');
    } catch (error) {
      setError(translate('google_login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={direction}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {translate('login_to_account')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {translate('or')}{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              {translate('dont_have_account')}
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="flex mb-6 border-b border-gray-200">
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-center ${loginMethod === 'email' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleMethodChange('email')}
          >
            <FaEnvelope className="inline mr-2" />
            {translate('email')}
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-center ${loginMethod === 'phone' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleMethodChange('phone')}
          >
            <FaPhone className="inline mr-2" />
            {translate('phone')}
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {loginMethod === 'email' && (
              <div>
                <label htmlFor="email" className="sr-only">{translate('email_address')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md"
                  placeholder={translate('email_address')}
                />
              </div>
            )}
            
            {loginMethod === 'phone' && (
              <div>
                <label htmlFor="phone" className="sr-only">{translate('phone_number')}</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md"
                  placeholder={translate('phone_number')}
                />
              </div>
            )}

            <div className="relative mt-3">
              <label htmlFor="password" className="sr-only">{translate('password')}</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md"
                placeholder={translate('password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {translate('remember_me')}
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                {translate('forgot_password')}
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? translate('signing_in') : translate('sign_in')}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {translate('or_continue_with')}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
              {translate('sign_in_with_google')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
