import { XMLParser } from 'fast-xml-parser';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';

export interface FacturaDetalle {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  precioTotalSinImpuesto: number;
}

export interface SRIFactura {
  tipoDocumento: string;
  infoTributaria: {
    ruc: string;
    razonSocial: string;
    claveAcceso: string;
    dirMatriz: string;
    ambiente: string;
  };
  infoFactura: {
    fechaEmision: string;
    totalSinImpuestos: number;
    subtotal15: number;
    subtotal0: number;
    importeTotal: number;
    propina?: number;
  };
  detalles: FacturaDetalle[];
  visuals: {
    barcodeBase64: string;
    qrBase64: string;
  };
}

/**
 * Genera un código de barras CODE128 como imagen PNG en Base64.
 * Usa node-canvas en lugar de document.createElement('canvas') del browser.
 */
const generateBarcode = (text: string): string => {
  const canvas = createCanvas(300, 50);
  JsBarcode(canvas as any, text, {
    format: 'CODE128',
    displayValue: false,
    height: 40,
    width: 1.5,
    margin: 0,
  });
  return canvas.toDataURL('image/png');
};

/**
 * Parsea un string XML de factura electrónica del SRI y retorna la metadata estructurada.
 * Adaptación server-side: recibe el string XML directamente (sin FileReader del browser).
 */
export const parseSRIXML = async (xmlContent: string): Promise<SRIFactura> => {
  if (!xmlContent || typeof xmlContent !== 'string') {
    throw new Error('El contenido XML es vacío o no es un string válido');
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    parseTagValue: false,
  });

  let jsonObj = parser.parse(xmlContent);

  // SRI invoices often wrap the real XML in a <comprobante> CDATA node if authorized.
  if (jsonObj.autorizacion && jsonObj.autorizacion.comprobante) {
    const comprobanteCdata = jsonObj.autorizacion.comprobante;
    let innerXml = '';
    if (typeof comprobanteCdata === 'string') {
      innerXml = comprobanteCdata;
    } else if (comprobanteCdata.__cdata) {
      innerXml = comprobanteCdata.__cdata;
    }

    if (innerXml) {
      jsonObj = parser.parse(innerXml);
    }
  }

  const tipoDocumento = jsonObj.factura ? 'FACTURA' : 
                        (jsonObj.notaCredito ? 'NOTA DE CRÉDITO' : 
                        (jsonObj.comprobanteRetencion ? 'COMPROBANTE DE RETENCIÓN' : 'COMPROBANTE'));
  const documento = jsonObj.factura || jsonObj.notaCredito || jsonObj.comprobanteRetencion;

  if (!documento) {
    throw new Error('El archivo no tiene una estructura válida de comprobante electrónico soportado');
  }

  const infoTributaria = documento.infoTributaria || {};
  const infoDoc = documento.infoFactura || documento.infoNotaCredito || documento.infoCompRetencion || {};
  
  let detallesArray: any[] = [];
  if (documento.detalles?.detalle) {
    detallesArray = Array.isArray(documento.detalles.detalle) ? documento.detalles.detalle : [documento.detalles.detalle];
  } else if (documento.docsSustento?.docSustento) { // Comprobante Retención v2.0
    const docs = Array.isArray(documento.docsSustento.docSustento) ? documento.docsSustento.docSustento : [documento.docsSustento.docSustento];
    docs.forEach((doc: any) => {
      const rets = doc.retenciones?.retencion;
      if (rets) {
        const retenciones = Array.isArray(rets) ? rets : [rets];
        retenciones.forEach((r: any) => {
          detallesArray.push({
            descripcion: `Retención Cód. ${r.codigoRetencion || ''} (Doc: ${doc.numDocSustento || ''})`,
            cantidad: r.porcentajeRetener,
            precioUnitario: r.baseImponible,
            descuento: 0,
            precioTotalSinImpuesto: r.valorRetenido
          });
        });
      }
    });
  } else if (documento.impuestos?.impuesto) { // Comprobante Retención v1.0
    const rets = Array.isArray(documento.impuestos.impuesto) ? documento.impuestos.impuesto : [documento.impuestos.impuesto];
    rets.forEach((r: any) => {
      detallesArray.push({
        descripcion: `Retención Cód. ${r.codigoRetencion || ''}`,
        cantidad: r.porcentajeRetener,
        precioUnitario: r.baseImponible,
        descuento: 0,
        precioTotalSinImpuesto: r.valorRetenido
      });
    });
  }

  const detalles: FacturaDetalle[] = detallesArray.map((d: any) => ({
    nombre: d.descripcion || 'Sin descripción',
    cantidad: parseFloat(d.cantidad || '0'),
    precioUnitario: parseFloat(d.precioUnitario || '0'),
    descuento: parseFloat(d.descuento || '0'),
    precioTotalSinImpuesto: parseFloat(d.precioTotalSinImpuesto || '0'),
  }));

  let subtotal15 = 0;
  let subtotal0 = 0;

  // Parse taxes
  const totalConImpuestos = infoDoc.totalConImpuestos?.totalImpuesto || [];
  const impuestosArray = Array.isArray(totalConImpuestos) ? totalConImpuestos : [totalConImpuestos];

  impuestosArray.forEach((imp: any) => {
    if (imp.codigo === '2') { // IVA
      if (imp.codigoPorcentaje === '4' || imp.codigoPorcentaje === '2') { // 15% o 12%
        subtotal15 += parseFloat(imp.baseImponible || '0');
      } else if (imp.codigoPorcentaje === '0') { // 0%
        subtotal0 += parseFloat(imp.baseImponible || '0');
      }
    }
  });

  const ruc = String(infoTributaria.ruc || '');
  const claveAcceso = String(infoTributaria.claveAcceso || '');
  const ambiente = infoTributaria.ambiente || '1';

  // Generar visuales
  const barcodeBase64 = generateBarcode(claveAcceso);

  // URL SRI para el QR
  const sriUrl = `https://srienlinea.sri.gob.ec/sri-en-linea/qr/design/swrx?claveAcceso=${claveAcceso}`;
  const qrBase64 = await QRCode.toDataURL(sriUrl, { errorCorrectionLevel: 'M', margin: 1 });

  let importeTotal = parseFloat(infoDoc.importeTotal || infoDoc.valorModificacion || '0');
  if (jsonObj.comprobanteRetencion) {
    importeTotal = detalles.reduce((sum, det) => sum + det.precioTotalSinImpuesto, 0);
  }

  const result: SRIFactura = {
    tipoDocumento,
    infoTributaria: {
      ruc,
      razonSocial: infoTributaria.razonSocial || '',
      claveAcceso,
      dirMatriz: infoTributaria.dirMatriz || '',
      ambiente: String(ambiente),
    },
    infoFactura: {
      fechaEmision: infoDoc.fechaEmision || '',
      totalSinImpuestos: parseFloat(infoDoc.totalSinImpuestos || '0'),
      subtotal15,
      subtotal0,
      importeTotal,
      propina: parseFloat(infoDoc.propina || '0'),
    },
    detalles,
    visuals: {
      barcodeBase64,
      qrBase64,
    },
  };

  return result;
};
