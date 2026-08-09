export interface IRendimientoInput {
  // TODO: Definir campos estrictos basados en el XML de origen
}

export interface IRendimientoAts {
  tipo1_y_2: {
    denoBenefi: string;
    tipoRegi: string;
    paisEfecPagoGen: string;
    denopagoRegFis: string;
    paisEfecPago: string;
  };
  tipo1?: {

  };
  tipo2?: {
    retenido: string;
    idRetenido: string;
    parteRel: string;
    tipoRete: string;
    totalDep: string;
    rendGen: string;
    totalDep: string;
    rendGen: string;
    pagoLocExt: string;
    paisEfecPagoParFis: string;
    aplicConvDobTrib: string;
    pagExtSujRetNorLeg: string;
    pagoRegFis: string;
    estabRetencion: string;
    ptoEmiRetencion: string;
    secRetencion: string;
    autRetencion: string;
    fechaEmiRet: string;
    codRetAir: string;
    deposito: string;
    baseImpAir: string;
    porcentajeAir: string;
    valRetAir: string;
    valRetAir: string;
  };
}
