import { ITotalImpuesto, IPago, ICompensacion } from './sri-factura.interface';

export interface IVentaInput {
  // --- Datos extraídos del XML del Informante (Factura de Venta) ---
  infoTributaria: {
    ruc: string; // RUC del Informante (No se suele usar en la fila de venta, pero viene en el XML)
    codDoc: string; // Tipo de comprobante (ej. '01' para factura)
    estab: string;
    ptoEmi: string;
    secuencial: string;
  };
  infoFactura: {
    fechaEmision: string;
    tipoIdentificacionComprador: string; // '04', '05', etc.
    identificacionComprador: string; // RUC/Cédula del cliente
    razonSocialComprador: string;
    totalConImpuestos: {
      totalImpuesto: ITotalImpuesto | ITotalImpuesto[];
    };
    compensaciones?: {
      compensacion: ICompensacion | ICompensacion[];
    };
    pagos?: {
      pago: IPago | IPago[];
    };
    valorRetIva?: number | string;
    valorRetRenta?: number | string;
  };

  // --- Datos de Contexto ---
  parteRelacionada: string; // 'SI' o 'NO'
  tipoCliente?: string;
  tipoCompe?: string;
}

export interface IVentaAts {
  tipo1_y_2: {
    tpIdCliente: string;
    idCliente: string;
    parteRel: string;
    tipoCliente: string;
    DenoCli: string;
    tipoComprobante: string;
    tipoEm: string;
    numeroComprobantes: string;
    baseNoGraIva: string;
    baseImponible: string;
    baseImpGrav: string;
    montoIva: string;
    compensaciones: { tipoCompe: string; monto: string }[];
    montoIce: string;
    valorRetIva: string;
    valorRetRenta: string;
    formaPago: string;
    codEstab: string;
    ventasEstab: string;
    ivaComp: string;
  };
  tipo1?: {

  };
  tipo2?: {

  };
}
