import type { Metadata } from "next";
import "./globals.css";
import Encabezado from "@/components/Encabezado";
import { MensajesProvider } from "@/components/Mensajes";

export const metadata: Metadata = {
  title: "Biblioteca UPB",
  description: "Catálogo de libros académicos de la Universidad Pontificia Bolivariana",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <Encabezado />
        <MensajesProvider>{children}</MensajesProvider>
        <footer className="site-footer">
          <p>Universidad Pontificia Bolivariana 2026</p>
          <p>&copy; Todos los derechos reservados</p>
        </footer>
      </body>
    </html>
  );
}
