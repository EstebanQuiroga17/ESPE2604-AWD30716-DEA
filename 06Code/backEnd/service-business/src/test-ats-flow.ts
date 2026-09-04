import * as fs from 'fs';
import * as path from 'path';
import { InvoiceService } from './services/invoice.service';
import { FieldsCoordinator } from './services/ats/fields.coordinator';
import { AtsXlsmBuilder } from './services/ats/builders/ats-xlsm.builder';
import AdmZip from 'adm-zip';

async function testFlow() {
  try {
    console.log('1. Preparando archivo ZIP de prueba...');
    const xmlPath = path.join(__dirname, '../../../../07Other/Examples/Compra_Example.xml');
    
    if (!fs.existsSync(xmlPath)) {
        throw new Error(`No se encontró el XML de ejemplo en: ${xmlPath}`);
    }

    // Crear un zip en memoria con el archivo XML
    const zip = new AdmZip();
    zip.addLocalFile(xmlPath);
    const zipBuffer = zip.toBuffer();

    console.log('2. Extrayendo XMLs del ZIP (InvoiceService.processZippedInvoices)...');
    const invoiceService = new InvoiceService();
    const xmls = invoiceService.processZippedInvoices(zipBuffer);
    console.log(`-> Se extrajeron ${xmls.length} XMLs.`);

    console.log('3. Parseando XML a JSON (InvoiceService.parseXmlsToJson)...');
    const jsons = invoiceService.parseXmlsToJson(xmls);
    console.log(`-> JSON parseado (Ejemplo de llaves raíz):`, Object.keys(jsons[0]));

    console.log('4. Coordinando el Mapeo (FieldsCoordinator.mapJsons)...');
    const coordinator = new FieldsCoordinator();
    const mappedData = coordinator.mapJsons(jsons, 'compras');
    console.log(`-> Mapeo exitoso. Datos mapeados:`, mappedData.length);
    if (mappedData.length > 0) {
      console.log('-> Muestra de datos mapeados (tipo1_y_2):');
      console.log(JSON.stringify(mappedData[0].tipo1_y_2, null, 2));
    } else {
      console.log('-> ADVERTENCIA: El arreglo mappedData está vacío.');
    }

    console.log('5. Construyendo Excel (AtsXlsmBuilder)...');
    const templatePath = path.join(__dirname, '../resources/PlantillaATS.xlsx');
    console.log('-> Usando template:', templatePath);
    
    if (!fs.existsSync(templatePath)) {
        throw new Error(`No se encontró la plantilla en: ${templatePath}`);
    }

    const builder = new AtsXlsmBuilder(templatePath);
    builder.buildCompras(mappedData);
    
    const excelBuffer = await builder.getResult();
    
    const outputPath = path.join(__dirname, 'test-output.xlsx');
    fs.writeFileSync(outputPath, excelBuffer);
    console.log('6. ¡Éxito! Archivo Excel guardado en:', outputPath);

  } catch (error) {
    console.error('\n--- ERROR EN EL FLUJO ---');
    console.error(error);
  }
}

testFlow();
