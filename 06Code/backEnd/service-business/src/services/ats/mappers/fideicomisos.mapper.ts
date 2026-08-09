import { IMapper } from '../interfaces/mapper.interface';
import { IFideicomisoInput, IFideicomisoAts } from '../interfaces/ats-fideicomisos.interface';

export class FideicomisoMapper implements IMapper<IFideicomisoInput, IFideicomisoAts> {
  public map(input: IFideicomisoInput, tipoContribuyente: number = 1): IFideicomisoAts {
    const result: IFideicomisoAts = {
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
        tipoBeneficiario: "",
        idBeneficiario: "",
        parteRel: "",
        tipoBeneficiario: "",
        rucFideicomiso: "",
        tipoFideicomiso: "",
        totalF: "",
        individualF: "",
        porRetF: "",
        valorRetF: "",
        fechaPagoDiv: "",
        imRentaSoc: "",
        anioUtDiv: "",
        pagoLocExt: "",
        paisEfecPagoParFis: "",
        aplicConvDobTrib: "",
        pagExtSujRetNorLeg: "",
        pagoRegFis: "",
      };
    }

    return result;
  }
}
