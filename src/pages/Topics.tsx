
import { BookOpen, ChevronRight } from "lucide-react";

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
                        {topic.subtopics.map((subtopic) => (
                          <button
                            key={subtopic.id}
                            className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
                          >
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {subtopic.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {subtopic.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{subtopic.questionsCount} questões</span>
                                <span>{subtopic.timeSpent} de estudo</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                                  <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${subtopic.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">
                                  {subtopic.progress}%
                                </span>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={topic.id}
                      className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{topic.title}</p>
                        <p className="text-sm text-gray-600">
                          {topic.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{topic.questionsCount} questões</span>
                          <span>{topic.timeSpent} de estudo</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${topic.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {topic.progress}%
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
