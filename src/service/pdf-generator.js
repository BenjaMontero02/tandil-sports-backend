const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs/promises');
const path = require('path');
// const [, , nombre, telefono] = process.argv;

// if (!nombre || !telefono) {
//   console.error('Uso: node generar-pdf.js "Nombre Apellido" "123456789"');
//   process.exit(1);
// }

const nombre = 'Calu Mazzucheli';
const dni = '222222222';
const imagenPath = './calu.jpeg'; // Cambia esto a la ruta de tu imagen

function rgb255(r, g, b) {
  return rgb(r / 255, g / 255, b / 255);
}

async function generarPDF(nombre, dni, imagenPath) {
  try {
    const pdfBase = await fs.readFile('template.pdf'); // asegurate de tener este archivo en la raíz
    const pdfDoc = await PDFDocument.load(pdfBase);

    const page = pdfDoc.getPages()[0];
    const { height, width } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Insertar texto (ajustar coordenadas según la plantilla)
    page.drawText(`${nombre}`, {
      x: width - 120,
      y: height - 210,
      size: 12,
      font,
      color: rgb255(255, 255, 255),
    });

    page.drawText(`Dni: ${dni}`, {
      x: width - 120,
      y: height - 210 - 15,
      size: 12,
      font,
      color: rgb255(255, 255, 255),
    });

    // Imagen
    if (imagenPath) {
      const ext = path.extname(imagenPath).toLowerCase();
      const imagenBuffer = await fs.readFile(imagenPath);

      let imagenEmbed;
      if (ext === '.jpg' || ext === '.jpeg') {
        imagenEmbed = await pdfDoc.embedJpg(imagenBuffer);
      } else if (ext === '.png') {
        imagenEmbed = await pdfDoc.embedPng(imagenBuffer);
      } else {
        throw new Error('Formato de imagen no soportado (usa JPG o PNG)');
      }

      page.drawImage(imagenEmbed, {
        x: width - 110,
        y: height - 190, // posición vertical
        width: 80,
        height: 60,
      });
    }

    const pdfFinal = await pdfDoc.save();
    await fs.writeFile('resultado.pdf', pdfFinal);
    console.log('✅ PDF generado: resultado.pdf');
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
  }
}

generarPDF(nombre, dni, imagenPath);
