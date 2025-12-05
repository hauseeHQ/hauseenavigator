import { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Lock,
  Home,
  DollarSign,
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  X,
  Edit,
} from 'lucide-react';
import { SelectFormData } from '../../types';

const ONTARIO_CITIES = [
  'Toronto',
  'Ottawa',
  'Mississauga',
  'Brampton',
  'Hamilton',
  'London',
  'Markham',
  'Vaughan',
  'Kitchener',
  'Windsor',
  'Richmond Hill',
  'Oakville',
  'Burlington',
  'Greater Sudbury',
  'Oshawa',
  'Barrie',
  'St. Catharines',
  'Cambridge',
  'Kingston',
  'Guelph',
];

const PROPERTY_TYPES = ['Condo', 'Townhouse', 'Semi-Detached', 'Detached', 'Multi-Unit'];

const initialFormData: SelectFormData = {
  aboutYou: {
    firstName: '',
    lastName: '',
    email: 'user@example.com',
    phone: '',
    hasReferral: false,
    referralCode: '',
  },
  propertyIntent: '',
  buyerQuestions: {
    preferredCities: [],
    priceRange: { min: 200000, max: 2000000 },
    propertyTypes: [],
    timeline: '',
    preApprovalStatus: '',
    hasCurrentAgent: false,
    additionalComments: '',
  },
  sellerQuestions: {
    propertyType: '',
    propertyLocation: '',
    estimatedValue: 0,
    sellingTimeline: '',
    sellingReason: '',
    propertyCondition: '',
    propertyNotes: '',
  },
  consent: {
    contactConsent: false,
    sharingConsent: false,
  },
  currentStep: 1,
  status: 'draft',
};

interface AgentMatchingFormProps {
  onComplete: () => void;
}

