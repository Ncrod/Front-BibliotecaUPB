import { ApiError } from "@/lib/api";

export function Cargando() {
  return <p className="vacio">Cargando…</p>;
}

export function ErrorApi({ error }: { error: ApiError }) {
  return (
    <ul className="mensajes">
      {error.errores.map((e, i) => (
        <li key={i} className="mensaje mensaje--error">
          {e}
        </li>
      ))}
    </ul>
  );
}
