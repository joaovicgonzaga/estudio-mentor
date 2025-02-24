
import { useState, useEffect } from "react";
import { Calendar, Clock, BookOpen, CheckCircle } from "lucide-react";
import { differenceInWeeks, addWeeks, format, isAfter, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface WeekSchedule {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
}

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

export default function Schedule() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [examDate, setExamDate] = useState<Date | null>(null);
  const [weeks, setWeeks] = useState<WeekSchedule[]>([]);
  const [studiedTopics, setStudiedTopics] = useState<StudiedTopic[]>(() => {
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
      return [];
    }
  });

  // Simula a obtenção das datas das configurações
  useEffect(() => {
    const storedStartDate = localStorage.getItem("startDate");
    const storedExamDate = localStorage.getItem("examDate");

    if (storedStartDate && storedExamDate) {
      setStartDate(new Date(storedStartDate));
      setExamDate(new Date(storedExamDate));
    }
  }, []);

  // Calcula as semanas quando as datas são definidas
  useEffect(() => {
    if (startDate && examDate) {
      const totalWeeks = differenceInWeeks(examDate, startDate) + 1;
      const weekSchedules: WeekSchedule[] = [];

      for (let i = 0; i < totalWeeks; i++) {
        const weekStartDate = addWeeks(startDate, i);
        const weekEndDate = addWeeks(weekStartDate, 1);
        
        weekSchedules.push({
          weekNumber: i + 1,
          startDate: weekStartDate,
          endDate: weekEndDate,
        });
      }

      setWeeks(weekSchedules);
    }
  }, [startDate, examDate]);

  // Função auxiliar para verificar se uma data está dentro de uma semana específica
  const isDateInWeek = (date: Date, weekStart: Date, weekEnd: Date) => {
    return isAfter(date, weekStart) && !isAfter(date, weekEnd);
  };

  // Encontra as revisões programadas para uma semana específica
  const getRevisionsForWeek = (weekStart: Date, weekEnd: Date) => {
    return studiedTopics.filter(topic => 
      isDateInWeek(new Date(topic.nextRevision), weekStart, weekEnd)
    );
  };

  if (!startDate || !examDate) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 space-y-2">
            <span className="text-sm font-medium text-primary">Cronograma</span>
            <h1 className="text-3xl font-bold text-gray-900">
              Planejamento de Estudos
            </h1>
            <p className="text-gray-600">
              Organize suas semanas de estudo até a data da prova
            </p>
          </div>

          <div className="rounded-lg border bg-white p-6 text-center">
            <Calendar className="mx-auto h-12 w-12 text-primary/50" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Configure as Datas
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Defina a data inicial e final dos estudos nas configurações para
              visualizar seu cronograma
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
          <span className="text-sm font-medium text-primary">Cronograma</span>
          <h1 className="text-3xl font-bold text-gray-900">
            Planejamento de Estudos
          </h1>
          <p className="text-gray-600">
            {`${weeks.length} semanas de estudo programadas`}
          </p>
        </div>

        <div className="space-y-6">
          {weeks.map((week) => {
            const revisionsThisWeek = getRevisionsForWeek(week.startDate, week.endDate);
            
            return (
              <div
                key={week.weekNumber}
                className="rounded-lg border bg-white p-6 transition-all hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Semana {week.weekNumber}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {format(week.startDate, "dd 'de' MMMM", { locale: ptBR })} -{" "}
                      {format(week.endDate, "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>

                {revisionsThisWeek.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="font-medium text-gray-900">
                      Revisões Programadas
                    </h3>
                    <div className="space-y-2">
                      {revisionsThisWeek.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center gap-2 rounded-md bg-primary/5 px-4 py-3"
                        >
                          <BookOpen className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{topic.title}</p>
                            <p className="text-sm text-gray-600">
                              Revisão em: {format(new Date(topic.nextRevision), "dd 'de' MMMM", { locale: ptBR })}
                            </p>
                          </div>
                          {topic.revisions.length > 0 && (
                            <div className="text-right text-sm">
                              <p className="font-medium text-green-600">
                                {topic.revisions[topic.revisions.length - 1].accuracy.toFixed(1)}% de acerto
                              </p>
                              <p className="text-gray-500">
                                Última revisão
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {revisionsThisWeek.length === 0 && (
                  <div className="mt-4 rounded-md bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">
                      Nenhuma revisão programada para esta semana
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
