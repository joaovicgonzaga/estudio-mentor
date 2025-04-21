
import { Brain, Target, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";

interface DashboardStatsProps {
  metrics: {
    totalQuestions: number;
    weeklyQuestions: number;
    totalAccuracy: number;
  };
}

export const DashboardStats = ({ metrics }: DashboardStatsProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total de Questões"
        value={metrics.totalQuestions.toString()}
        description={`${metrics.weeklyQuestions} questões essa semana`}
        icon={Brain}
        trend={metrics.weeklyQuestions > 0 ? { value: 12, isPositive: true } : undefined}
      />
      <StatCard
        title="Taxa de Acerto"
        value={`${metrics.totalAccuracy}%`}
        description="Média dos últimos 30 dias"
        icon={Target}
        trend={metrics.totalAccuracy > 70 ? { value: 4, isPositive: true } : undefined}
      />
      <StatCard
        title="Taxa de Acerto Total"
        value={`${metrics.totalAccuracy}%`}
        description="Todas as questões respondidas"
        icon={CheckCircle}
        trend={metrics.totalAccuracy > 70 ? { value: 2, isPositive: true } : undefined}
      />
    </div>
  );
};
