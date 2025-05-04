import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';


function rgb255(r, g, b) {
  return rgb(r / 255, g / 255, b / 255);
}

export async function generateCredential(nombre: string, dni: string, imagenPath: string | undefined): Promise<{ base64: string; filename: string }> {
  try {
    const pdfBase = await fs.readFile('./template.pdf'); // asegurate de tener este archivo en la raíz
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

    imagenPath = imagenPath || './user-default.png'; // ruta de la imagen por defecto si no se proporciona una
    
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

    const pdfBytes = await pdfDoc.save();
    // Devolver como File
    const base64 = Buffer.from(pdfBytes).toString('base64');
    return {
      base64,
      filename: `${nombre}_${dni}.pdf`
    };
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
  }
}