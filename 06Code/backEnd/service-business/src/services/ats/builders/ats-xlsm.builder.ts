import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { IInformanteAts } from '../interfaces/ats-informante.interface';
import { ICompraAts } from '../interfaces/ats-compras.interface';
import { IVentaAts } from '../interfaces/ats-ventas.interface';
import { IAnuladoAts } from '../interfaces/ats-anulados.interface';
import { IExportacionAts } from '../interfaces/ats-exportaciones.interface';

export class AtsXlsmBuilder {
  private informante?: IInformanteAts;
  private compras: ICompraAts[] = [];
  private ventas: IVentaAts[] = [];
  private exportaciones: IExportacionAts[] = [];
  private anulados: IAnuladoAts[] = [];
  private templatePath: string;

  constructor(templatePath: string) {
    this.templatePath = templatePath;
  }

  public buildInformante(data: IInformanteAts): AtsXlsmBuilder {
    this.informante = data;
    return this;
  }

  public buildCompras(data: ICompraAts[]): AtsXlsmBuilder {
    this.compras = data;
    return this;
  }

  public buildVentas(data: IVentaAts[]): AtsXlsmBuilder {
    this.ventas = data;
    return this;
  }

  public buildExportaciones(data: IExportacionAts[]): AtsXlsmBuilder {
    this.exportaciones = data;
    return this;
  }

  public buildAnulados(data: IAnuladoAts[]): AtsXlsmBuilder {
    this.anulados = data;
    return this;
  }

  /**
   * Genera el archivo Excel (XLSM) y lo devuelve como Buffer.
   */
  public async getResult(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(this.templatePath);

    this.writeInformante(workbook);
    this.writeVentas(workbook);
    this.writeAnulados(workbook);
    this.writeExportaciones(workbook);
    this.writeCompras(workbook);

    // Retornar el archivo procesado
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }

  private writeInformante(workbook: ExcelJS.Workbook): void {
    if (!this.informante) return;
    const sheetInfo = workbook.getWorksheet('Informante');
    if (sheetInfo) {
      // Limpiar filas residuales que la plantilla pueda tener debajo de la fila 2
      try {
        sheetInfo.spliceRows(3, 100);
      } catch (e) {
        // Ignorar si hay algún problema eliminando filas
      }

      const row = sheetInfo.getRow(2);
      row.getCell(1).value = this.informante.IdInformante || "";
      row.getCell(2).value = this.informante.razonSocial || "";
      row.getCell(3).value = this.informante.anio || "";
      row.getCell(4).value = this.informante.mes || "";
      row.getCell(5).value = ""; // Micro Empresas (opcional)
      row.getCell(6).value = this.informante.numEstabRuc || "001";
      row.getCell(7).value = this.informante.totalVentas || 0;
      row.commit();
    }
  }

