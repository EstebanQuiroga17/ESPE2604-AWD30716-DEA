import { ITotalImpuesto, IRetencion, IPago, IReembolsoDetalle } from './sri-factura.interface';

export interface ICompraInput {
  // --- Datos extraídos del XML del Proveedor (Factura de Compra) ---
  infoTributaria: {
    ruc: string; // RUC del Proveedor
    codDoc: string; // Tipo de comprobante (ej. '01' para factura)
    estab: string;
    ptoEmi: string;
    secuencial: string;
    claveAcceso: string; // Autorización
  };
  infoFactura: {
    fechaEmision: string;
    totalConImpuestos: {
      totalImpuesto: ITotalImpuesto | ITotalImpuesto[];
    };
    pagos?: {
      pago: IPago | IPago[];
    };
  };
  reembolsos?: {
    reembolsoDetalle: IReembolsoDetalle | IReembolsoDetalle[];
  };
  retenciones?: {
    retencion: IRetencion | IRetencion[];
  };

  // --- Datos de Contexto (Ingresados por el usuario o DB) ---
  codSustento: string; // Sustento Tributario (ej. '01')
  fechaRegistroContable: string;
  parteRelacionada: string; // 'SI' o 'NO'
  pagoLocExt: string; // '01' (Residente) o '02' (No Residente)
}

export interface ICompraAts {
  tipo1_y_2: {
    codSustento: string;
    tpIdProv: string;
    idProv: string;
    tipoComprobante: string;
    parteRel: string;
    tipoProv: string;
    denopr: string;
    fechaRegistro: string;
    establecimiento: string;
    puntoEmision: string;
    secuencial: string;
    fechaEmision: string;
    autorizacion: string;
    baseNoGraIva: string;
    baseImponible: string;
    baseImpGrav: string;
    baseImpExe: string;
    montoIce: string;
    montoIva: string;
    valRetBien10: string;
    valRetServ20: string;
    valorRetBienes: string;
    valRetServ50: string;
    valorRetServicios: string;
    valRetServ100: string;
    valorRetencionNc: string;
    pagoLocExt: string;
    tipoRegi: string;
    paisEfecPagoGen: string;
    paisEfecPagoParFis: string;
    denopago: string;
    paisEfecPago: string;
    aplicConvDobTrib: string;
    pagExtSujRetNorLeg: string;
    pagoRegFis: string;
    formaPago: string;
    codRetAir: string;
    baseImpAir: string;
    porcentajeAir: string;
    valRetAir: string;
    fechaPagoDiv: string;
    imRentaSoc: string;
    anioUtDiv: string;
    numCajBan: string;
    precCajBan: string;
    estabRetencion1: string;
    ptoEmiRetencion1: string;
    secRetencion1: string;
    autRetencion1: string;
    fechaEmiRet1: string;
    docModificado: string;
    estabModificado: string;
    ptoEmiModificado: string;
    secModificado: string;
    autModificado: string;
    tipoComprobanteReemb: string;
    tpIdProvReemb: string;
    idProvReemb: string;
    establecimientoReemb: string;
    puntoEmisionReemb: string;
    secuencialReemb: string;
    fechaEmisionReemb: string;
    autorizacionReemb: string;
    baseImponibleReemb: string;
    baseImpGravReemb: string;
    baseNoGraIvaReemb: string;
    baseImpExeReemb: string;
    totbasesImpReemb: string;
    montoIceReemb: string;
    montoIvaRemb: string;
  };
  tipo1?: {

  };
  tipo2?: {

  };
}
