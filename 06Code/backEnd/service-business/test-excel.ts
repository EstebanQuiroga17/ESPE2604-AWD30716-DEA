import { XMLParser } from 'fast-xml-parser';
import * as fs from 'fs';
import * as path from 'path';
import { VentaMapper } from './src/services/ats/mappers/ventas.mapper';
import { AtsXlsmBuilder } from './src/services/ats/builders/ats-xlsm.builder';
import { IInformanteAts } from './src/services/ats/interfaces/ats-informante.interface';

async function run() {
  try {
    // 1. Leer el XML de prueba
    const xmlPath = path.join(__dirname, '..', '..', '..', '07Other', 'XML y XSD Factura', 'factura_V2.1.0.xml');
    const xmlData = fs.readFileSync(xmlPath, 'utf8');

    // 2. Parsear XML
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsedXml = parser.parse(xmlData);
    const facturaXml = parsedXml.factura;

    // 3. Crear el input para el Mapper
    // Simular los campos de contexto
    const ventaInput = {
      infoTributaria: facturaXml.infoTributaria,
      infoFactura: facturaXml.infoFactura,
      parteRelacionada: "NO"
    };

    // 4. Mapear
    const mapper = new VentaMapper();
    const ventaAts = mapper.map(ventaInput as any);

    // 5. Configurar Informante
    const informante: IInformanteAts = {
      IdInformante: "1792152267001",
      razonSocial: "EMPRESA PRUEBA S.A.",
      anio: "2024",
      mes: "08",
      numEstabRuc: "001",
      totalVentas: "150.50",
      codigoOperativo: "IVA"
    };

    // 6. Construir Excel
    const templatePath = path.join(__dirname, '..', '..', '..', '07Other', 'Ejemplo_PlantillaATS2020_Mensual.xlsx');
    const builder = new AtsXlsmBuilder(templatePath);
    builder.buildInformante(informante);
    builder.buildVentas([ventaAts, ventaAts]); // Ponemos 2 ventas idénticas para probar
    
    // Probar Anulados
    const AnuladoMapper = require('./src/services/ats/mappers/anulados.mapper').AnuladoMapper;
    const anuladoMapper = new AnuladoMapper();
    const anuladoAts = anuladoMapper.map({
      tipoComprobante: "01",
      establecimiento: "001",
      puntoEmision: "001",
      secuencialInicio: "000000001",
      secuencialFin: "000000005",
      autorizacion: "1234567890"
    });
    builder.buildAnulados([anuladoAts]);

    // Probar Exportaciones
    const ExportacionMapper = require('./src/services/ats/mappers/exportaciones.mapper').ExportacionMapper;
    const expMapper = new ExportacionMapper();
    const expAts = expMapper.map({
      codDoc: "01",
      estab: "001",
      ptoEmi: "002",
      secuencial: "000000123",
      claveAcceso: "1234567890123456789012345678901234567890123456789",
      fechaEmision: "15/08/2026",
      paisOrigen: "593",
      paisDestino: "156", // China, por ejemplo
      tipoldentificacionComprador: "04",
      razonSocialComprador: "IMPORTADOR CHINO LTD",
      identificacionComprador: "999999999",
      totalSinImpuestos: "15000.00"
    });
    builder.buildExportaciones([expAts]);

    // Probar Compras
    const CompraMapper = require('./src/services/ats/mappers/compras.mapper').CompraMapper;
    const compraMapper = new CompraMapper();
    const compraAts = compraMapper.map({
      codSustento: "01",
      fechaRegistroContable: "15/08/2026",
      parteRelacionada: "NO",
      pagoLocExt: "01",
      infoTributaria: {
        ambiente: "1",
        tipoEmision: "1",
        razonSocial: "PROVEEDOR S.A.",
        nombreComercial: "PROVEEDOR",
        ruc: "0999999999001",
        claveAcceso: "1234567890123456789012345678901234567890123456789",
        codDoc: "01",
        estab: "001",
        ptoEmi: "002",
        secuencial: "000000321",
        dirMatriz: "GUAYAQUIL"
      },
      infoFactura: {
        fechaEmision: "10/08/2026",
        dirEstablecimiento: "GUAYAQUIL",
        obligadoContabilidad: "SI",
        tipoIdentificacionComprador: "04",
        razonSocialComprador: "MI EMPRESA",
        identificacionComprador: "1799999999001",
        totalSinImpuestos: 1000.00,
        totalDescuento: 0,
        totalConImpuestos: {
          totalImpuesto: [
            { codigo: 2, codigoPorcentaje: 2, baseImponible: 1000.00, valor: 120.00 }
          ]
        },
        propina: 0,
        importeTotal: 1120.00,
        moneda: "DOLAR",
        pagos: {
          pago: [
            { formaPago: "01", total: 1120.00, plazo: 0, unidadTiempo: "dias" }
          ]
        }
      },
      detalles: { detalle: [] },
      retenciones: {
        retencion: [
          {
            codigoRetencion: "312",
            baseImponible: "1000.00",
            porcentajeRetener: "1.75",
            valorRetenido: "17.50",
            fechaPagoDiv: "",
            imRentaSoc: "",
            anioUtDiv: "",
            numCajBan: "",
            precCajBan: ""
          }
        ]
      }
    });

    builder.buildCompras([compraAts]);

    console.log("Generando Excel...");
    const buffer = await builder.getResult();

    // 7. Guardar en disco
    const outputPath = path.join(__dirname, 'ats_generado.xlsx');
    fs.writeFileSync(outputPath, buffer);
    console.log(`¡Éxito! Archivo guardado en: ${outputPath}`);

  } catch (err) {
    console.error("Error al generar:", err);
  }
}

run();
