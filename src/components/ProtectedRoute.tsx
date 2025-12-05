import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const { currentWorkspace, isLoading: workspaceLoading, workspaces } = useWorkspace();
  const location = useLocation();

  if (!userLoaded || workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const isWorkspaceSetupRoute = location.pathname === '/workspace/setup';
  const isAcceptInviteRoute = location.pathname === '/workspace/accept';

  if (!isWorkspaceSetupRoute && !isAcceptInviteRoute && workspaces.length === 0) {
    return <Navigate to="/workspace/setup" replace />;
  }

  if (!isWorkspaceSetupRoute && !isAcceptInviteRoute && !currentWorkspace) {
    return <Navigate to="/workspace/setup" replace />;
  }

  return <>{children}</>;
}
