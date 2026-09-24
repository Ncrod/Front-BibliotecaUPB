"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { useCarga } from "@/lib/useCarga";
import { Cargando, ErrorApi } from "@/components/Estado";

export default function Inicio() {
  const { data, error, cargando } = useCarga("generos", api.generos);

  const generos = [...(data ?? [])].sort(
    (a, b) =>
      b.total_libros - a.total_libros || a.nombre.localeCompare(b.nombre),
  );
  const total = generos.reduce((suma, g) => suma + g.total_libros, 0);

  return (
    <section className="hero">
      <title>Biblioteca UPB — Inicio</title>
      <div className="hero__encabezado">
        <h1>Nuestros libros académicos</h1>
        {data && (
          <p className="hero__resumen">
            {total} títulos disponibles en {generos.length} géneros.
          </p>
        )}
      </div>

      <div className="hero__cuerpo">
        <figure className="hero__foto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/hero.png"
            alt="Estudiantes leyendo en la biblioteca de la UPB"
          />
        </figure>

        <div className="generos">
          {cargando && <Cargando />}
          {error && <ErrorApi error={error} />}
          {data && generos.length === 0 && (
            <p className="vacio">
              Todavía no hay géneros cargados en la base de datos.
            </p>
          )}
          {generos.map((genero) => (
            <article className="genero" key={genero.id}>
              <div className="genero__texto">
                <h2 className="genero__nombre">
                  <Link
                    className="genero__enlace"
                    href={`/catalogo/genero/${genero.id}`}
                  >
                    <span className="genero__cobertura"></span>
                    {genero.nombre}
                  </Link>
                </h2>
                <span className="chip">
                  {genero.total_libros} Libro
                  {genero.total_libros !== 1 ? "s" : ""}
                </span>
              </div>
              <span className="genero__link" aria-hidden="true">
                Ver mas
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/flecha.svg" alt="" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
