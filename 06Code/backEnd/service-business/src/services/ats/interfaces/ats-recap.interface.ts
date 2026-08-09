export interface IRecapInput {
  // TODO: Definir campos estrictos basados en el XML de origen
}

export interface IRecapAts {
  tipo1_y_2: {
    DenoCliRecaps: string;
    tipoCompe: string;
    monto: string;
    valRetServ50: string;
    tipoRegi: string;
    paisEfecPagoGen: string;
    denopagoRegFis: string;
    paisEfecPago: string;
  };
  tipo1?: {

  };
  tipo2?: {
    establecimientoRecap: string;
    identificacionRecap: string;
    parteRel: string;
    tipoEst: string;
    tipoComprobante: string;
    numeroRecap: string;
    fechaPago: string;
    tarjetaCredito: string;
    fechaEmisionRecap: string;
    consumoCero: string;
    consumoGravado: string;
    totalConsumo: string;
    montoIva: string;
    comision: string;
    numeroVouchers: string;
    valRetBien10: string;
    valRetServ20: string;
    valorRetBienes: string;
    valorRetServicios: string;
    valRetServ100: string;
    pagoLocExt: string;
    paisEfecPagoParFis: string;
    aplicConvDobTrib: string;
    pagExtSujRetNorLeg: string;
    pagoRegFis: string;
    codRetAir: string;
    baseImpAir: string;
    porcentajeAir: string;
    valRetAir: string;
    establecimiento: string;
    puntoEmision: string;
    secuencial: string;
    autorización: string;
    fechaEmision: string;
  };
}
