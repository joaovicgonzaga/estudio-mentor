
import { useEffect } from "react";
import { ThemeCard } from "@/components/ThemeCard";

const themes = [
  {
    id: 1,
    title: "Cardiologia",
    description: "Doenças cardiovasculares, ECG e tratamentos",
    progress: 65,
    questionsCount: 120,
    timeSpent: "8h 30min",
  },
  {
    id: 2,
    title: "Neurologia",
    description: "Sistema nervoso, patologias e diagnósticos",
    progress: 45,
    questionsCount: 85,
    timeSpent: "6h 15min",
  },
  {
    id: 3,
    title: "Pediatria",
    description: "Desenvolvimento infantil e doenças pediátricas",
    progress: 30,
    questionsCount: 150,
    timeSpent: "4h 45min",
  },
  {
    id: 4,
    title: "Cirurgia Geral",
    description: "Técnicas cirúrgicas e cuidados pré/pós-operatórios",
    progress: 25,
    questionsCount: 95,
    timeSpent: "3h 20min",
  },
];

const Index = () => {
  useEffect(() => {
    console.log("Página de temas carregada");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <span className="text-sm font-medium text-primary">
            Sistema de Estudos
          </span>
          <h1 className="text-3xl font-bold text-gray-900">
            Temas para Residência Médica
          </h1>
          <p className="text-gray-600">
            Organize seus estudos por especialidade e acompanhe seu progresso
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Seu Progresso
              </h2>
              <p className="text-sm text-gray-600">
                Continue de onde parou ou explore novos temas
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              title={theme.title}
              description={theme.description}
              progress={theme.progress}
              questionsCount={theme.questionsCount}
              timeSpent={theme.timeSpent}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
