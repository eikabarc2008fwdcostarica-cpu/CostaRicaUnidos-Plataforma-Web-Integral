import { useState, useEffect, useCallback, useRef } from 'react';
import { swrCache, SWROptions } from '../services/swrCache';

export interface UseDirectoryDataReturn<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;     // True únicamente si no hay datos previos en caché (Skeleton State)
  isValidating: boolean;  // True mientras se consulta la versión más reciente en segundo plano
  revalidate: () => Promise<T | undefined>;
  mutate: (newData?: T, shouldRevalidate?: boolean) => void;
}

/**
 * useDirectoryData — Hook Genérico de Fetching SWR para Directorios Cantonales (RNF-10)
 * 
 * Diseñado para la consulta de directorios de infraestructura educativa (M06),
 * comercios/PYMES (M08), instalaciones deportivas (M04) y atractivos turísticos (M09).
 * 
 * Ventajas:
 * - Evita parpadeos de UI mediante datos inmediatos de caché (Stale).
 * - Sincroniza en background sin bloquear la interfaz.
 * - Deduplica peticiones concurrentes a la misma URL o clave de consulta.
 * - Permite renderizar Skeleton loaders cuando isLoading es verdadero.
 */
export function useDirectoryData<T>(
  key: string | null | undefined,
  fetcher: () => Promise<T>,
  options: SWROptions<T> = {}
): UseDirectoryDataReturn<T> {
  const {
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    dedupingInterval = 2500,
    ttl = 1000 * 60 * 15, // 15 minutos de caché por defecto
    fallbackData
  } = options;

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Obtener estado inicial de la caché
  const initialCache = key ? swrCache.get<T>(key, ttl) : undefined;
  const initialData = initialCache ? initialCache.data : fallbackData;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(initialCache?.error || null);
  const [isValidating, setIsValidating] = useState<boolean>(!initialData && !!key);

  // isLoading es true únicamente si no tenemos datos que mostrar aún (ideal para Skeletons)
  const isLoading = !data && !error && !!key;

  const executeFetch = useCallback(async (): Promise<T | undefined> => {
    if (!key) return undefined;
    setIsValidating(true);
    try {
      const fresh = await swrCache.fetchWithSWR<T>(
        key,
        () => fetcherRef.current(),
        {
          dedupingInterval,
          ttl,
          onSuccess: options.onSuccess,
          onError: options.onError
        }
      );
      setData(fresh);
      setError(null);
      return fresh;
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      return undefined;
    } finally {
      setIsValidating(false);
    }
  }, [key, dedupingInterval, ttl, options.onSuccess, options.onError]);

  // Suscripción al bus de eventos de la caché SWR
  useEffect(() => {
    if (!key) return;

    // Sincronizar datos si ya existen en caché
    const cached = swrCache.get<T>(key, ttl);
    if (cached) {
      setData(cached.data);
      setError(cached.error || null);
    }

    // Suscribirse a cambios en esta clave
    const unsubscribe = swrCache.subscribe<T>(key, (updatedData, updatedError, updating) => {
      if (updatedData !== undefined) setData(updatedData);
      setError(updatedError);
      setIsValidating(updating);
    });

    // Ejecutar fetch / revalidación inicial
    executeFetch();

    return () => {
      unsubscribe();
    };
  }, [key, ttl, executeFetch]);

  // Revalidar en foco de ventana si está habilitado
  useEffect(() => {
    if (!revalidateOnFocus || !key) return;

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        executeFetch();
      }
    };

    window.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [key, revalidateOnFocus, executeFetch]);

  // Revalidar al recuperar conexión
  useEffect(() => {
    if (!revalidateOnReconnect || !key) return;

    const handleOnline = () => {
      executeFetch();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [key, revalidateOnReconnect, executeFetch]);

  const mutate = useCallback(
    (newData?: T, shouldRevalidate: boolean = true) => {
      if (!key) return;
      swrCache.mutate(key, newData, shouldRevalidate);
      if (newData !== undefined) {
        setData(newData);
      }
      if (shouldRevalidate) {
        executeFetch();
      }
    },
    [key, executeFetch]
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    revalidate: executeFetch,
    mutate
  };
}

export default useDirectoryData;
