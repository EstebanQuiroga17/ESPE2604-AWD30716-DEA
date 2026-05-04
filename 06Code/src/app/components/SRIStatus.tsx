import { useState } from 'react';
import { Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

export function SRIStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastSync, setLastSync] = useState('Hace 15 minutos');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    
    // Simular sincronización
    setTimeout(() => {
      setIsSyncing(false);
      setShowSyncModal(true);
      setLastSync('Justo ahora');
      setIsConnected(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowSyncModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gray-700" />
          <h3 className="text-gray-900">Estado de Conexión SRI</h3>
        </div>
        
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="text-sm text-gray-900">Estado</span>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full ${
              isConnected 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          
          {/* Last Sync */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-900">Última sincronización</span>
            </div>
            <span className="text-sm text-gray-600">{lastSync}</span>
          </div>
          
          {/* Sync Button */}
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
          </button>
        </div>
      </div>

      {/* Modal de Sincronización Exitosa */}
      <Dialog open={showSyncModal} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sincronización Completada</DialogTitle>
            <DialogDescription>
              Conexión actualizada con el portal del SRI
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-green-900 mb-2">¡Sincronizado exitosamente!</h3>
            <p className="text-gray-600 text-center">
              Tu conexión con el SRI ha sido actualizada correctamente
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCloseModal} className="bg-blue-600 hover:bg-blue-700">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}