  private writeVentas(workbook: ExcelJS.Workbook): void {
    if (this.ventas.length === 0) return;
    
    const sheetVentasCli = workbook.getWorksheet('Ventas Cliente');
    const sheetCompensaciones = workbook.getWorksheet('Compensaciones Ventas');
    const sheetFormasCobro = workbook.getWorksheet('Formas de Cobro');
    const sheetVentasEstab = workbook.getWorksheet('Ventas Establecimiento');

    let ventasRowIndex = 2; // Empezamos a llenar desde la fila 2
    let cobrosRowIndex = 2;
    let compRowIndex = 2;
    
    const estabTotals = new Map<string, number>();

    this.ventas.forEach((venta, index) => {
      const v = venta.tipo1_y_2;
      const codVenta = `V${index + 1}`; // ID Relacional: V1, V2, etc.

      // Llenar "Ventas Cliente"
      if (sheetVentasCli) {
        const row = sheetVentasCli.getRow(ventasRowIndex);
        row.getCell(1).value = codVenta;
        row.getCell(2).value = v.tpIdCliente;
        row.getCell(3).value = v.idCliente;
        row.getCell(4).value = v.parteRel;
        row.getCell(5).value = v.tipoCliente;
        row.getCell(6).value = v.DenoCli;
        row.getCell(7).value = v.tipoComprobante;
        row.getCell(8).value = v.tipoEm;
        row.getCell(9).value = Number(v.numeroComprobantes) || 1;
        row.getCell(10).value = Number(v.baseNoGraIva) || 0;
        row.getCell(11).value = Number(v.baseImponible) || 0;
        row.getCell(12).value = Number(v.baseImpGrav) || 0;
        row.getCell(13).value = Number(v.montoIva) || 0;
        row.getCell(14).value = Number(v.montoIce) || 0;
        row.getCell(15).value = Number(v.valorRetIva) || 0;
        row.getCell(16).value = Number(v.valorRetRenta) || 0;
        row.commit();
      }

      // Llenar "Formas de Cobro"
      if (sheetFormasCobro) {
        const cRow = sheetFormasCobro.getRow(cobrosRowIndex);
        cRow.getCell(1).value = codVenta;
        cRow.getCell(2).value = v.formaPago;
        cRow.commit();
        cobrosRowIndex++;
      }

      // Llenar "Compensaciones Ventas"
      if (sheetCompensaciones && v.compensaciones && v.compensaciones.length > 0) {
        v.compensaciones.forEach(comp => {
          const compRow = sheetCompensaciones.getRow(compRowIndex);
          compRow.getCell(1).value = codVenta;
          compRow.getCell(2).value = comp.tipoCompe;
          compRow.getCell(3).value = comp.monto;
          compRow.commit();
          compRowIndex++;
        });
      }

      // Acumular totales para "Ventas Establecimiento"
      const estab = v.codEstab || "001";
      const currentTotal = estabTotals.get(estab) || 0;
      estabTotals.set(estab, currentTotal + (Number(v.ventasEstab) || 0));

      ventasRowIndex++;
    });

    // Llenar "Ventas Establecimiento"
    if (sheetVentasEstab) {
      let estabRowIndex = 2;
      estabTotals.forEach((total, estabId) => {
        const eRow = sheetVentasEstab.getRow(estabRowIndex);
        eRow.getCell(1).value = estabId;
        eRow.getCell(2).value = total;
        eRow.getCell(3).value = 0; // ivaComp
        eRow.commit();
        estabRowIndex++;
      });
    }
  }

  private writeAnulados(workbook: ExcelJS.Workbook): void {
    if (this.anulados.length === 0) return;
    const sheetAnulados = workbook.getWorksheet('Anulados');
    if (sheetAnulados) {
      let anuladosRowIndex = 2;
      this.anulados.forEach(anulado => {
        const a = anulado.tipo1_y_2;
        const row = sheetAnulados.getRow(anuladosRowIndex);
        row.getCell(1).value = a.tipoComprobante;
        row.getCell(2).value = a.establecimiento;
        row.getCell(3).value = a.puntoEmision;
        row.getCell(4).value = a.secuencialInicio;
        row.getCell(5).value = a.secuencialFin;
        row.getCell(6).value = a.autorizacion;
        row.commit();
        anuladosRowIndex++;
      });
    }
  }

