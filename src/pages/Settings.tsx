
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <span className="text-sm font-medium text-primary">Configurações</span>
          <h1 className="text-3xl font-bold text-gray-900">
            Configurações do Sistema
          </h1>
          <p className="text-gray-600">
            Defina as datas e preferências do seu plano de estudos
          </p>
        </div>

        {/* Formulário de configurações será implementado posteriormente */}
        <div className="rounded-lg border bg-white p-6">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-900"
                >
                  Data de Início dos Estudos
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="examDate"
                  className="text-sm font-medium text-gray-900"
                >
                  Data da Prova
                </label>
                <input
                  type="date"
                  id="examDate"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
