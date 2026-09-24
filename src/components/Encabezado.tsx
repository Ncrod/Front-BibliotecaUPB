"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Encabezado() {
  const pathname = usePathname();
  const activo = (cond: boolean) => (cond ? "activo" : undefined);

  return (
    <header className="site-header">
      <Link className="logo" href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo-upb.png" alt="Universidad Pontificia Bolivariana" />
      </Link>
      <nav className="nav">
        <Link href="/" className={activo(pathname === "/")}>
          Inicio
        </Link>
        <Link
          href="/catalogo"
          className={activo(
            pathname.startsWith("/catalogo") || pathname.startsWith("/libro"),
          )}
        >
          Catálogo
        </Link>
        <Link
          href="/admin-libros"
          className={activo(pathname.startsWith("/admin-libros"))}
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
