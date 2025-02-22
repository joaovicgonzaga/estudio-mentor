
import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, ChevronRight } from "lucide-react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

// Intervalos de revisão em dias
const REVISION_INTERVALS = [1, 7, 30, 60, 90, 180];

interface StudiedTopic {
  id: number | string;
  title: string;
  studiedAt: Date;
  nextRevision: Date;
  currentInterval: number;
}

const specialties = [
  {
    id: "clinica",
    title: "Clínica Médica",
    topics: [
      {
        id: "cardiologia",
        title: "Cardiologia",
        subtopics: [
          {
            id: 1,
            title: "Arritmias e Morte súbita",
            description: "Distúrbios do ritmo cardíaco e suas consequências",
            progress: 0,
            questionsCount: 50,
            timeSpent: "0h",
          },
          {
            id: 2,
            title: "IC e HAS",
            description: "Insuficiência Cardíaca e Hipertensão Arterial Sistêmica",
            progress: 0,
            questionsCount: 60,
            timeSpent: "0h",
          },
          {
            id: 3,
            title: "Valvopatias e Cardiomiopatias",
            description: "Doenças das válvulas cardíacas e do músculo cardíaco",
            progress: 0,
            questionsCount: 45,
            timeSpent: "0h",
          },
        ],
      },
      {
        id: "endocrinologia",
        title: "Endocrinologia",
        subtopics: [
          {
            id: 4,
            title: "Tireoide",
            description: "Distúrbios da glândula tireoide",
            progress: 0,
            questionsCount: 40,
            timeSpent: "0h",
          },
          {
            id: 5,
            title: "Suprarrenal e Paratireoide",
            description: "Doenças das glândulas suprarrenais e paratireoides",
            progress: 0,
            questionsCount: 35,
            timeSpent: "0h",
          },
          {
            id: 6,
            title: "DM e Obesidade",
            description: "Diabetes Mellitus e controle do peso",
            progress: 0,
            questionsCount: 55,
            timeSpent: "0h",
          },
        ],
      },
      // ... Outros temas de clínica médica
    ],
  },
  {
    id: "cirurgia",
    title: "Cirurgia",
    topics: [
      {
        id: 7,
        title: "Trauma",
        description: "Abordagem ao paciente politraumatizado",
        progress: 0,
        questionsCount: 45,
        timeSpent: "0h",
      },
      {
        id: 8,
        title: "Perioperatório e outros",
        description: "Cuidados pré e pós-operatórios",
        progress: 0,
        questionsCount: 40,
        timeSpent: "0h",
      },
      {
        id: 9,
        title: "REMIT, queimaduras",
        description: "Resposta Endócrino-Metabólica ao Trauma e queimados",
        progress: 0,
        questionsCount: 35,
        timeSpent: "0h",
      },
      {
        id: 10,
        title: "Urologia",
        description: "Patologias do sistema urinário",
        progress: 0,
        questionsCount: 30,
        timeSpent: "0h",
      },
      {
        id: 11,
        title: "Cirurgia Vascular",
        description: "Doenças vasculares cirúrgicas",
        progress: 0,
        questionsCount: 35,
        timeSpent: "0h",
      },
      {
        id: 12,
        title: "Cirurgia do Aparelho Digestivo",
        description: "Patologias cirúrgicas do sistema digestório",
        progress: 0,
        questionsCount: 50,
        timeSpent: "0h",
      },
    ],
  },
  {
    id: "gineco",
    title: "Ginecologia e Obstetrícia",
    topics: [
      {
        id: "ginecologia",
        title: "Ginecologia",
        subtopics: [
          {
            id: 13,
            title: "Ciclo Menstrual",
            description: "Fisiologia e distúrbios do ciclo menstrual",
            progress: 0,
            questionsCount: 30,
            timeSpent: "0h",
          },
          {
            id: 14,
            title: "SUA e Infertilidade",
            description: "Sangramento Uterino Anormal e causas de infertilidade",
            progress: 0,
            questionsCount: 35,
            timeSpent: "0h",
          },
          // ... Outros temas de ginecologia
        ],
      },
      {
        id: "obstetricia",
        title: "Obstetrícia",
        subtopics: [
          {
            id: 15,
            title: "Gestação",
            description: "Fisiologia e patologias da gestação",
            progress: 0,
            questionsCount: 45,
            timeSpent: "0h",
          },
          {
            id: 16,
            title: "O parto",
            description: "Mecanismo e assistência ao parto",
            progress: 0,
            questionsCount: 40,
            timeSpent: "0h",
          },
          // ... Outros temas de obstetrícia
        ],
      },
    ],
  },
  {
    id: "pediatria",
    title: "Pediatria",
    topics: [
      {
        id: 17,
        title: "Neonatologia",
        description: "Cuidados com o recém-nascido",
        progress: 0,
        questionsCount: 45,
        timeSpent: "0h",
      },
      {
        id: 18,
        title: "Aleitamento materno + Crescimento e Desenvolvimento",
        description: "Nutrição e desenvolvimento infantil",
        progress: 0,
        questionsCount: 40,
        timeSpent: "0h",
      },
      // ... Outros temas de pediatria
    ],
  },
  {
    id: "preventiva",
    title: "Medicina Preventiva",
    topics: [
      {
        id: 19,
        title: "Medidas de Saúde Coletiva",
        description: "Ações de prevenção e promoção da saúde",
        progress: 0,
        questionsCount: 35,
        timeSpent: "0h",
      },
      {
        id: 20,
        title: "Estudos Epidemiológicos",
        description: "Metodologia e interpretação de estudos",
        progress: 0,
        questionsCount: 30,
        timeSpent: "0h",
      },
      {
        id: 21,
        title: "Saúde do Trabalhador e Vigilância em Saúde",
        description: "Medicina do trabalho e vigilância epidemiológica",
        progress: 0,
        questionsCount: 40,
        timeSpent: "0h",
      },
      {
        id: 22,
        title: "SUS",
        description: "Sistema Único de Saúde: princípios e diretrizes",
        progress: 0,
        questionsCount: 45,
        timeSpent: "0h",
      },
    ],
  },
];

