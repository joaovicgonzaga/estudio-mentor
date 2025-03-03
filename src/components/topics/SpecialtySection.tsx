
import { TopicButton } from "./TopicButton";
import { cn } from "@/lib/utils";
import { StudiedTopic } from "@/types/study";

interface SpecialtySectionProps {
  specialty: {
    id: string;
    title: string;
    topics: Array<any>;
  };
  expandedTopics: Set<number | string>;
  studiedTopics: StudiedTopic[];
  toggleTopicExpansion: (topicId: number | string) => void;
  handleMarkAsStudied: (topicId: number | string, topicTitle: string) => void;
  formatDate: (date: Date) => string;
  getCurrentRevisionDay: (studiedTopic: StudiedTopic) => number | null;
  REVISION_INTERVALS: number[];
}

export const SpecialtySection = ({
  specialty,
  expandedTopics,
  studiedTopics,
  toggleTopicExpansion,
  handleMarkAsStudied,
  formatDate,
  getCurrentRevisionDay,
  REVISION_INTERVALS
}: SpecialtySectionProps) => {
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

  const isTopicStudied = (topicId: number | string) => {
    return studiedTopics.some((topic) => topic.id === topicId);
  };

  return (
    <div 
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
                {topic.subtopics.map((subtopic: any) => (
                  <TopicButton
                    key={subtopic.id}
                    topic={subtopic}
                    isStudied={isTopicStudied(subtopic.id)}
                    studiedTopic={studiedTopics.find((t) => t.id === subtopic.id)}
                    isExpanded={expandedTopics.has(subtopic.id)}
                    onToggleExpand={() => toggleTopicExpansion(subtopic.id)}
                    onMarkAsStudied={handleMarkAsStudied}
                    formatDate={formatDate}
                    getCurrentRevisionDay={getCurrentRevisionDay}
                    REVISION_INTERVALS={REVISION_INTERVALS}
                  />
                ))}
              </div>
            );
          }
          return (
            <TopicButton
              key={topic.id}
              topic={topic}
              isStudied={isTopicStudied(topic.id)}
              studiedTopic={studiedTopics.find((t) => t.id === topic.id)}
              isExpanded={expandedTopics.has(topic.id)}
              onToggleExpand={() => toggleTopicExpansion(topic.id)}
              onMarkAsStudied={handleMarkAsStudied}
              formatDate={formatDate}
              getCurrentRevisionDay={getCurrentRevisionDay}
              REVISION_INTERVALS={REVISION_INTERVALS}
            />
          );
        })}
      </div>
    </div>
  );
};
