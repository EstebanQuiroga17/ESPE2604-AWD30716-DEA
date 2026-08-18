export interface IInformanteInput {
  ruc: string;
  razonSocial: string;
  anio: number;
  mes: number;
  numEstablecimientos: number;
}

export interface IInformanteAts {
  IdInformante: string;
  razonSocial: string;
  anio: string;
  mes: string;
  numEstabRuc: string;
  totalVentas: string;
  codigoOperativo: string;
}