export default function Topics() {
  const [studiedTopics, setStudiedTopics] = useState<StudiedTopic[]>(() => {
    const saved = localStorage.getItem("studied-topics");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("studied-topics", JSON.stringify(studiedTopics));
  }, [studiedTopics]);

  const handleMarkAsStudied = (topicId: number | string, topicTitle: string) => {
    const now = new Date();
    const isAlreadyStudied = studiedTopics.some((topic) => topic.id === topicId);

    if (isAlreadyStudied) {
      setStudiedTopics(studiedTopics.filter((topic) => topic.id !== topicId));
      toast({
        title: "Tema desmarcado",
        description: "O tema foi removido da lista de revisões",
      });
    } else {
      const newStudiedTopic: StudiedTopic = {
        id: topicId,
        title: topicTitle,
        studiedAt: now,
        nextRevision: addDays(now, REVISION_INTERVALS[0]),
        currentInterval: 0,
      };
      setStudiedTopics([...studiedTopics, newStudiedTopic]);
      toast({
        title: "Tema marcado como estudado",
        description: "O tema foi adicionado à lista de revisões",
      });
    }
  };

  const isTopicStudied = (topicId: number | string) => {
    return studiedTopics.some((topic) => topic.id === topicId);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM", { locale: ptBR });
  };

  const renderTopicButton = (topic: any) => {
    const studied = isTopicStudied(topic.id);

    return (
      <button
        key={topic.id}
        onClick={() => handleMarkAsStudied(topic.id, topic.title)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{topic.title}</p>
            {studied && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">{topic.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{topic.questionsCount} questões</span>
            {studied && (
              <span className="text-green-600">
                Próxima revisão: {formatDate(studiedTopics.find(t => t.id === topic.id)?.nextRevision || new Date())}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>
    );
  };

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

        <div className="space-y-6">
          {specialties.map((specialty) => (
            <div key={specialty.id} className="rounded-lg border bg-white">
              <div className="border-b p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {specialty.title}
                </h2>
              </div>
              <div className="divide-y">
                {specialty.topics.map((topic) => {
                  if ('subtopics' in topic) {
                    return (
                      <div key={topic.id} className="divide-y">
                        <div className="bg-gray-50 px-6 py-4">
                          <h3 className="font-medium text-gray-900">
                            {topic.title}
                          </h3>
                        </div>
                        {topic.subtopics.map((subtopic) => renderTopicButton(subtopic))}
                      </div>
                    );
                  }
                  return renderTopicButton(topic);
                })}
              </div>
            </div>
          ))}
        </div>

        {studiedTopics.length > 0 && (
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Próximas Revisões
              </h2>
              <p className="text-sm text-gray-600">
                Temas que você precisa revisar em ordem cronológica
              </p>
            </div>
            <div className="rounded-lg border bg-white">
              <div className="divide-y">
                {studiedTopics
                  .sort((a, b) => new Date(a.nextRevision).getTime() - new Date(b.nextRevision).getTime())
                  .map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Estudado em: {formatDate(new Date(topic.studiedAt))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Próxima revisão
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(new Date(topic.nextRevision))}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
