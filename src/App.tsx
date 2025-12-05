import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ToastContainer';
import Dashboard from './components/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import HomeDetailPage from './pages/HomeDetailPage';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/plan" replace />} />

          <Route path="/plan" element={<Dashboard />} />
          <Route path="/evaluate" element={<Dashboard />} />
          <Route path="/evaluate/:homeId" element={<HomeDetailPage />} />
          <Route path="/select" element={<Dashboard />} />
          <Route path="/guide" element={<Dashboard />} />
          <Route path="/ai" element={<Dashboard />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
