import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TOPICS, QUESTIONS_BANK } from '../data/curriculumData.ts';
import { 
  User, 
  Topic, 
  Question, 
  Test, 
  TestAttempt, 
  ClassGroup, 
  DailyReport, 
  Achievement, 
  AppNotification,
  KundalikSyncStatus,
  GradeMark
} from '../types/index.ts';

const DB_FILE = path.resolve(process.cwd(), 'data_store.json');

export interface DBState {
  users: (User & { passwordHash: string })[];
  classes: ClassGroup[];
  topics: Topic[];
  questions: Question[];
  tests: Test[];
  test_attempts: TestAttempt[];
  daily_reports: DailyReport[];
  achievements: Record<string, Achievement[]>; // userId -> achievements
  notifications: AppNotification[];
  kundalik: KundalikSyncStatus;
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_math_salt_uz').digest('hex');
}

export function calculateGradeMark(percentage: number): GradeMark {
  if (percentage >= 90) return "A'lo";
  if (percentage >= 80) return "Juda yaxshi";
  if (percentage >= 70) return "Yaxshi";
  if (percentage >= 60) return "Qoniqarli";
  return "Ko'proq mashq qilish kerak";
}

function getInitialAchievements(): Achievement[] {
  return [
    {
      id: 'ach-1',
      title: 'Ilk qadam',
      description: "Birinchi testni muvaffaqiyatli yakunlang",
      icon: 'Footprints',
      unlocked: true,
      unlockedAt: '2026-10-01T10:00:00.000Z',
      currentProgress: 1,
      maxProgress: 1,
      category: 'tests',
      badgeColor: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'ach-2',
      title: '7 kunlik seriya 🔥',
      description: "Ketma-ket 7 kun matematika bilan shug'ullaning",
      icon: 'Flame',
      unlocked: false,
      currentProgress: 3,
      maxProgress: 7,
      category: 'streak',
      badgeColor: 'from-amber-500 to-orange-600'
    },
    {
      id: 'ach-3',
      title: '100 ta savol yechildi 🎯',
      description: "Jami 100 ta matematika savolini to'g'ri yeching",
      icon: 'Target',
      unlocked: false,
      currentProgress: 38,
      maxProgress: 100,
      category: 'mastery',
      badgeColor: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'ach-4',
      title: "Matematika ustasi 👑",
      description: "Barcha sinf mavzularida 90%+ (A'lo) natija ko'rsating",
      icon: 'Crown',
      unlocked: false,
      currentProgress: 4,
      maxProgress: 10,
      category: 'accuracy',
      badgeColor: 'from-purple-500 to-pink-600'
    },
    {
      id: 'ach-5',
      title: "Tezkor hisobchi ⚡",
      description: "Testni vaqt me'yorining yarmidan kamida topshiring",
      icon: 'Zap',
      unlocked: true,
      unlockedAt: '2026-10-02T14:30:00.000Z',
      currentProgress: 1,
      maxProgress: 1,
      category: 'mastery',
      badgeColor: 'from-yellow-400 to-amber-500'
    }
  ];
}

