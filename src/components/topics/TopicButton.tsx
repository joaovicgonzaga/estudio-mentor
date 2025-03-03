
import { useState } from "react";
import { BookOpen, CheckCircle, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RevisionRecord, StudiedTopic } from "@/types/study";

interface TopicButtonProps {
  topic: {
    id: number | string;
    title: string;
    description?: string;
    questionsCount?: number;
    timeSpent?: string;
  };
  isStudied: boolean;
  studiedTopic?: StudiedTopic;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMarkAsStudied: (topicId: number | string, topicTitle: string) => void;
  formatDate: (date: Date) => string;
  getCurrentRevisionDay: (studiedTopic: StudiedTopic) => number | null;
  REVISION_INTERVALS: number[];
}

export const TopicButton = ({
  topic,
  isStudied,
  studiedTopic,
  isExpanded,
  onToggleExpand,
  onMarkAsStudied,
  formatDate,
  getCurrentRevisionDay,
  REVISION_INTERVALS,
}: TopicButtonProps) => {
  const lastRevision = studiedTopic?.revisions?.[studiedTopic.revisions.length - 1];
  const lastAccuracy = lastRevision?.accuracy;
  const currentRevisionDay = studiedTopic ? getCurrentRevisionDay(studiedTopic) : null;

  return (
    <div className="border-b last:border-b-0">
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{topic.title}</p>
              {isStudied && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            {topic.description && (
              <p className="text-sm text-gray-600">{topic.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {topic.questionsCount && <span>{topic.questionsCount} questões</span>}
              {isStudied && lastAccuracy !== undefined && (
                <span className="text-green-600">
                  Acertos: {lastAccuracy.toFixed(1)}%
                </span>
              )}
              {isStudied && currentRevisionDay !== null && (
                <span className="text-blue-600">
                  Próxima revisão: D{currentRevisionDay}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onToggleExpand}
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
              {!isStudied ? (
                <Button
                  onClick={() => onMarkAsStudied(topic.id, topic.title)}
                  variant="default"
                  size="sm"
                  className="inline-flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como estudado
                </Button>
              ) : (
                <div className="space-y-3">
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
                    onClick={() => onMarkAsStudied(topic.id, topic.title)}
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
