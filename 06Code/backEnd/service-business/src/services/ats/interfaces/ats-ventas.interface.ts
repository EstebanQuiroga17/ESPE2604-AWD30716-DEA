export interface IVentaInput {
  // TODO: Definir campos estrictos basados en el XML de origen
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
    tipoCompe: string;
    monto: string;
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
