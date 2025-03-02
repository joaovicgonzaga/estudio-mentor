import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, ChevronRight, ChevronDown } from "lucide-react";
import { addDays, format, isAfter, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Defining the sequence of revision days
const REVISION_INTERVALS = [1, 7, 30, 60, 90, 180];

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
  initialQuestionsAnswered: boolean;
}

interface RevisionInput {
  topicId: number | string;
  correct: string;
  wrong: string;
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
        })),
        initialQuestionsAnswered: topic.initialQuestionsAnswered ?? false
      }));
    } catch (e) {
      return [];
    }
  });

  const [revisionInput, setRevisionInput] = useState<RevisionInput | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<number | string>>(new Set());
  const [showingInitialQuestion, setShowingInitialQuestion] = useState<number | string | null>(null);

  useEffect(() => {
    localStorage.setItem("studied-topics", JSON.stringify(studiedTopics));
  }, [studiedTopics]);

  const isTopicStudied = (topicId: number | string) => {
    return studiedTopics.some((topic) => topic.id === topicId);
  };

  const toggleTopicExpansion = (topicId: number | string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM", { locale: ptBR });
  };

  const handleMarkAsStudied = (topicId: number | string, topicTitle: string) => {
    const now = new Date();
    const isAlreadyStudied = studiedTopics.some((topic) => topic.id === topicId);

    if (isAlreadyStudied) {
      setStudiedTopics(studiedTopics.filter((topic) => topic.id !== topicId));
      setRevisionInput(null);
      setShowingInitialQuestion(null);
      toast({
        title: "Tema desmarcado",
        description: "O tema foi removido da lista de revisões",
      });
    } else {
      // Ask user about initial questions first, don't create full record yet
      setShowingInitialQuestion(topicId);
      setExpandedTopics(prev => {
        const next = new Set(prev);
        next.add(topicId);
        return next;
      });
      toast({
        title: "Tema marcado como estudado",
        description: "Por favor, informe se realizou questões durante o estudo inicial",
      });
    }
  };

  const handleInitialQuestionsAnswer = (topicId: number | string, topicTitle: string, hasAnsweredQuestions: boolean) => {
    const now = new Date();
    
    const newStudiedTopic: StudiedTopic = {
      id: topicId,
      title: topicTitle,
      studiedAt: now,
      nextRevision: addDays(now, REVISION_INTERVALS[0]),
      currentInterval: 0,
      revisions: [],
      initialQuestionsAnswered: hasAnsweredQuestions
    };
    
    setStudiedTopics([...studiedTopics, newStudiedTopic]);
    setShowingInitialQuestion(null);
    
    if (hasAnsweredQuestions) {
      // If user answered questions, prompt for results
      setRevisionInput({ topicId, correct: "", wrong: "" });
      toast({
        title: "Questões realizadas no estudo inicial",
        description: "Por favor, informe o número de acertos e erros",
      });
    } else {
      // If no questions, just set up for D1 revision
      toast({
        title: "Estudo inicial registrado",
        description: `A próxima revisão (D1) está agendada para ${formatDate(addDays(now, REVISION_INTERVALS[0]))}`,
      });
    }
  };

  const handleRevisionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!revisionInput) return;

    const { topicId, correct, wrong } = revisionInput;
    const correctCount = parseInt(correct);
    const wrongCount = parseInt(wrong);
    
    if (isNaN(correctCount) || isNaN(wrongCount)) {
      toast({
        title: "Valores inválidos",
        description: "Por favor, informe números válidos de acertos e erros",
      });
      return;
    }
    
    const totalCount = correctCount + wrongCount;
    if (totalCount <= 0) {
      toast({
        title: "Valores inválidos",
        description: "O total de questões deve ser maior que zero",
      });
      return;
    }
    
    const accuracy = (correctCount / totalCount) * 100;

    setStudiedTopics((prevTopics) =>
      prevTopics.map((topic) => {
        if (topic.id === topicId) {
          const now = new Date();
          const newRevision: RevisionRecord = {
            date: now,
            correctCount,
            wrongCount,
            totalCount,
            accuracy,
          };

          // Calculate next interval based on whether this is the first D0 revision or a later one
          let nextInterval = 0;
          
          // If initial questions were answered and this is the first submission, this is D0
          // Otherwise, advance to the next interval
          if (topic.initialQuestionsAnswered && topic.revisions.length === 0) {
            nextInterval = 0; // Stay at index 0 which corresponds to 1 day (D1)
          } else {
            nextInterval = Math.min(topic.currentInterval + 1, REVISION_INTERVALS.length - 1);
          }
          
          return {
            ...topic,
            revisions: [...topic.revisions, newRevision],
            currentInterval: nextInterval,
            nextRevision: addDays(now, REVISION_INTERVALS[nextInterval]),
          };
        }
        return topic;
      })
    );

    setRevisionInput(null);
    
    const targetTopic = studiedTopics.find(t => t.id === topicId);
    const isInitialRevision = targetTopic?.initialQuestionsAnswered && targetTopic.revisions.length === 0;
    const nextIntervalIndex = isInitialRevision ? 0 : (targetTopic?.currentInterval || 0) + 1;
    const nextIntervalDays = REVISION_INTERVALS[Math.min(nextIntervalIndex, REVISION_INTERVALS.length - 1)];
    
    const revisionLabel = isInitialRevision ? "Estudo inicial (D0)" : `Revisão D${REVISION_INTERVALS[targetTopic?.currentInterval || 0]}`;
    
    toast({
      title: `${revisionLabel} registrada`,
      description: `Taxa de acerto: ${accuracy.toFixed(1)}%. Próxima revisão em ${nextIntervalDays} dias (D${nextIntervalDays})`,
    });
  };

  // Check if the topic should show initial question prompt
  const shouldShowInitialQuestion = (topicId: number | string) => {
    return showingInitialQuestion === topicId;
  };

  // Check if the topic needs revision submission 
  const shouldShowRevisionInput = (topicId: number | string) => {
    const studiedTopic = studiedTopics.find(topic => topic.id === topicId);
    if (!studiedTopic || shouldShowInitialQuestion(topicId)) return false;
    
    // If initial questions were answered but no revisions yet, show D0 input
    if (studiedTopic.initialQuestionsAnswered && studiedTopic.revisions.length === 0) {
      return true;
    }
    
    // Otherwise show revision input based on revision count vs expected intervals
    return studiedTopic.revisions.length < REVISION_INTERVALS.length;
  };

  const getCurrentRevisionDay = (studiedTopic: StudiedTopic) => {
    if (!studiedTopic) return null;
    
    // If initial questions were answered but no revisions yet, it's D0
    if (studiedTopic.initialQuestionsAnswered && studiedTopic.revisions.length === 0) {
      return 0;
    }
    
    // Otherwise get the current revision day based on the last completed revision
    const revisionsCount = studiedTopic.revisions.length;
    
    // If no revisions yet, it's D1 (skipped D0)
    if (revisionsCount === 0) {
      return 1;
    }
    
    // If user completed all revisions
    if (revisionsCount >= REVISION_INTERVALS.length) {
      return null;
    }
    
    // Otherwise return the next day in the sequence
    return REVISION_INTERVALS[revisionsCount - (studiedTopic.initialQuestionsAnswered ? 0 : 1)];
  };
  
  const getNextRevisionDay = (topic: StudiedTopic) => {
    // If the topic hasn't been through all revisions yet
    const effectiveRevisionCount = topic.revisions.length;
    if (effectiveRevisionCount >= REVISION_INTERVALS.length) return null;
    
    // If initial questions were answered but no revisions recorded, next is D1
    if (topic.initialQuestionsAnswered && topic.revisions.length === 0) {
      return REVISION_INTERVALS[0]; // D1
    }
    
    // Otherwise determine next based on current revisions
    return REVISION_INTERVALS[effectiveRevisionCount];
  };

  const renderInitialQuestionPrompt = (topic: any) => {
    if (!shouldShowInitialQuestion(topic.id)) return null;
    
    return (
      <div className="pt-3 space-y-4">
        <p className="text-sm font-medium text-gray-700">
          Fez questões durante os estudos iniciais?
        </p>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleInitialQuestionsAnswer(topic.id, topic.title, true)}
            variant="default"
            size="sm"
          >
            Sim
          </Button>
          <Button
            onClick={() => handleInitialQuestionsAnswer(topic.id, topic.title, false)}
            variant="outline"
            size="sm"
          >
            Não
          </Button>
        </div>
      </div>
    );
  };

  const renderRevisionForm = (topic: any, studiedTopic: StudiedTopic | undefined) => {
    if (!shouldShowRevisionInput(topic.id) || !studiedTopic) return null;

    const isD0Revision = studiedTopic.initialQuestionsAnswered && studiedTopic.revisions.length === 0;
    const currentRevisionDay = isD0Revision ? 0 : REVISION_INTERVALS[studiedTopic.revisions.length - (studiedTopic.initialQuestionsAnswered ? 0 : 1)];

    return (
      <div className="pt-3">
        <form onSubmit={handleRevisionSubmit} className="space-y-4">
          <p className="text-sm font-medium text-gray-700">
            {isD0Revision 
              ? "Registre seus acertos e erros iniciais (D0):" 
              : `Registre os resultados da revisão D${currentRevisionDay}:`}
          </p>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Acertos
              </label>
              <Input
                type="number"
                min="0"
                value={revisionInput?.topicId === topic.id ? revisionInput.correct : ""}
                onChange={(e) =>
                  setRevisionInput(prev => ({
                    topicId: topic.id,
                    correct: e.target.value,
                    wrong: prev?.wrong || ""
                  }))
                }
                className="ml-2 w-20"
                placeholder="Acertos"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Erros
              </label>
              <Input
                type="number"
                min="0"
                value={revisionInput?.topicId === topic.id ? revisionInput.wrong : ""}
                onChange={(e) =>
                  setRevisionInput(prev => ({
                    topicId: topic.id,
                    correct: prev?.correct || "",
                    wrong: e.target.value
                  }))
                }
                className="ml-2 w-20"
                placeholder="Erros"
              />
            </div>
            <Button
              type="submit"
              variant="default"
              size="sm"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const renderTopicButton = (topic: any) => {
    const studied = isTopicStudied(topic.id);
    const studiedTopic = studiedTopics.find((t) => t.id === topic.id);
    const isExpanded = expandedTopics.has(topic.id);
    const lastRevision = studiedTopic?.revisions?.[studiedTopic.revisions.length - 1];
    const lastAccuracy = lastRevision?.accuracy;
    const nextRevisionDay = studiedTopic ? getNextRevisionDay(studiedTopic) : null;
    const currentRevisionDay = studiedTopic ? getCurrentRevisionDay(studiedTopic) : null;

    return (
      <div key={topic.id} className="border-b last:border-b-0">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{topic.title}</p>
                {studied && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
              <p className="text-sm text-gray-600">{topic.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{topic.questionsCount} questões</span>
                {studied && lastAccuracy !== undefined && (
                  <span className="text-green-600">
                    Acertos: {lastAccuracy.toFixed(1)}%
                  </span>
                )}
                {studied && currentRevisionDay !== null && (
                  <span className="text-blue-600">
                    Próxima revisão: D{currentRevisionDay}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => toggleTopicExpansion(topic.id)}
              className="transform transition-transform duration-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="space-y-4">
                {!studied ? (
                  <Button
                    onClick={() => handleMarkAsStudied(topic.id, topic.title)}
                    variant="default"
                    size="sm"
                    className="inline-flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marcar como estudado
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {renderInitialQuestionPrompt(topic)}
                    {studiedTopic && renderRevisionForm(topic, studiedTopic)}
                    
                    {studiedTopic?.revisions?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">Histórico de revisões</h4>
                        <div className="space-y-1">
                          {studiedTopic.revisions.map((revision, index) => {
                            if (!revision?.accuracy) return null;
                            
                            // Calculate which D-day this revision corresponds to
                            let revisionDay;
                            if (index === 0 && studiedTopic.initialQuestionsAnswered) {
                              revisionDay = 0; // D0 for initial questions
                            } else {
                              const adjustedIndex = studiedTopic.initialQuestionsAnswered ? index - 1 : index;
                              revisionDay = adjustedIndex >= 0 ? REVISION_INTERVALS[adjustedIndex] : 0;
                            }
                            
                            return (
                              <div key={index} className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Revisão D{revisionDay}:</span>
                                <span>{revision.correctCount} acertos</span>
                                <span>{revision.wrongCount} erros</span>
                                <span className="font-medium text-green-600">
                                  {revision.accuracy.toFixed(1)}% de acerto
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handleMarkAsStudied(topic.id, topic.title)}
                      variant="destructive"
                      size="sm"
                    >
                      Desmarcar tema
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getSpecialtyColor = (specialtyId: string) => {
    switch (specialtyId) {
      case "clinica":
        return "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90";
      case "cirurgia":
        return "bg-[#F97316] text-white hover:bg-[#F97316]/90";
      case "gineco":
        return "bg-[#D946EF] text-white hover:bg-[#D946EF]/90";
      case "preventiva":
        return "bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90";
      case "pediatria":
        return "bg-[#84CC16] text-white hover:bg-[#84CC16]/90";
      default:
        return "bg-gray-100 text-gray-900 hover:bg-gray-200";
    }
  };

  const getSpecialtyBorderColor = (specialtyId: string) => {
    switch (specialtyId) {
      case "clinica":
        return "border-[#0EA5E9]/20";
      case "cirurgia":
        return "border-[#F97316]/20";
      case "gineco":
        return "border-[#D946EF]/20";
      case "preventiva":
        return "border-[#8B5CF6]/20";
      case "pediatria":
        return "border-[#84CC16]/20";
      default:
        return "border-gray-200";
    }
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
            <div 
              key={specialty.id} 
              className={cn(
                "rounded-lg border bg-white", 
                getSpecialtyBorderColor(specialty.id)
              )}
            >
              <div className={cn(
                "rounded-t-lg p-6",
                getSpecialtyColor(specialty.id)
              )}>
                <h2 className="text-xl font-semibold">
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
                  .map((topic) => {
                    const lastRevision = topic.revisions?.[topic.revisions.length - 1];
                    const lastAccuracy = lastRevision?.accuracy;
                    const nextRevisionDay = getNextRevisionDay(topic);

                    return (
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
                          <div className="mt-1 text-sm text-gray-500">
                            {lastAccuracy !== undefined && (
                              <span>
                                Última taxa de acerto: {lastAccuracy.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Próxima revisão
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(new Date(topic.nextRevision))}
                            {nextRevisionDay && (
                              <span className="ml-2 text-blue-600">
                                (D{nextRevisionDay})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
