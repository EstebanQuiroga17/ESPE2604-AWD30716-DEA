import { IMapper } from '../interfaces/mapper.interface';
import { IAnuladoInput, IAnuladoAts } from '../interfaces/ats-anulados.interface';

export class AnuladoMapper implements IMapper<IAnuladoInput, IAnuladoAts> {
  public map(input: IAnuladoInput, tipoContribuyente: number = 1): IAnuladoAts {
    const result: IAnuladoAts = {
      tipo1_y_2: {
        tipoComprobante: "",
        establecimiento: "",
        puntoEmision: "",
        secuencialInicio: "",
        secuencialFin: "",
        autorización: "",
      }
    };

    if (tipoContribuyente === 1) {
      result.tipo1 = {

      };
    }

    if (tipoContribuyente === 2) {
      result.tipo2 = {

      };
    }

    return result;
  }
}
