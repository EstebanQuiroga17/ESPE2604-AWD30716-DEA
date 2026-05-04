import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

const stats = [
  {
    icon: FileText,
    title: 'Facturas Descargadas',
    value: '247',
    subtitle: 'Este mes (Noviembre 2025)',
    color: 'blue',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    trend: '+12% vs mes anterior',
    trendPositive: true,
  },
  {
    icon: AlertCircle,
    title: 'Errores Detectados',
    value: '3',
    subtitle: 'Requieren atención',
    color: 'orange',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    trend: 'Pendientes de corrección',
    trendPositive: false,
  },
  {
    icon: CheckCircle,
    title: 'ATS Listo para Generar',
    value: '✓',
    subtitle: 'Periodo actual completo',
    color: 'green',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    trend: 'Validación exitosa',
    trendPositive: true,
  },
];

export function StatsCards() {
  return (
    <div>
      <h2 className="text-gray-900 mb-4">Resumen del Periodo Fiscal Actual</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.value !== '✓' && (
                <span className="text-3xl text-gray-900">{stat.value}</span>
              )}
              {stat.value === '✓' && (
                <span className="text-4xl text-green-600">{stat.value}</span>
              )}
            </div>
            <h3 className="text-gray-900 mb-1">{stat.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{stat.subtitle}</p>
            <div className={`text-xs ${stat.trendPositive ? 'text-green-600' : 'text-orange-600'}`}>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}