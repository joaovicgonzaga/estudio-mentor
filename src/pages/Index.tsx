
import { useEffect } from "react";
import { ThemeCard } from "@/components/ThemeCard";
import { StatCard } from "@/components/StatCard";
import { ReviewAlert } from "@/components/ReviewAlert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Brain,
  GraduationCap,
  Timer,
  Trophy,
  CheckCircle,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const performanceData = [
  { subject: "Cardiologia", você: 75, média: 65 },
  { subject: "Neurologia", você: 85, média: 70 },
  { subject: "Pediatria", você: 65, média: 68 },
  { subject: "Cirurgia", você: 70, média: 72 },
];

const reviewAlerts = [
  { subject: "Cardiologia - ECG", daysUntilReview: 1 },
  { subject: "Neurologia - Epilepsia", daysUntilReview: 2 },
  { subject: "Pediatria - Vacinas", daysUntilReview: 4 },
];

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
            Dashboard Residência Médica
          </h1>
          <p className="text-gray-600">
            Acompanhe seu desempenho e organize suas revisões
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total de Questões"
            value="1.248"
            description="89 questões essa semana"
            icon={Brain}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Taxa de Acerto"
            value="76%"
            description="Média dos últimos 30 dias"
            icon={Target}
            trend={{ value: 4, isPositive: true }}
          />
          <StatCard
            title="Horas Estudadas"
            value="42h"
            description="Essa semana"
            icon={Timer}
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        {/* Performance Chart */}
        <div className="mb-8 rounded-lg border bg-white p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Desempenho por Disciplina
            </h2>
            <p className="text-sm text-gray-600">
              Comparação com a média da turma
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="você" fill="#94A3B8" />
                <Bar dataKey="média" fill="#E2E8F0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reviews and Progress */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Revisões Pendentes
              </h2>
              <div className="space-y-4">
                {reviewAlerts.map((alert, index) => (
                  <ReviewAlert key={index} {...alert} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Temas em Progresso
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {themes.slice(0, 2).map((theme) => (
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
        </div>

        {/* All Themes */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Todos os Temas
            </h2>
            <p className="text-sm text-gray-600">
              Continue de onde parou ou explore novos temas
            </p>
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
    </div>
  );
};

export default Index;
