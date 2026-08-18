export interface IAnuladoInput {
  tipoComprobante: string;
  establecimiento: string;
  puntoEmision: string;
  secuencialInicio: string;
  secuencialFin: string;
  autorizacion: string;
}

export interface IAnuladoAts {
  tipo1_y_2: {
    tipoComprobante: string;
    establecimiento: string;
    puntoEmision: string;
    secuencialInicio: string;
    secuencialFin: string;
    autorizacion: string;
  };
  tipo1?: {

  };
  tipo2?: {

  };
}
