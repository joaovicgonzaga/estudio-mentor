
import { Card } from "@/components/ui/card";
import { ReviewAlert } from "@/components/ReviewAlert";

interface ReviewData {
  subject: string;
  daysUntilReview: number;
}

interface ThemeData {
  id: string | number;
  title: string;
  description?: string;
  progress: number;
  questionsCount: number;
  correctAnswers: number;
}

interface DashboardOverviewProps {
  upcomingReviews: ReviewData[];
  themes: ThemeData[];
  ThemeCard: React.ComponentType<ThemeData>;
}

export const DashboardOverview = ({
  upcomingReviews,
  themes,
  ThemeCard,
}: DashboardOverviewProps) => {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-1">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Revisões Pendentes
        </h2>
        <div className="space-y-4">
          {upcomingReviews.length > 0 ? (
            upcomingReviews.map((alert, index) => (
              <ReviewAlert key={index} {...alert} />
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhuma revisão para os próximos 7 dias</p>
          )}
        </div>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Temas em Progresso
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {themes.slice(0, 2).map((theme) => (
            <ThemeCard key={theme.id} {...theme} />
          ))}
          {themes.length === 0 && (
            <p className="text-sm text-gray-500 sm:col-span-2">Nenhum tema em progresso ainda</p>
          )}
        </div>
      </Card>
    </div>
  );
};