  private writeExportaciones(workbook: ExcelJS.Workbook): void {
    if (this.exportaciones.length === 0) return;
    const sheet = workbook.getWorksheet('Exportaciones');
    if (sheet) {
      let rowIndex = 2;
      this.exportaciones.forEach(exp => {
        const e = exp.tipo1_y_2;
        const row = sheet.getRow(rowIndex);
        row.getCell(1).value = e.tpIdClienteEx;
        row.getCell(2).value = e.idClienteEx;
        row.getCell(3).value = e.parteRel;
        row.getCell(4).value = e.tipoCli;
        row.getCell(5).value = e.denoExpCli;
        row.getCell(6).value = e.tipoRegi;
        row.getCell(7).value = e.paisEfecPagoGen;
        row.getCell(8).value = e.paisEfecPagoParFis;
        row.getCell(9).value = e.denopagoRegFis;
        row.getCell(10).value = e.paisEfecExp;
        row.getCell(11).value = e.exportacionDe;
        row.getCell(12).value = e.tipIngExt;
        row.getCell(13).value = e.ingextgravotropaís;
        row.getCell(14).value = e.impuestootropaís;
        row.getCell(15).value = e.tipoComprobante;
        row.getCell(16).value = e.distAduanero;
        row.getCell(17).value = e.anio;
        row.getCell(18).value = e.regimen;
        row.getCell(19).value = e.correlativo;
        row.getCell(20).value = e.verificador;
        row.getCell(21).value = e.docTransp;
        row.getCell(22).value = e.fechaEmbarque;
        row.getCell(23).value = e.fue;
        row.getCell(24).value = e.valorFOB;
        row.getCell(25).value = e.valorFOBComprobante;
        row.getCell(26).value = e.establecimiento;
        row.getCell(27).value = e.puntoEmision;
        row.getCell(28).value = e.secuencial;
        row.getCell(29).value = e.autorizacion;
        row.getCell(30).value = e.fechaEmision;
        
        row.commit();
        rowIndex++;
      });
    }
  }

  private writeCompras(workbook: ExcelJS.Workbook): void {
    if (this.compras.length === 0) return;
    
    this.writeComprasDetalladas(workbook);
    this.writeComprasFormasPago(workbook);
    this.writeComprasRetenciones(workbook);
    this.writeComprasReembolsos(workbook);
  }

  private writeComprasDetalladas(workbook: ExcelJS.Workbook): void {
    const sCompras = workbook.getWorksheet('Compras Detalladas');
    if (!sCompras) return;

    let idxCompras = 3;
    this.compras.forEach((compra, index) => {
      const codigoCompra = index + 1;
      const c = compra.tipo1_y_2;

      const row = sCompras.getRow(idxCompras);
      row.getCell(1).value = codigoCompra;
      row.getCell(2).value = c.codSustento;
      row.getCell(3).value = c.tpIdProv;
      row.getCell(4).value = c.idProv;
      row.getCell(5).value = c.tipoComprobante;
      row.getCell(6).value = c.tipoProv;
      row.getCell(7).value = c.denopr;
      row.getCell(8).value = c.parteRel;
      row.getCell(9).value = c.fechaRegistro;
      row.getCell(10).value = c.establecimiento;
      row.getCell(11).value = c.puntoEmision;
      row.getCell(12).value = c.secuencial;
      row.getCell(13).value = c.fechaEmision;
      row.getCell(14).value = c.autorizacion;
      row.getCell(15).value = c.baseNoGraIva;
      row.getCell(16).value = c.baseImponible;
      row.getCell(17).value = c.baseImpGrav;
      row.getCell(18).value = c.baseImpExe;
      row.getCell(19).value = c.montoIce;
      row.getCell(20).value = c.montoIva;
      row.getCell(21).value = c.valRetBien10;
      row.getCell(22).value = c.valRetServ20;
      row.getCell(23).value = c.valorRetBienes;
      row.getCell(24).value = c.valRetServ50;
      row.getCell(25).value = c.valorRetServicios;
      row.getCell(26).value = c.valRetServ100;
      row.getCell(27).value = c.valorRetencionNc;
      row.getCell(28).value = c.totbasesImpReemb;
      row.getCell(29).value = c.pagoLocExt;
      row.getCell(30).value = c.tipoRegi;
      row.getCell(31).value = c.paisEfecPagoGen;
      row.getCell(32).value = c.paisEfecPagoParFis;
      row.getCell(33).value = c.pagoRegFis;
      row.getCell(34).value = c.paisEfecPago;
      row.getCell(35).value = c.aplicConvDobTrib;
      row.getCell(36).value = c.pagExtSujRetNorLeg;
      
      if (c.pagoRegFis) {
        row.getCell(37).value = c.pagoRegFis;
      }

      if (c.docModificado) {
        row.getCell(38).value = c.docModificado;
        row.getCell(39).value = c.estabModificado;
        row.getCell(40).value = c.ptoEmiModificado;
        row.getCell(41).value = c.secModificado;
        row.getCell(42).value = c.autModificado;
      }
      
      row.commit();
      idxCompras++;
    });
  }

