
import { Settings as SettingsIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const [startDate, setStartDate] = useState("");
  const [examDate, setExamDate] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedStartDate = localStorage.getItem("startDate");
    const storedExamDate = localStorage.getItem("examDate");

    if (storedStartDate) setStartDate(storedStartDate.split("T")[0]);
    if (storedExamDate) setExamDate(storedExamDate.split("T")[0]);
  }, []);

  const handleSave = () => {
    if (!startDate || !examDate) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Por favor, preencha todas as datas",
      });
      return;
    }

    const start = new Date(startDate);
    const exam = new Date(examDate);

    if (start >= exam) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "A data de início deve ser anterior à data da prova",
      });
      return;
    }

    localStorage.setItem("startDate", start.toISOString());
    localStorage.setItem("examDate", exam.toISOString());

    toast({
      title: "Configurações salvas",
      description: "As datas foram atualizadas com sucesso",
    });
  };

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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
