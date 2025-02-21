
import { BarChart as BarChartIcon } from "lucide-react";

export default function Metrics() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <span className="text-sm font-medium text-primary">Métricas</span>
          <h1 className="text-3xl font-bold text-gray-900">
            Controle de Revisão e Métricas
          </h1>
          <p className="text-gray-600">
            Acompanhe seu desempenho e progresso nos estudos
          </p>
        </div>
        
        {/* O conteúdo das métricas será implementado posteriormente */}
        <div className="rounded-lg border bg-white p-6 text-center">
          <BarChartIcon className="mx-auto h-12 w-12 text-primary/50" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            Em desenvolvimento
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            O sistema de métricas está sendo implementado
          </p>
        </div>
      </div>
    </div>
  );
}
