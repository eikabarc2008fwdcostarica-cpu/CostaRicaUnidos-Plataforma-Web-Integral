import React from 'react';
import Routing from './routes/Routing';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import {
  AccessibilityProvider,
  VoiceReaderFloatingButton,
  SpotlightGuidedTour
} from './components/accessibility';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <Routing />
            {/* Botón flotante accesible de lectura asistida (TTS) con Web Speech API en 8 idiomas */}
            <VoiceReaderFloatingButton />
            {/* Recorrido Interactivo Guiado en Vivo con Spotlight y Narración Fluida en 8 Idiomas */}
            <SpotlightGuidedTour />
          </AuthProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
