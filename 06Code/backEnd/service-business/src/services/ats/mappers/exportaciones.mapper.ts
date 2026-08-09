import { IMapper } from '../interfaces/mapper.interface';
import { IExportacionInput, IExportacionAts } from '../interfaces/ats-exportaciones.interface';

export class ExportacionMapper implements IMapper<IExportacionInput, IExportacionAts> {
  public map(input: IExportacionInput, tipoContribuyente: number = 1): IExportacionAts {
    const result: IExportacionAts = {
      tipo1_y_2: {
        tpIdClienteEx: "",
        idClienteEx: "",
        parteRel: "",
        tipoCli: "",
        denoExpCli: "",
        tipoRegi: "",
        paisEfecPagoGen: "",
        paisEfecPagoParFis: "",
        denopagoRegFis: "",
        paisEfecExp: "",
        pagoRegFis: "",
        exportacionDe: "",
        tipIngExt: "",
        ingextgravotropaís: "",
        impuestootropaís: "",
        tipoComprobante: "",
        distAduanero: "",
        anio: "",
        regimen: "",
        correlativo: "",
        verificador: "",
        docTransp: "",
        fechaEmbarque: "",
        fue: "",
        valorFOB: "",
        valorFOBComprobante: "",
        establecimiento: "",
        puntoEmision: "",
        secuencial: "",
        autorizacion: "",
        fechaEmision: "",
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
