import { IMapper } from '../interfaces/mapper.interface';
import { ICompraInput, ICompraAts } from '../interfaces/ats-compras.interface';

export class CompraMapper implements IMapper<ICompraInput, ICompraAts> {
  public map(input: ICompraInput, tipoContribuyente: number = 1): ICompraAts {
    const result: ICompraAts = {
      tipo1_y_2: {
        codSustento: "",
        tpIdProv: "",
        idProv: "",
        tipoComprobante: "",
        parteRel: "",
        tipoProv: "",
        denopr: "",
        fechaRegistro: "",
        establecimiento: "",
        puntoEmision: "",
        secuencial: "",
        fechaEmision: "",
        autorizacion: "",
        baseNoGraIva: "",
        baseImponible: "",
        baseImpGrav: "",
        baseImpExe: "",
        montoIce: "",
        montoIva: "",
        valRetBien10: "",
        valRetServ20: "",
        valorRetBienes: "",
        valRetServ50: "",
        valorRetServicios: "",
        valRetServ100: "",
        valorRetencionNc: "",
        pagoLocExt: "",
        tipoRegi: "",
        paisEfecPagoGen: "",
        paisEfecPagoParFis: "",
        denopago: "",
        paisEfecPago: "",
        aplicConvDobTrib: "",
        pagExtSujRetNorLeg: "",
        pagoRegFis: "",
        formaPago: "",
        codRetAir: "",
        baseImpAir: "",
        porcentajeAir: "",
        valRetAir: "",
        fechaPagoDiv: "",
        imRentaSoc: "",
        anioUtDiv: "",
        numCajBan: "",
        precCajBan: "",
        estabRetencion1: "",
        ptoEmiRetencion1: "",
        secRetencion1: "",
        autRetencion1: "",
        fechaEmiRet1: "",
        docModificado: "",
        estabModificado: "",
        ptoEmiModificado: "",
        secModificado: "",
        autModificado: "",
        tipoComprobanteReemb: "",
        tpIdProvReemb: "",
        idProvReemb: "",
        establecimientoReemb: "",
        puntoEmisionReemb: "",
        secuencialReemb: "",
        fechaEmisionReemb: "",
        autorizacionReemb: "",
        baseImponibleReemb: "",
        baseImpGravReemb: "",
        baseNoGraIvaReemb: "",
        baseImpExeReemb: "",
        totbasesImpReemb: "",
        montoIceReemb: "",
        montoIvaRemb: "",
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
