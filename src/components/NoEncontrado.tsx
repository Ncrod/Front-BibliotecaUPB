import Link from "next/link";

export default function NoEncontrado({ mensaje }: { mensaje: string }) {
  return (
    <section className="catalogo">
      <title>No encontrado — Biblioteca UPB</title>
      <Link className="volver" href="/catalogo">
        &larr; Volver al catálogo
      </Link>
      <div className="catalogo__encabezado">
        <h1>No encontrado</h1>
        <p className="catalogo__sub">{mensaje}</p>
      </div>
    </section>
  );
}
