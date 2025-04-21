import { useEffect, useMemo, useState } from "react";
import { StudiedTopic } from "@/types/study";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AllThemes } from "@/components/dashboard/AllThemes";
import { ThemeCard } from "@/components/dashboard/ThemeCard";

const Index = () => {
  const [studiedTopics, setStudiedTopics] = useState<StudiedTopic[]>([]);
  
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
    
    setStudiedTopics(getStudiedTopics());
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setStudiedTopics(getStudiedTopics());
      }
    };
    
    const handleRouteChange = () => {
      setStudiedTopics(getStudiedTopics());
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleRouteChange);
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
    const specialties = {
      'Clínica Médica': { correct: 0, total: 0, média: 70 },
      'Cirurgia': { correct: 0, total: 0, média: 70 },
      'Ginecologia e Obstetrícia': { correct: 0, total: 0, média: 70 },
      'Pediatria': { correct: 0, total: 0, média: 70 },
      'Medicina Preventiva': { correct: 0, total: 0, média: 70 }
    };

    const getSpecialty = (title: string): string => {
      const lowerTitle = title.toLowerCase();
      
      if (lowerTitle.includes('cardio') || lowerTitle.includes('clínica') || 
          lowerTitle.includes('clinica') || lowerTitle.includes('endocrin') ||
          lowerTitle.includes('nefrolog') || lowerTitle.includes('gastro') ||
          lowerTitle.includes('pneumo') || lowerTitle.includes('hemato') ||
          lowerTitle.includes('neurolog') || lowerTitle.includes('reumatolog') ||
          lowerTitle.includes('infecto') || lowerTitle.includes('imunolog') ||
          lowerTitle.includes('dermatolog') || lowerTitle.includes('psiquiatr')) {
        return 'Clínica Médica';
      } 
      else if (lowerTitle.includes('cirurg') || lowerTitle.includes('trauma') || 
               lowerTitle.includes('vascular') || lowerTitle.includes('urolog') ||
               lowerTitle.includes('otorrino') || lowerTitle.includes('oftalmolog') ||
               lowerTitle.includes('ortoped') || lowerTitle.includes('transplant') ||
               lowerTitle.includes('anestes')) {
        return 'Cirurgia';
      }
      else if (lowerTitle.includes('gineco') || lowerTitle.includes('obstetr') ||
               lowerTitle.includes('sua') || lowerTitle.includes('ciclo menstrual') ||
               lowerTitle.includes('parto') || lowerTitle.includes('gravidez') ||
               lowerTitle.includes('pré-natal') || lowerTitle.includes('pre-natal') ||
               lowerTitle.includes('amament') || lowerTitle.includes('menstruaç')) {
        return 'Ginecologia e Obstetrícia';
      }
      else if (lowerTitle.includes('pediatr') || lowerTitle.includes('neonat') ||
               lowerTitle.includes('aleitamento') || lowerTitle.includes('crescimento') ||
               lowerTitle.includes('infantil') || lowerTitle.includes('criança') ||
               lowerTitle.includes('adolescente') || lowerTitle.includes('púbere') ||
               lowerTitle.includes('puberdade')) {
        return 'Pediatria';
      }
      else if (lowerTitle.includes('prevent') || lowerTitle.includes('epidem') || 
               lowerTitle.includes('saúde') || lowerTitle.includes('sus') ||
               lowerTitle.includes('coletiv') || lowerTitle.includes('pública') ||
               lowerTitle.includes('publica') || lowerTitle.includes('saneament') ||
               lowerTitle.includes('vigilância') || lowerTitle.includes('promocao') ||
               lowerTitle.includes('promoção')) {
        return 'Medicina Preventiva';
      }
      
      console.log('Topic not categorized:', title);
      return 'Outros';
    };

    const aggregatedData: Record<string, { correctCount: number, totalCount: number }> = {};
    
    studiedTopics.forEach(topic => {
      const specialtyName = getSpecialty(topic.title);
      
      if (!aggregatedData[specialtyName]) {
        aggregatedData[specialtyName] = {
          correctCount: 0,
          totalCount: 0
        };
      }
      
      topic.revisions.forEach(rev => {
        if (typeof rev.correctCount === 'number' && typeof rev.totalCount === 'number') {
          aggregatedData[specialtyName].correctCount += rev.correctCount;
          aggregatedData[specialtyName].totalCount += rev.totalCount;
        }
      });
    });
    
    const result = Object.entries(aggregatedData).map(([specialtyName, data]) => {
      const defaultMedia = 70;
      const media = specialties[specialtyName as keyof typeof specialties]?.média || defaultMedia;
      
      return {
        subject: specialtyName,
        você: data.totalCount > 0 ? Math.round((data.correctCount / data.totalCount) * 100) : 0,
        média: media
      };
    });
    
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

  const chartConfig = {
    você: {
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa",
      },
    },
    média: {
      theme: {
        light: "#94a3b8",
        dark: "#64748b",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 pb-24">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-2">
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

        <DashboardStats metrics={metrics} />
        <PerformanceChart data={specialtyPerformance} chartConfig={chartConfig} />
        <DashboardOverview
          upcomingReviews={upcomingReviews}
          themes={themes}
          ThemeCard={ThemeCard}
        />
        <AllThemes themes={themes} ThemeCard={ThemeCard} />
      </div>
    </div>
  );
};

const ThemeCard = ({
  title,
  description,
  progress,
  questionsCount,
  correctAnswers,
}: {
  title: string;
  description?: string;
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

export default Index;
