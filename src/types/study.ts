export interface RevisionRecord {
  date: Date;
  correctCount: number;
  wrongCount: number;
  totalCount: number;
  accuracy: number;
}

export interface StudiedTopic {
  id: number | string;
  title: string;
  studiedAt: Date;
  nextRevision: Date;
  currentInterval: number;
  revisions: RevisionRecord[];
  initialQuestionsAnswered: boolean;
}

export interface RevisionInput {
  topicId: number | string;
  correct: string;
  wrong: string;
}

export interface Topic {
  id: number | string;
  title: string;
  description?: string;
  progress?: number;
  questionsCount?: number;
  timeSpent?: string;
}

export interface SubTopic extends Topic {
  subtopics?: Topic[];
}

export interface Specialty {
  id: string;
  title: string;
  topics: (Topic | { id: string; title: string; subtopics: Topic[] })[];
}

/**
 * Standard revision intervals in days:
 * D1: 1 day after initial study
 * D7: 7 days after initial study
 * D30: 30 days after initial study
 * Then every 30 days: D60, D90, D120, D150, etc.
 */
