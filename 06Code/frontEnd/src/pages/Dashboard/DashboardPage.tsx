
import { Link } from 'react-router-dom';
import {
  Download,
  FileSpreadsheet,
  FileCode2,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';

import { useWorkspace } from '../../context/WorkspaceContext';
import '../../styles/Dashboard.css';

interface ActionCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  path: string;
  color: string;
  status?: string;
  isExternal?: boolean;
}
const buildActionCards = (): ActionCard[] => [
  {
    id: 'download-invoices',
    icon: <Download size={28} />,
    title: 'Descargar Facturas',
    subtitle: 'SRI En Línea',
    path: 'https://chromewebstore.google.com/search/SRI%20En%20L%C3%ADnea',
    color: 'purple',
    isExternal: true,
  },
  {
    id: 'generate-xlsm',
    icon: <FileSpreadsheet size={28} />,
    title: 'Generar ATS XLSM',
    subtitle: 'Archivo Excel Macro',
    path: '/ats/generate',
    color: 'indigo',
  },
  {
    id: 'generate-xml',
    icon: <FileCode2 size={28} />,
    title: 'Generar ATS XML',
    subtitle: 'Listo para declarar',
    path: '/ats/export',
    color: 'teal',
  },
];


export default function DashboardPage() {
  const { currentWorkspace } = useWorkspace();
  const actionCards = buildActionCards();

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Bienvenido a ATS Express</h1>
        <p className="page-subtitle">
          {currentWorkspace && (
            <>Workspace: <strong>{currentWorkspace.name}</strong> - </>
          )}
          Automatiza la descarga de facturas del SRI y genera tu Anexo Transaccional Simplificado
        </p>

        <section className="card mb-24">
          <div className="card-header">
            <h2 className="card-title">Acciones Principales</h2>
          </div>
          <div className="card-body">
            <div className="action-cards-grid">
              {actionCards.map((action) => (
                action.isExternal ? (
                  <a
                    key={action.id}
                    id={action.id}
                    href={action.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`action-card action-card-${action.color}`}
                  >
                    <div className={`action-card-icon action-icon-${action.color}`}>
                      {action.icon}
                    </div>
                    <p className="action-card-title">{action.title}</p>
                    <p className="action-card-subtitle">{action.subtitle}</p>
                    {action.status && (
                      <span className="badge badge-success action-card-badge">{action.status}</span>
                    )}
                  </a>
                ) : (
                  <Link
                    key={action.id}
                    id={action.id}
                    to={action.path}
                    className={`action-card action-card-${action.color}`}
                  >
                    <div className={`action-card-icon action-icon-${action.color}`}>
                      {action.icon}
                    </div>
                    <p className="action-card-title">{action.title}</p>
                    <p className="action-card-subtitle">{action.subtitle}</p>
                    {action.status && (
                      <span className="badge badge-success action-card-badge">{action.status}</span>
                    )}
                  </Link>
                )
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
