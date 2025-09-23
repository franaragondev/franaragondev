import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[98vh] text-center -mt-14">
      <h1 className="text-6xl font-bold text-[#DC2C20] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
      <p className="mb-6 text-gray-600">
        Lo sentimos, no pudimos encontrar la página que estás buscando.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </main>
  );
}
