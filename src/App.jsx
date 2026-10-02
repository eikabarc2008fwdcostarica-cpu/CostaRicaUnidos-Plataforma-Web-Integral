import React from 'react';
import Routing from './routes/Routing';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext.jsx';
import {
  AccessibilityProvider,
  VoiceReaderFloatingButton
} from './components/accessibility';
import { CivicModalProvider } from './context/CivicModalContext';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';

export default function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <CivicModalProvider>
                <Routing />
                {/* Botón flotante accesible de lectura asistida (TTS) con Web Speech API en 8 idiomas */}
                <VoiceReaderFloatingButton />
              </CivicModalProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
