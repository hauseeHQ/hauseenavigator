import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ToastContainer';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import Dashboard from './components/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import HomeDetailPage from './pages/HomeDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import WorkspaceSetupPage from './pages/WorkspaceSetupPage';
import AcceptInvitationPage from './pages/AcceptInvitationPage';
import WorkspaceSettingsPage from './pages/WorkspaceSettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/plan" replace />} />

            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route path="/workspace/setup" element={<WorkspaceSetupPage />} />
            <Route path="/workspace/accept" element={<AcceptInvitationPage />} />
            <Route path="/workspace/settings" element={<WorkspaceSettingsPage />} />

            <Route path="/plan" element={<Dashboard />} />
            <Route path="/evaluate" element={<Dashboard />} />
            <Route path="/evaluate/:homeId" element={<HomeDetailPage />} />
            <Route path="/select" element={<Dashboard />} />
            <Route path="/guide" element={<Dashboard />} />
            <Route path="/ai" element={<Dashboard />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </WorkspaceProvider>
    </BrowserRouter>
  );
}

export default App;
