import { useState, useEffect } from 'react';
import { Users, FileText, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import axios from 'axios';
import '../../styles/Dashboard.css';
import '../../styles/AdminDashboard.css';

const BUSINESS_SERVICE_URL = import.meta.env.VITE_BUSINESS_SERVICE_DEPLOY_URL || import.meta.env.VITE_BUSINESS_SERVICE_DEV_URL;

interface AdminStat {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  color: string;
}

interface Notification {
  title: string;
  message: string;
  time: string;
  type: string;
}

export default function AdminDashboardPage() {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [ticketsCount, setTicketsCount] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, ticketsRes, auditRes] = await Promise.all([
          axios.get(`${BUSINESS_SERVICE_URL}/admin/users`).catch(() => ({ data: { data: [] } })),
          axios.get(`${BUSINESS_SERVICE_URL}/admin/tickets`).catch(() => ({ data: { data: [] } })),
          axios.get(`${BUSINESS_SERVICE_URL}/admin/audit`).catch(() => ({ data: { data: [] } }))
        ]);

        const fetchedUsers = Array.isArray(usersRes.data?.data) ? usersRes.data.data.length : 0;
        const fetchedTickets = Array.isArray(ticketsRes.data?.data) ? ticketsRes.data.data.length : 0;

        let fetchedAudits: Notification[] = [];
        if (Array.isArray(auditRes.data?.data) && auditRes.data.data.length > 0) {
          fetchedAudits = auditRes.data.data.slice(0, 4).map((log: any) => ({
            title: log.action || 'Actividad de sistema',
            message: log.details || 'Evento registrado',
            time: log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'Reciente',
            type: 'info'
          }));
        } else {
          fetchedAudits = [
            { title: 'Nuevo usuario registrado', message: 'test2@test.com se unió a la plataforma', time: 'Hace 5 min', type: 'info' },
            { title: 'Generación ATS completada', message: 'Empresa A completó su anexo exitosamente', time: 'Hace 1 hora', type: 'success' },
            { title: 'Alerta de sistema', message: 'Se detectó latencia en el servidor SRI', time: 'Hace 3 horas', type: 'warning' },
            { title: 'Error de descarga', message: 'Falló la descarga masiva para el usuario admin', time: 'Ayer', type: 'error' }
          ];
        }

        setUsersCount(fetchedUsers);
        setTicketsCount(fetchedTickets);
        setAuditLogs(fetchedAudits);
      } catch (error) {
        setAuditLogs([
          { title: 'Nuevo usuario registrado', message: 'test2@test.com se unió a la plataforma', time: 'Hace 5 min', type: 'info' },
          { title: 'Generación ATS completada', message: 'Empresa A completó su anexo exitosamente', time: 'Hace 1 hora', type: 'success' },
          { title: 'Alerta de sistema', message: 'Se detectó latencia en el servidor SRI', time: 'Hace 3 horas', type: 'warning' },
          { title: 'Error de descarga', message: 'Falló la descarga masiva para el usuario admin', time: 'Ayer', type: 'error' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const adminStats: AdminStat[] = [
    { icon: <Users size={24} />, value: isLoading ? '...' : usersCount.toString(), label: 'Usuarios activos', change: 'Total registrados', color: 'blue' },
    { icon: <FileText size={24} />, value: '1,247', label: 'Facturas procesadas', change: '+12% vs mes anterior', color: 'green' },
    { icon: <AlertTriangle size={24} />, value: isLoading ? '...' : ticketsCount.toString(), label: 'Errores reportados', change: 'Tickets totales', color: 'orange' },
    { icon: <TrendingUp size={24} />, value: '99.8%', label: 'Disponibilidad del sistema', change: 'Último mes', color: 'purple' },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="admin-header-badge">
          <Shield size={16} />
          <span>Panel de Administración</span>
        </div>
        <h1 className="page-title">Dashboard Administrativo</h1>
        <p className="page-subtitle">Monitoreo general del sistema ATS Express y gestión de usuarios</p>

        <div className="admin-stats-grid mb-24">
          {adminStats.map((stat) => (
            <div key={stat.label} className={`admin-stat-card admin-stat-${stat.color}`}>
              <div className={`admin-stat-icon admin-stat-icon-${stat.color}`}>
                {stat.icon}
              </div>
              <div className="admin-stat-body">
                <span className="admin-stat-value">{stat.value}</span>
                <span className="admin-stat-label">{stat.label}</span>
                <span className="admin-stat-change">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Estado de Módulos</h2>
              <span className="badge badge-success">Todo operativo</span>
            </div>
            <div className="card-body flex flex-col gap-12">
              {[
                { name: 'Autenticación', status: 'ok', uptime: '100%' },
                { name: 'Integración SRI', status: 'ok', uptime: '99.8%' },
                { name: 'Descarga facturas', status: 'ok', uptime: '99.9%' },
                { name: 'Generación ATS', status: 'warning', uptime: '98.5%' },
                { name: 'Exportación XML', status: 'ok', uptime: '100%' },
                { name: 'Trazabilidad', status: 'ok', uptime: '100%' },
              ].map((module) => (
                <div key={module.name} className="module-status-row">
                  <div className="flex items-center gap-8">
                    <span className={`status-dot status-dot-${module.status === 'ok' ? 'success' : 'warning'}`} />
                    <span className="text-sm font-medium">{module.name}</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-xs text-muted">{module.uptime}</span>
                    <span className={`badge ${module.status === 'ok' ? 'badge-success' : 'badge-warning'}`}>
                      {module.status === 'ok' ? 'Operativo' : 'Alerta'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Reportes Rápidos (Actividad)</h2>
            </div>
            <div className="card-body">
              <div className="notification-feed">
                {auditLogs.map((notif, index) => (
                  <div key={index} className="notification-feed-item">
                    <div className={`notif-icon-wrapper notif-${notif.type}`}>
                      <AlertTriangle size={16} />
                    </div>
                    <div className="notif-content">
                      <p className="notif-title">{notif.title}</p>
                      <p className="notif-message">{notif.message}</p>
                      <span className="notif-time">{notif.time}</span>
                    </div>
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
