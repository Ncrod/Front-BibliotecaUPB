"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { useCarga } from "@/lib/useCarga";
import { Cargando, ErrorApi } from "./Estado";
import NoEncontrado from "./NoEncontrado";
import TarjetaLibro from "./TarjetaLibro";

export default function Listado({ generoId }: { generoId?: string }) {
  const { data, error, cargando } = useCarga(`listado:${generoId ?? ""}`, () =>
    Promise.all([api.libros(generoId), api.generos()]),
  );

  if (cargando) return <Cargando />;
  if (error)
    return error.status === 404 ? (
      <NoEncontrado mensaje={error.errores[0]} />
    ) : (
      <ErrorApi error={error} />
    );

  const [libros, generos] = data!;
  const genero = generoId ? generos.find((g) => g.id === generoId) : undefined;
  if (generoId && !genero) return <NoEncontrado mensaje="Género no encontrado." />;

  return (
    <section className="catalogo">
      <title>{`${genero ? genero.nombre : "Catálogo"} — Biblioteca UPB`}</title>
      <div className="catalogo__encabezado">
        <h1>{genero ? genero.nombre : "Catálogo completo"}</h1>
        {genero?.descripcion && (
          <p className="catalogo__sub">{genero.descripcion}</p>
        )}
      </div>

      <nav className="filtros" aria-label="Filtrar por género">
        <Link href="/catalogo" className={`filtro ${!genero ? "filtro--activo" : ""}`}>
          Todos
        </Link>
        {generos.map((g) => (
          <Link
            key={g.id}
            href={`/catalogo/genero/${g.id}`}
            className={`filtro ${genero?.id === g.id ? "filtro--activo" : ""}`}
          >
            {g.nombre} <span className="filtro__n">{g.total_libros}</span>
          </Link>
        ))}
      </nav>

      <div className="libros">
        {libros.length === 0 && (
          <p className="vacio">No hay libros en esta sección todavía.</p>
        )}
        {libros.map((libro) => (
          <TarjetaLibro key={libro.id} libro={libro} conStock />
        ))}
      </div>
    </section>
  );
}
