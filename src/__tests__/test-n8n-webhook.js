import http from 'http';

const WEBHOOK_URL = 'http://localhost:5678/webhook/foro-moderacion';
const SECRET = 'cr-unidos-secret-2026';

async function enviarWebhook(payload, headersPersonalizados = {}) {
  const url = new URL(WEBHOOK_URL);
  const data = JSON.stringify(payload);

  return new Promise((resolve) => {
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'x-webhook-secret': SECRET,
          ...headersPersonalizados
        },
        timeout: 10000
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              data: JSON.parse(body)
            });
          } catch {
            resolve({
              statusCode: res.statusCode,
              data: body
            });
          }
        });
      }
    );

    req.on('error', (err) => {
      resolve({ statusCode: 500, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: 504, error: 'TIMEOUT_10S' });
    });

    req.write(data);
    req.end();
  });
}

async function ejecutarBateriaN8n() {
  console.log('=== INICIANDO BATERÍA DE PRUEBAS EN N8N WEBHOOK ===\n');

  // Caso 1: Payload inválido (sin campos requeridos)
  const res1 = await enviarWebhook({ incompleto: true });
  console.log('1. Payload inválido:', res1.statusCode, res1.data?.error || res1.data);

  // Caso 2: Sin secreto de autenticación
  const res2 = await enviarWebhook(
    { tipo: 'post', id: 'p-auth-test', texto: 'Hola', autorId: 'USR-1' },
    { 'x-webhook-secret': 'secreto-invalido' }
  );
  console.log('2. Secreto inválido:', res2.statusCode, res2.data?.error || res2.data);

  // Caso 3: Texto limpio (Propuesta comunal)
  const res3 = await enviarWebhook({
    tipo: 'post',
    id: `post-limpio-${Date.now()}`,
    texto: 'Proponemos reparar los baches en la radial de Heredia y limpiar las aceras.',
    autorId: 'USR-CIUDADANO-1',
    rolAutor: 'Ciudadano',
    canton: 'Heredia',
    provincia: 'Heredia'
  });
  console.log('3. Texto limpio (Propuesta):', res3.statusCode, res3.data);

  // Caso 4: Teléfono y cédula (Blindaje Ley N.º 8968)
  const res4 = await enviarWebhook({
    tipo: 'post',
    id: `post-pii-${Date.now()}`,
    texto: 'Comuníquense conmigo al 8888-5678 o verifiquen mi cédula 1-1234-0567 para la feria.',
    autorId: 'USR-CIUDADANO-2',
    rolAutor: 'Ciudadano',
    canton: 'San José'
  });
  console.log('4. Datos Personales (Ley 8968):', res4.statusCode, res4.data);

  // Caso 5: Insulto directo (carepicha)
  const res5 = await enviarWebhook({
    tipo: 'post',
    id: `post-insulto-${Date.now()}`,
    texto: 'Ese regidor es un carepicha incompetente y un estafador.',
    autorId: 'USR-CIUDADANO-3',
    rolAutor: 'Ciudadano',
    canton: 'Alajuela'
  });
  console.log('5. Insulto directo:', res5.statusCode, res5.data);

  // Caso 6: Amenaza velada
  const res6 = await enviarWebhook({
    tipo: 'post',
    id: `post-amenaza-${Date.now()}`,
    texto: 'Ya sé dónde vive ese líder comunal, que se cuide la espalda.',
    autorId: 'USR-CIUDADANO-4',
    rolAutor: 'Ciudadano',
    canton: 'Cartago'
  });
  console.log('6. Amenaza velada:', res6.statusCode, res6.data);

  // Caso 7: Rol Exento (Super Admin)
  const res7 = await enviarWebhook({
    tipo: 'post',
    id: `post-admin-${Date.now()}`,
    texto: 'Reporte de fiscalización institucional sobre irregularidades en contrataciones.',
    autorId: 'USR-ADMIN-1',
    rolAutor: 'Super Administrador Nacional',
    canton: 'San José'
  });
  console.log('7. Rol Exento (Super Admin):', res7.statusCode, res7.data);

  // Caso 8: Mismo ID repetido (Idempotencia / yaProcesado)
  const idRepetido = `post-rep-${Date.now()}`;
  await enviarWebhook({
    tipo: 'post',
    id: idRepetido,
    texto: 'Mensaje de prueba para verificar no reprocesamiento.',
    autorId: 'USR-CIUDADANO-5'
  });
  const res8 = await enviarWebhook({
    tipo: 'post',
    id: idRepetido,
    texto: 'Mensaje de prueba para verificar no reprocesamiento.',
    autorId: 'USR-CIUDADANO-5'
  });
  console.log('8. Repetido (Idempotencia):', res8.statusCode, res8.data);
}

ejecutarBateriaN8n();
