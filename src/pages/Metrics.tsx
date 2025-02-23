
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";

interface RevisionRecord {
  date: Date;
  correctCount: number;
  wrongCount: number;
  totalCount: number;
  accuracy: number;
}

interface StudiedTopic {
  id: number | string;
  title: string;
  studiedAt: Date;
  nextRevision: Date;
  currentInterval: number;
  revisions: RevisionRecord[];
}

export default function Metrics() {
  const [studiedTopics] = useState<StudiedTopic[]>(() => {
    const saved = localStorage.getItem("studied-topics");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const topicsWithRevisions = useMemo(() => {
    return studiedTopics.filter(topic => topic.revisions.length > 0);
  }, [studiedTopics]);

  const averageAccuracyByTopic = useMemo(() => {
    return topicsWithRevisions.map(topic => ({
      name: topic.title,
      accuracy: topic.revisions.reduce((acc, rev) => acc + rev.accuracy, 0) / topic.revisions.length,
    }));
  }, [topicsWithRevisions]);

  const overallStats = useMemo(() => {
    if (topicsWithRevisions.length === 0) return null;

    const totalRevisions = topicsWithRevisions.reduce((acc, topic) => acc + topic.revisions.length, 0);
    const totalQuestions = topicsWithRevisions.reduce((acc, topic) => 
      acc + topic.revisions.reduce((sum, rev) => sum + rev.totalCount, 0), 0);
    const totalCorrect = topicsWithRevisions.reduce((acc, topic) => 
      acc + topic.revisions.reduce((sum, rev) => sum + rev.correctCount, 0), 0);
    
    return {
      totalTopics: topicsWithRevisions.length,
      totalRevisions,
      totalQuestions,
      overallAccuracy: (totalCorrect / totalQuestions) * 100,
    };
  }, [topicsWithRevisions]);

  if (topicsWithRevisions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 space-y-2">
            <span className="text-sm font-medium text-primary">Métricas</span>
            <h1 className="text-3xl font-bold text-gray-900">
              Controle de Revisão e Métricas
            </h1>
            <p className="text-gray-600">
              Ainda não há dados de revisão registrados
            </p>
          </div>
        </div>
      </div>
    );
  }

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

        {overallStats && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm text-gray-600">Total de temas estudados</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{overallStats.totalTopics}</p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm text-gray-600">Total de revisões</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{overallStats.totalRevisions}</p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm text-gray-600">Total de questões</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{overallStats.totalQuestions}</p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm text-gray-600">Taxa média de acerto</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {overallStats.overallAccuracy.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Taxa de acerto por tema
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averageAccuracyByTopic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#22c55e" name="Taxa de acerto (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
