import { IMapper } from '../interfaces/mapper.interface';
import { IInformanteInput, IInformanteAts } from '../interfaces/ats-informante.interface';

export class InformanteMapper implements IMapper<IInformanteInput, IInformanteAts> {
  public map(input: IInformanteInput): IInformanteAts {
    return {
      IdInformante: input.ruc,
      razonSocial: this.sanitizeRazonSocial(input.razonSocial),
      anio: input.anio.toString(),
      mes: this.padNumber(input.mes, 2),
      numEstabRuc: this.padNumber(input.numEstablecimientos, 3),
      // TODO: Calcular al finalizar el ATS sumando bases imponibles de las facturas (Solo Facturación Física F)
      totalVentas: "0.00", 
      codigoOperativo: "IVA" // Requerido estáticamente por el SRI para este código operativo
    };
  }

  /**
   * Elimina caracteres especiales de la Razón Social y trunca a 500 caracteres (máximo del SRI).
   * @param razonSocial 
   * @returns string limpio
   */
  private sanitizeRazonSocial(razonSocial: string): string {
    if (!razonSocial) return '';
    // Quitar caracteres no alfanuméricos y espacios extras
    const sanitized = razonSocial.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    return sanitized.substring(0, 500);
  }

  /**
   * Rellena un número con ceros a la izquierda hasta alcanzar la longitud especificada.
   * @param num Número original
   * @param length Longitud deseada
   * @returns String con padding
   */
  private padNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }
}
