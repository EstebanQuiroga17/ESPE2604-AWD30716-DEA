import { IMapper } from '../interfaces/mapper.interface';
import { IVentaInput, IVentaAts } from '../interfaces/ats-ventas.interface';
import { ITotalImpuesto } from '../interfaces/sri-factura.interface';

export class VentaMapper implements IMapper<IVentaInput, IVentaAts> {
  public map(input: IVentaInput, tipoContribuyente: number = 1): IVentaAts {
    // Normalizar impuestos a array
    const impuestosRaw = input.infoFactura.totalConImpuestos?.totalImpuesto;
    const impuestos: ITotalImpuesto[] = Array.isArray(impuestosRaw) 
      ? impuestosRaw 
      : impuestosRaw ? [impuestosRaw] : [];

    // Bases imponibles
    let baseNoGraIva = 0;
    let baseImponible = 0; // 0%
    let baseImpGrav = 0; // Diferente de 0%
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
        else if (codPorcentaje === 7) { /* Exento, se reporta en 0% o ignorado según caso, el SRI en ventas solo tiene baseNoGra, Imponible(0%) y Gravada(12%) */ }
        else {
          baseImpGrav += base;
          montoIva += valor;
        }
      } else if (codigo === 3) { // ICE
        montoIce += valor;
      }
    }

    const ventasEstab = baseNoGraIva + baseImponible + baseImpGrav;

    const result: IVentaAts = {
      tipo1_y_2: {
        tpIdCliente: input.infoFactura.tipoIdentificacionComprador || "04",
        idCliente: input.infoFactura.identificacionComprador || "",
        parteRel: input.parteRelacionada || "NO",
        tipoCliente: input.tipoCliente || "", // Opcional, usualmente para sociedades
        DenoCli: input.infoFactura.razonSocialComprador || "",
        tipoComprobante: input.infoTributaria.codDoc || "01", // Factura
        tipoEm: "E", // E = Electrónica, F = Física
        numeroComprobantes: "1", // Para electrónicas se detalla 1 por 1
        
        // Valores Monetarios
        baseNoGraIva: this.formatCurrency(baseNoGraIva),
        baseImponible: this.formatCurrency(baseImponible),
        baseImpGrav: this.formatCurrency(baseImpGrav),
        montoIva: this.formatCurrency(montoIva),
        montoIce: this.formatCurrency(montoIce),
        
        // Compensaciones
        compensaciones: this.getCompensaciones(input),
        
        // Retenciones que nos hizo el cliente
        valorRetIva: this.formatCurrency(Number(input.infoFactura.valorRetIva || 0)),
        valorRetRenta: this.formatCurrency(Number(input.infoFactura.valorRetRenta || 0)),
        
        // Pago y Establecimiento
        formaPago: this.getFormaPago(input),
        codEstab: input.infoTributaria.estab || "001",
        ventasEstab: this.formatCurrency(ventasEstab),
        ivaComp: "0.00" // Compensación por solidaridad (usualmente 0)
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

  private formatCurrency(value: number): string {
    return value.toFixed(2);
  }

  private getFormaPago(input: IVentaInput): string {
    const pagosRaw = input.infoFactura.pagos?.pago;
    if (!pagosRaw) return "01"; // Default "Sin utilización del sistema financiero"
    const pagos = Array.isArray(pagosRaw) ? pagosRaw : [pagosRaw];
    if (pagos.length > 0 && pagos[0].formaPago) {
      return pagos[0].formaPago.toString().padStart(2, '0');
    }
    return "01";
  }

  private getCompensaciones(input: IVentaInput): { tipoCompe: string; monto: string }[] {
    const compRaw = input.infoFactura.compensaciones?.compensacion;
    if (!compRaw) return [];
    
    const comps = Array.isArray(compRaw) ? compRaw : [compRaw];
    return comps.map(c => ({
      tipoCompe: c.codigo ? c.codigo.toString().padStart(2, '0') : (input.tipoCompe || "01"),
      monto: this.formatCurrency(Number(c.valor || 0))
    }));
  }
}
