import React from 'react';
import Routing from './routes/Routing';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import {
  AccessibilityProvider,
  VoiceReaderFloatingButton,
  VoiceGuidedOnboardingModal
} from './components/accessibility';

import { CivicModalProvider } from './context/CivicModalContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <CivicModalProvider>
              <Routing />
              {/* Botón flotante accesible de lectura asistida (TTS) con Web Speech API en 8 idiomas */}
              <VoiceReaderFloatingButton />
              {/* Modal de Onboarding Interactivo Animado Asistido por Voz */}
              <VoiceGuidedOnboardingModal />
            </CivicModalProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
