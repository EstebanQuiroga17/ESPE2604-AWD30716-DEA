import AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';

export class InvoiceService {
  /**
   * 1. Recibir un zip con archivos xml (facturas) y descomprimir el archivo.
   */
  public unzipXmlFiles(zipBuffer: Buffer): string[] {
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();
    const xmlContents: string[] = [];

    for (const entry of zipEntries) {
      // Solo procesar archivos .xml
      if (!entry.isDirectory && entry.name.toLowerCase().endsWith('.xml')) {
        const content = entry.getData().toString('utf8');
        xmlContents.push(content);
      }
    }
    return xmlContents;
  }

  /**
   * 2. Extraer la información del campo <comprobante> de cada archivo xml.
   */
  public extractComprobante(xmlContent: string): string | null {
    // Regex para extraer todo el contenido dentro de <comprobante><![CDATA[ ... ]]></comprobante>
    const match = xmlContent.match(/<comprobante><!\[CDATA\[([\s\S]*?)\]\]><\/comprobante>/);
    if (match && match[1]) {
      return match[1].trim();
    }
    
    // Fallback si por alguna razón no tiene CDATA
    const matchNoCdata = xmlContent.match(/<comprobante>([\s\S]*?)<\/comprobante>/);
    if (matchNoCdata && matchNoCdata[1]) {
        return matchNoCdata[1].trim();
    }
    return null;
  }

  /**
   * 3. Método que integra las funcionalidades.
   */
  public processZippedInvoices(zipBuffer: Buffer): string[] {
    const xmls = this.unzipXmlFiles(zipBuffer);
    const comprobantes: string[] = [];

    for (const xml of xmls) {
      const comprobante = this.extractComprobante(xml);
      if (comprobante) {
        comprobantes.push(comprobante);
      }
    }

    return comprobantes;
  }

  /**
   * 4. Convertir arreglo de strings XML a JSONs crudos
   */
  public parseXmlsToJson(xmls: string[]): any[] {
    const parser = new XMLParser({ ignoreAttributes: false, parseAttributeValue: true });
    const jsons: any[] = [];
    
    for (const xml of xmls) {
      try {
        const jsonObj = parser.parse(xml);
        if (jsonObj) {
          jsons.push(jsonObj);
        }
      } catch (e) {
        console.error('Error parsing XML to JSON:', e);
      }
    }
    
    return jsons;
  }
}