export default function AgentMatchingForm({ onComplete }: AgentMatchingFormProps) {
  const [formData, setFormData] = useState<SelectFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('agentMatchingForm');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved form data');
      }
    }
  }, []);

  useEffect(() => {
    if (formData.status !== 'submitted') {
      localStorage.setItem('agentMatchingForm', JSON.stringify(formData));
    }
  }, [formData]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.aboutYou.firstName || formData.aboutYou.firstName.length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }
      if (!formData.aboutYou.lastName || formData.aboutYou.lastName.length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      }
      if (!formData.aboutYou.phone || formData.aboutYou.phone.replace(/\D/g, '').length !== 10) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      if (formData.aboutYou.hasReferral && !formData.aboutYou.referralCode) {
        newErrors.referralCode = 'Please enter your referral code';
      }
    }

    if (step === 2) {
      if (!formData.propertyIntent) {
        newErrors.propertyIntent = 'Please select your property intent';
      }
    }

    if (step === 3 && formData.propertyIntent === 'buying') {
      if (formData.buyerQuestions!.preferredCities.length === 0) {
        newErrors.preferredCities = 'Please select at least one city';
      }
      if (formData.buyerQuestions!.propertyTypes.length === 0) {
        newErrors.propertyTypes = 'Please select at least one property type';
      }
      if (!formData.buyerQuestions!.timeline) {
        newErrors.timeline = 'Please select your timeline';
      }
      if (!formData.buyerQuestions!.preApprovalStatus) {
        newErrors.preApprovalStatus = 'Please select your pre-approval status';
      }
    }

    if (step === 3 && formData.propertyIntent === 'selling') {
      if (!formData.sellerQuestions!.propertyType) {
        newErrors.propertyType = 'Please select property type';
      }
      if (!formData.sellerQuestions!.propertyLocation) {
        newErrors.propertyLocation = 'Please enter property location';
      }
      if (!formData.sellerQuestions!.estimatedValue || formData.sellerQuestions!.estimatedValue < 1000) {
        newErrors.estimatedValue = 'Please enter estimated value';
      }
      if (!formData.sellerQuestions!.sellingTimeline) {
        newErrors.sellingTimeline = 'Please select selling timeline';
      }
      if (!formData.sellerQuestions!.sellingReason) {
        newErrors.sellingReason = 'Please select reason for selling';
      }
      if (!formData.sellerQuestions!.propertyCondition) {
        newErrors.propertyCondition = 'Please select property condition';
      }
    }

    if (step === 4) {
      if (!formData.consent.contactConsent) {
        newErrors.contactConsent = 'You must consent to be contacted';
      }
      if (!formData.consent.sharingConsent) {
        newErrors.sharingConsent = 'You must consent to information sharing';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep = (step: number) => {
    if (step < formData.currentStep || validateStep(formData.currentStep)) {
      setFormData((prev) => ({ ...prev, currentStep: step }));
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (validateStep(formData.currentStep)) {
      goToStep(formData.currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(4)) {
      const submittedData = {
        ...formData,
        status: 'submitted' as const,
        submittedAt: new Date().toISOString(),
      };
      setFormData(submittedData);
      localStorage.removeItem('agentMatchingForm');
      goToStep(5);
    }
  };

  const renderProgressBar = () => {
    const steps = [
      { num: 1, label: 'About You' },
      { num: 2, label: 'Intent' },
      { num: 3, label: 'Details' },
      { num: 4, label: 'Review' },
      { num: 5, label: 'Complete' },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    formData.currentStep >= step.num
                      ? 'bg-red-400 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {formData.currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden md:block ${
                    formData.currentStep >= step.num ? 'text-red-400' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${
                    formData.currentStep > step.num ? 'bg-red-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {formData.currentStep < 5 && renderProgressBar()}

        {formData.currentStep === 1 && (
          <Step1ContactInfo formData={formData} setFormData={setFormData} errors={errors} onNext={handleNext} />
        )}

        {formData.currentStep === 2 && (
          <Step2PropertyIntent
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onNext={handleNext}
            onBack={() => goToStep(1)}
          />
        )}

        {formData.currentStep === 3 && formData.propertyIntent === 'buying' && (
          <Step3ABuyerQuestions
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onNext={handleNext}
            onBack={() => goToStep(2)}
          />
        )}

        {formData.currentStep === 3 && formData.propertyIntent === 'selling' && (
          <Step3BSellerQuestions
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onNext={handleNext}
            onBack={() => goToStep(2)}
          />
        )}

        {formData.currentStep === 4 && (
          <Step4Review
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onSubmit={handleSubmit}
            onBack={() => goToStep(3)}
            goToStep={goToStep}
          />
        )}

        {formData.currentStep === 5 && <Step5Confirmation onComplete={onComplete} />}
      </div>
    </div>
  );
}

interface StepProps {
  formData: SelectFormData;
  setFormData: React.Dispatch<React.SetStateAction<SelectFormData>>;
  errors: Record<string, string>;
  onNext: () => void;
  onBack?: () => void;
}

function Step1ContactInfo({ formData, setFormData, errors, onNext }: StepProps) {
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's start with your information</h2>
      <p className="text-gray-600 mb-6">We'll use this to connect you with the right agent.</p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.aboutYou.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aboutYou: { ...prev.aboutYou, firstName: e.target.value },
                  }))
                }
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.aboutYou.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aboutYou: { ...prev.aboutYou, lastName: e.target.value },
                  }))
                }
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.aboutYou.email}
              disabled
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">This email is from your account and cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.aboutYou.phone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  aboutYou: { ...prev.aboutYou, phone: formatPhone(e.target.value) },
                }))
              }
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Do you have a referral code?
          </label>
          <div className="flex gap-3 mb-3">
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  aboutYou: { ...prev.aboutYou, hasReferral: true },
                }))
              }
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                formData.aboutYou.hasReferral
                  ? 'bg-red-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  aboutYou: { ...prev.aboutYou, hasReferral: false, referralCode: '' },
                }))
              }
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                !formData.aboutYou.hasReferral
                  ? 'bg-red-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No
            </button>
          </div>

          {formData.aboutYou.hasReferral && (
            <div>
              <input
                type="text"
                value={formData.aboutYou.referralCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aboutYou: { ...prev.aboutYou, referralCode: e.target.value },
                  }))
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
                  errors.referralCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter referral code"
              />
              {errors.referralCode && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.referralCode}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Step2PropertyIntent({ formData, setFormData, errors, onNext, onBack }: StepProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What brings you here?</h2>
      <p className="text-gray-600 mb-8">Select the option that best describes your needs.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              propertyIntent: 'buying',
            }))
          }
          className={`p-8 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
            formData.propertyIntent === 'buying'
              ? 'border-red-400 bg-red-50 shadow-md'
              : 'border-gray-200 hover:border-red-200'
          }`}
        >
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Home className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Buying a home</h3>
          <p className="text-gray-600">Looking to purchase your dream property</p>
          {formData.propertyIntent === 'buying' && (
            <div className="mt-4 flex items-center gap-2 text-red-400 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Selected
            </div>
          )}
        </button>

        <button
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              propertyIntent: 'selling',
            }))
          }
          className={`p-8 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
            formData.propertyIntent === 'selling'
              ? 'border-red-400 bg-red-50 shadow-md'
              : 'border-gray-200 hover:border-red-200'
          }`}
        >
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Selling a property</h3>
          <p className="text-gray-600">Ready to list your property for sale</p>
          {formData.propertyIntent === 'selling' && (
            <div className="mt-4 flex items-center gap-2 text-red-400 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Selected
            </div>
          )}
        </button>
      </div>

      {errors.propertyIntent && (
        <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.propertyIntent}
        </p>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Step3ABuyerQuestions({ formData, setFormData, errors, onNext, onBack }: StepProps) {
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const filteredCities = ONTARIO_CITIES.filter(
    (city) =>
      city.toLowerCase().includes(citySearch.toLowerCase()) &&
      !formData.buyerQuestions!.preferredCities.includes(city)
  );

  const addCity = (city: string) => {
    if (formData.buyerQuestions!.preferredCities.length < 3) {
      setFormData((prev) => ({
        ...prev,
        buyerQuestions: {
          ...prev.buyerQuestions!,
          preferredCities: [...prev.buyerQuestions!.preferredCities, city],
        },
      }));
      setCitySearch('');
      setShowCityDropdown(false);
    }
  };

  const removeCity = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      buyerQuestions: {
        ...prev.buyerQuestions!,
        preferredCities: prev.buyerQuestions!.preferredCities.filter((c) => c !== city),
      },
    }));
  };

  const togglePropertyType = (type: string) => {
    const current = formData.buyerQuestions!.propertyTypes;
    setFormData((prev) => ({
      ...prev,
      buyerQuestions: {
        ...prev.buyerQuestions!,
        propertyTypes: current.includes(type)
          ? current.filter((t) => t !== type)
          : [...current, type],
      },
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your home search</h2>
      <p className="text-gray-600 mb-6">This helps us match you with the right agent.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Cities <span className="text-red-500">*</span>
            <span className="text-gray-500 font-normal ml-2">(Select up to 3)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setShowCityDropdown(true);
              }}
              onFocus={() => setShowCityDropdown(true)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
                errors.preferredCities ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Search for cities..."
              disabled={formData.buyerQuestions!.preferredCities.length >= 3}
            />
            {showCityDropdown && filteredCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCities.slice(0, 10).map((city) => (
                  <button
                    key={city}
                    onClick={() => addCity(city)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.buyerQuestions!.preferredCities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
              >
                {city}
                <button
                  onClick={() => removeCity(city)}
                  className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          {errors.preferredCities && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.preferredCities}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range <span className="text-red-500">*</span>
          </label>
          <div className="px-4 py-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span className="font-bold text-red-400">
                {formatCurrency(formData.buyerQuestions!.priceRange.min)}
              </span>
              <span className="font-bold text-red-400">
                {formatCurrency(formData.buyerQuestions!.priceRange.max)}
              </span>
            </div>
            <input
              type="range"
              min={200000}
              max={2000000}
              step={10000}
              value={formData.buyerQuestions!.priceRange.max}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  buyerQuestions: {
                    ...prev.buyerQuestions!,
                    priceRange: { ...prev.buyerQuestions!.priceRange, max: parseInt(e.target.value) },
                  },
                }))
              }
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Property Types <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => togglePropertyType(type)}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                  formData.buyerQuestions!.propertyTypes.includes(type)
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-700 hover:border-red-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {errors.propertyTypes && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.propertyTypes}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeline <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.buyerQuestions!.timeline}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                buyerQuestions: { ...prev.buyerQuestions!, timeline: e.target.value },
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
              errors.timeline ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select timeline</option>
            <option value="0-3">0-3 months</option>
            <option value="3-6">3-6 months</option>
            <option value="6-12">6-12 months</option>
            <option value="12+">12+ months</option>
          </select>
          {errors.timeline && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.timeline}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mortgage Pre-Approval Status <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {[
              { value: 'yes', label: 'Yes, I have pre-approval' },
              { value: 'in_progress', label: 'In progress' },
              { value: 'no', label: 'No, not yet' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="preApproval"
                  value={option.value}
                  checked={formData.buyerQuestions!.preApprovalStatus === option.value}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      buyerQuestions: {
                        ...prev.buyerQuestions!,
                        preApprovalStatus: e.target.value as any,
                      },
                    }))
                  }
                  className="w-4 h-4 text-red-400 focus:ring-red-400"
                />
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.preApprovalStatus && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.preApprovalStatus}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 border-2 border-yellow-300 bg-yellow-50 rounded-lg">
            <input
              type="checkbox"
              checked={formData.buyerQuestions!.hasCurrentAgent}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  buyerQuestions: { ...prev.buyerQuestions!, hasCurrentAgent: e.target.checked },
                }))
              }
              className="w-5 h-5 text-red-400 focus:ring-red-400"
            />
            <div>
              <div className="font-medium text-gray-900">I currently have a real estate agent</div>
              <div className="text-sm text-gray-600">
                Note: If you're under contract with an agent, matching may not be possible
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            value={formData.buyerQuestions!.additionalComments}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                buyerQuestions: { ...prev.buyerQuestions!, additionalComments: e.target.value },
              }))
            }
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 resize-none"
            placeholder="Any specific requirements or preferences..."
          />
          <div className="text-xs text-gray-500 text-right mt-1">
            {formData.buyerQuestions!.additionalComments?.length || 0} / 500
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Step3BSellerQuestions({ formData, setFormData, errors, onNext, onBack }: StepProps) {
  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseInt(num));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your property</h2>
      <p className="text-gray-600 mb-6">This helps us match you with the right agent.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Property Type <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {PROPERTY_TYPES.concat(['Other']).map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="propertyType"
                  value={type}
                  checked={formData.sellerQuestions!.propertyType === type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sellerQuestions: { ...prev.sellerQuestions!, propertyType: e.target.value },
                    }))
                  }
                  className="w-4 h-4 text-red-400 focus:ring-red-400"
                />
                <span className="text-gray-900">{type}</span>
              </label>
            ))}
          </div>
          {errors.propertyType && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.propertyType}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.sellerQuestions!.propertyLocation}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sellerQuestions: { ...prev.sellerQuestions!, propertyLocation: e.target.value },
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
              errors.propertyLocation ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="City, Province"
          />
          {errors.propertyLocation && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.propertyLocation}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Property Value <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formatCurrency(formData.sellerQuestions!.estimatedValue.toString())}
            onChange={(e) => {
              const num = e.target.value.replace(/\D/g, '');
              setFormData((prev) => ({
                ...prev,
                sellerQuestions: {
                  ...prev.sellerQuestions!,
                  estimatedValue: parseInt(num) || 0,
                },
              }))
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
              errors.estimatedValue ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="$500,000"
          />
          {errors.estimatedValue && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.estimatedValue}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Timeline <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.sellerQuestions!.sellingTimeline}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sellerQuestions: { ...prev.sellerQuestions!, sellingTimeline: e.target.value },
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
              errors.sellingTimeline ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select timeline</option>
            <option value="immediate">Immediately</option>
            <option value="1-3">1-3 months</option>
            <option value="3-6">3-6 months</option>
            <option value="6+">6+ months</option>
          </select>
          {errors.sellingTimeline && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.sellingTimeline}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Selling <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.sellerQuestions!.sellingReason}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sellerQuestions: { ...prev.sellerQuestions!, sellingReason: e.target.value },
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
              errors.sellingReason ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select reason</option>
            <option value="upsizing">Upsizing</option>
            <option value="downsizing">Downsizing</option>
            <option value="relocation">Relocation</option>
            <option value="investment">Investment property</option>
            <option value="other">Other</option>
          </select>
          {errors.sellingReason && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.sellingReason}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Condition <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.sellerQuestions!.propertyCondition}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sellerQuestions: { ...prev.sellerQuestions!, propertyCondition: e.target.value },
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 ${
              errors.propertyCondition ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select condition</option>
            <option value="excellent">Excellent - Move-in ready</option>
            <option value="good">Good - Minor updates needed</option>
            <option value="fair">Fair - Some renovations needed</option>
            <option value="needs-work">Needs significant work</option>
          </select>
          {errors.propertyCondition && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.propertyCondition}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Notes (Optional)
          </label>
          <textarea
            value={formData.sellerQuestions!.propertyNotes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sellerQuestions: { ...prev.sellerQuestions!, propertyNotes: e.target.value },
              }))
            }
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 resize-none"
            placeholder="Any additional details about your property..."
          />
          <div className="text-xs text-gray-500 text-right mt-1">
            {formData.sellerQuestions!.propertyNotes?.length || 0} / 500
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

