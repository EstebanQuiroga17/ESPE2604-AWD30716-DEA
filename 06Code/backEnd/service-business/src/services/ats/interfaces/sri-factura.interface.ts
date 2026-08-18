export interface IFacturaXml {
  infoTributaria: {
    ambiente: number | string;
    tipoEmision: number | string;
    razonSocial: string;
    nombreComercial?: string;
    ruc: string;
    claveAcceso: string;
    codDoc: string;
    estab: string;
    ptoEmi: string;
    secuencial: string;
    dirMatriz: string;
    agenteRetencion?: string;
    contribuyenteRimpe?: string;
  };
  infoFactura: {
    fechaEmision: string; // dd/mm/yyyy
    dirEstablecimiento?: string;
    contribuyenteEspecial?: string;
    obligadoContabilidad?: string;
    comercioExterior?: string;
    incoTermFactura?: string;
    lugarIncoTerm?: string;
    paisOrigen?: string;
    puertoEmbarque?: string;
    puertoDestino?: string;
    paisDestino?: string;
    paisAdquisicion?: string;
    tipoIdentificacionComprador: string;
    guiaRemision?: string;
    razonSocialComprador: string;
    identificacionComprador: string;
    direccionComprador?: string;
    totalSinImpuestos: number | string;
    totalSubsidio?: number | string;
    incoTermTotalSinImpuestos?: string;
    totalDescuento: number | string;
    codDocReembolso?: string;
    totalComprobantesReembolso?: number | string;
    totalBaseImponibleReembolso?: number | string;
    totalImpuestoReembolso?: number | string;
    totalConImpuestos: {
      totalImpuesto: ITotalImpuesto | ITotalImpuesto[];
    };
    compensaciones?: {
      compensacion: ICompensacion | ICompensacion[];
    };
    propina?: number | string;
    fleteInternacional?: number | string;
    seguroInternacional?: number | string;
    gastosAduaneros?: number | string;
    gastosTransporteOtros?: number | string;
    importeTotal: number | string;
    moneda?: string;
    placa?: string;
    pagos?: {
      pago: IPago | IPago[];
    };
    valorRetIva?: number | string;
    valorRetRenta?: number | string;
  };
  detalles: {
    detalle: IDetalleFactura | IDetalleFactura[];
  };
  reembolsos?: {
    reembolsoDetalle: IReembolsoDetalle | IReembolsoDetalle[];
  };
  retenciones?: {
    retencion: IRetencion | IRetencion[];
  };
  infoSustitutivaGuiaRemision?: IInfoSustitutivaGuiaRemision;
  otrosRubrosTerceros?: {
    rubro: IRubroTercero | IRubroTercero[];
  };
  tipoNegociable?: ITipoNegociable;
  maquinaFiscal?: IMaquinaFiscal;
  infoAdicional?: {
    campoAdicional: ICampoAdicional | ICampoAdicional[];
  };
}

export interface ITotalImpuesto {
  codigo: number | string;
  codigoPorcentaje: number | string;
  descuentoAdicional?: number | string;
  baseImponible: number | string;
  tarifa?: number | string;
  valor: number | string;
  valorDevolucionIva?: number | string;
}

export interface ICompensacion {
  codigo: number | string;
  tarifa: number | string;
  valor: number | string;
}

export interface IPago {
  formaPago: string;
  total: number | string;
  plazo?: number | string;
  unidadTiempo?: string;
}

export interface IDetalleFactura {
  codigoPrincipal?: string;
  codigoAuxiliar?: string;
  descripcion: string;
  unidadMedida?: string;
  cantidad: number | string;
  precioUnitario: number | string;
  precioSinSubsidio?: number | string;
  descuento: number | string;
  precioTotalSinImpuesto: number | string;
  detallesAdicionales?: {
    detAdicional: IDetAdicional | IDetAdicional[];
  };
  impuestos: {
    impuesto: ITotalImpuesto | ITotalImpuesto[];
  };
}

export interface IDetAdicional {
  nombre: string;
  valor: string;
}

export interface IReembolsoDetalle {
  tipoIdentificacionProveedorReembolso: string;
  identificacionProveedorReembolso: string;
  codPaisPagoProveedorReembolso?: string;
  tipoProveedorReembolso?: string;
  codDocReembolso: string;
  estabDocReembolso: string;
  ptoEmiDocReembolso: string;
  secuencialDocReembolso: string;
  fechaEmisionDocReembolso: string;
  numeroautorizacionDocReemb: string;
  detalleImpuestos: {
    detalleImpuesto: IDetalleImpuestoReembolso | IDetalleImpuestoReembolso[];
  };
  compensacionesReembolso?: {
    compensacionReembolso: ICompensacionReembolso | ICompensacionReembolso[];
  };
}

export interface IDetalleImpuestoReembolso {
  codigo: number | string;
  codigoPorcentaje: number | string;
  tarifa: number | string;
  baseImponibleReembolso: number | string;
  impuestoReembolso: number | string;
}

export interface ICompensacionReembolso {
  codigo: number | string;
  tarifa: number | string;
  valor: number | string;
}

export interface IRetencion {
  codigo: number | string;
  codigoPorcentaje: number | string;
  tarifa: number | string;
  valor: number | string;
}

export interface IInfoSustitutivaGuiaRemision {
  dirPartida: string;
  dirDestinatario: string;
  fechaIniTransporte: string;
  fechaFinTransporte: string;
  razonSocialTransportista: string;
  tipoIdentificacionTransportista: string;
  rucTransportista: string;
  placa?: string;
  destinos?: {
    destino: IDestino | IDestino[];
  };
}

export interface IDestino {
  motivoTraslado: string;
  docAduaneroUnico?: string;
  codEstabDestino?: string;
  ruta?: string;
}

export interface IRubroTercero {
  concepto: string;
  total: number | string;
}

export interface ITipoNegociable {
  correo: string;
}

export interface IMaquinaFiscal {
  marca: string;
  modelo: string;
  serie: string;
}

export interface ICampoAdicional {
  nombre: string;
  "#text"?: string; 
}
