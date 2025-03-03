
import { StudiedTopic } from "@/types/study";

interface NextRevisionsSectionProps {
  studiedTopics: StudiedTopic[];
  formatDate: (date: Date) => string;
  getNextRevisionDay: (topic: StudiedTopic) => number | null;
}

export const NextRevisionsSection = ({
  studiedTopics,
  formatDate,
  getNextRevisionDay
}: NextRevisionsSectionProps) => {
  if (studiedTopics.length === 0) return null;

  return (
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
  );
};
