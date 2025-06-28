import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateForm, schemas } from '../utils/validation';
import { showError, showSuccess } from '../utils/toast';
import { LoadingButton } from '../utils/loading.jsx';
import { logger } from '../utils/logger';

export default function Login() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    nameOrEmail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name, value) => {
    const fieldSchema = schemas.login[name];
    if (!fieldSchema) return null;
    
    for (const validator of fieldSchema) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      const validationErrors = validateForm(formData, schemas.login);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showError('Please fix the errors in the form');
        return;
      }

      await login(formData.nameOrEmail, formData.password);
      showSuccess('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      logger.error('Login error:', err);
      showError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to CustomTee
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="nameOrEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Name or Email
                </label>
                <input
                  id="nameOrEmail"
                  name="nameOrEmail"
                  type="text"
                  required
                  value={formData.nameOrEmail}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition ${
                    errors.nameOrEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name or email"
                />
                {errors.nameOrEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.nameOrEmail}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <LoadingButton
                type="submit"
                loading={isSubmitting || loading}
                disabled={isSubmitting || loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                loadingText="Signing in..."
              >
                Sign in
              </LoadingButton>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-2">🏠</span>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 