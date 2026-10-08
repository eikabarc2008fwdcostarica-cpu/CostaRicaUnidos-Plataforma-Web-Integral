import fs from 'fs';
import { GEMINI_MODELS, GEMINI_API_BASE } from '../services/geminiService.js';

// Leer clave de forma privada sin imprimirla
function getEnvKey() {
  try {
    const raw = fs.readFileSync('.env', 'utf-8');
    const m = raw.match(/VITE_GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
    return m ? m[1].trim() : null;
  } catch {
    return null;
  }
}

async function testearGeminiReal() {
  const apiKey = getEnvKey();
  if (!apiKey) {
    console.log(JSON.stringify({ ok: false, error: 'API_KEY_NOT_FOUND' }));
    return;
  }

  const promptPrueba = '¿Qué cantón de Costa Rica es conocido como la Ciudad de los Mangos? Responde en 1 sola frase corta.';
  const inicio = Date.now();
  
  // Probar modelo prioritario
  const modelo = 'gemini-2.5-flash';
  const url = `${GEMINI_API_BASE}/${modelo}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: promptPrueba }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 256,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });

    const latenciaMs = Date.now() - inicio;
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.log(JSON.stringify({
        ok: false,
        status: res.status,
        error: errJson?.error?.message || res.statusText,
        modelo,
        latenciaMs
      }));
      return;
    }

    const data = await res.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(JSON.stringify({
      ok: true,
      modelo,
      latenciaMs,
      respuestaCorta: texto?.trim(),
      finishReason: data?.candidates?.[0]?.finishReason
    }));
  } catch (err) {
    console.log(JSON.stringify({ ok: false, error: err.message, modelo }));
  }
}

testearGeminiReal();
