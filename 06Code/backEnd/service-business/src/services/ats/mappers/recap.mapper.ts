import { IMapper } from '../interfaces/mapper.interface';
import { IRecapInput, IRecapAts } from '../interfaces/ats-recap.interface';

export class RecapMapper implements IMapper<IRecapInput, IRecapAts> {
  public map(input: IRecapInput, tipoContribuyente: number = 1): IRecapAts {
    const result: IRecapAts = {
      tipo1_y_2: {
        DenoCliRecaps: "",
        tipoCompe: "",
        monto: "",
        valRetServ50: "",
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
        establecimientoRecap: "",
        identificacionRecap: "",
        parteRel: "",
        tipoEst: "",
        tipoComprobante: "",
        numeroRecap: "",
        fechaPago: "",
        tarjetaCredito: "",
        fechaEmisionRecap: "",
        consumoCero: "",
        consumoGravado: "",
        totalConsumo: "",
        montoIva: "",
        comision: "",
        numeroVouchers: "",
        valRetBien10: "",
        valRetServ20: "",
        valorRetBienes: "",
        valorRetServicios: "",
        valRetServ100: "",
        pagoLocExt: "",
        paisEfecPagoParFis: "",
        aplicConvDobTrib: "",
        pagExtSujRetNorLeg: "",
        pagoRegFis: "",
        codRetAir: "",
        baseImpAir: "",
        porcentajeAir: "",
        valRetAir: "",
        establecimiento: "",
        puntoEmision: "",
        secuencial: "",
        autorización: "",
        fechaEmision: "",
      };
    }

    return result;
  }
}
