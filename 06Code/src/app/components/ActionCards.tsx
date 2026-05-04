import { useState } from 'react';
import { Cloud, Download, FileSpreadsheet, FileCheck, CheckCircle, Calendar, Upload, FolderOpen, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

const actions = [
  {
    id: 'sri',
    icon: Cloud,
    title: 'Conectar con SRI',
    description: 'Portal web del SRI',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    hoverColor: 'hover:bg-indigo-100',
  },
  {
    id: 'download',
    icon: Download,
    title: 'Descargar Facturas',
    description: 'Automático desde SRI',
    color: 'purple',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    hoverColor: 'hover:bg-purple-100',
  },
  {
    id: 'xlsm',
    icon: FileSpreadsheet,
    title: 'Generar ATS XLSM',
    description: 'Archivo Excel Macro',
    color: 'blue',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    hoverColor: 'hover:bg-blue-100',
  },
  {
    id: 'xml',
    icon: FileCheck,
    title: 'Generar ATS XML',
    description: 'Listo para declarar',
    color: 'green',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    hoverColor: 'hover:bg-green-100',
  },
];

export function ActionCards() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActionClick = (actionId: string) => {
    setOpenModal(actionId);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setStartDate('');
    setEndDate('');
    setSelectedFolder(null);
    setIsProcessing(false);
  };

  const handleDownloadFacturas = () => {
    if (!startDate || !endDate) {
      alert('Por favor selecciona ambas fechas');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Facturas descargadas del ${startDate} al ${endDate}`);
      handleCloseModal();
    }, 1500);
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFolder(files[0].webkitRelativePath.split('/')[0] || 'Carpeta seleccionada');
    }
  };

  const handleGenerateXML = () => {
    if (!selectedFolder) {
      alert('Por favor selecciona una carpeta');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('ATS XML generado exitosamente');
      handleCloseModal();
    }, 1500);
  };

  const handleGenerateXLSM = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Mantener el modal abierto para mostrar mensaje de éxito
    }, 1000);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-4">Acciones Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className={`${action.bgColor} ${action.hoverColor} rounded-lg p-6 text-left transition-all hover:shadow-md group`}
            >
              <div className={`w-12 h-12 ${action.iconColor} bg-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal: Conectar con SRI */}
      <Dialog open={openModal === 'sri'} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar con SRI</DialogTitle>
            <DialogDescription>
              Conexión al portal web del Servicio de Rentas Internas
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-green-900 mb-2">¡Conectado exitosamente!</h3>
            <p className="text-gray-600 text-center">Tu conexión con el SRI está activa y funcionando correctamente</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCloseModal} className="bg-blue-600 hover:bg-blue-700">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Descargar Facturas */}
      <Dialog open={openModal === 'download'} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Descargar Facturas</DialogTitle>
            <DialogDescription>
              Selecciona el rango de fechas para descargar las facturas del SRI
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                Fecha Inicial
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                Fecha Final
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button 
              onClick={handleDownloadFacturas} 
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? 'Descargando...' : 'Descargar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Generar ATS XLSM */}
      <Dialog open={openModal === 'xlsm'} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generar ATS XLSM</DialogTitle>
            <DialogDescription>
              Generar archivo Excel con macros para el Anexo Transaccional Simplificado
            </DialogDescription>
          </DialogHeader>
          
          {!isProcessing && (
            <div className="py-4">
              <p className="text-gray-700 mb-4">
                Se generará el archivo ATS en formato XLSM con todas las transacciones del periodo fiscal actual.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900">
                  <strong>Periodo:</strong> Diciembre 2025
                </p>
                <p className="text-blue-900">
                  <strong>Facturas:</strong> 156 documentos
                </p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-green-900 mb-2">¡Creado con éxito!</h3>
              <p className="text-gray-600 text-center mb-1">El archivo ATS XLSM ha sido generado correctamente</p>
              <p className="text-gray-900 text-center">
                <strong>Guardado en:</strong>
              </p>
              <p className="text-blue-600 text-center break-all px-4">
                C:\Users\Usuario\Downloads\ATS_Diciembre_2025.xlsm
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            {!isProcessing && (
              <>
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleGenerateXLSM}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generar XLSM
                </Button>
              </>
            )}
            {isProcessing && (
              <Button onClick={handleCloseModal} className="bg-blue-600 hover:bg-blue-700">
                Cerrar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Generar ATS XML */}
      <Dialog open={openModal === 'xml'} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generar ATS XML</DialogTitle>
            <DialogDescription>
              Selecciona la carpeta con los archivos de facturas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              <input
                type="file"
                id="folder-upload"
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFolderSelect}
                className="hidden"
              />
              <label htmlFor="folder-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  {selectedFolder ? (
                    <>
                      <FolderOpen className="w-12 h-12 text-green-600 mb-3" />
                      <p className="text-green-900">{selectedFolder}</p>
                      <p className="text-green-600">Carpeta seleccionada</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-900 mb-1">Seleccionar carpeta</p>
                      <p className="text-gray-600">Haz clic para elegir la carpeta con facturas</p>
                    </>
                  )}
                </div>
              </label>
            </div>
            {selectedFolder && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-900">
                  La carpeta seleccionada será procesada para generar el archivo XML
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateXML}
              disabled={isProcessing || !selectedFolder}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? 'Generando...' : 'Generar XML'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
