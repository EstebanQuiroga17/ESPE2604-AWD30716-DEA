import { IMapper } from '../interfaces/mapper.interface';
import { ICompraInput, ICompraAts } from '../interfaces/ats-compras.interface';
import { ITotalImpuesto } from '../interfaces/sri-factura.interface';

export class CompraMapper implements IMapper<ICompraInput, ICompraAts> {
  public map(input: ICompraInput, tipoContribuyente: number = 1): ICompraAts {
    // Normalizar impuestos a array
    const impuestosRaw = input.infoFactura.totalConImpuestos?.totalImpuesto;
    const impuestos: ITotalImpuesto[] = Array.isArray(impuestosRaw) 
      ? impuestosRaw 
      : impuestosRaw ? [impuestosRaw] : [];

    // Bases imponibles
    let baseNoGraIva = 0;
    let baseImponible = 0; // 0%
    let baseImpGrav = 0; // Diferente de 0%
    let baseImpExe = 0;
    let montoIva = 0;
    let montoIce = 0;

    for (const imp of impuestos) {
      const codigo = Number(imp.codigo);
      const codPorcentaje = Number(imp.codigoPorcentaje);
      const base = Number(imp.baseImponible) || 0;
      const valor = Number(imp.valor) || 0;

      if (codigo === 2) { // IVA
        if (codPorcentaje === 0) baseImponible += base; // 0%
        else if (codPorcentaje === 6) baseNoGraIva += base; // No objeto
        else if (codPorcentaje === 7) baseImpExe += base; // Exento
        else {
          // Diferente de cero (2: 12%, 3: 14%, 4: 15%, 8: 8%, etc)
          baseImpGrav += base;
          montoIva += valor;
        }
      } else if (codigo === 3) { // ICE
        montoIce += valor;
      }
    }

    const rucProv = input.infoTributaria.ruc || "";

    const result: ICompraAts = {
      tipo1_y_2: {
        codSustento: input.codSustento || "",
        tpIdProv: this.getTpIdProv(rucProv),
        idProv: rucProv,
        tipoComprobante: input.infoTributaria.codDoc || "01",
        parteRel: input.parteRelacionada || "NO",
        tipoProv: "", // Opcional según tabla
        denopr: "", // Denominación (opcional si es pasaporte)
        fechaRegistro: input.fechaRegistroContable || input.infoFactura.fechaEmision,
        establecimiento: input.infoTributaria.estab,
        puntoEmision: input.infoTributaria.ptoEmi,
        secuencial: input.infoTributaria.secuencial,
        fechaEmision: input.infoFactura.fechaEmision,
        autorizacion: input.infoTributaria.claveAcceso,
        
        // Valores Monetarios
        baseNoGraIva: this.formatCurrency(baseNoGraIva),
        baseImponible: this.formatCurrency(baseImponible),
        baseImpGrav: this.formatCurrency(baseImpGrav),
        baseImpExe: this.formatCurrency(baseImpExe),
        montoIce: this.formatCurrency(montoIce),
        montoIva: this.formatCurrency(montoIva),
        
        // Retenciones de IVA (Vacíos por defecto o extraídos si existieran)
        valRetBien10: "0.00",
        valRetServ20: "0.00",
        valorRetBienes: "0.00", // 30%
        valRetServ50: "0.00",
        valorRetServicios: "0.00", // 70%
        valRetServ100: "0.00",
        valorRetencionNc: "0.00",
        
        // Pagos al exterior / Locales
        pagoLocExt: input.pagoLocExt || "01",
        tipoRegi: "",
        paisEfecPagoGen: "",
        paisEfecPagoParFis: "",
        denopago: "",
        paisEfecPago: "",
        aplicConvDobTrib: "",
        pagExtSujRetNorLeg: "",
        pagoRegFis: "",
        formaPago: this.getFormaPago(input),
        
        // Retenciones Renta
        codRetAir: "",
        baseImpAir: "0.00",
        porcentajeAir: "0.00",
        valRetAir: "0.00",
        fechaPagoDiv: "",
        imRentaSoc: "0.00",
        anioUtDiv: "",
        numCajBan: "",
        precCajBan: "0.00",
        
        // Retenciones Emitidas
        estabRetencion1: "",
        ptoEmiRetencion1: "",
        secRetencion1: "",
        autRetencion1: "",
        fechaEmiRet1: "",
        
        // Notas de Crédito / Modificados
        docModificado: "",
        estabModificado: "",
        ptoEmiModificado: "",
        secModificado: "",
        autModificado: "",
        
        // Reembolsos
        tipoComprobanteReemb: "",
        tpIdProvReemb: "",
        idProvReemb: "",
        establecimientoReemb: "",
        puntoEmisionReemb: "",
        secuencialReemb: "",
        fechaEmisionReemb: "",
        autorizacionReemb: "",
        baseImponibleReemb: "0.00",
        baseImpGravReemb: "0.00",
        baseNoGraIvaReemb: "0.00",
        baseImpExeReemb: "0.00",
        totbasesImpReemb: "0.00",
        montoIceReemb: "0.00",
        montoIvaRemb: "0.00",
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

  private getTpIdProv(ruc: string): string {
    const len = ruc.trim().length;
    if (len === 13) return "01"; // RUC
    if (len === 10) return "02"; // Cédula
    return "03"; // Pasaporte / Identificación Exterior
  }

  private formatCurrency(value: number): string {
    return value.toFixed(2);
  }

  private getFormaPago(input: ICompraInput): string {
    const pagosRaw = input.infoFactura.pagos?.pago;
    if (!pagosRaw) return "01"; // Default "Sin utilización del sistema financiero"
    const pagos = Array.isArray(pagosRaw) ? pagosRaw : [pagosRaw];
    if (pagos.length > 0 && pagos[0].formaPago) {
      return pagos[0].formaPago.toString().padStart(2, '0');
    }
    return "01";
  }
}
