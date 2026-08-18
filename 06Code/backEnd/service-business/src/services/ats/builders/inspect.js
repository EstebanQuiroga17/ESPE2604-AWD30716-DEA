const ExcelJS = require('exceljs');
const path = require('path');

async function inspectSheets() {
  const filePath = path.join(__dirname, '..', '..', '..', '..', '..', '..', '..', '07Other', 'Ejemplo_PlantillaATS2020_Mensual.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const sheets = ['Compras Detalladas', 'Compras Formas Pago', 'Compras Retenciones', 'Compras Reembolsos'];
  
  for (const s of sheets) {
    const sheet = workbook.getWorksheet(s);
    if (sheet) {
      console.log(`\nHeaders para ${s} (Fila 2):`);
      console.log(JSON.stringify(sheet.getRow(2).values));
    }
  }
}

inspectSheets().catch(console.error);
