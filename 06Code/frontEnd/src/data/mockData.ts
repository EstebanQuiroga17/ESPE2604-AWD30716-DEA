import type { TaxPayer, Invoice, AtsFile, ProcessStep, Workspace } from '../types';


export const MockUserData: TaxPayer = {
  id: 'u001',
  RUC: '1234567890001',
  firstName: 'David',
  firstLastName: 'Rodriguez',
  email: 'david2626714@gmail.com',
  birthDate: '1990-05-15',
  isAdmin: false,
  createdAt: '2025-01-10T10:00:00Z',
};

export const MockAdminData: TaxPayer = {
  id: 'u002',
  RUC: '9876543210001',
  firstName: 'Angel',
  firstLastName: 'Sabando',
  email: 'admin@atsexpress.com',
  birthDate: '1985-03-20',
  isAdmin: true,
  createdAt: '2024-12-01T08:00:00Z',
};


export const MockInvoices: Invoice[] = [
  {
    id: 'inv001',
    number: 'F001-001-000001',
    issuerRuc: '0912345678001',
    issuerName: 'Proveedor ABC S.A.',
    date: '2025-11-05',
    total: 1120.00,
    taxBase: 1000.00,
    iva: 120.00,
    format: 'XML',
    period: { type: 'monthly', month: 11, year: 2025 },
  },
  {
    id: 'inv002',
    number: 'F001-001-000002',
    issuerRuc: '1723456789001',
    issuerName: 'Servicios XYZ Cía. Ltda.',
    date: '2025-11-12',
    total: 560.00,
    taxBase: 500.00,
    iva: 60.00,
    format: 'XML',
    period: { type: 'monthly', month: 11, year: 2025 },
  },
  {
    id: 'inv003',
    number: 'F002-001-000010',
    issuerRuc: '0987654321001',
    issuerName: 'Tech Solutions Ecuador',
    date: '2025-11-20',
    total: 2240.00,
    taxBase: 2000.00,
    iva: 240.00,
    format: 'XML',
    period: { type: 'monthly', month: 11, year: 2025 },
  },
  {
    id: 'inv004',
    number: 'F003-001-000005',
    issuerRuc: '1234509876001',
    issuerName: 'Distribuidora Norte',
    date: '2025-11-25',
    total: 336.00,
    taxBase: 300.00,
    iva: 36.00,
    format: 'PDF',
    period: { type: 'monthly', month: 11, year: 2025 },
  },
];

export const MockAtsFiles: AtsFile[] = [
  {
    id: 'ats001',
    name: 'ATS_2025_11_v1.xlsm',
    format: 'XLSM',
    period: { type: 'monthly', month: 11, year: 2025 },
    createdAt: '2025-11-28T14:30:00Z',
    invoiceCount: 247,
    validationErrors: 3,
    downloadUrl: '#',
  },
  {
    id: 'ats002',
    name: 'ATS_2025_10_final.xml',
    format: 'XML',
    period: { type: 'monthly', month: 10, year: 2025 },
    createdAt: '2025-10-30T09:00:00Z',
    invoiceCount: 312,
    validationErrors: 0,
    downloadUrl: '#',
  },
  {
    id: 'ats003',
    name: 'ATS_2025_S1.xlsm',
    format: 'XLSM',
    period: { type: 'semi-annual', semester: 1, year: 2025 },
    createdAt: '2025-07-05T11:00:00Z',
    invoiceCount: 1834,
    validationErrors: 7,
    downloadUrl: '#',
  },
];

export const MockProcessSteps: ProcessStep[] = [
  {
    id: 'step1',
    title: 'Descargar Facturas',
    description: 'Obtener facturas del período seleccionado desde SRI',
    status: 'completed',
    completedAt: '2025-11-28T09:45:00Z',
    module: 'Módulo 3',
  },
  {
    id: 'step2',
    title: 'Generar ATS XLSM',
    description: 'Crear archivo ATS en formato Excel Macro',
    status: 'in-progress',
    module: 'Módulo 4',
  },
  {
    id: 'step3',
    title: 'Generar ATS XML',
    description: 'Exportar ATS final compatible con DIMM del SRI',
    status: 'blocked',
    module: 'Módulo 6',
  },
];


export const MockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Workspace Principal',
    description: 'Mi workspace principal de trabajo',
    ownerId: 'u001',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sriConnectionStatus: 'connected',
    lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    invoicesCount: 45,
    atsFilesCount: 3,
    workspaceLocation: '/home/user/ats-data/workspace-principal',
    period: { type: 'monthly', month: 11, year: 2025 },
    processTracer: {
      invoicedDownloadStatus: true,
      atsXlsmGenerationStatus: true,
      atsXmlGenerationStatus: false,
    },
  },
  {
    id: 'ws-2',
    name: 'Proyectos Especiales',
    description: 'Workspace para proyectos especiales y auditorías',
    ownerId: 'u001',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sriConnectionStatus: 'disconnected',
    lastActivityAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    invoicesCount: 12,
    atsFilesCount: 1,
    workspaceLocation: '/home/user/ats-data/proyectos-especiales',
    period: { type: 'semi-annual', semester: 1, year: 2025 },
    processTracer: {
      invoicedDownloadStatus: false,
      atsXlsmGenerationStatus: false,
      atsXmlGenerationStatus: false,
    },
  },
];
