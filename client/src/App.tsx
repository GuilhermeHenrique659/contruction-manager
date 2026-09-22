import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { ProjectItemList } from './components/pages/ProjectItemList/ProjectItemList';
import { Navbar } from './components/organisms/Navbar';
import { useAuth } from './hooks/useAuth';
import './App.css';

function AppContent() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="app-loading" role="status" aria-label="Carregando">
        <div className="spinner" aria-hidden="true" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <Navbar brand="ESTRUTURA" user={{ name: user.name }} onLogout={logout} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppContent />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:projectId/itens" element={<ProjectItemList />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
