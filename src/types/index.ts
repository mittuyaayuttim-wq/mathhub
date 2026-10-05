export type UserRole = 'student' | 'teacher' | 'admin';
export type GradeLevel = 5 | 6 | 7 | 8;

export interface User {
  id: string;
  name: string;
  surname: string;
  login: string;
  email?: string;
  phone?: string;
  role: UserRole;
  grade?: GradeLevel;
  className?: string; // e.g. "5-A", "7-B"
  avatar?: string;
  points: number;
  streak: number;
  lastActiveDate?: string;
  createdAt: string;
}

export type QuestionType = 
  | 'single_choice'
  | 'multiple_choice'
  | 'number_input'
  | 'equation_solve'
  | 'geometry'
  | 'logic_puzzle';

export interface Question {
  id: string;
  topicId: string;
  grade: GradeLevel;
  type: QuestionType;
  questionText: string;
  formula?: string;
  diagramSvg?: string; // For geometry / charts
  options?: string[]; // For single/multi choice
  correctAnswer: string | string[] | number; // Kept secret on server during test
  explanation: string; // Step-by-step solution
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Client safe question without correct answer
export interface ClientQuestion {
  id: string;
  topicId: string;
  grade: GradeLevel;
  type: QuestionType;
  questionText: string;
  formula?: string;
  diagramSvg?: string;
  options?: string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Topic {
  id: string;
  grade: GradeLevel;
  category: string;
  title: string;
  description: string;
  iconName: string;
  difficulty: 'Oson' | "O'rta" | 'Qiyin';
  estimatedMinutes: number;
  formulaSummary: string;
  theoryContent: {
    title: string;
    sections: {
      heading: string;
      text: string;
      formula?: string;
      example?: {
        problem: string;
        solution: string;
      };
    }[];
  };
  questionCount: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  grade: GradeLevel;
  topicId?: string; // optional: could be comprehensive grade exam
  questionCount: number;
  timeLimitMinutes: number;
  questions?: ClientQuestion[];
  isCustom?: boolean;
  assignedClassId?: string;
  createdBy?: string;
  teacherName?: string;
  createdAt: string;
}

export interface TestAnswerSubmission {
  questionId: string;
  answer: string | string[] | number;
}

export interface TestResultReviewItem {
  questionId: string;
  questionText: string;
  formula?: string;
  diagramSvg?: string;
  userAnswer: string | string[] | number;
  correctAnswer: string | string[] | number;
  isCorrect: boolean;
  explanation: string;
  pointsEarned: number;
  maxPoints: number;
}

export type GradeMark = 
  | "A'lo"
  | 'Juda yaxshi'
  | 'Yaxshi'
  | 'Qoniqarli'
  | "Ko'proq mashq qilish kerak";

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  userId: string;
  userName: string;
  grade: GradeLevel;
  score: number;
  maxScore: number;
  percentage: number;
  gradeMark: GradeMark;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt: string;
  reviewItems?: TestResultReviewItem[];
}

export interface ClassGroup {
  id: string;
  name: string; // "5-A", "7-B"
  grade: GradeLevel;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  studentCount: number;
  code: string;
  averageScore: number;
}

export interface DailyReport {
  date: string;
  userId: string;
  userName?: string;
  testsTaken: number;
  questionsSolved: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercentage: number;
  timeSpentMinutes: number;
  topicsStudied: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  maxProgress: number;
  category: 'tests' | 'streak' | 'accuracy' | 'mastery';
  badgeColor: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'test' | 'achievement' | 'grade' | 'system';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface KundalikSyncStatus {
  connected: boolean;
  schoolId: string;
  schoolName: string;
  lastSyncTime: string | null;
  syncedStudentsCount: number;
  syncedGradesCount: number;
  autoSync: boolean;
  apiKeyMasked: string;
  mockMode: boolean;
  recentLogs: {
    timestamp: string;
    action: string;
    status: 'success' | 'warning' | 'error';
    details: string;
  }[];
}
