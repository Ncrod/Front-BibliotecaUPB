import FormularioLibro from "@/components/FormularioLibro";

export default async function EditarLibro({
  params,
}: PageProps<"/admin-libros/[libroId]/editar">) {
  const { libroId } = await params;
  return <FormularioLibro libroId={libroId} />;
}
