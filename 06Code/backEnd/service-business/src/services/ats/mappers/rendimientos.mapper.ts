import { IMapper } from '../interfaces/mapper.interface';
import { IRendimientoInput, IRendimientoAts } from '../interfaces/ats-rendimientos.interface';

export class RendimientoMapper implements IMapper<IRendimientoInput, IRendimientoAts> {
  public map(input: IRendimientoInput, tipoContribuyente: number = 1): IRendimientoAts {
    const result: IRendimientoAts = {
      tipo1_y_2: {
        denoBenefi: "",
        tipoRegi: "",
        paisEfecPagoGen: "",
        denopagoRegFis: "",
        paisEfecPago: "",
      }
    };

    if (tipoContribuyente === 1) {
      result.tipo1 = {

      };
    }

    if (tipoContribuyente === 2) {
      result.tipo2 = {
        retenido: "",
        idRetenido: "",
        parteRel: "",
        tipoRete: "",
        totalDep: "",
        rendGen: "",
        totalDep: "",
        rendGen: "",
        pagoLocExt: "",
        paisEfecPagoParFis: "",
        aplicConvDobTrib: "",
        pagExtSujRetNorLeg: "",
        pagoRegFis: "",
        estabRetencion: "",
        ptoEmiRetencion: "",
        secRetencion: "",
        autRetencion: "",
        fechaEmiRet: "",
        codRetAir: "",
        deposito: "",
        baseImpAir: "",
        porcentajeAir: "",
        valRetAir: "",
        valRetAir: "",
      };
    }

    return result;
  }
}
