"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { useCarga } from "@/lib/useCarga";
import { Cargando, ErrorApi } from "./Estado";
import NoEncontrado from "./NoEncontrado";
import TarjetaLibro from "./TarjetaLibro";

export default function Detalle({ libroId }: { libroId: string }) {
  const { data, error, cargando } = useCarga(`libro:${libroId}`, async () => {
    const libro = await api.libro(libroId);
    const delGenero = await api.libros(libro.genero.id);
    const relacionados = delGenero.filter((l) => l.id !== libro.id).slice(0, 4);
    return { libro, relacionados };
  });

  if (cargando) return <Cargando />;
  if (error)
    return error.status === 404 ? (
      <NoEncontrado mensaje={error.errores[0]} />
    ) : (
      <ErrorApi error={error} />
    );

  const { libro, relacionados } = data!;

  return (
    <section className="detalle">
      <title>{`${libro.titulo} — Biblioteca UPB`}</title>
      <Link className="volver" href={`/catalogo/genero/${libro.genero.id}`}>
        &larr; Volver a {libro.genero.nombre}
      </Link>

      <div className="detalle__cuerpo">
        <div className="detalle__portada">
          <span className="libro__genero">{libro.genero.nombre}</span>
          <span className="libro__titulo">{libro.titulo}</span>
          <span className="libro__anio">{libro.anio}</span>
        </div>

        <div className="detalle__info">
          <h1>{libro.titulo}</h1>

          {libro.stock > 0 ? (
            <span className="estado estado--disponible">
              Disponible — {libro.stock} en stock
            </span>
          ) : (
            <span className="estado estado--agotado">Agotado</span>
          )}

          {libro.sinopsis && (
            <p className="detalle__sinopsis">{libro.sinopsis}</p>
          )}

          <dl className="ficha">
            <dt>Autor</dt>
            <dd>{libro.autor.nombre}</dd>
            <dt>Contacto</dt>
            <dd>{libro.autor.contacto}</dd>
            <dt>Género</dt>
            <dd>{libro.genero.nombre}</dd>
            <dt>Año</dt>
            <dd>{libro.anio}</dd>
            <dt>Existencias</dt>
            <dd>{libro.stock}</dd>
          </dl>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="relacionados">
          <h2>Más de {libro.genero.nombre}</h2>
          <div className="libros">
            {relacionados.map((otro) => (
              <TarjetaLibro key={otro.id} libro={otro} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
