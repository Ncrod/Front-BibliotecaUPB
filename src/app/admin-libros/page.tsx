"use client";

import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { useCarga } from "@/lib/useCarga";
import { Cargando, ErrorApi } from "@/components/Estado";
import { useMensajes } from "@/components/Mensajes";

export default function AdminLista() {
  const { data: libros, error, cargando, recargar } = useCarga(
    "admin-libros",
    () => api.libros(),
  );
  const { mostrar } = useMensajes();

  async function eliminar(id: string, titulo: string) {
    if (!confirm(`¿Eliminar «${titulo}»?`)) return;
    try {
      await api.eliminarLibro(id);
      mostrar("success", [`Libro "${titulo}" eliminado.`]);
      recargar();
    } catch (e) {
      mostrar("error", e instanceof ApiError ? e.errores : ["No se pudo eliminar."]);
    }
  }

  return (
    <section className="admin">
      <title>Admin — Biblioteca UPB</title>
      <div className="admin__encabezado">
        <h1>Administrar libros</h1>
        <Link className="boton" href="/admin-libros/nuevo">
          + Nuevo libro
        </Link>
      </div>

      {cargando && <Cargando />}
      {error && <ErrorApi error={error} />}
      {libros && (
        <div className="tabla-envoltorio">
          <table className="tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Género</th>
                <th>Año</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro.id}>
                  <td>{libro.titulo}</td>
                  <td>{libro.autor.nombre}</td>
                  <td>{libro.genero.nombre}</td>
                  <td>{libro.anio}</td>
                  <td>{libro.stock}</td>
                  <td className="tabla__acciones">
                    <Link href={`/admin-libros/${libro.id}/editar`}>Editar</Link>
                    <button
                      type="button"
                      className="boton-link boton-link--peligro"
                      onClick={() => eliminar(libro.id, libro.titulo)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {libros.length === 0 && (
                <tr>
                  <td colSpan={6} className="vacio">
                    No hay libros registrados todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
