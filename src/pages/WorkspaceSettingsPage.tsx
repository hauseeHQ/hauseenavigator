import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Copy, CheckCircle, Users, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { createInvitation, getWorkspaceMembers, updateWorkspaceName } from '../lib/workspaceApi';
import { WorkspaceMember } from '../types';

const MOCK_USER_ID = 'test-user-123';

export default function WorkspaceSettingsPage() {
  const navigate = useNavigate();
  const { currentWorkspace, workspaces, switchWorkspace, refreshWorkspaces } = useWorkspace();

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitationLink, setInvitationLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [workspaceName, setWorkspaceName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentWorkspace) {
      setWorkspaceName(currentWorkspace.name);
      loadMembers();
    }
  }, [currentWorkspace]);

  const loadMembers = async () => {
    if (!currentWorkspace) return;

    setIsLoadingMembers(true);
    const { data } = await getWorkspaceMembers(currentWorkspace.id);
    setMembers(data || []);
    setIsLoadingMembers(false);
  };

  const handleGenerateInvitation = async () => {
    if (!currentWorkspace) return;

    setIsGeneratingLink(true);
    setError('');

    const result = await createInvitation(currentWorkspace.id, MOCK_USER_ID);

    if (result.success && result.invitation) {
      const link = `${window.location.origin}/workspace/accept?token=${result.invitation.invitationToken}`;
      setInvitationLink(link);
    } else {
      setError(result.error || 'Failed to generate invitation');
    }

    setIsGeneratingLink(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveWorkspaceName = async () => {
    if (!currentWorkspace || !workspaceName.trim()) return;

    setIsSavingName(true);
    setError('');

    const result = await updateWorkspaceName(currentWorkspace.id, workspaceName.trim());

    if (result.success) {
      await refreshWorkspaces();
      setIsEditingName(false);
    } else {
      setError(result.error || 'Failed to update workspace name');
    }

    setIsSavingName(false);
  };

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Workspace Settings</h1>
          </div>
          <button
            onClick={() => navigate('/plan')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Workspace Name</h2>
            {isEditingName ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveWorkspaceName}
                    disabled={isSavingName || !workspaceName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSavingName ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setWorkspaceName(currentWorkspace.name);
                      setIsEditingName(false);
                    }}
                    disabled={isSavingName}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-lg text-gray-700">{currentWorkspace.name}</p>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {workspaces.length > 1 && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Switch Workspace</h2>
              <div className="space-y-2">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => switchWorkspace(workspace.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border ${
                      workspace.id === currentWorkspace.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {workspace.name}
                    {workspace.id === currentWorkspace.id && (
                      <span className="ml-2 text-sm text-blue-600">(Current)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-gray-700 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Members</h2>
            </div>

            {isLoadingMembers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.userId}
                        {member.userId === MOCK_USER_ID && (
                          <span className="ml-2 text-xs text-gray-500">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <LinkIcon className="w-5 h-5 text-gray-700 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Invite Co-Buyer</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Generate an invitation link to invite someone to collaborate on this workspace.
            </p>

            {invitationLink ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={invitationLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  This link will expire in 7 days and can only be used once.
                </p>
                <button
                  onClick={handleGenerateInvitation}
                  disabled={isGeneratingLink}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Generate new link
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerateInvitation}
                disabled={isGeneratingLink}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGeneratingLink ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating link...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5" />
                    Generate Invitation Link
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
