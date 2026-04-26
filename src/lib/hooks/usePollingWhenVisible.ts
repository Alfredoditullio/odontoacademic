'use client';

/**
 * Hook para hacer polling de un endpoint solo mientras la pestaña está visible.
 *
 * Diseño escalable:
 *  - Si el usuario va a otra pestaña / minimiza la ventana, el polling se PAUSA
 *    automáticamente (visibilitychange API). Esto reduce la carga DB en 60-90%
 *    porque la mayoría de las pestañas viven en background.
 *  - Cuando el usuario vuelve a la pestaña, se hace un fetch inmediato (no
 *    esperamos al próximo intervalo) para que la UI esté fresca.
 *  - Cleanup completo al unmount → cero leaks de timers.
 *  - El `tick` se redispara automáticamente si cambia `intervalMs` o `enabled`.
 */

import { useEffect, useRef } from 'react';

interface Options {
  /** Cada cuántos ms hacer fetch. Recomendado: 10000-15000 para comments. */
  intervalMs: number;
  /** Si false, el polling no arranca (útil para pausarlo condicionalmente). */
  enabled?: boolean;
  /** Si true, ejecuta `fn` apenas el componente monta (además del intervalo). */
  fireOnMount?: boolean;
}

export function usePollingWhenVisible(
  fn: () => void | Promise<void>,
  { intervalMs, enabled = true, fireOnMount = false }: Options,
): void {
  // "Latest ref" pattern: mantenemos `fn` actualizada en una ref via effect
  // para no recrear el interval cada render (rompería la cadencia y
  // dispararía fetches dobles). Update se hace post-commit, no en render.
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let mounted = true;

    function startPolling() {
      if (timer !== null || !mounted) return;
      timer = setInterval(() => {
        void fnRef.current();
      }, intervalMs);
    }

    function stopPolling() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }

    function onVisibility() {
      if (!mounted) return;
      if (document.visibilityState === 'visible') {
        // Fetch inmediato al volver + reanudar el ciclo
        void fnRef.current();
        startPolling();
      } else {
        stopPolling();
      }
    }

    if (fireOnMount && document.visibilityState === 'visible') {
      void fnRef.current();
    }

    if (document.visibilityState === 'visible') {
      startPolling();
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mounted = false;
      stopPolling();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs, enabled, fireOnMount]);
}
