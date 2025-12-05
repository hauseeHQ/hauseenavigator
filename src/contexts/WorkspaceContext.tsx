import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Workspace } from '../types';
import { getUserWorkspaces, createWorkspace } from '../lib/workspaceApi';

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  switchWorkspace: (workspaceId: string) => void;
  refreshWorkspaces: () => Promise<void>;
  createNewWorkspace: (name: string) => Promise<{ success: boolean; error?: string }>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspaces = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: loadError } = await getUserWorkspaces(user.id);

    if (loadError) {
      setError(loadError);
      setIsLoading(false);
      return;
    }

    setWorkspaces(data || []);

    const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');

    if (savedWorkspaceId && data?.some(w => w.id === savedWorkspaceId)) {
      const workspace = data.find(w => w.id === savedWorkspaceId);
      setCurrentWorkspace(workspace || null);
    } else if (data && data.length > 0) {
      setCurrentWorkspace(data[0]);
      localStorage.setItem('currentWorkspaceId', data[0].id);
    } else {
      setCurrentWorkspace(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (userLoaded) {
      loadWorkspaces();
    }
  }, [userLoaded, user?.id]);

  const switchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      localStorage.setItem('currentWorkspaceId', workspaceId);
    }
  };

  const refreshWorkspaces = async () => {
    await loadWorkspaces();
  };

  const createNewWorkspace = async (name: string) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await createWorkspace(user.id, name);

    if (result.success && result.workspace) {
      await refreshWorkspaces();
      switchWorkspace(result.workspace.id);
    }

    return result;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        isLoading,
        error,
        switchWorkspace,
        refreshWorkspaces,
        createNewWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
