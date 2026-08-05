import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { UsersReportDocument } from './UsersReportDocument.service';

/**
 * UserReportService — Maneja la generación de reportes de usuarios en PDF.
 */
export class UserReportService {
  /**
   * Genera un PDF con el reporte de los usuarios registrados.
   */
  public async generateUsersReportPdf(users: any[]): Promise<Buffer> {
    const element = React.createElement(UsersReportDocument, { users });
    const buffer = await renderToBuffer(element as any);
    return Buffer.from(buffer);
  }
}
