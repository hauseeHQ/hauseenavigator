import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Loader2 } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';

export default function WorkspaceSetupPage() {
  const navigate = useNavigate();
  const { createNewWorkspace } = useWorkspace();
  const [workspaceName, setWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!workspaceName.trim()) {
      setError('Please enter a workspace name');
      return;
    }

    setIsCreating(true);

    const result = await createNewWorkspace(workspaceName.trim());

    if (result.success) {
      navigate('/plan');
    } else {
      setError(result.error || 'Failed to create workspace');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Home className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create Your Workspace
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Set up your home buying workspace to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleCreateWorkspace} className="space-y-6">
            <div>
              <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700">
                Workspace Name
              </label>
              <input
                type="text"
                id="workspaceName"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600`}
                placeholder="My Home Search"
                autoFocus
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              <p className="mt-2 text-sm text-gray-500">
                You can invite co-buyers to collaborate on your home search later.
              </p>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating workspace...
                </>
              ) : (
                'Create Workspace'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
