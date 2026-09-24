"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError, type Autor, type Genero, type Libro } from "@/lib/api";
import { useCarga } from "@/lib/useCarga";
import { Cargando, ErrorApi } from "./Estado";
import { useMensajes } from "./Mensajes";
import NoEncontrado from "./NoEncontrado";

type Campos = {
  titulo: string;
  autor: string;
  genero: string;
  anio: string;
  stock: string;
  sinopsis: string;
};

function validar(c: Campos): string[] {
  const errores: string[] = [];
  if (!c.titulo.trim()) errores.push("El título es obligatorio.");
  if (!c.autor) errores.push("Debes elegir un autor.");
  if (!c.genero) errores.push("Debes elegir un género.");
  if (!/^-?\d+$/.test(c.anio.trim())) errores.push("El año debe ser un número entero.");
  if (c.stock.trim() !== "" && !/^\d+$/.test(c.stock.trim()))
    errores.push("El stock debe ser un entero mayor o igual a 0.");
  return errores;
}

function Formulario({
  libro,
  autores,
  generos,
}: {
  libro?: Libro;
  autores: Autor[];
  generos: Genero[];
}) {
  const router = useRouter();
  const { mostrar, mostrarTrasNavegar, limpiar } = useMensajes();
  const [enviando, setEnviando] = useState(false);
  const [campos, setCampos] = useState<Campos>({
    titulo: libro?.titulo ?? "",
    autor: libro?.autor.id ?? "",
    genero: libro?.genero.id ?? "",
    anio: libro ? String(libro.anio) : "",
    stock: libro ? String(libro.stock) : "0",
    sinopsis: libro?.sinopsis ?? "",
  });
  const cambiar =
    (nombre: keyof Campos) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setCampos((c) => ({ ...c, [nombre]: e.target.value }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    limpiar();
    const errores = validar(campos);
    if (errores.length) return mostrar("error", errores);

    const datos = {
      titulo: campos.titulo.trim(),
      autor: campos.autor,
      genero: campos.genero,
      anio: Number(campos.anio),
      stock: campos.stock.trim() === "" ? 0 : Number(campos.stock),
      sinopsis: campos.sinopsis,
    };
    setEnviando(true);
    try {
      const guardado = libro
        ? await api.editarLibro(libro.id, datos)
        : await api.crearLibro(datos);
      mostrarTrasNavegar(
        "success",
        [`Libro "${guardado.titulo}" ${libro ? "actualizado" : "creado"}.`],
      );
      router.push("/admin-libros");
    } catch (err) {
      mostrar("error", err instanceof ApiError ? err.errores : ["No se pudo guardar."]);
      setEnviando(false);
    }
  }

  const accion = libro ? "Editar" : "Crear";
  return (
    <section className="admin">
      <title>{`${accion} libro — Biblioteca UPB`}</title>
      <Link className="volver" href="/admin-libros">
        &larr; Volver al listado
      </Link>
      <h1>{accion} libro</h1>

      <form className="formulario" onSubmit={enviar} noValidate>
        <label className="campo">
          <span>Título</span>
          <input type="text" value={campos.titulo} onChange={cambiar("titulo")} required />
        </label>

        <label className="campo">
          <span>Autor</span>
          <select value={campos.autor} onChange={cambiar("autor")} required>
            <option value="">-- Selecciona un autor --</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="campo">
          <span>Género</span>
          <select value={campos.genero} onChange={cambiar("genero")} required>
            <option value="">-- Selecciona un género --</option>
            {generos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="campo">
          <span>Año</span>
          <input type="number" value={campos.anio} onChange={cambiar("anio")} required />
        </label>

        <label className="campo">
          <span>Stock</span>
          <input type="number" min="0" value={campos.stock} onChange={cambiar("stock")} />
        </label>

        <label className="campo campo--ancho">
          <span>Sinopsis</span>
          <textarea rows={5} value={campos.sinopsis} onChange={cambiar("sinopsis")} />
        </label>

        <div className="formulario__acciones">
          <button type="submit" className="boton" disabled={enviando}>
            Guardar
          </button>
        </div>
      </form>
    </section>
  );
}

export default function FormularioLibro({ libroId }: { libroId?: string }) {
  const { data, error, cargando } = useCarga(`form:${libroId ?? "nuevo"}`, async () => {
    const [autores, generos, libro] = await Promise.all([
      api.autores(),
      api.generos(),
      libroId ? api.libro(libroId) : Promise.resolve(undefined),
    ]);
    return { autores, generos, libro };
  });

  if (cargando) return <Cargando />;
  if (error)
    return error.status === 404 ? (
      <NoEncontrado mensaje={error.errores[0]} />
    ) : (
      <ErrorApi error={error} />
    );
  return <Formulario {...data!} />;
}
