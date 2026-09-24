import Link from "next/link";
import type { Libro } from "@/lib/api";

export default function TarjetaLibro({
  libro,
  conStock = false,
}: {
  libro: Libro;
  conStock?: boolean;
}) {
  return (
    <article className="libro">
      <Link
        className={`libro__portada${libro.imagen ? " libro__portada--foto" : ""}`}
        href={`/libro/${libro.id}`}
      >
        {libro.imagen && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="libro__img" src={libro.imagen} alt={`Portada de ${libro.titulo}`} loading="lazy" />
        )}
        <span className="libro__genero">{libro.genero.nombre}</span>
        <span className="libro__titulo">{libro.titulo}</span>
        <span className="libro__anio">{libro.anio}</span>
      </Link>
      <div className="libro__pie">
        <p className="libro__autor">{libro.autor.nombre}</p>
        {conStock &&
          (libro.stock > 0 ? (
            <span className="estado estado--disponible">
              {libro.stock} disponibles
            </span>
          ) : (
            <span className="estado estado--agotado">Agotado</span>
          ))}
      </div>
    </article>
  );
}
