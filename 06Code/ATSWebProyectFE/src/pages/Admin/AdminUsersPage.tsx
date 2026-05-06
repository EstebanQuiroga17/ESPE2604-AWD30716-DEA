import { useState, useEffect } from 'react';
import { Users, Search, Edit2, Trash2, Plus, Shield, UserCheck, X, AlertCircle } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import type { User } from '../../types';
import axios from 'axios';
import '../../styles/AdminUsers.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [formData, setFormData] = useState({
    ruc: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);
    
    if (!formData.ruc || !formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setModalError('Todos los campos son obligatorios');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/register`, formData);
      if (response.data.success) {
        // Add new user to the top of the list
        setUsers([response.data.data, ...users]);
        setIsModalOpen(false);
        setFormData({ ruc: '', firstName: '', lastName: '', email: '', password: '' });
      }
    } catch (error: any) {
      setModalError(error.response?.data?.message || 'Error al crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.ruc.includes(searchQuery) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Gestión de Usuarios</h1>
        <p className="page-subtitle">Administra los usuarios registrados en la plataforma ATS Express</p>

        <div className="users-toolbar mb-24">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              id="user-search"
              type="text"
              className="form-input search-input"
              placeholder="Buscar por nombre, RUC o correo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button id="add-user-btn" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />Agregar Usuario
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <Users size={18} className="text-primary" />
              <h2 className="card-title">Usuarios registrados</h2>
            </div>
            <span className="badge badge-info">{filteredUsers.length} usuarios</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>RUC</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Fecha registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">Cargando usuarios...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">No se encontraron usuarios.</td>
                  </tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-10">
                        <div className="user-row-avatar">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm font-medium">{user.ruc}</td>
                    <td className="text-sm text-muted">{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                        {user.role === 'admin' ? <><Shield size={12} />Admin</> : <><UserCheck size={12} />Contador</>}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{new Date(user.createdAt).toLocaleDateString('es-EC')}</td>
                    <td>
                      <div className="flex gap-4">
                        <button className="btn btn-ghost btn-sm" aria-label="Editar usuario">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm text-danger" aria-label="Eliminar usuario">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal para Crear Usuario */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in" style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Registrar Nuevo Usuario</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="modal-body">
                {modalError && (
                  <div className="alert alert-danger mb-16 py-8">
                    <AlertCircle size={14} />
                    <span className="text-sm">{modalError}</span>
                  </div>
                )}
                <div className="grid-2 mb-16">
                  <div className="form-group">
                    <label className="form-label text-sm">Nombres</label>
                    <input type="text" className="form-input" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-sm">Apellidos</label>
                    <input type="text" className="form-input" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group mb-16">
                  <label className="form-label text-sm">Número de RUC</label>
                  <input type="text" className="form-input" maxLength={13} value={formData.ruc} onChange={e => setFormData({...formData, ruc: e.target.value})} required />
                </div>
                <div className="form-group mb-16">
                  <label className="form-label text-sm">Correo Electrónico</label>
                  <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group mb-24">
                  <label className="form-label text-sm">Contraseña Temporal</label>
                  <input type="text" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Mínimo 8 caracteres" required />
                </div>
                <div className="flex gap-12 justify-end">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