function getInitialDB(): DBState {
  const teacherId = 'user-teacher-1';
  const student1Id = 'user-student-1';
  const student2Id = 'user-student-2';
  const student3Id = 'user-student-3';
  const student4Id = 'user-student-4';

  const defaultPassword = hashPassword('123456');

  const users: (User & { passwordHash: string })[] = [
    {
      id: teacherId,
      name: 'Alisher',
      surname: 'Qodirov',
      login: 'ustoz_alisher',
      email: 'alisher@maktab.uz',
      phone: '+998 90 123 45 67',
      role: 'teacher',
      points: 450,
      streak: 12,
      createdAt: '2026-09-01T08:00:00.000Z',
      passwordHash: defaultPassword
    },
    {
      id: student1Id,
      name: 'Nodir',
      surname: 'Karimov',
      login: 'nodir',
      email: 'nodir@maktab.uz',
      phone: '+998 91 234 56 78',
      role: 'student',
      grade: 5,
      className: '5-A',
      points: 240,
      streak: 5,
      createdAt: '2026-09-02T08:00:00.000Z',
      passwordHash: defaultPassword
    },
    {
      id: student2Id,
      name: 'Malika',
      surname: 'Toshmatova',
      login: 'malika',
      email: 'malika@maktab.uz',
      phone: '+998 93 345 67 89',
      role: 'student',
      grade: 6,
      className: '6-B',
      points: 380,
      streak: 7,
      createdAt: '2026-09-02T08:00:00.000Z',
      passwordHash: defaultPassword
    },
    {
      id: student3Id,
      name: 'Jasur',
      surname: 'Ergashev',
      login: 'jasur',
      email: 'jasur@maktab.uz',
      phone: '+998 94 456 78 90',
      role: 'student',
      grade: 7,
      className: '7-A',
      points: 520,
      streak: 11,
      createdAt: '2026-09-02T08:00:00.000Z',
      passwordHash: defaultPassword
    },
    {
      id: student4Id,
      name: 'Dilnoza',
      surname: 'Rahimova',
      login: 'dilnoza',
      email: 'dilnoza@maktab.uz',
      phone: '+998 97 567 89 01',
      role: 'student',
      grade: 8,
      className: '8-V',
      points: 610,
      streak: 14,
      createdAt: '2026-09-02T08:00:00.000Z',
      passwordHash: defaultPassword
    },
    {
      id: 'user-admin-1',
      name: 'Super',
      surname: 'Administrator',
      login: 'admin',
      email: 'admin@matematikapro.uz',
      phone: '+998 90 999 88 77',
      role: 'admin',
      points: 999,
      streak: 30,
      createdAt: '2026-08-01T08:00:00.000Z',
      passwordHash: hashPassword('admin123')
    }
  ];

  const classes: ClassGroup[] = [
    {
      id: 'class-5a',
      name: '5-A sinf',
      grade: 5,
      teacherId: teacherId,
      teacherName: 'Alisher Qodirov',
      studentIds: [student1Id],
      studentCount: 28,
      code: 'MATH5A',
      averageScore: 84
    },
    {
      id: 'class-6b',
      name: '6-B sinf',
      grade: 6,
      teacherId: teacherId,
      teacherName: 'Alisher Qodirov',
      studentIds: [student2Id],
      studentCount: 26,
      code: 'MATH6B',
      averageScore: 78
    },
    {
      id: 'class-7a',
      name: '7-A sinf',
      grade: 7,
      teacherId: teacherId,
      teacherName: 'Alisher Qodirov',
      studentIds: [student3Id],
      studentCount: 25,
      code: 'MATH7A',
      averageScore: 88
    },
    {
      id: 'class-8v',
      name: '8-V sinf',
      grade: 8,
      teacherId: teacherId,
      teacherName: 'Alisher Qodirov',
      studentIds: [student4Id],
      studentCount: 24,
      code: 'MATH8V',
      averageScore: 81
    }
  ];

  // Seed system tests for each grade
  const tests: Test[] = [
    {
      id: 'test-5-diag',
      title: '5-sinf: Boshlang\'ich bilimlar va natural sonlar testi',
      description: 'Natural sonlar, arifmetik amallar va oddiy shakllar bo\'yicha 10 savolli sinov.',
      grade: 5,
      topicId: 'top-5-1',
      questionCount: 10,
      timeLimitMinutes: 15,
      isCustom: false,
      assignedClassId: 'class-5a',
      createdBy: teacherId,
      teacherName: 'Alisher Qodirov',
      createdAt: '2026-10-01T09:00:00.000Z'
    },
    {
      id: 'test-6-rat',
      title: '6-sinf: Nisbat, proporsiya va butun sonlar',
      description: 'Manfiy sonlar ustida amallar, proporsiya va doira yuzasi bo\'yicha oraliq nazorat.',
      grade: 6,
      topicId: 'top-6-2',
      questionCount: 10,
      timeLimitMinutes: 20,
      isCustom: false,
      assignedClassId: 'class-6b',
      createdBy: teacherId,
      teacherName: 'Alisher Qodirov',
      createdAt: '2026-10-02T10:00:00.000Z'
    },
    {
      id: 'test-7-alg',
      title: '7-sinf: Chiziqli tenglamalar va qisqa ko\'paytirish',
      description: 'Algebraik ifodalar, daraja qoidalari va uchburchaklar tengligi.',
      grade: 7,
      topicId: 'top-7-2',
      questionCount: 15,
      timeLimitMinutes: 25,
      isCustom: false,
      assignedClassId: 'class-7a',
      createdBy: teacherId,
      teacherName: 'Alisher Qodirov',
      createdAt: '2026-10-03T11:00:00.000Z'
    },
    {
      id: 'test-8-quad',
      title: '8-sinf: Kvadrat tenglamalar va Pifagor teoremasi',
      description: 'Ildizlar, diskriminant, Viyet teoremasi va to\'g\'ri burchakli uchburchak.',
      grade: 8,
      topicId: 'top-8-2',
      questionCount: 20,
      timeLimitMinutes: 30,
      isCustom: false,
      assignedClassId: 'class-8v',
      createdBy: teacherId,
      teacherName: 'Alisher Qodirov',
      createdAt: '2026-10-04T08:30:00.000Z'
    }
  ];

  const test_attempts: TestAttempt[] = [
    {
      id: 'att-1',
      testId: 'test-5-diag',
      testTitle: '5-sinf: Boshlang\'ich bilimlar va natural sonlar testi',
      userId: student1Id,
      userName: 'Nodir Karimov',
      grade: 5,
      score: 90,
      maxScore: 100,
      percentage: 90,
      gradeMark: "A'lo",
      correctCount: 9,
      wrongCount: 1,
      totalQuestions: 10,
      timeSpentSeconds: 540,
      completedAt: '2026-10-03T14:20:00.000Z'
    },
    {
      id: 'att-2',
      testId: 'test-6-rat',
      testTitle: '6-sinf: Nisbat, proporsiya va butun sonlar',
      userId: student2Id,
      userName: 'Malika Toshmatova',
      grade: 6,
      score: 80,
      maxScore: 100,
      percentage: 80,
      gradeMark: "Juda yaxshi",
      correctCount: 8,
      wrongCount: 2,
      totalQuestions: 10,
      timeSpentSeconds: 680,
      completedAt: '2026-10-04T16:10:00.000Z'
    },
    {
      id: 'att-3',
      testId: 'test-7-alg',
      testTitle: '7-sinf: Chiziqli tenglamalar va qisqa ko\'paytirish',
      userId: student3Id,
      userName: 'Jasur Ergashev',
      grade: 7,
      score: 95,
      maxScore: 100,
      percentage: 95,
      gradeMark: "A'lo",
      correctCount: 14,
      wrongCount: 1,
      totalQuestions: 15,
      timeSpentSeconds: 890,
      completedAt: '2026-10-04T18:00:00.000Z'
    }
  ];

  const daily_reports: DailyReport[] = [
    {
      date: '2026-10-04',
      userId: student1Id,
      userName: 'Nodir Karimov',
      testsTaken: 1,
      questionsSolved: 10,
      correctCount: 9,
      wrongCount: 1,
      accuracyPercentage: 90,
      timeSpentMinutes: 18,
      topicsStudied: ['Natural sonlar', 'Arifmetik amallar']
    },
    {
      date: '2026-10-04',
      userId: student3Id,
      userName: 'Jasur Ergashev',
      testsTaken: 2,
      questionsSolved: 25,
      correctCount: 23,
      wrongCount: 2,
      accuracyPercentage: 92,
      timeSpentMinutes: 35,
      topicsStudied: ['Chiziqli tenglamalar', 'Qisqa ko\'paytirish']
    }
  ];

  const notifications: AppNotification[] = [
    {
      id: 'notif-1',
      userId: student1Id,
      title: 'Yangi test yuklandi! 🔔',
      message: '"5-sinf: Boshlang\'ich bilimlar va natural sonlar testi" sizning sinfingizga biriktirildi.',
      type: 'test',
      link: '/tests/test-5-diag',
      read: false,
      createdAt: '2026-10-04T10:00:00.000Z'
    },
    {
      id: 'notif-2',
      userId: student1Id,
      title: 'Yutuq ochildi! 🏆',
      message: 'Tabriklaymiz! Siz "Ilk qadam" nishoniga sazovor bo\'ldingiz!',
      type: 'achievement',
      read: true,
      createdAt: '2026-10-03T14:21:00.000Z'
    },
    {
      id: 'notif-3',
      userId: teacherId,
      title: 'Yangi test natijasi 📊',
      message: 'Nodir Karimov 5-A sinf testidan 90% (A\'lo) baho oldi.',
      type: 'grade',
      read: false,
      createdAt: '2026-10-03T14:20:00.000Z'
    }
  ];

  const achievementsMap: Record<string, Achievement[]> = {
    [student1Id]: getInitialAchievements(),
    [student2Id]: getInitialAchievements(),
    [student3Id]: getInitialAchievements(),
    [student4Id]: getInitialAchievements()
  };

  const kundalik: KundalikSyncStatus = {
    connected: true,
    schoolId: 'UZ-TAS-SCH-178',
    schoolName: 'Toshkent shahri 178-sonli ixtisoslashtirilgan umumiy o\'rta ta\'lim maktabi',
    lastSyncTime: '2026-10-04T07:15:00.000Z',
    syncedStudentsCount: 103,
    syncedGradesCount: 342,
    autoSync: true,
    apiKeyMasked: 'knd_live_••••••••••••••••7a9f',
    mockMode: true,
    recentLogs: [
      {
        timestamp: '2026-10-04T07:15:00.000Z',
        action: 'Sinf jurnali sinxronlashtirildi',
        status: 'success',
        details: "5-A va 7-A sinflar bo'yicha 28 ta yangi matematika baholari Kundalik jurnaliga yuborildi."
      },
      {
        timestamp: '2026-10-03T18:00:00.000Z',
        action: 'O\'quvchilar ro\'yxati yangilandi',
        status: 'success',
        details: "Kundalik bazasidan 103 ta o'quvchi ma'lumotlari muvaffaqiyatli tekshirildi."
      }
    ]
  };

  return {
    users,
    classes,
    topics: TOPICS,
    questions: QUESTIONS_BANK,
    tests,
    test_attempts,
    daily_reports,
    achievements: achievementsMap,
    notifications,
    kundalik
  };
}

class Database {
  private state: DBState;

  constructor() {
    this.state = this.load();
  }

  private load(): DBState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure topics and questions are up to date
        parsed.topics = TOPICS;
        if (!parsed.questions || parsed.questions.length === 0) {
          parsed.questions = QUESTIONS_BANK;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading DB file, fallback to seed:', e);
    }
    const init = getInitialDB();
    this.saveState(init);
    return init;
  }

  private saveState(state: DBState) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving DB file:', e);
    }
  }

  public save() {
    this.saveState(this.state);
  }

  public getState(): DBState {
    return this.state;
  }
}

export const db = new Database();
