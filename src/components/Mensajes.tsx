"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type Tipo = "success" | "error";
type Mensaje = { tipo: Tipo; texto: string };

type MensajesCtx = {
  /** Muestra mensajes en la página actual; se borran al navegar. */
  mostrar: (tipo: Tipo, textos: string[]) => void;
  /** Muestra mensajes que sobreviven a la siguiente navegación (p. ej. tras guardar). */
  mostrarTrasNavegar: (tipo: Tipo, textos: string[]) => void;
  limpiar: () => void;
};

const Contexto = createContext<MensajesCtx | null>(null);

export function MensajesProvider({ children }: { children: React.ReactNode }) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const sobrevive = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (sobrevive.current) {
      sobrevive.current = false;
    } else {
      setMensajes([]);
    }
  }, [pathname]);

  const mostrar = useCallback((tipo: Tipo, textos: string[]) => {
    setMensajes(textos.map((texto) => ({ tipo, texto })));
  }, []);
  const mostrarTrasNavegar = useCallback((tipo: Tipo, textos: string[]) => {
    sobrevive.current = true;
    setMensajes(textos.map((texto) => ({ tipo, texto })));
  }, []);
  const limpiar = useCallback(() => setMensajes([]), []);

  const valor = useMemo(
    () => ({ mostrar, mostrarTrasNavegar, limpiar }),
    [mostrar, mostrarTrasNavegar, limpiar],
  );

  return (
    <Contexto.Provider value={valor}>
      <main className="lienzo">
        {mensajes.length > 0 && (
          <ul className="mensajes">
            {mensajes.map((m, i) => (
              <li key={i} className={`mensaje mensaje--${m.tipo}`}>
                {m.texto}
              </li>
            ))}
          </ul>
        )}
        {children}
      </main>
    </Contexto.Provider>
  );
}

export function useMensajes() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useMensajes fuera de MensajesProvider");
  return ctx;
}
