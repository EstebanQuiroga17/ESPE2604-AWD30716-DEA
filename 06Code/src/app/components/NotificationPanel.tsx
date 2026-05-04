import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

const notifications = [
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

// Notificaciones adicionales para el modal completo
const allNotifications = [
  ...notifications,
  {
    type: 'info',
    icon: Info,
    title: 'Actualización Disponible',
    message: 'Nueva versión del sistema ATS Express disponible',
    time: 'Ayer',
    color: 'blue',
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Certificado Digital',
    message: 'Tu certificado digital vence en 30 días',
    time: 'Hace 2 días',
    color: 'orange',
  },
  {
    type: 'info',
    icon: Info,
    title: 'Sincronización Completada',
    message: 'Se han descargado 45 facturas nuevas del SRI',
    time: 'Hace 3 días',
    color: 'blue',
  },
];

export function NotificationPanel() {
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Notificaciones</h3>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            2 nuevas
          </span>
        </div>
        
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
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
                  <p className="text-sm text-gray-900 mb-1">{notification.title}</p>
                  <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setShowAllNotifications(true)}
          className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 py-2 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Ver todas las notificaciones
        </button>
      </div>

      {/* Modal de Todas las Notificaciones */}
      <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Todas las Notificaciones</DialogTitle>
            <DialogDescription>
              Historial completo de notificaciones del sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {allNotifications.map((notification, index) => (
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
              onClick={() => setShowAllNotifications(false)}
            >
              Cerrar
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                alert('Todas las notificaciones marcadas como leídas');
                setShowAllNotifications(false);
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