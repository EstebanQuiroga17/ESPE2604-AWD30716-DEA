import AdmZip from 'adm-zip';

export class XmlService {
  /**
   * Parsea un contenido CSV de forma robusta teniendo en cuenta comillas dobles y comas internas.
   */

  private escapeXml(unsafe: any): string {
    if (unsafe === undefined || unsafe === null) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Convierte un string de contenido CSV en un string XML estructurado.
   */

  private getXmlFileName(xmlContent: string, index: number): string {
    const authMatch = xmlContent.match(/<numeroAutorizacion>([^<]+)<\/numeroAutorizacion>/i);
    if (authMatch && authMatch[1]) {
      const cleaned = authMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      if (cleaned) return `${cleaned}.xml`;
    }

    const accessMatch = xmlContent.match(/<claveAcceso>([^<]+)<\/claveAcceso>/i);
    if (accessMatch && accessMatch[1]) {
      const cleaned = accessMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      if (cleaned) return `${cleaned}.xml`;
    }

    return `factura_${index + 1}.xml`;
  }

  public compressXmlsToZip(xmlList: string[]): Buffer {
    const zip = new AdmZip();

    for (let i = 0; i < xmlList.length; i++) {
      const item = xmlList[i];
      const fileName = this.getXmlFileName(item, i);
      zip.addFile(fileName, Buffer.from(item, 'utf-8'));
    }

    return zip.toBuffer();
  }
}
