import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getInvitationByToken, acceptInvitation } from '../lib/workspaceApi';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../contexts/AuthContext';
import { Workspace } from '../types';

export default function AcceptInvitationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { refreshWorkspaces, switchWorkspace } = useWorkspace();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    const loadInvitation = async () => {
      if (!token) {
        setError('Invalid invitation link');
        setIsLoading(false);
        return;
      }

      const { data, workspace: workspaceData, error: loadError } = await getInvitationByToken(token);

      if (loadError || !data || !workspaceData) {
        setError(loadError || 'Invalid invitation');
        setIsLoading(false);
        return;
      }

      setWorkspace(workspaceData);
      setIsLoading(false);
    };

    loadInvitation();
  }, [token, navigate]);

  const handleAccept = async () => {
    if (!token || !user?.id) return;

    setIsAccepting(true);
    setError('');

    const result = await acceptInvitation(token, user.id);

    if (result.success && result.workspaceId) {
      await refreshWorkspaces();
      switchWorkspace(result.workspaceId);
      setSuccess(true);
      setTimeout(() => {
        navigate('/plan');
      }, 2000);
    } else {
      setError(result.error || 'Failed to accept invitation');
      setIsAccepting(false);
    }
  };

  const handleDecline = () => {
    navigate('/plan');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Success!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You've joined the workspace. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Invalid Invitation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">{error}</p>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/plan')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Home className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Join Workspace
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You've been invited to collaborate on a home search
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {workspace && (
            <div className="mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Workspace</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{workspace.name}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                'Accept Invitation'
              )}
            </button>

            <button
              onClick={handleDecline}
              disabled={isAccepting}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
