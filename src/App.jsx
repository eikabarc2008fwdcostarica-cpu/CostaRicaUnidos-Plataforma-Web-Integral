import React from 'react';
import Routing from './routes/Routing';
import { LanguageProvider } from './context/LanguageContext';
import {
  AccessibilityProvider,
  VoiceReaderFloatingButton,
  VoiceGuidedOnboardingModal
} from './components/accessibility';

export default function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <Routing />
        {/* Botón flotante accesible de lectura asistida (TTS) con Web Speech API en 8 idiomas */}
        <VoiceReaderFloatingButton />
        {/* Modal de Onboarding Interactivo Animado Asistido por Voz */}
        <VoiceGuidedOnboardingModal />
      </AccessibilityProvider>
    </LanguageProvider>
  );
}
