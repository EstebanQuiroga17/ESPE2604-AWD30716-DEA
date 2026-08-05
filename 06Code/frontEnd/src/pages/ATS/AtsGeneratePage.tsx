import { useState } from 'react';
import { FileSpreadsheet, Play, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

import type { AtsFile } from '../../types';
import '../../styles/AtsModule.css';

const BUSINESS_SERVICE_URL = import.meta.env.VITE_BUSINESS_SERVICE_DEPLOY_URL || import.meta.env.VITE_BUSINESS_SERVICE_DEV_URL;

type GenerationStatus = 'idle' | 'processing' | 'done' | 'error';

const MockInvoices: any[] = [];
const MockAtsFiles: any[] = [];

export default function AtsGeneratePage() {
  const { currentUser } = useAuth();
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [generatedFile, setGeneratedFile] = useState<AtsFile | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!currentUser) return;
    setGenerationStatus('processing');
    setProgress(30);

    try {
      const response = await axios.get(`${BUSINESS_SERVICE_URL}/ats/user/${currentUser.id}/export-csv`, {
        responseType: 'blob'
      });
      setProgress(80);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices_${currentUser.id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setProgress(100);
      setGeneratedFile({
        id: 'generated',
        name: `invoices_${currentUser.id}.csv`,
        period: { type: 'monthly', month: 11, year: 2025 },
        invoiceCount: MockInvoices.length,
        validationErrors: 0,
        createdAt: new Date().toISOString(),
        downloadUrl: url,
        taxpayerId: currentUser.id
      });
      setGenerationStatus('done');
    } catch (error) {
      console.error('Error generating CSV:', error);
      setGenerationStatus('error');
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Generar ATS en Formato CSV</h1>
        <p className="page-subtitle">
          Crea automáticamente el Anexo Transaccional Simplificado en formato CSV a partir de las facturas cargadas
        </p>

        <div className="ats-layout">
          <div className="ats-main">
            <div className="card mb-24">
              <div className="card-header">
                <div className="flex items-center gap-8">
                  <FileSpreadsheet size={18} className="text-primary" />
                  <h2 className="card-title">Estado de Generación</h2>
                </div>
                {generationStatus === 'done' && <span className="badge badge-success">Completado</span>}
                {generationStatus === 'processing' && <span className="badge badge-warning">Procesando</span>}
              </div>
              <div className="card-body">
                {generationStatus === 'idle' && (
                  <div className="generation-idle">
                    <div className="generation-idle-icon">
                      <FileSpreadsheet size={40} />
                    </div>
                    <h3>Listo para generar</h3>
                    <p className="text-muted">
                      Se procesarán {MockInvoices.length} facturas validadas del directorio cargado.
                      El sistema verificará que todas pertenezcan a tu RUC único.
                    </p>
                    <div className="generation-info-grid">
                      <div className="generation-info-item">
                        <span className="generation-info-value">{MockInvoices.length}</span>
                        <span className="generation-info-label">Facturas a procesar</span>
                      </div>
                      <div className="generation-info-item">
                        <span className="generation-info-value">Noviembre 2025</span>
                        <span className="generation-info-label">Período tributario</span>
                      </div>
                      <div className="generation-info-item">
                        <span className="generation-info-value">{'< 5s'}</span>
                        <span className="generation-info-label">Tiempo estimado</span>
                      </div>
                    </div>
                    <button
                      id="generate-xlsm-btn"
                      className="btn btn-primary"
                      onClick={handleGenerate}
                    >
                      <Play size={16} />Generar ATS CSV
                    </button>
                  </div>
                )}

                {generationStatus === 'processing' && (
                  <div className="generation-processing">
                    <div className="processing-animation">
                      <FileSpreadsheet size={36} />
                    </div>
                    <h3>Generando ATS CSV...</h3>
                    <p className="text-muted">Extrayendo facturas de la base de datos</p>
                    <div className="processing-progress">
                      <div className="flex justify-between mb-8">
                        <span className="text-sm text-muted">Progreso</span>
                        <span className="text-sm font-semibold">{progress}%</span>
                      </div>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-muted mt-8">
                        {progress < 40 ? 'Obteniendo comprobantes...' : progress < 70 ? 'Generando CSV...' : 'Descargando archivo...'}
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === 'done' && generatedFile && (
                  <div className="generation-done">
                    <div className="done-icon">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3>¡ATS CSV generado exitosamente!</h3>
                    <p className="text-muted">
                      El archivo ha sido creado con {generatedFile.invoiceCount} facturas en {generatedFile.validationErrors} errores detectados.
                    </p>
                    <div className="done-file-card">
                      <FileSpreadsheet size={24} className="text-success" />
                      <div>
                        <p className="font-semibold">{generatedFile.name}</p>
                        <p className="text-sm text-muted">
                          {generatedFile.invoiceCount} facturas · Creado: {new Date(generatedFile.createdAt).toLocaleDateString('es-EC')}
                        </p>
                      </div>
                      <a href={generatedFile.downloadUrl} className="btn btn-success btn-sm" id="download-xlsm-btn">
                        <Download size={14} />Descargar
                      </a>
                    </div>
                    {generatedFile.validationErrors > 0 && (
                      <div className="alert alert-warning mt-16">
                        <AlertCircle size={16} />
                        <span>{generatedFile.validationErrors} advertencias detectadas. Se recomienda validar el CSV antes de enviarlo.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2 className="card-title">Historial de ATS Generados</h2></div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Archivo</th>
                      <th>Período</th>
                      <th>Facturas</th>
                      <th>Errores</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MockAtsFiles.map((file: any) => (
                      <tr key={file.id}>
                        <td>
                          <div className="flex items-center gap-8">
                            <FileSpreadsheet size={16} className="text-muted" />
                            <span className="font-medium text-sm">{file.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info">
                            {file.period.type === 'monthly'
                              ? `Mes ${file.period.month}/${file.period.year}`
                              : `S${file.period.semester} ${file.period.year}`}
                          </span>
                        </td>
                        <td className="text-sm">{file.invoiceCount}</td>
                        <td>
                          <span className={`badge ${file.validationErrors === 0 ? 'badge-success' : 'badge-warning'}`}>
                            {file.validationErrors === 0 ? 'Sin errores' : `${file.validationErrors} errores`}
                          </span>
                        </td>
                        <td className="text-sm text-muted">{new Date(file.createdAt).toLocaleDateString('es-EC')}</td>
                        <td>
                          <a href={file.downloadUrl} className="btn btn-ghost btn-sm">
                            <Download size={14} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="ats-sidebar">
            <div className="card mb-16">
              <div className="card-header"><h3 className="card-title">Requisitos previos</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { done: true, label: 'Conectado con SRI' },
                  { done: true, label: 'Facturas descargadas' },
                  { done: true, label: 'Directorio cargado y validado' },
                  { done: generationStatus === 'done', label: 'ATS CSV generado' },
                ].map((req) => (
                  <div key={req.label} className="requirement-item">
                    {req.done
                      ? <CheckCircle2 size={18} className="text-success" />
                      : <Clock size={18} className="text-muted" />}
                    <span className={`text-sm ${req.done ? 'text-success font-medium' : 'text-muted'}`}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3 className="card-title">Información del proceso</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { label: 'Formato de salida', value: 'CSV (Valores separados por comas)' },
                  { label: 'Validación', value: 'Campos RN-03' },
                  { label: 'Singularidad', value: 'Un solo RUC (RN-02)' },
                  { label: 'Tiempo máximo', value: '5 segundos (RNF-03)' },
                ].map((info) => (
                  <div key={info.label} className="info-detail-row">
                    <span className="text-sm text-muted">{info.label}</span>
                    <span className="text-sm font-medium">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
