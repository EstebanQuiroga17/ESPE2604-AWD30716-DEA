const ExcelJS = require('exceljs');
const path = require('path');

async function inspectSheets() {
  const filePath = path.join(__dirname, '..', '..', '..', '..', '..', '..', '..', '07Other', 'PlantillaATS.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const sheet = workbook.getWorksheet('Compensaciones Ventas');
  if (sheet) {
    console.log(`\n--- Compensaciones Ventas ---`);
    for (let i = 1; i <= 3; i++) {
      console.log(`Fila ${i}:`, JSON.stringify(sheet.getRow(i).values));
    }
  }
}

inspectSheets().catch(console.error);
