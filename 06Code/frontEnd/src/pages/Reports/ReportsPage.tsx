import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface TaxPayer {
  id: string;
  RUC?: string;
  ruc?: string;
  firstName: string;
  firstLastName?: string;
  lastName?: string;
  email: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [users, setUsers] = useState<TaxPayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/taxpayer/taxPayers`);
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Reporte de Contribuyentes', 14, 22);
    
    const tableColumn = ["Nombre", "Apellido", "RUC", "Correo", "Fecha Registro"];
    const tableRows: any[] = [];

    users.forEach(user => {
      const userData = [
        user.firstName || '',
        user.firstLastName || user.lastName || '',
        user.RUC || user.ruc || '',
        user.email || '',
        user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-EC') : '-'
      ];
      tableRows.push(userData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('reporte_contribuyentes.pdf');
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">Informe general de usuarios registrados en el sistema</p>

        <div className="flex justify-end mb-24">
          <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={isLoading || users.length === 0}>
            <Download size={16} /> Descargar PDF
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <FileText size={18} className="text-primary" />
              <h2 className="card-title">Lista de Contribuyentes</h2>
            </div>
            <span className="badge badge-info">{users.length} usuarios</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>RUC</th>
                  <th>Correo</th>
                  <th>Fecha Registro</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">Cargando reporte...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">No se encontraron datos.</td>
                  </tr>
                ) : users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.firstLastName || user.lastName}</td>
                    <td className="text-sm font-medium">{user.RUC || user.ruc}</td>
                    <td className="text-sm text-muted">{user.email}</td>
                    <td className="text-sm text-muted">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-EC') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
