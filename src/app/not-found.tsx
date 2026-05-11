import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold text-indigo-100 mb-4">404</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Página não encontrada</h2>
      <p className="text-gray-500 mb-8">A página que você procura não existe.</p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        Ir para o início
      </Link>
    </div>
  );
}
