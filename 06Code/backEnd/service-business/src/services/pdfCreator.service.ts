import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import AdmZip from 'adm-zip';
import { parseSRIXML } from './xmlParser.service';
import { RideDocument } from './RideDocument.service';
import { UsersReportDocument } from './UsersReportDocument.service';

interface PdfResult {
  buffer: Buffer;
  claveAcceso: string;
}

interface PdfError {
  index: number;
  message: string;
}

interface MultiplePdfsResult {
  pdfs: PdfResult[];
  errors: PdfError[];
}

interface ZipResult {
  zipBuffer: Buffer;
  errors: PdfError[];
}

/**
 * PdfCreatorService — Orquesta el pipeline XML → SRIFactura → PDF.
 * Utiliza @react-pdf/renderer del lado del servidor para renderizar
 * el componente RideDocument en un Buffer de PDF.
 */
export class PdfCreatorService {
  /**
   * Genera un solo PDF a partir de un string XML de factura SRI.
   * Pipeline: xmlString → parseSRIXML() → RideDocument → renderToBuffer()
   */
  public async generatePdf(xmlContent: string): Promise<PdfResult> {
    const factura = await parseSRIXML(xmlContent);
    const element = React.createElement(RideDocument, { factura });
    const buffer = await renderToBuffer(element as any);

    return {
      buffer: Buffer.from(buffer),
      claveAcceso: factura.infoTributaria.claveAcceso,
    };
  }

  /**
   * Genera múltiples PDFs a partir de un arreglo de strings XML.
   * Usa Promise.allSettled para que un XML malformado no aborte el lote completo.
   */
  public async generateMultiplePdfs(xmlContents: string[]): Promise<MultiplePdfsResult> {
    const promises = xmlContents.map((xml, index) =>
      this.generatePdf(xml).then(
        (result) => ({ status: 'fulfilled' as const, value: result, index }),
        (error) => ({ status: 'rejected' as const, reason: error, index })
      )
    );

    const results = await Promise.all(promises);

    const pdfs: PdfResult[] = [];
    const errors: PdfError[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        pdfs.push(result.value);
      } else {
        errors.push({
          index: result.index,
          message: result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
        });
      }
    }

    return { pdfs, errors };
  }

  /**
   * Genera los PDFs y los empaqueta en un archivo ZIP al vuelo.
   * Los archivos se nombran como {claveAcceso}.pdf (o factura_{i+1}.pdf como fallback).
   */
  public async generatePdfsAsZip(xmlContents: string[]): Promise<ZipResult> {
    const { pdfs, errors } = await this.generateMultiplePdfs(xmlContents);

    const zip = new AdmZip();
    const usedNames = new Set<string>();

    for (let i = 0; i < pdfs.length; i++) {
      const { buffer, claveAcceso } = pdfs[i];
      let fileName = claveAcceso
        ? `${claveAcceso}.pdf`
        : `factura_${i + 1}.pdf`;

      // Evitar nombres duplicados
      if (usedNames.has(fileName)) {
        fileName = `factura_${i + 1}_${claveAcceso || 'sin_clave'}.pdf`;
      }
      usedNames.add(fileName);

      zip.addFile(fileName, buffer);
    }

    return {
      zipBuffer: zip.toBuffer(),
      errors,
    };
  }

  /**
   * Genera un PDF con el reporte de los usuarios registrados.
   */
  public async generateUsersReportPdf(users: any[]): Promise<Buffer> {
    const element = React.createElement(UsersReportDocument, { users });
    const buffer = await renderToBuffer(element as any);
    return Buffer.from(buffer);
  }
}
