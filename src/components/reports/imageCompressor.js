/**
 * COSTA RICA UNIDOS — Procesador Multimedia en Cliente
 * Compresión automática con HTML5 Canvas API
 * Requisitos:
 * - Resolución máxima: 1920x1080 px (escalado proporcional manteniendo aspecto)
 * - Formato: image/webp (con fallback automático a image/jpeg)
 * - Peso: estrictamente MENOR a 1 MB (< 1048576 bytes)
 */

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB estricto

/**
 * Formatea bytes en cadena legible (KB / MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Procesa y comprime una imagen en el navegador del cliente
 * @param {File|Blob} file Archivo de imagen original
 * @returns {Promise<Object>} Resultado con dataUrl, blob, metadata y telemetría
 */
export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo proporcionado no es una imagen válida.'));
    }

    const originalSize = file.size;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo decodificar el formato de imagen.'));

      img.onload = async () => {
        try {
          let { width, height } = img;

          // 1. Cálculo de escala proporcional respetando máx 1920x1080
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratioW = width / MAX_WIDTH;
            const ratioH = height / MAX_HEIGHT;
            const scale = Math.max(ratioW, ratioH);

            width = Math.round(width / scale);
            height = Math.round(height / scale);
          }

          // 2. Renderizado en HTML5 Canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: false });
          // Fondo sólido para evitar transparencias accidentales
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // 3. Compresión adaptativa a WebP (con fallback a JPEG) < 1 MB
          const preferredMime = 'image/webp';
          let quality = 0.84;
          let blob = null;
          let mimeUsed = preferredMime;

          // Función auxiliar para generar blob
          const getCanvasBlob = (q, mime) => {
            return new Promise((res) => {
              canvas.toBlob((b) => res(b), mime, q);
            });
          };

          // Intento inicial con WebP
          blob = await getCanvasBlob(quality, preferredMime);

          // Si el navegador no soporta exportación WebP, recurrir a JPEG
          if (!blob || blob.type !== preferredMime) {
            mimeUsed = 'image/jpeg';
            blob = await getCanvasBlob(quality, mimeUsed);
          }

          // Bucle adaptativo para garantizar que el peso sea estrictamente MENOR a 1 MB
          let attempts = 0;
          while (blob && blob.size >= MAX_SIZE_BYTES && attempts < 5) {
            quality -= 0.12;
            if (quality < 0.3) {
              // Si la calidad ya es baja, reducir adicionalmente las dimensiones un 15%
              const subW = Math.round(canvas.width * 0.85);
              const subH = Math.round(canvas.height * 0.85);
              canvas.width = subW;
              canvas.height = subH;
              ctx.drawImage(img, 0, 0, subW, subH);
              quality = 0.65;
            }
            blob = await getCanvasBlob(quality, mimeUsed);
            attempts++;
          }

          // Si aún supera 1 MB, último ajuste forzado a calidad 0.4
          if (blob && blob.size >= MAX_SIZE_BYTES) {
            blob = await getCanvasBlob(0.4, mimeUsed);
          }

          const compressedSize = blob ? blob.size : originalSize;
          const ratioNum = originalSize > 0
            ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
            : 0;

          // Convertir a Data URL para previsualización inmediata y guardado en JSON
          const dataUrlReader = new FileReader();
          dataUrlReader.onloadend = () => {
            resolve({
              dataUrl: dataUrlReader.result,
              blob: blob,
              originalSizeBytes: originalSize,
              compressedSizeBytes: compressedSize,
              originalSizeFormatted: formatBytes(originalSize),
              compressedSizeFormatted: formatBytes(compressedSize),
              compressionRatio: ratioNum > 0 ? `-${ratioNum}%` : '0%',
              dimensiones: `${canvas.width}x${canvas.height}`,
              formato: mimeUsed,
              nombreArchivoOriginal: file.name || 'evidencia_incidencia.webp',
              cumpleLimite1MB: compressedSize < MAX_SIZE_BYTES
            });
          };
          dataUrlReader.readAsDataURL(blob);
        } catch (err) {
          reject(err);
        }
      };

      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
}
