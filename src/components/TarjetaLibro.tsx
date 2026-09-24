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
      <Link className="libro__portada" href={`/libro/${libro.id}`}>
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
