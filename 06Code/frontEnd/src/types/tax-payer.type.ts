
export type TipoContribuyente = '1' | '2';

export interface TaxPayer {
  id: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  RUC: string;
  email: string;
  birthDate: string | Date;
  tipoContribuyente?: TipoContribuyente;
  isAdmin: boolean;
  createdAt?: string;
}
