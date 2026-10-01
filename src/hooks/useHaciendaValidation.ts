import { useState, useEffect, useCallback, useRef } from 'react';
import {
  validateCedula,
  checkTaxStatus,
  CedulaValidationResult,
  TaxStatusResult,
  sanitizeCedula
} from '../services/haciendaService';

export interface UseHaciendaValidationOptions {
  autoValidate?: boolean;
  debounceMs?: number;
  includeTaxStatus?: boolean; // Consulta también el régimen y estado fiscal si la cédula es válida
}

export interface UseHaciendaValidationReturn {
  cedula: string;
  setCedula: (cedula: string) => void;
  validation: CedulaValidationResult | null;
  taxStatus: TaxStatusResult | null;
  isValidating: boolean;
  isValid: boolean;
  nombreOficial: string;
  error: string | null;
  validateNow: (overrideCedula?: string) => Promise<CedulaValidationResult>;
  checkTaxStatusNow: (overrideCedula?: string) => Promise<TaxStatusResult>;
  reset: () => void;
}

/**
 * useHaciendaValidation — Hook para Validación Oficial ante el Ministerio de Hacienda
 * 
 * Usos clave:
 * - Autocompletado inmediato del nombre legal oficial en Login y Registro ciudadano.
 * - Validación antifraude de 1 voto por cédula en Participación Ciudadana.
 * - Certificación de "Comercio Verificado / Régimen Simplificado" en PYMES y Ferias.
 * - Manejo robusto de estados de carga (Skeleton/Spinner), debounce y memoria caché.
 */
export function useHaciendaValidation(
  initialCedula: string = '',
  options: UseHaciendaValidationOptions = {}
): UseHaciendaValidationReturn {
  const { autoValidate = true, debounceMs = 600, includeTaxStatus = false } = options;

  const [cedula, setCedulaState] = useState<string>(initialCedula);
  const [validation, setValidation] = useState<CedulaValidationResult | null>(null);
  const [taxStatus, setTaxStatus] = useState<TaxStatusResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setCedula = useCallback((newCedula: string) => {
    setCedulaState(newCedula);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setCedulaState('');
    setValidation(null);
    setTaxStatus(null);
    setIsValidating(false);
    setError(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  const validateNow = useCallback(
    async (overrideCedula?: string): Promise<CedulaValidationResult> => {
      const targetCedula = overrideCedula !== undefined ? overrideCedula : cedula;
      const clean = sanitizeCedula(targetCedula);

      if (!clean) {
        const emptyResult: CedulaValidationResult = {
          isValid: false,
          cedulaLimpia: '',
          tipo: 'DESCONOCIDO',
          nombreOficial: '',
          formatoValido: false,
          existeEnHacienda: false,
          mensajeError: 'Por favor ingrese un número de cédula válido.'
        };
        setValidation(emptyResult);
        setError(emptyResult.mensajeError || null);
        return emptyResult;
      }

      setIsValidating(true);
      setError(null);

      try {
        const result = await validateCedula(clean);
        setValidation(result);

        if (!result.isValid) {
          setError(result.mensajeError || 'Cédula no válida ante el Ministerio de Hacienda');
        } else {
          setError(null);
          // Si se solicitó el estado tributario, consultar en paralelo
          if (includeTaxStatus) {
            checkTaxStatus(clean).then((status) => {
              setTaxStatus(status);
            }).catch(() => {
              // Silencioso para no romper la validación principal de identidad
            });
          }
        }

        return result;
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Error al conectar con Hacienda';
        setError(errMsg);
        const errResult: CedulaValidationResult = {
          isValid: false,
          cedulaLimpia: clean,
          tipo: 'DESCONOCIDO',
          nombreOficial: '',
          formatoValido: false,
          existeEnHacienda: false,
          mensajeError: errMsg
        };
        setValidation(errResult);
        return errResult;
      } finally {
        setIsValidating(false);
      }
    },
    [cedula, includeTaxStatus]
  );

  const checkTaxStatusNow = useCallback(
    async (overrideCedula?: string): Promise<TaxStatusResult> => {
      const targetCedula = overrideCedula !== undefined ? overrideCedula : cedula;
      const clean = sanitizeCedula(targetCedula);

      setIsValidating(true);
      try {
        const result = await checkTaxStatus(clean);
        setTaxStatus(result);
        return result;
      } finally {
        setIsValidating(false);
      }
    },
    [cedula]
  );

  // Efecto con debounce para validación automática mientras el usuario escribe
  useEffect(() => {
    if (!autoValidate) return;

    const clean = sanitizeCedula(cedula);
    // Cédulas físicas mínimas: 9 dígitos; jurídicas: 10; DIMEX: 11-12
    if (clean.length < 9) {
      setValidation(null);
      setTaxStatus(null);
      setError(null);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      validateNow(cedula);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cedula, autoValidate, debounceMs, validateNow]);

  return {
    cedula,
    setCedula,
    validation,
    taxStatus,
    isValidating,
    isValid: Boolean(validation?.isValid),
    nombreOficial: validation?.nombreOficial || '',
    error,
    validateNow,
    checkTaxStatusNow,
    reset
  };
}

export default useHaciendaValidation;
