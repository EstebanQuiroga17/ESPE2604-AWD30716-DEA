import { IMapper } from '../interfaces/mapper.interface';
import { IVentaInput, IVentaAts } from '../interfaces/ats-ventas.interface';

export class VentaMapper implements IMapper<IVentaInput, IVentaAts> {
  public map(input: IVentaInput, tipoContribuyente: number = 1): IVentaAts {
    const result: IVentaAts = {
      tipo1_y_2: {
        tpIdCliente: "",
        idCliente: "",
        parteRel: "",
        tipoCliente: "",
        DenoCli: "",
        tipoComprobante: "",
        tipoEm: "",
        numeroComprobantes: "",
        baseNoGraIva: "",
        baseImponible: "",
        baseImpGrav: "",
        montoIva: "",
        tipoCompe: "",
        monto: "",
        montoIce: "",
        valorRetIva: "",
        valorRetRenta: "",
        formaPago: "",
        codEstab: "",
        ventasEstab: "",
        ivaComp: "",
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