  private writeComprasFormasPago(workbook: ExcelJS.Workbook): void {
    const sFormasPago = workbook.getWorksheet('Compras Formas Pago');
    if (!sFormasPago) return;

    let idxFormasPago = 3;
    this.compras.forEach((compra, index) => {
      const codigoCompra = index + 1;
      if (compra.tipo1_y_2.pagos && compra.tipo1_y_2.pagos.pago) {
        const pagos = Array.isArray(compra.tipo1_y_2.pagos.pago) ? compra.tipo1_y_2.pagos.pago : [compra.tipo1_y_2.pagos.pago];
        pagos.forEach(p => {
          const row = sFormasPago.getRow(idxFormasPago);
          row.getCell(1).value = codigoCompra;
          row.getCell(2).value = p.formaPago;
          row.commit();
          idxFormasPago++;
        });
      }
    });
  }

  private writeComprasRetenciones(workbook: ExcelJS.Workbook): void {
    const sRetenciones = workbook.getWorksheet('Compras Retenciones');
    if (!sRetenciones) return;

    let idxRetenciones = 2;
    this.compras.forEach((compra, index) => {
      const codigoCompra = index + 1;
      if (compra.tipo1_y_2.retenciones && compra.tipo1_y_2.retenciones.retencion) {
        const retenciones = Array.isArray(compra.tipo1_y_2.retenciones.retencion) ? compra.tipo1_y_2.retenciones.retencion : [compra.tipo1_y_2.retenciones.retencion];
        retenciones.forEach(r => {
          const row = sRetenciones.getRow(idxRetenciones);
          row.getCell(1).value = codigoCompra;
          row.getCell(2).value = r.codigoRetencion;
          row.getCell(3).value = r.baseImponible;
          row.getCell(4).value = r.porcentajeRetener;
          row.getCell(5).value = r.valorRetenido;
          row.getCell(6).value = r.fechaPagoDiv;
          row.getCell(7).value = r.imRentaSoc;
          row.getCell(8).value = r.anioUtDiv;
          row.getCell(9).value = r.numCajBan;
          row.getCell(10).value = r.precCajBan;
          row.commit();
          idxRetenciones++;
        });
      }
    });
  }

  private writeComprasReembolsos(workbook: ExcelJS.Workbook): void {
    const sReembolsos = workbook.getWorksheet('Compras Reembolsos');
    if (!sReembolsos) return;

    let idxReembolsos = 3;
    this.compras.forEach((compra, index) => {
      const codigoCompra = index + 1;
      if (compra.tipo1_y_2.reembolsos && compra.tipo1_y_2.reembolsos.reembolsoDetalle) {
        const reembolsos = Array.isArray(compra.tipo1_y_2.reembolsos.reembolsoDetalle) ? compra.tipo1_y_2.reembolsos.reembolsoDetalle : [compra.tipo1_y_2.reembolsos.reembolsoDetalle];
        reembolsos.forEach(r => {
          const row = sReembolsos.getRow(idxReembolsos);
          row.getCell(1).value = codigoCompra;
          row.getCell(2).value = r.tipoComprobanteReemb;
          row.getCell(3).value = r.tpIdProvReemb;
          row.getCell(4).value = r.idProvReemb;
          row.getCell(5).value = r.establecimientoReemb;
          row.getCell(6).value = r.puntoEmisionReemb;
          row.getCell(7).value = r.secuencialReemb;
          row.getCell(8).value = r.fechaEmisionReemb;
          row.getCell(9).value = r.autorizacionReemb;
          row.getCell(10).value = r.baseImponibleReemb;
          row.getCell(11).value = r.baseImpGravReemb;
          row.getCell(12).value = r.baseNoGraIvaReemb;
          row.getCell(13).value = r.baseImpExeReemb;
          row.getCell(14).value = r.montoIceRemb;
          row.getCell(15).value = r.montoIvaRemb;
          row.commit();
          idxReembolsos++;
        });
      }
    });
  }
}
