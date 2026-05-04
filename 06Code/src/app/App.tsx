import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ActionCards } from './components/ActionCards';
import { StatsCards } from './components/StatsCards';
import { SRIStatus } from './components/SRIStatus';
import { NotificationPanel } from './components/NotificationPanel';
import { Login } from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Mostrar pantalla de login si no está autenticado
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar onLogout={handleLogout} username={currentUser || undefined} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div>
              <h1 className="text-gray-900 mb-1">Bienvenido a ATS Express</h1>
              <p className="text-gray-600">Automatiza la descarga de facturas del SRI y genera tu Anexo Transaccional Simplificado</p>
            </div>
            
            {/* Action Cards - Main CTAs */}
            <ActionCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Cards - Main Area */}
              <div className="lg:col-span-2">
                <StatsCards />
              </div>
              
              {/* Right Panel - Status & Notifications */}
              <div className="space-y-6">
                <SRIStatus />
                <NotificationPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}