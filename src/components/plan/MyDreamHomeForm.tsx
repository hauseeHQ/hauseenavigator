import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { DreamHome, DreamHomeFormErrors, ONTARIO_CITIES } from '../../types';
import { saveDreamHome, loadDreamHome } from '../../lib/supabaseClient';
import DualRangeSlider from './DualRangeSlider';

const INITIAL_FORM_STATE: DreamHome = {
  constructionStatus: null,
  priceRange: {
    min: 400000,
    max: 800000,
  },
  preferredCities: [],
  bedrooms: null,
  bathrooms: null,
  maxCondoFees: null,
  backyard: null,
  timeline: null,
  notes: '',
  updatedAt: new Date().toISOString(),
};

const TEMP_USER_ID = 'temp-user-demo';

export default function MyDreamHomeForm() {
  const userId = TEMP_USER_ID;
  const [formData, setFormData] = useState<DreamHome>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<DreamHomeFormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const localData = localStorage.getItem(`hausee_dream_home_${userId}`);

      const { data: dbData } = await loadDreamHome(userId);

      if (dbData) {
        setFormData(dbData);
        setLastSaved(dbData.updatedAt);
      } else if (localData) {
        const parsed = JSON.parse(localData);
        setFormData(parsed);
        setLastSaved(parsed.updatedAt);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSave = useCallback(
    (data: DreamHome) => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      const timeout = setTimeout(async () => {
        setIsSaving(true);
        const updatedData = { ...data, updatedAt: new Date().toISOString() };

        localStorage.setItem(
          `hausee_dream_home_${userId}`,
          JSON.stringify(updatedData)
        );

        const result = await saveDreamHome(userId, updatedData);

        if (result.success) {
          setLastSaved(updatedData.updatedAt);
        }

        setIsSaving(false);
      }, 1000);

      setSaveTimeout(timeout);
    },
    [saveTimeout]
  );

  const updateField = <K extends keyof DreamHome>(
    field: K,
    value: DreamHome[K]
  ) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    debouncedSave(newData);

    if (errors[field as keyof DreamHomeFormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: DreamHomeFormErrors = {};

    if (!formData.constructionStatus) {
      newErrors.constructionStatus = 'Construction status is required';
    }

    if (!formData.timeline) {
      newErrors.timeline = 'Timeline to buy is required';
    }

    if (formData.preferredCities.length > 3) {
      newErrors.preferredCities = 'You can select up to 3 cities';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    updateField('priceRange', { min, max });
  };

  const addCity = (city: string) => {
    if (formData.preferredCities.length >= 3) {
      setErrors({ ...errors, preferredCities: 'You can select up to 3 cities' });
      return;
    }

    if (!formData.preferredCities.includes(city)) {
      updateField('preferredCities', [...formData.preferredCities, city]);
    }

    setCitySearch('');
    setShowCityDropdown(false);
  };

  const removeCity = (city: string) => {
    updateField(
      'preferredCities',
      formData.preferredCities.filter(c => c !== city)
    );
    if (errors.preferredCities) {
      setErrors({ ...errors, preferredCities: undefined });
    }
  };

  const filteredCities = ONTARIO_CITIES.filter(
    city =>
      city.toLowerCase().includes(citySearch.toLowerCase()) &&
      !formData.preferredCities.includes(city)
  );

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const date = new Date(lastSaved);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Dream Home</h2>
        {!formData.constructionStatus && !formData.timeline && (
          <p className="text-gray-600">Define your ideal home to guide your search</p>
        )}
        {lastSaved && (
          <p className="text-xs text-gray-400 mt-2">
            Autosaved locally • Prototype • {formatLastSaved()}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Construction Status <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updateField('constructionStatus', 'new')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                formData.constructionStatus === 'new'
                  ? 'border-primary-400 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              New Construction
            </button>
            <button
              type="button"
              onClick={() => updateField('constructionStatus', 'ready')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                formData.constructionStatus === 'ready'
                  ? 'border-primary-400 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              Ready to move in
            </button>
          </div>
          {errors.constructionStatus && (
            <p className="text-red-500 text-sm mt-1">{errors.constructionStatus}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range <span className="text-red-500">*</span>
          </label>
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-900 text-center">
              ${formData.priceRange.min.toLocaleString()} to ${formData.priceRange.max.toLocaleString()}
            </p>
          </div>
          <DualRangeSlider
            min={200000}
            max={2000000}
            step={10000}
            minValue={formData.priceRange.min}
            maxValue={formData.priceRange.max}
            onChange={handlePriceRangeChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Cities (max 3)
          </label>
          <div className="relative">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
              placeholder="Search for cities..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              disabled={formData.preferredCities.length >= 3}
            />
            {showCityDropdown && filteredCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => addCity(city)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          {formData.preferredCities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.preferredCities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {city}
                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="hover:bg-primary-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.preferredCities && (
            <p className="text-red-500 text-sm mt-1">{errors.preferredCities}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <select
              value={formData.bedrooms || ''}
              onChange={(e) => updateField('bedrooms', e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <select
              value={formData.bathrooms || ''}
              onChange={(e) => updateField('bathrooms', e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="1">1</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
              <option value="3.5">3.5</option>
              <option value="4+">4+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Condo/POTL Fees
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={formData.maxCondoFees || ''}
              onChange={(e) => updateField('maxCondoFees', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backyard
          </label>
          <div className="flex gap-3">
            {(['small', 'large', 'indifferent'] as const).map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="backyard"
                  value={option}
                  checked={formData.backyard === option}
                  onChange={(e) => updateField('backyard', e.target.value as DreamHome['backyard'])}
                  className="w-4 h-4 text-primary-400 border-gray-300 focus:ring-primary-400"
                />
                <span className="text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeline to Buy <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.timeline || ''}
            onChange={(e) => updateField('timeline', e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          >
            <option value="">Select...</option>
            <option value="0-6 months">0-6 months</option>
            <option value="6-12 months">6-12 months</option>
            <option value="12-24 months">12-24 months</option>
            <option value="2+ years">2+ years</option>
          </select>
          {errors.timeline && (
            <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                updateField('notes', e.target.value);
              }
            }}
            rows={4}
            placeholder="Add any additional preferences or requirements..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {formData.notes.length}/500 characters
          </p>
        </div>
      </div>
    </div>
  );
}
