import { IMapper } from '../interfaces/mapper.interface';
import { IAnuladoInput, IAnuladoAts } from '../interfaces/ats-anulados.interface';

export class AnuladoMapper implements IMapper<IAnuladoInput, IAnuladoAts> {
  public map(input: IAnuladoInput, tipoContribuyente: number = 1): IAnuladoAts {
    const result: IAnuladoAts = {
      tipo1_y_2: {
        tipoComprobante: input.tipoComprobante,
        establecimiento: input.establecimiento,
        puntoEmision: input.puntoEmision,
        secuencialInicio: input.secuencialInicio,
        secuencialFin: input.secuencialFin,
        autorizacion: input.autorizacion
      }
    };

    if (tipoContribuyente === 1) {
      result.tipo1 = {};
    }

    if (tipoContribuyente === 2) {
      result.tipo2 = {};
    }

    return result;
  }
}
