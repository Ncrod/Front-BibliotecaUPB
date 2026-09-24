import Detalle from "@/components/Detalle";

export default async function PaginaLibro({
  params,
}: PageProps<"/libro/[libroId]">) {
  const { libroId } = await params;
  return <Detalle libroId={libroId} />;
}
