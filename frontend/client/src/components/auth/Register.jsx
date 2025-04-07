import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaGoogle, FaEnvelope, FaPhone, FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';

const Register = () => {
  const { translate, direction } = useContext(LanguageContext);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [registrationMethod, setRegistrationMethod] = useState('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
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
    setRegistrationMethod(method);
    setError('');
  };

  const validateForm = () => {
    // Check if name is provided
    if (!formData.name.trim()) {
      setError(translate('name_required'));
      return false;
    }
    
    // Validate based on registration method
    if (registrationMethod === 'email') {
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
    } else if (registrationMethod === 'phone') {
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
    
    // Password validation
    if (!formData.password) {
      setError(translate('password_required'));
      return false;
    }
    
    if (formData.password.length < 8) {
      setError(translate('password_min_length'));
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(translate('passwords_do_not_match'));
      return false;
    }
    
    // Terms agreement check
    if (!formData.agreeToTerms) {
      setError(translate('agree_to_terms'));
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
      // Create a user object based on registration method
      const userData = {
        name: formData.name,
        email: registrationMethod === 'email' ? formData.email : null,
        phone: registrationMethod === 'phone' ? formData.phone : null,
        role: 'user'
      };
      
      // Use the register function from AuthContext
      await register(userData);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(translate('registration_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegistration = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Mock Google authentication
      const userData = {
        name: 'Google User',
        email: 'google.user@gmail.com',
        role: 'user'
      };
      
      // Use the register function from AuthContext
      await register(userData);
      
      navigate('/dashboard');
    } catch (error) {
      setError(translate('google_registration_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={direction}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {translate('create_new_account')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {translate('or')}{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              {translate('already_have_account')}
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
            className={`flex-1 py-3 px-4 text-center ${registrationMethod === 'email' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleMethodChange('email')}
          >
            <FaEnvelope className="inline mr-2" />
            {translate('email')}
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-center ${registrationMethod === 'phone' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleMethodChange('phone')}
          >
            <FaPhone className="inline mr-2" />
            {translate('phone')}
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">{translate('full_name')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FaUser />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md"
                  placeholder={translate('full_name')}
                />
              </div>
            </div>
            
            {registrationMethod === 'email' && (
              <div>
                <label htmlFor="email" className="sr-only">{translate('email_address')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md"
                    placeholder={translate('email_address')}
                  />
                </div>
              </div>
            )}
            
            {registrationMethod === 'phone' && (
              <div>
                <label htmlFor="phone" className="sr-only">{translate('phone_number')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <FaPhone />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md"
                    placeholder={translate('phone_number')}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="sr-only">{translate('password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md"
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
            
            <div>
              <label htmlFor="confirmPassword" className="sr-only">{translate('confirm_password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-md"
                  placeholder={translate('confirm_password')}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ms-2 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                {translate('agree_to')}{' '}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                  {translate('terms_and_conditions')}
                </Link>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? translate('creating_account') : translate('create_account')}
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
              onClick={handleGoogleRegistration}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
              {translate('sign_up_with_google')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
