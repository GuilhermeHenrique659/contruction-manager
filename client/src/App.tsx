import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
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
      <Navbar
        brand="ESTRUTURA"
        user={{ name: user.name }}
        onLogout={logout}
      />
      <main className="app-main">
        <Home />
      </main>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;