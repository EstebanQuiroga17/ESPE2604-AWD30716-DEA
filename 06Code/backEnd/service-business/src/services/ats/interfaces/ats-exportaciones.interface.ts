import { IFacturaXml } from './sri-factura.interface';

export interface IExportacionInput {
  // Campos extraídos del XML que sí se mapean al ATS
  codDoc?: string;
  estab?: string;
  ptoEmi?: string;
  secuencial?: string;
  claveAcceso?: string;
  fechaEmision?: string;
  paisOrigen?: string;
  paisDestino?: string;
  tipoldentificacionComprador?: string;
  razonSocialComprador?: string;
  identificacionComprador?: string;
  totalSinImpuestos?: string;
}

export interface IExportacionAts {
  tipo1_y_2: {
    tpIdClienteEx: string;
    idClienteEx: string;
    parteRel: string;
    tipoCli: string;
    denoExpCli: string;
    tipoRegi: string;
    paisEfecPagoGen: string;
    paisEfecPagoParFis: string;
    denopagoRegFis: string;
    paisEfecExp: string;
    pagoRegFis: string;
    exportacionDe: string;
    tipIngExt: string;
    ingextgravotropaís: string;
    impuestootropaís: string;
    tipoComprobante: string;
    distAduanero: string;
    anio: string;
    regimen: string;
    correlativo: string;
    verificador: string;
    docTransp: string;
    fechaEmbarque: string;
    fue: string;
    valorFOB: string;
    valorFOBComprobante: string;
    establecimiento: string;
    puntoEmision: string;
    secuencial: string;
    autorizacion: string;
    fechaEmision: string;
  };
  tipo1?: {

  };
  tipo2?: {

  };
}
