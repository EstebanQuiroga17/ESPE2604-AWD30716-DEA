import { IInformanteAts } from '../interfaces/ats-informante.interface';

export class AtsXlsmBuilder {
  private informante?: IInformanteAts;
  private compras: any[] = [];
  private ventas: any[] = [];
  private exportaciones: any[] = [];
  private recap: any[] = [];
  private fideicomisos: any[] = [];
  private anulados: any[] = [];
  private rendimientos: any[] = [];

  public buildInformante(data: IInformanteAts): AtsXlsmBuilder {
    this.informante = data;
    return this;
  }

  public buildCompras(data: any[]): AtsXlsmBuilder {
    this.compras = data;
    return this;
  }

  public buildVentas(data: any[]): AtsXlsmBuilder {
    this.ventas = data;
    return this;
  }

  public buildExportaciones(data: any[]): AtsXlsmBuilder {
    this.exportaciones = data;
    return this;
  }

  public buildRecap(data: any[]): AtsXlsmBuilder {
    this.recap = data;
    return this;
  }

  public buildFideicomisos(data: any[]): AtsXlsmBuilder {
    this.fideicomisos = data;
    return this;
  }

  public buildAnulados(data: any[]): AtsXlsmBuilder {
    this.anulados = data;
    return this;
  }

  public buildRendimientos(data: any[]): AtsXlsmBuilder {
    this.rendimientos = data;
    return this;
  }

  /**
   * Genera el archivo Excel (XLSM) y lo devuelve como Buffer.
   */
  public getResult(): Buffer {
    // TODO: Implementar lógica de construcción de Excel usando exceljs o xlsx
    // Aquí escribiremos iterativamente las propiedades de `this.informante`, `this.compras`, etc.
    // en sus respectivas hojas.
    return Buffer.from([]);
  }
}
