import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ToastContainer';
import { SupabaseProvider } from './contexts/SupabaseProvider';
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
      <SupabaseProvider>
        <WorkspaceProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/signin" replace />} />

              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              <Route
                path="/workspace/setup"
                element={
                  <ProtectedRoute>
                    <WorkspaceSetupPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/workspace/accept"
                element={
                  <ProtectedRoute>
                    <AcceptInvitationPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/workspace/settings"
                element={
                  <ProtectedRoute>
                    <WorkspaceSettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/plan"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/evaluate"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/evaluate/:homeId"
                element={
                  <ProtectedRoute>
                    <HomeDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/select"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/guide"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ai"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </WorkspaceProvider>
      </SupabaseProvider>
    </BrowserRouter>
  );
}

export default App;
