import Listado from "@/components/Listado";

export default async function PorGenero({
  params,
}: PageProps<"/catalogo/genero/[generoId]">) {
  const { generoId } = await params;
  return <Listado generoId={generoId} />;
}
