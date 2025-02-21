
import { BookOpen } from "lucide-react";
import { ThemeCard } from "@/components/ThemeCard";

const specialties = [
  {
    id: "clinica",
    title: "Clínica Médica",
    topics: [
      {
        id: 1,
        title: "Cardiologia",
        description: "Sistema cardiovascular e suas patologias",
        progress: 65,
        questionsCount: 120,
        timeSpent: "8h 30min",
      },
      // Outros temas de clínica médica
    ],
  },
  {
    id: "cirurgia",
    title: "Cirurgia",
    topics: [
      {
        id: 2,
        title: "Cirurgia Geral",
        description: "Princípios básicos e técnicas cirúrgicas",
        progress: 45,
        questionsCount: 85,
        timeSpent: "6h 15min",
      },
    ],
  },
  // ... Adicione outras especialidades aqui
];

export default function Topics() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <span className="text-sm font-medium text-primary">Temas</span>
          <h1 className="text-3xl font-bold text-gray-900">
            Conteúdo Programático
          </h1>
          <p className="text-gray-600">
            Explore os temas por especialidade médica
          </p>
        </div>

        <div className="space-y-8">
          {specialties.map((specialty) => (
            <div key={specialty.id} className="rounded-lg border bg-white p-6">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {specialty.title}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {specialty.topics.map((topic) => (
                  <ThemeCard key={topic.id} {...topic} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
