export interface IFideicomisoInput {
  // TODO: Definir campos estrictos basados en el XML de origen
}

export interface IFideicomisoAts {
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
    tipoBeneficiario: string;
    idBeneficiario: string;
    parteRel: string;
    tipoBeneficiario: string;
    rucFideicomiso: string;
    tipoFideicomiso: string;
    totalF: string;
    individualF: string;
    porRetF: string;
    valorRetF: string;
    fechaPagoDiv: string;
    imRentaSoc: string;
    anioUtDiv: string;
    pagoLocExt: string;
    paisEfecPagoParFis: string;
    aplicConvDobTrib: string;
    pagExtSujRetNorLeg: string;
    pagoRegFis: string;
  };
}
