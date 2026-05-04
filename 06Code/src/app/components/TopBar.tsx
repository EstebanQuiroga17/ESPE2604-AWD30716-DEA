import { useState } from 'react';
import { Home, Building2, Settings, HelpCircle, LogOut, Bell, User, X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

interface TopBarProps {
  onLogout?: () => void;
  username?: string;
}

const quickNotifications = [
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Facturas Faltantes',
    message: '2 facturas del proveedor XYZ no han sido descargadas',
    time: 'Hace 1 hora',
    color: 'orange',
  },
  {
    type: 'error',
    icon: AlertCircle,
    title: 'Inconsistencia en ATS',
    message: 'La retención #001-001-000045 tiene un error de validación',
    time: 'Hace 3 horas',
    color: 'red',
  },
  {
    type: 'info',
    icon: Info,
    title: 'Recordatorio',
    message: 'El plazo para declarar el ATS vence el 30/11/2025',
    time: 'Hoy',
    color: 'blue',
  },
];

export function TopBar({ onLogout, username }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        {/* Left - Quick Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Inicio">
            <Home className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Empresas">
            <Building2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Configuración">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Ayuda">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        {/* Right - User Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button 
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm text-gray-900">{username || 'María González'}</p>
              <p className="text-xs text-gray-500">Contador</p>
            </div>
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-700" />
            </div>
          </div>
          
          {/* Logout */}
          <button 
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" 
            title="Cerrar sesión"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Modal de Notificaciones Rápidas */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notificaciones
            </DialogTitle>
            <DialogDescription>
              Tienes 2 notificaciones nuevas
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {quickNotifications.map((notification, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  notification.color === 'orange'
                    ? 'bg-orange-50 border-orange-200'
                    : notification.color === 'red'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex gap-3">
                  <notification.icon
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      notification.color === 'orange'
                        ? 'text-orange-600'
                        : notification.color === 'red'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-gray-900">{notification.title}</p>
                      <span className="text-xs text-gray-500 flex-shrink-0">{notification.time}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowNotifications(false)}
            >
              Cerrar
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                alert('Todas las notificaciones marcadas como leídas');
                setShowNotifications(false);
              }}
            >
              Marcar como leídas
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}