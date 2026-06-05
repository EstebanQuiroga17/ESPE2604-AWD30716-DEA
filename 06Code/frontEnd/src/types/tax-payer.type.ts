import type { SriSession } from './sri-session.type';

export type TipoContribuyente = 'natural' | 'juridica';

export interface TaxPayer {
  id: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  RUC: string;
  email: string;
  birthDate: string | Date;
  SriSession?: SriSession;
  tipoContribuyente?: TipoContribuyente;
  isAdmin: boolean;
  createdAt?: string;
}
