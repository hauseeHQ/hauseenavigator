import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import { Loader2, Home } from 'lucide-react';
import { SignUpFormData, FormErrors, UserMetadata } from '../types';
import { validateEmail, validatePhoneNumber, formatPhoneNumber } from '../utils/validation';

export default function SignUpPage() {
  const { signUp } = useSignUp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    homeStage: '',
    acceptedTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.homeStage) {
      newErrors.homeStage = 'Please select your home-buying stage';
    }

    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phoneNumber: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (!signUp) {
        throw new Error('Sign up not initialized');
      }

      const metadata: UserMetadata = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber || undefined,
        homeStage: formData.homeStage as UserMetadata['homeStage'],
      };

      await signUp.create({
        emailAddress: formData.email,
        unsafeMetadata: metadata,
      });

      const redirectUrl = `${window.location.origin}/verify-email`;

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_link',
        redirectUrl: redirectUrl
      });

      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err: any) {
      console.error('Sign up error:', err);
      setErrors({
        email: err.errors?.[0]?.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Home className="w-10 h-10 text-primary-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start your home buying journey today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400`}
                placeholder="(555) 123-4567"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="homeStage" className="block text-sm font-medium text-gray-700">
                Home-buying Stage *
              </label>
              <select
                id="homeStage"
                value={formData.homeStage}
                onChange={(e) => setFormData({ ...formData, homeStage: e.target.value as any })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.homeStage ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400`}
              >
                <option value="">Select your stage</option>
                <option value="dreaming">Dreaming</option>
                <option value="getting_ready">Getting ready</option>
                <option value="actively_looking">Actively looking</option>
              </select>
              {errors.homeStage && (
                <p className="mt-1 text-sm text-red-600">{errors.homeStage}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                className="mt-1 h-4 w-4 text-primary-400 focus:ring-primary-400 border-gray-300 rounded"
              />
              <label htmlFor="acceptedTerms" className="ml-2 block text-sm text-gray-700">
                I agree to Hausee's{' '}
                <a href="#" className="text-primary-400 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-400 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.acceptedTerms && (
              <p className="text-sm text-red-600">{errors.acceptedTerms}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Get Started'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-primary-400 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
