import { useState } from 'react';
import AgentMatchingForm from '../components/select/AgentMatchingForm';

export default function SelectTab() {
  const [showForm, setShowForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (showForm) {
    return (
      <AgentMatchingForm
        onComplete={() => {
          setShowForm(false);
          setHasSubmitted(true);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Real Estate Agent</h2>
        <p className="text-gray-600 mb-8">
          Get matched with experienced agents who understand your needs and the local market.
        </p>

        {hasSubmitted ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-green-900 mb-2">Request Already Submitted</h3>
            <p className="text-green-700">
              We're currently processing your agent matching request. You'll hear from us within 24-48
              hours.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏡</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Personalized Matching</h3>
                <p className="text-gray-600">
                  We match you with agents based on your specific needs, location, and property type.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Vetted Professionals</h3>
                <p className="text-gray-600">
                  All agents in our network are licensed, experienced, and have proven track records.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">No Obligation</h3>
                <p className="text-gray-600">
                  Meet with agents and choose the one that's right for you. No pressure, no commitment.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowForm(true)}
          disabled={hasSubmitted}
          className="w-full md:w-auto px-8 py-4 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasSubmitted ? 'Request Already Submitted' : 'Start Agent Matching'}
        </button>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary-400 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                1
              </div>
              <div className="font-medium text-gray-900">Fill Out Form</div>
              <div className="text-gray-600 text-xs">5-minute questionnaire</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary-400 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                2
              </div>
              <div className="font-medium text-gray-900">We Match</div>
              <div className="text-gray-600 text-xs">24-48 hour turnaround</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary-400 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                3
              </div>
              <div className="font-medium text-gray-900">Meet Agents</div>
              <div className="text-gray-600 text-xs">Interview your matches</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary-400 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                4
              </div>
              <div className="font-medium text-gray-900">Choose</div>
              <div className="text-gray-600 text-xs">Select your agent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
