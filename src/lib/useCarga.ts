"use client";

import { useEffect, useState } from "react";
import { ApiError } from "./api";

type Resultado<T> = { clave: string; data?: T; error?: ApiError };

/** Carga datos de la API. `clave` identifica la petición: al cambiar, se vuelve a pedir. */
export function useCarga<T>(clave: string, cargar: () => Promise<T>) {
  const [version, setVersion] = useState(0);
  const claveCompleta = `${clave}#${version}`;
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);

  useEffect(() => {
    let activo = true;
    cargar().then(
      (data) => activo && setResultado({ clave: claveCompleta, data }),
      (e) =>
        activo &&
        setResultado({
          clave: claveCompleta,
          error:
            e instanceof ApiError
              ? e
              : new ApiError(0, ["Ocurrió un error inesperado."]),
        }),
    );
    return () => {
      activo = false;
    };
    // `cargar` se recrea en cada render; la petición depende solo de `claveCompleta`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveCompleta]);

  const listo = resultado?.clave === claveCompleta;
  return {
    data: listo ? resultado.data : undefined,
    error: listo ? resultado.error : undefined,
    cargando: !listo,
    recargar: () => setVersion((v) => v + 1),
  };
}
