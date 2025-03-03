import { useState, useEffect } from "react";
import { format } from "date-fns";
import { addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { SpecialtySection } from "@/components/topics/SpecialtySection";
import { StudyRegistrationSheet } from "@/components/topics/StudyRegistrationSheet";
import { NextRevisionsSection } from "@/components/topics/NextRevisionsSection";
import { StudiedTopic, RevisionInput, Specialty } from "@/types/study";

// Defining the sequence of revision days
const REVISION_INTERVALS = [1, 7, 30, 60, 90, 180];

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
  const [openTopicSheet, setOpenTopicSheet] = useState<{ id: number | string, title: string } | null>(null);
  const [initialQuestionsAnswer, setInitialQuestionsAnswer] = useState<boolean | null>(null);

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
      // Open the sheet to ask about initial questions
      setOpenTopicSheet({ id: topicId, title: topicTitle });
      setInitialQuestionsAnswer(null);
      // Expand the topic to show the sheet
      setExpandedTopics(prev => {
        const next = new Set(prev);
        next.add(topicId);
        return next;
      });
    }
  };
  
  const handleInitialQuestionsAnswer = (hasAnsweredQuestions: boolean) => {
    if (!openTopicSheet) return;
    
    const { id: topicId, title: topicTitle } = openTopicSheet;
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
    setInitialQuestionsAnswer(hasAnsweredQuestions);
    
    if (hasAnsweredQuestions) {
      // Keep sheet open for D0 revision input
      setRevisionInput({ topicId, correct: "", wrong: "" });
      toast({
        title: "Questões realizadas no estudo inicial",
        description: "Por favor, informe o número de acertos e erros",
      });
    } else {
      // Close sheet and set up for D1 revision
      setOpenTopicSheet(null);
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
          const newRevision = {
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
    
    // Close the sheet after submitting
    setOpenTopicSheet(null);
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

  const handleRevisionInputChange = (input: RevisionInput) => {
    setRevisionInput(input);
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

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <StudyRegistrationSheet
        open={!!openTopicSheet}
        onOpenChange={(open) => !open && setOpenTopicSheet(null)}
        topicInfo={openTopicSheet}
        initialQuestionsAnswer={initialQuestionsAnswer}
        onInitialQuestionsAnswer={handleInitialQuestionsAnswer}
        revisionInput={revisionInput}
        onRevisionInputChange={handleRevisionInputChange}
        onRevisionSubmit={handleRevisionSubmit}
      />
      
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
            <SpecialtySection
              key={specialty.id}
              specialty={specialty}
              expandedTopics={expandedTopics}
              studiedTopics={studiedTopics}
              toggleTopicExpansion={toggleTopicExpansion}
              handleMarkAsStudied={handleMarkAsStudied}
              formatDate={formatDate}
              getCurrentRevisionDay={getCurrentRevisionDay}
              REVISION_INTERVALS={REVISION_INTERVALS}
            />
          ))}
        </div>

        <NextRevisionsSection
          studiedTopics={studiedTopics}
          formatDate={formatDate}
          getNextRevisionDay={getNextRevisionDay}
        />
      </div>
    </div>
  );
}
