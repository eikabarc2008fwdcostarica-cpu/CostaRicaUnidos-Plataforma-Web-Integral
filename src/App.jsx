import React from 'react';
import Routing from './routes/Routing';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import {
  AccessibilityProvider,
  VoiceReaderFloatingButton,
  VoiceGuidedOnboardingModal
} from './components/accessibility';

export default function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <Routing />
          {/* Botón flotante accesible de lectura asistida (TTS) con Web Speech API en 8 idiomas */}
          <VoiceReaderFloatingButton />
          {/* Modal de Onboarding Interactivo Animado Asistido por Voz */}
          <VoiceGuidedOnboardingModal />
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}
