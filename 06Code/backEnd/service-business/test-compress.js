const fs = require('fs');
const path = require('path');
const http = require('http');

const jsonPath = path.join(__dirname, 'facturas.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const invoices = JSON.parse(rawData);

console.log(`Cargadas ${invoices.length} facturas desde facturas.json.`);

const reqOpts = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/invoices/compress-xml',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(rawData)
  }
};

console.log('Enviando petición POST a http://127.0.0.1:3001/invoices/compress-xml ...');

const req = http.request(reqOpts, (res) => {
  console.log(`Estado de respuesta: ${res.statusCode}`);
  if (res.statusCode !== 200) {
    let errBody = '';
    res.on('data', chunk => errBody += chunk);
    res.on('end', () => {
      console.error(`Error en la petición: ${errBody}`);
      process.exit(1);
    });
    return;
  }

  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const zipPath = path.join(__dirname, 'facturas_resultado.zip');
    fs.writeFileSync(zipPath, buffer);
    console.log(`\n¡Éxito! Archivo ZIP guardado en: ${zipPath} (${buffer.length} bytes)`);

    // Verificar contenido del ZIP usando adm-zip
    try {
      const AdmZip = require('adm-zip');
      const zip = new AdmZip(zipPath);
      const entries = zip.getEntries();
      console.log(`\nEl archivo ZIP contiene ${entries.length} facturas XML:`);
      // Mostrar las primeras 5 como muestra
      entries.slice(0, 5).forEach(entry => {
        console.log(` - ${entry.entryName} (${entry.header.size} bytes)`);
      });
      if (entries.length > 5) {
        console.log(` ... y ${entries.length - 5} archivos XML más.`);
      }
    } catch (e) {
      console.error('Error leyendo el ZIP:', e);
    }
  });
});

req.on('error', (e) => {
  console.error(`\nError de conexión: ${e.message}`);
  console.error(`Asegúrate de que tu servidor backend esté corriendo en el puerto 3001 con "npm run dev"`);
  process.exit(1);
});

req.write(rawData);
req.end();
