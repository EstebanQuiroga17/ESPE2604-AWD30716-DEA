import { IMapper } from '../interfaces/mapper.interface';
import { IExportacionInput, IExportacionAts } from '../interfaces/ats-exportaciones.interface';

export class ExportacionMapper implements IMapper<IExportacionInput, IExportacionAts> {
  public map(input: IExportacionInput, tipoContribuyente: number = 1): IExportacionAts {
    // Normalizar total a número
    const valorFOB = Number(input.totalSinImpuestos) || 0;

    const result: IExportacionAts = {
      tipo1_y_2: {
        tpIdClienteEx: input.tipoldentificacionComprador || "04",
        idClienteEx: input.identificacionComprador || "",
        parteRel: "",
        tipoCli: "",
        denoExpCli: input.razonSocialComprador || "",
        tipoRegi: "",
        paisEfecPagoGen: input.paisOrigen || "593",
        paisEfecPagoParFis: "",
        denopagoRegFis: "",
        paisEfecExp: input.paisDestino || "593",
        pagoRegFis: "",
        exportacionDe: "",
        tipIngExt: "",
        ingextgravotropaís: "",
        impuestootropaís: "",
        tipoComprobante: input.codDoc || "01",
        distAduanero: "",
        anio: "",
        regimen: "",
        correlativo: "",
        verificador: "",
        docTransp: "",
        fechaEmbarque: "",
        fue: "",
        valorFOB: valorFOB.toFixed(2),
        valorFOBComprobante: valorFOB.toFixed(2),
        establecimiento: input.estab || "001",
        puntoEmision: input.ptoEmi || "001",
        secuencial: input.secuencial || "",
        autorizacion: input.claveAcceso || "",
        fechaEmision: input.fechaEmision || "",
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
