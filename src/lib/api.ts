export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type Autor = { id: string; nombre: string; contacto: string };
export type Genero = {
  id: string;
  nombre: string;
  descripcion: string;
  total_libros: number;
};
export type Libro = {
  id: string;
  titulo: string;
  autor: Autor;
  genero: Omit<Genero, "total_libros">;
  anio: number;
  stock: number;
  sinopsis: string;
  imagen: string;
  disponible: boolean;
};
export type LibroPayload = {
  titulo: string;
  autor: string;
  genero: string;
  anio: number;
  stock: number;
  sinopsis: string;
};

export class ApiError extends Error {
  status: number;
  errores: string[];

  constructor(status: number, errores: string[]) {
    super(errores[0]);
    this.status = status;
    this.errores = errores;
  }
}

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      cache: "no-store",
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(0, ["No se pudo conectar con el servidor."]);
  }

  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    const errores: string[] = Array.isArray(cuerpo?.errores)
      ? cuerpo.errores
      : [cuerpo?.error ?? `Error inesperado (${respuesta.status}).`];
    throw new ApiError(respuesta.status, errores);
  }
  return cuerpo as T;
}

export const api = {
  generos: () =>
    pedir<{ resultados: Genero[] }>("/api/generos/").then((r) => r.resultados),
  autores: () =>
    pedir<{ resultados: Autor[] }>("/api/autores/").then((r) => r.resultados),
  libros: (generoId?: string) =>
    pedir<{ resultados: Libro[] }>(
      generoId
        ? `/api/libros/?genero=${encodeURIComponent(generoId)}`
        : "/api/libros/",
    ).then((r) => r.resultados),
  libro: (id: string) => pedir<Libro>(`/api/libros/${encodeURIComponent(id)}/`),
  crearLibro: (datos: LibroPayload) =>
    pedir<Libro>("/api/libros/", { method: "POST", body: JSON.stringify(datos) }),
  editarLibro: (id: string, datos: LibroPayload) =>
    pedir<Libro>(`/api/libros/${encodeURIComponent(id)}/`, {
      method: "PUT",
      body: JSON.stringify(datos),
    }),
  eliminarLibro: (id: string) =>
    pedir<{ mensaje: string }>(`/api/libros/${encodeURIComponent(id)}/`, {
      method: "DELETE",
    }),
};
