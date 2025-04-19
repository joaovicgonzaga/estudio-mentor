
import { useEffect, useMemo, useState } from "react";
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
import { Brain, Target, CheckCircle } from "lucide-react";
import { StudiedTopic } from "@/types/study";

const Index = () => {
  // Use useState instead of a custom hook to ensure we're always getting fresh data
  const [studiedTopics, setStudiedTopics] = useState<StudiedTopic[]>([]);
  
  // Load data from localStorage when the component mounts or when the user navigates back to the dashboard
  useEffect(() => {
    const getStudiedTopics = () => {
      const saved = localStorage.getItem("studied-topics");
      if (!saved) return [];
      
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((topic: any) => ({
          ...topic,
          studiedAt: new Date(topic.studiedAt),
          nextRevision: new Date(topic.nextRevision),
          revisions: (topic.revisions || []).map((rev: any) => ({
            ...rev,
            date: new Date(rev.date)
          }))
        }));
      } catch (e) {
        console.error("Error parsing studied topics:", e);
        return [];
      }
    };
    
    // Get fresh data from localStorage
    setStudiedTopics(getStudiedTopics());
    
    // This will ensure we refresh the data if the user navigates away and back to this page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setStudiedTopics(getStudiedTopics());
      }
    };
    
    // Listen for visibility changes (e.g., when user returns to tab)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const metrics = useMemo(() => {
    const totalQuestions = studiedTopics.reduce((sum, topic) => {
      const topicQuestions = topic.revisions.reduce((total, rev) => 
        total + rev.totalCount, 0);
      return sum + topicQuestions;
    }, 0);

    const weeklyQuestions = studiedTopics.reduce((sum, topic) => {
      const weeklyRevisions = topic.revisions.filter(rev => {
        const revDate = new Date(rev.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return revDate >= weekAgo;
      });
      return sum + weeklyRevisions.reduce((total, rev) => total + rev.totalCount, 0);
    }, 0);

    const correctAnswers = studiedTopics.reduce((sum, topic) => {
      return sum + topic.revisions.reduce((total, rev) => total + rev.correctCount, 0);
    }, 0);

    const totalAccuracy = totalQuestions > 0 
      ? Math.round((correctAnswers / totalQuestions) * 100) 
      : 0;

    return {
      totalQuestions,
      weeklyQuestions,
      totalAccuracy
    };
  }, [studiedTopics]);

  const specialtyPerformance = useMemo(() => {
    // Define specialties with default values
    const specialties = {
      'Clínica Médica': { correct: 0, total: 0, média: 70 },
      'Cirurgia': { correct: 0, total: 0, média: 70 },
      'Ginecologia e Obstetrícia': { correct: 0, total: 0, média: 70 },
      'Pediatria': { correct: 0, total: 0, média: 70 },
      'Medicina Preventiva': { correct: 0, total: 0, média: 70 }
    };

    // Helper function to determine which specialty a topic belongs to
    const getSpecialty = (title: string): string => {
      const lowerTitle = title.toLowerCase();
      
      if (lowerTitle.includes('cardio') || lowerTitle.includes('clínica') || 
          lowerTitle.includes('clinica') || lowerTitle.includes('endocrin')) {
        return 'Clínica Médica';
      } 
      else if (lowerTitle.includes('cirurg') || lowerTitle.includes('trauma') || 
               lowerTitle.includes('vascular') || lowerTitle.includes('urolog')) {
        return 'Cirurgia';
      }
      else if (lowerTitle.includes('gineco') || lowerTitle.includes('obstetr') ||
               lowerTitle.includes('sua') || lowerTitle.includes('ciclo menstrual')) {
        return 'Ginecologia e Obstetrícia';
      }
      else if (lowerTitle.includes('pediatr') || lowerTitle.includes('neonat') ||
               lowerTitle.includes('aleitamento') || lowerTitle.includes('crescimento')) {
        return 'Pediatria';
      }
      else if (lowerTitle.includes('prevent') || lowerTitle.includes('epidem') || 
               lowerTitle.includes('saúde') || lowerTitle.includes('sus')) {
        return 'Medicina Preventiva';
      }
      
      console.log('Topic not categorized:', title);
      return 'Outros';
    };

    // Process all topics to aggregate data by specialty
    studiedTopics.forEach(topic => {
      const specialtyName = getSpecialty(topic.title);
      
      // Skip uncategorized topics
      if (specialtyName === 'Outros') return;
      
      const specialty = specialties[specialtyName as keyof typeof specialties];
      if (!specialty) return;
      
      // Count all questions and correct answers from all revisions
      topic.revisions.forEach(rev => {
        if (typeof rev.correctCount === 'number' && typeof rev.totalCount === 'number') {
          specialty.correct += rev.correctCount;
          specialty.total += rev.totalCount;
        }
      });
    });

    // Format data for the chart
    const result = Object.entries(specialties).map(([subject, stats]) => ({
      subject,
      você: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      média: stats.média
    }));
    
    console.log('Specialty Performance Calculation:', result);
    return result;
  }, [studiedTopics]);

  const upcomingReviews = useMemo(() => {
    return studiedTopics
      .filter(topic => {
        const daysUntilReview = Math.ceil(
          (new Date(topic.nextRevision).getTime() - new Date().getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        return daysUntilReview > 0 && daysUntilReview <= 7;
      })
      .map(topic => ({
        subject: topic.title,
        daysUntilReview: Math.ceil(
          (new Date(topic.nextRevision).getTime() - new Date().getTime()) / 
          (1000 * 60 * 60 * 24)
        )
      }))
      .sort((a, b) => a.daysUntilReview - b.daysUntilReview)
      .slice(0, 3);
  }, [studiedTopics]);

  const themes = useMemo(() => {
    const themeStats = new Map();

    studiedTopics.forEach(topic => {
      const themeName = topic.title.split(' - ')[0];
      
      if (!themeStats.has(themeName)) {
        themeStats.set(themeName, {
          id: themeName,
          title: themeName,
          description: `Revisões e questões de ${themeName}`,
          questionsCount: 0,
          correctAnswers: 0,
          totalAnswers: 0
        });
      }

      const stats = themeStats.get(themeName);
      topic.revisions.forEach(rev => {
        stats.questionsCount += rev.totalCount;
        stats.correctAnswers += rev.correctCount;
        stats.totalAnswers += rev.totalCount;
      });
      
      stats.progress = stats.totalAnswers > 0 
        ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
        : 0;
    });

    return Array.from(themeStats.values());
  }, [studiedTopics]);

  useEffect(() => {
    console.log("Página de temas carregada");
    console.log("Specialty Performance Data:", specialtyPerformance);
  }, [specialtyPerformance]);

  const ThemeCard = ({
    title,
    description,
    progress,
    questionsCount,
    correctAnswers,
  }: {
    title: string;
    description: string;
    progress: number;
    questionsCount: number;
    correctAnswers: number;
  }) => {
    const accuracy = Math.round((correctAnswers / questionsCount) * 100) || 0;
    
    return (
      <div className="group relative rounded-lg border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{questionsCount} questões</span>
            <span>{accuracy}% de acerto</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Progresso</span>
              <span className="text-sm font-medium text-primary">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

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

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="mb-8 rounded-lg border bg-white p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Desempenho por Área
            </h2>
            <p className="text-sm text-gray-600">
              Comparação com a média da turma
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={specialtyPerformance}>
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

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Revisões Pendentes
              </h2>
              <div className="space-y-4">
                {upcomingReviews.map((alert, index) => (
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
                    correctAnswers={theme.correctAnswers}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

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
                correctAnswers={theme.correctAnswers}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