interface Step4Props extends StepProps {
  onSubmit: () => void;
  goToStep: (step: number) => void;
}

function Step4Review({ formData, setFormData, errors, onSubmit, onBack, goToStep }: Step4Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Review your information</h2>
      <p className="text-gray-600 mb-6">Please review your details before submitting.</p>

      <div className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Contact Information</h3>
            <button
              onClick={() => goToStep(1)}
              className="text-red-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>{' '}
              <span className="text-gray-900 font-medium">
                {formData.aboutYou.firstName} {formData.aboutYou.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>{' '}
              <span className="text-gray-900 font-medium">{formData.aboutYou.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>{' '}
              <span className="text-gray-900 font-medium">{formData.aboutYou.phone}</span>
            </div>
            {formData.aboutYou.hasReferral && (
              <div>
                <span className="text-gray-600">Referral Code:</span>{' '}
                <span className="text-gray-900 font-medium">{formData.aboutYou.referralCode}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Property Intent</h3>
            <button
              onClick={() => goToStep(2)}
              className="text-red-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="text-sm">
            <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full font-medium">
              {formData.propertyIntent === 'buying' ? 'Buying a home' : 'Selling a property'}
            </span>
          </div>
        </div>

        {formData.propertyIntent === 'buying' && formData.buyerQuestions && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Buyer Requirements</h3>
              <button
                onClick={() => goToStep(3)}
                className="text-red-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Cities:</span>{' '}
                <span className="text-gray-900 font-medium">
                  {formData.buyerQuestions.preferredCities.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Price Range:</span>{' '}
                <span className="text-gray-900 font-medium">
                  {formatCurrency(formData.buyerQuestions.priceRange.min)} -{' '}
                  {formatCurrency(formData.buyerQuestions.priceRange.max)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Property Types:</span>{' '}
                <span className="text-gray-900 font-medium">
                  {formData.buyerQuestions.propertyTypes.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Timeline:</span>{' '}
                <span className="text-gray-900 font-medium">{formData.buyerQuestions.timeline} months</span>
              </div>
              <div>
                <span className="text-gray-600">Pre-Approval:</span>{' '}
                <span className="text-gray-900 font-medium">
                  {formData.buyerQuestions.preApprovalStatus === 'yes'
                    ? 'Yes'
                    : formData.buyerQuestions.preApprovalStatus === 'in_progress'
                    ? 'In Progress'
                    : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {formData.propertyIntent === 'selling' && formData.sellerQuestions && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Property Details</h3>
              <button
                onClick={() => goToStep(3)}
                className="text-red-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>{' '}
                <span className="text-gray-900 font-medium">{formData.sellerQuestions.propertyType}</span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>{' '}
                <span className="text-gray-900 font-medium">
                  {formData.sellerQuestions.propertyLocation}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Estimated Value:</span>{' '}
                <span className="text-gray-900 font-medium">
                  {formatCurrency(formData.sellerQuestions.estimatedValue)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Timeline:</span>{' '}
                <span className="text-gray-900 font-medium">
                  {formData.sellerQuestions.sellingTimeline}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Condition:</span>{' '}
                <span className="text-gray-900 font-medium">
                  {formData.sellerQuestions.propertyCondition}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-2 border-red-100 bg-red-50 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-4">Consent & Privacy</h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent.contactConsent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consent: { ...prev.consent, contactConsent: e.target.checked },
                  }))
                }
                className="w-5 h-5 text-red-400 focus:ring-red-400 mt-0.5"
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  I consent to being contacted <span className="text-red-500">*</span>
                </div>
                <div className="text-gray-600">
                  You agree to be contacted by matched real estate agents via phone or email.
                </div>
              </div>
            </label>
            {errors.contactConsent && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.contactConsent}
              </p>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent.sharingConsent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consent: { ...prev.consent, sharingConsent: e.target.checked },
                  }))
                }
                className="w-5 h-5 text-red-400 focus:ring-red-400 mt-0.5"
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  I consent to information sharing <span className="text-red-500">*</span>
                </div>
                <div className="text-gray-600">
                  Your information will be shared with carefully selected agents for matching purposes.
                </div>
              </div>
            </label>
            {errors.sharingConsent && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.sharingConsent}
              </p>
            )}
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg text-xs text-gray-600">
            <strong>Privacy Notice:</strong> Your information is secure and will only be shared with licensed
            real estate professionals. We will never sell your data to third parties.
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onSubmit}
          className="px-8 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium flex items-center gap-2"
        >
          Submit Request
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

interface Step5Props {
  onComplete: () => void;
}

function Step5Confirmation({ onComplete }: Step5Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
      <p className="text-gray-600 text-lg mb-8">
        Thank you for submitting your agent matching request. We're working on finding the perfect agent for
        you.
      </p>

      <div className="max-w-lg mx-auto text-left bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">What happens next?</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-red-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <div className="font-medium text-gray-900">Review (24-48 hours)</div>
              <div className="text-sm text-gray-600">
                Our team reviews your requirements and searches for suitable agents
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-red-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <div className="font-medium text-gray-900">Agent Match</div>
              <div className="text-sm text-gray-600">
                We'll match you with 1-3 qualified agents in your area
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-red-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <div className="font-medium text-gray-900">Initial Contact</div>
              <div className="text-sm text-gray-600">
                Agents will reach out to introduce themselves and discuss your needs
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-red-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <div className="font-medium text-gray-900">Choose Your Agent</div>
              <div className="text-sm text-gray-600">
                Interview agents and select the one that's the best fit
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
        <p>
          Questions? Contact us at{' '}
          <a href="mailto:support@hausee.ca" className="text-red-400 hover:text-red-500">
            support@hausee.ca
          </a>
        </p>
      </div>
    </div>
  );
}
