
import { Calendar } from "lucide-react";

export default function Schedule() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <span className="text-sm font-medium text-primary">Cronograma</span>
          <h1 className="text-3xl font-bold text-gray-900">
            Planejamento de Estudos
          </h1>
          <p className="text-gray-600">
            Organize suas semanas de estudo até a data da prova
          </p>
        </div>

        {/* Conteúdo do cronograma será implementado após configuração de datas */}
        <div className="rounded-lg border bg-white p-6 text-center">
          <Calendar className="mx-auto h-12 w-12 text-primary/50" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            Configure as Datas
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Defina a data inicial e final dos estudos nas configurações para
            visualizar seu cronograma
          </p>
        </div>
      </div>
    </div>
  );
}
