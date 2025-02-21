
import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { differenceInWeeks, addWeeks, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WeekSchedule {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
}

export default function Schedule() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [examDate, setExamDate] = useState<Date | null>(null);
  const [weeks, setWeeks] = useState<WeekSchedule[]>([]);

  // Simula a obtenção das datas das configurações
  useEffect(() => {
    // Por enquanto, vamos usar datas mockadas
    // Isso deve ser substituído pela integração real com as configurações
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
          {weeks.map((week) => (
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

              {/* Placeholder para conteúdo da semana */}
              <div className="mt-4 rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  Clique para adicionar conteúdo para esta semana
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
