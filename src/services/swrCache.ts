/**
 * ============================================================================
 * COSTA RICA UNIDOS — MOTOR DE CACHÉ SWR (STALE-WHILE-REVALIDATE)
 * Cumplimiento RNF-10: Sincronización y Caché Resiliente en Directorios
 * ============================================================================
 * 
 * Implementa el patrón Stale-While-Revalidate:
 * 1. Retorna inmediatamente los datos en caché (stale) para renderizado ultrarrápido sin parpadeos.
 * 2. Desencadena la revalidación en segundo plano (revalidate) para actualizar datos frescos.
 * 3. Deduplica peticiones idénticas concurrentes previniendo sobrecarga en la red.
 */

export interface CacheRecord<T> {
  data: T;
  timestamp: number;
  error?: Error | null;
}

export interface SWROptions<T> {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number; // Tiempo mínimo entre peticiones para la misma clave (ms)
  ttl?: number;              // Tiempo de vida útil de la caché (ms)
  onSuccess?: (data: T) => void;
  onError?: (err: Error) => void;
  fallbackData?: T;
}

type Subscriber<T> = (data: T | undefined, error: Error | null, isValidating: boolean) => void;

class SWRCacheManager {
  private cache = new Map<string, CacheRecord<unknown>>();
  private inFlightRequests = new Map<string, Promise<unknown>>();
  private subscribers = new Map<string, Set<Subscriber<unknown>>>();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.revalidateAllActive());
    }
  }

  /**
   * Obtiene una entrada de la caché si existe y no ha expirado
   */
  get<T>(key: string, ttl: number = 1000 * 60 * 10): CacheRecord<T> | undefined {
    const record = this.cache.get(key) as CacheRecord<T> | undefined;
    if (!record) return undefined;
    if (Date.now() - record.timestamp > ttl) {
      this.cache.delete(key);
      return undefined;
    }
    return record;
  }

  /**
   * Guarda o actualiza un registro en caché
   */
  set<T>(key: string, data: T, error: Error | null = null): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      error
    });
    this.notifySubscribers(key, data, error, false);
  }

  /**
   * Suscribe un componente a cambios en una clave específica
   */
  subscribe<T>(key: string, callback: Subscriber<T>): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    const set = this.subscribers.get(key)!;
    set.add(callback as Subscriber<unknown>);

    return () => {
      set.delete(callback as Subscriber<unknown>);
      if (set.size === 0) {
        this.subscribers.delete(key);
      }
    };
  }

  /**
   * Notifica a todos los suscriptores de una clave
   */
  private notifySubscribers<T>(key: string, data: T | undefined, error: Error | null, isValidating: boolean): void {
    const set = this.subscribers.get(key);
    if (!set) return;
    set.forEach((cb) => {
      try {
        cb(data, error, isValidating);
      } catch (e) {
        console.error(`[SWRCacheManager] Error en suscriptor de clave ${key}:`, e);
      }
    });
  }

  /**
   * Ejecuta o deduplica una petición asíncrona mediante el patrón SWR
   */
  async fetchWithSWR<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: SWROptions<T> = {}
  ): Promise<T> {
    const { dedupingInterval = 2000, onSuccess, onError } = options;

    // Verificar si ya existe una petición en curso para evitar peticiones duplicadas simultáneas
    if (this.inFlightRequests.has(key)) {
      return this.inFlightRequests.get(key) as Promise<T>;
    }

    // Verificar si los datos existentes en caché aún son lo suficientemente frescos como para omitir revalidación
    const existing = this.get<T>(key);
    if (existing && Date.now() - existing.timestamp < dedupingInterval) {
      return existing.data;
    }

    // Indicar a los suscriptores que la revalidación comenzó
    this.notifySubscribers(key, existing?.data, null, true);

    const promise = (async () => {
      try {
        const freshData = await fetcher();
        this.set(key, freshData, null);
        if (onSuccess) onSuccess(freshData);
        return freshData;
      } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        if (onError) onError(errorObj);
        // Preservar datos anteriores en caché si existen (stale on error)
        if (existing) {
          this.notifySubscribers(key, existing.data, errorObj, false);
        } else {
          this.notifySubscribers(key, undefined, errorObj, false);
        }
        throw errorObj;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, promise as Promise<unknown>);
    return promise;
  }

  /**
   * Modifica manualmente los datos en caché (Optimistic UI / Mutation)
   */
  mutate<T>(key: string, newData?: T, shouldRevalidate: boolean = true): void {
    if (newData !== undefined) {
      this.set(key, newData, null);
    }
    if (shouldRevalidate) {
      this.notifySubscribers(key, newData, null, true);
    }
  }

  /**
   * Limpia toda la memoria de caché
   */
  clear(): void {
    this.cache.clear();
    this.inFlightRequests.clear();
  }

  private revalidateAllActive(): void {
    // Revalidación selectiva al recuperar conectividad de red
    for (const key of this.subscribers.keys()) {
      this.notifySubscribers(key, this.get(key)?.data, null, true);
    }
  }
}

export const swrCache = new SWRCacheManager();
