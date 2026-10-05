import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, hashPassword, calculateGradeMark } from './src/server/db.ts';
import { 
  User, 
  Test, 
  TestAttempt, 
  ClientQuestion, 
  TestResultReviewItem,
  AppNotification
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// SSE Clients for real-time updates
const sseClients: Response[] = [];

function broadcastRealtime(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(res => {
    try {
      res.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// SSE endpoint
app.get('/api/realtime/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.push(res);
  res.write(`event: connected\ndata: {"status": "ok"}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// ==================== AUTH ROUTES ====================

app.get('/api/auth/demo-users', (_req: Request, res: Response) => {
  const users = db.getState().users.map(u => ({
    id: u.id,
    name: u.name,
    surname: u.surname,
    login: u.login,
    role: u.role,
    grade: u.grade,
    className: u.className,
    points: u.points,
    streak: u.streak
  }));
  res.json({ success: true, users });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, surname, login, email, phone, password, role, grade, className } = req.body;

  if (!name || !surname || !login || !password) {
    return res.status(400).json({ error: "Barcha majburiy maydonlarni to'ldiring!" });
  }

  const state = db.getState();
  const existing = state.users.find(u => u.login.toLowerCase() === login.toLowerCase() || (email && u.email?.toLowerCase() === email.toLowerCase()));
  if (existing) {
    return res.status(400).json({ error: "Ushbu login yoki email allaqachon ro'yxatdan o'tgan!" });
  }

  const newUser: User & { passwordHash: string } = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    surname: surname.trim(),
    login: login.trim().toLowerCase(),
    email: email ? email.trim() : undefined,
    phone: phone ? phone.trim() : undefined,
    role: role === 'teacher' ? 'teacher' : 'student',
    grade: role === 'student' ? (parseInt(grade, 10) as any || 5) : undefined,
    className: role === 'student' ? (className || `${grade || 5}-A`) : undefined,
    points: 100, // Welcome points
    streak: 1,
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password)
  };

  state.users.push(newUser);

  // If student, link to suitable class
  if (newUser.role === 'student' && newUser.grade) {
    const cl = state.classes.find(c => c.grade === newUser.grade);
    if (cl) {
      cl.studentIds.push(newUser.id);
      cl.studentCount = cl.studentIds.length;
    }
  }

  db.save();

  const userSafe: User = {
    id: newUser.id,
    name: newUser.name,
    surname: newUser.surname,
    login: newUser.login,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    grade: newUser.grade,
    className: newUser.className,
    points: newUser.points,
    streak: newUser.streak,
    createdAt: newUser.createdAt
  };

  res.json({ success: true, user: userSafe });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: "Login va parolni kiriting!" });
  }

  const hash = hashPassword(password);
  const state = db.getState();
  const user = state.users.find(u => 
    (u.login.toLowerCase() === identifier.toLowerCase() ||
     u.email?.toLowerCase() === identifier.toLowerCase() ||
     u.phone === identifier) &&
    u.passwordHash === hash
  );

  if (!user) {
    return res.status(401).json({ error: "Login yoki parol noto'g'ri!" });
  }

  const userSafe: User = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    login: user.login,
    email: user.email,
    phone: user.phone,
    role: user.role,
    grade: user.grade,
    className: user.className,
    points: user.points,
    streak: user.streak,
    createdAt: user.createdAt
  };

  res.json({ success: true, user: userSafe });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { identifier } = req.body;
  const state = db.getState();
  const user = state.users.find(u => 
    u.login.toLowerCase() === identifier?.toLowerCase() ||
    u.email?.toLowerCase() === identifier?.toLowerCase() ||
    u.phone === identifier
  );

  if (!user) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi!" });
  }

  // Generate demo reset token
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({
    success: true,
    message: `Parolni tiklash kodi yuborildi. Demo kod: ${resetCode}`,
    demoCode: resetCode
  });
});

// ==================== TOPICS & CURRICULUM ====================

app.get('/api/topics', (req: Request, res: Response) => {
  const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : null;
  const state = db.getState();
  let topics = state.topics;
  if (grade) {
    topics = topics.filter(t => t.grade === grade);
  }
  res.json({ success: true, topics });
});

app.get('/api/topics/:id', (req: Request, res: Response) => {
  const state = db.getState();
  const topic = state.topics.find(t => t.id === req.params.id);
  if (!topic) {
    return res.status(404).json({ error: "Mavzu topilmadi!" });
  }
  // Questions count
  const questionsCount = state.questions.filter(q => q.topicId === topic.id).length;
  res.json({ success: true, topic: { ...topic, questionCount: Math.max(topic.questionCount, questionsCount) } });
});

// ==================== TESTS & ATTEMPTS ====================

app.get('/api/tests', (req: Request, res: Response) => {
  const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : null;
  const state = db.getState();
  let tests = state.tests;
  if (grade) {
    tests = tests.filter(t => t.grade === grade);
  }
  res.json({ success: true, tests });
});

app.get('/api/tests/:id/start', (req: Request, res: Response) => {
  const state = db.getState();
  const test = state.tests.find(t => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ error: "Test topilmadi!" });
  }

  // Collect questions for this test / topic / grade
  let relevantQuestions = state.questions.filter(q => {
    if (test.topicId) {
      return q.topicId === test.topicId || q.grade === test.grade;
    }
    return q.grade === test.grade;
  });

  if (relevantQuestions.length === 0) {
    relevantQuestions = state.questions.filter(q => q.grade === test.grade);
  }

  // Shuffle and pick test questionCount
  const count = Math.min(test.questionCount || 10, Math.max(relevantQuestions.length, 5));
  const shuffled = [...relevantQuestions].sort(() => 0.5 - Math.random()).slice(0, count);

  // SANITIZE: Remove correctAnswer and explanation to prevent cheating!
  const clientQuestions: ClientQuestion[] = shuffled.map(q => ({
    id: q.id,
    topicId: q.topicId,
    grade: q.grade,
    type: q.type,
    questionText: q.questionText,
    formula: q.formula,
    diagramSvg: q.diagramSvg,
    options: q.options,
    points: q.points || 10,
    difficulty: q.difficulty
  }));

  res.json({
    success: true,
    test: {
      id: test.id,
      title: test.title,
      description: test.description,
      grade: test.grade,
      timeLimitMinutes: test.timeLimitMinutes,
      questionCount: clientQuestions.length,
      questions: clientQuestions
    }
  });
});

app.post('/api/tests/:id/submit', (req: Request, res: Response) => {
  const testId = req.params.id;
  const { userId, answers, timeSpentSeconds } = req.body;

  if (!userId || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Noto'g'ri so'rov ma'lumotlari!" });
  }

  const state = db.getState();
  const user = state.users.find(u => u.id === userId);
  const test = state.tests.find(t => t.id === testId);

  if (!user || !test) {
    return res.status(404).json({ error: "Foydalanuvchi yoki test topilmadi!" });
  }

  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;
  let wrongCount = 0;

  const reviewItems: TestResultReviewItem[] = [];

  for (const item of answers) {
    const q = state.questions.find(quest => quest.id === item.questionId);
    if (!q) continue;

    const points = q.points || 10;
    maxScore += points;

    let isCorrect = false;

    if (q.type === 'number_input') {
      const userNum = parseFloat(String(item.answer).replace(',', '.').trim());
      const correctNum = parseFloat(String(q.correctAnswer).replace(',', '.').trim());
      isCorrect = Math.abs(userNum - correctNum) < 0.01;
    } else if (Array.isArray(q.correctAnswer)) {
      const userArr = Array.isArray(item.answer) ? item.answer.map(String).sort() : [String(item.answer)];
      const correctArr = q.correctAnswer.map(String).sort();
      isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr);
    } else {
      isCorrect = String(item.answer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
    }

    if (isCorrect) {
      totalScore += points;
      correctCount++;
    } else {
      wrongCount++;
    }

    reviewItems.push({
      questionId: q.id,
      questionText: q.questionText,
      formula: q.formula,
      diagramSvg: q.diagramSvg,
      userAnswer: item.answer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      pointsEarned: isCorrect ? points : 0,
      maxPoints: points
    });
  }

  if (maxScore === 0) maxScore = 100;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const gradeMark = calculateGradeMark(percentage);

  // Update User points & streak
  user.points = (user.points || 0) + totalScore + (percentage >= 90 ? 20 : 10);
  user.streak = (user.streak || 0) + 1;

  const attempt: TestAttempt = {
    id: `att-${Date.now()}`,
    testId: test.id,
    testTitle: test.title,
    userId: user.id,
    userName: `${user.name} ${user.surname}`,
    grade: user.grade || test.grade,
    score: totalScore,
    maxScore,
    percentage,
    gradeMark,
    correctCount,
    wrongCount,
    totalQuestions: reviewItems.length,
    timeSpentSeconds: timeSpentSeconds || 60,
    completedAt: new Date().toISOString(),
    reviewItems
  };

  state.test_attempts.unshift(attempt);

  // Update daily report
  const today = new Date().toISOString().split('T')[0];
  let daily = state.daily_reports.find(d => d.date === today && d.userId === user.id);
  if (!daily) {
    daily = {
      date: today,
      userId: user.id,
      userName: `${user.name} ${user.surname}`,
      testsTaken: 0,
      questionsSolved: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracyPercentage: 0,
      timeSpentMinutes: 0,
      topicsStudied: []
    };
    state.daily_reports.unshift(daily);
  }

  daily.testsTaken += 1;
  daily.questionsSolved += reviewItems.length;
  daily.correctCount += correctCount;
  daily.wrongCount += wrongCount;
  daily.timeSpentMinutes += Math.round((timeSpentSeconds || 60) / 60);
  daily.accuracyPercentage = Math.round((daily.correctCount / Math.max(1, daily.questionsSolved)) * 100);

  // Check achievements
  const userAchs = state.achievements[user.id] || [];
  userAchs.forEach(ach => {
    if (ach.id === 'ach-1') ach.unlocked = true;
    if (ach.id === 'ach-2') {
      ach.currentProgress = Math.min(ach.maxProgress, user.streak);
      if (ach.currentProgress >= ach.maxProgress) ach.unlocked = true;
    }
    if (ach.id === 'ach-3') {
      ach.currentProgress = Math.min(ach.maxProgress, ach.currentProgress + correctCount);
      if (ach.currentProgress >= ach.maxProgress) ach.unlocked = true;
    }
    if (ach.id === 'ach-4' && percentage >= 90) {
      ach.currentProgress = Math.min(ach.maxProgress, ach.currentProgress + 1);
      if (ach.currentProgress >= ach.maxProgress) ach.unlocked = true;
    }
  });

  // Notify teacher about new test submission
  const teacherNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    userId: test.createdBy || 'user-teacher-1',
    title: 'Yangi test topshirildi 📊',
    message: `${user.name} ${user.surname} "${test.title}" testidan ${percentage}% (${gradeMark}) oldi.`,
    type: 'grade',
    read: false,
    createdAt: new Date().toISOString()
  };
  state.notifications.unshift(teacherNotif);

  db.save();

  // Broadcast real-time event to connected teacher dashboards
  broadcastRealtime('test_completed', {
    attemptId: attempt.id,
    studentName: `${user.name} ${user.surname}`,
    testTitle: test.title,
    percentage,
    gradeMark
  });

  res.json({
    success: true,
    result: attempt
  });
});

// ==================== STUDENT STATS & PROGRESS ====================

app.get('/api/stats/student/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const state = db.getState();
  const user = state.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi!" });
  }

  const attempts = state.test_attempts.filter(a => a.userId === userId);
  const totalTests = attempts.length;
  const avgPercentage = totalTests > 0 
    ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / totalTests)
    : 0;

  const totalCorrect = attempts.reduce((acc, a) => acc + a.correctCount, 0);
  const totalWrong = attempts.reduce((acc, a) => acc + a.wrongCount, 0);
  const totalTimeSeconds = attempts.reduce((acc, a) => acc + a.timeSpentSeconds, 0);

  // Grade distributions
  const marks = {
    "A'lo": attempts.filter(a => a.gradeMark === "A'lo").length,
    "Juda yaxshi": attempts.filter(a => a.gradeMark === "Juda yaxshi").length,
    "Yaxshi": attempts.filter(a => a.gradeMark === "Yaxshi").length,
    "Qoniqarli": attempts.filter(a => a.gradeMark === "Qoniqarli").length,
    "Ko'proq mashq qilish kerak": attempts.filter(a => a.gradeMark === "Ko'proq mashq qilish kerak").length
  };

  const userAchievements = state.achievements[userId] || [];

  res.json({
    success: true,
    stats: {
      points: user.points || 0,
      streak: user.streak || 1,
      totalTests,
      avgPercentage,
      totalCorrect,
      totalWrong,
      totalTimeMinutes: Math.round(totalTimeSeconds / 60),
      marks,
      recentAttempts: attempts.slice(0, 10),
      achievements: userAchievements
    }
  });
});

// ==================== TEACHER ROUTES ====================

app.get('/api/teacher/classes', (_req: Request, res: Response) => {
  const state = db.getState();
  const classes = state.classes.map(cl => {
    const students = state.users.filter(u => cl.studentIds.includes(u.id));
    return {
      ...cl,
      students: students.map(s => ({
        id: s.id,
        name: s.name,
        surname: s.surname,
        points: s.points,
        streak: s.streak,
        grade: s.grade
      }))
    };
  });
  res.json({ success: true, classes });
});

app.post('/api/teacher/classes', (req: Request, res: Response) => {
  const { name, grade, teacherId } = req.body;
  const state = db.getState();
  const teacher = state.users.find(u => u.id === teacherId) || state.users.find(u => u.role === 'teacher');

  const newClass = {
    id: `class-${Date.now()}`,
    name,
    grade: parseInt(grade, 10) as any || 5,
    teacherId: teacher?.id || 'user-teacher-1',
    teacherName: `${teacher?.name || 'Alisher'} ${teacher?.surname || 'Qodirov'}`,
    studentIds: [],
    studentCount: 0,
    code: `MATH${grade}${name.replace(/\D/g, '') || 'X'}`,
    averageScore: 0
  };

  state.classes.push(newClass);
  db.save();
  res.json({ success: true, class: newClass });
});

app.post('/api/teacher/tests', (req: Request, res: Response) => {
  const { title, description, grade, timeLimitMinutes, questionCount, assignedClassId, customQuestions } = req.body;

  if (!title || !grade) {
    return res.status(400).json({ error: "Sarlavha va sinfni ko'rsating!" });
  }

  const state = db.getState();
  const newTestId = `test-${Date.now()}`;

  // If teacher provided custom questions, add them to questions bank
  if (Array.isArray(customQuestions) && customQuestions.length > 0) {
    for (const cq of customQuestions) {
      state.questions.push({
        id: `q-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        topicId: cq.topicId || 'top-custom',
        grade: parseInt(grade, 10) as any,
        type: cq.type || 'single_choice',
        questionText: cq.questionText,
        formula: cq.formula,
        options: cq.options || [],
        correctAnswer: cq.correctAnswer,
        explanation: cq.explanation || "O'qituvchi tomonidan kiritilgan savol yechimi.",
        points: cq.points || 10,
        difficulty: cq.difficulty || 'medium'
      });
    }
  }

  const newTest: Test = {
    id: newTestId,
    title,
    description: description || "O'qituvchi tomonidan tuzilgan maxsus sinov testi.",
    grade: parseInt(grade, 10) as any,
    questionCount: questionCount || 10,
    timeLimitMinutes: timeLimitMinutes || 20,
    isCustom: true,
    assignedClassId,
    createdBy: 'user-teacher-1',
    teacherName: 'Alisher Qodirov',
    createdAt: new Date().toISOString()
  };

  state.tests.unshift(newTest);

  // Notify students of assigned class
  const targetClass = state.classes.find(c => c.id === assignedClassId);
  const studentsToNotify = targetClass 
    ? state.users.filter(u => targetClass.studentIds.includes(u.id))
    : state.users.filter(u => u.grade === parseInt(grade, 10) && u.role === 'student');

  studentsToNotify.forEach(st => {
    state.notifications.unshift({
      id: `notif-${Date.now()}-${st.id}`,
      userId: st.id,
      title: 'Yangi topshiriq! 🔔',
      message: `"${newTest.title}" testi sizning sinfingiz uchun e'lon qilindi.`,
      type: 'test',
      link: `/tests/${newTest.id}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  });

  db.save();

  // Broadcast to students in real-time
  broadcastRealtime('new_test_assigned', {
    testId: newTest.id,
    title: newTest.title,
    grade: newTest.grade
  });

  res.json({ success: true, test: newTest });
});

app.get('/api/teacher/stats', (_req: Request, res: Response) => {
  const state = db.getState();
  const attempts = state.test_attempts;
  const students = state.users.filter(u => u.role === 'student');
  const classes = state.classes;

  const totalAttempts = attempts.length;
  const overallAvg = totalAttempts > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts)
    : 80;

  // Grade averages by class
  const classStats = classes.map(c => {
    const classAttempts = attempts.filter(a => {
      const student = students.find(s => s.id === a.userId);
      return student && c.studentIds.includes(student.id);
    });
    const avg = classAttempts.length > 0 
      ? Math.round(classAttempts.reduce((s, a) => s + a.percentage, 0) / classAttempts.length)
      : c.averageScore || 75;
    return {
      className: c.name,
      grade: c.grade,
      studentCount: c.studentCount || c.studentIds.length,
      averageScore: avg
    };
  });

  // Weak topics detection
  const difficultTopics = [
    { title: 'Kvadrat tenglamalar va diskriminant', grade: 8, mastery: 64, status: 'Qiyin' },
    { title: 'Doira va aylana yuzasi', grade: 6, mastery: 68, status: 'Qiyin' },
    { title: 'Algebraik kasrlarni soddalashtirish', grade: 8, mastery: 71, status: "O'rtacha" },
    { title: 'Proporsiya va foiz masalalari', grade: 6, mastery: 74, status: "O'rtacha" }
  ];

  res.json({
    success: true,
    stats: {
      totalStudents: students.length,
      totalClasses: classes.length,
      totalTestsConducted: totalAttempts,
      overallAvg,
      classStats,
      difficultTopics,
      recentSubmissions: attempts.slice(0, 15)
    }
  });
});

// ==================== DAILY REPORTS ====================

app.get('/api/reports/daily', (req: Request, res: Response) => {
  const { userId, date } = req.query;
  const state = db.getState();
  const targetDate = (date as string) || new Date().toISOString().split('T')[0];

  if (userId) {
    const report = state.daily_reports.find(r => r.userId === userId && r.date === targetDate);
    return res.json({
      success: true,
      report: report || {
        date: targetDate,
        userId,
        testsTaken: 0,
        questionsSolved: 0,
        correctCount: 0,
        wrongCount: 0,
        accuracyPercentage: 0,
        timeSpentMinutes: 0,
        topicsStudied: []
      }
    });
  }

  // Teacher aggregated daily report across all students
  const reportsToday = state.daily_reports.filter(r => r.date === targetDate);
  const totalTests = reportsToday.reduce((s, r) => s + r.testsTaken, 0);
  const totalQuestions = reportsToday.reduce((s, r) => s + r.questionsSolved, 0);
  const totalCorrect = reportsToday.reduce((s, r) => s + r.correctCount, 0);
  const totalWrong = reportsToday.reduce((s, r) => s + r.wrongCount, 0);
  const totalMinutes = reportsToday.reduce((s, r) => s + r.timeSpentMinutes, 0);
  const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  res.json({
    success: true,
    aggregated: {
      date: targetDate,
      activeStudents: reportsToday.length,
      totalTests,
      totalQuestions,
      totalCorrect,
      totalWrong,
      avgAccuracy,
      totalMinutes,
      studentBreakdown: reportsToday
    }
  });
});

// ==================== NOTIFICATIONS ====================

app.get('/api/notifications/:userId', (req: Request, res: Response) => {
  const state = db.getState();
  const notifs = state.notifications.filter(n => n.userId === req.params.userId);
  res.json({ success: true, notifications: notifs });
});

app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  const state = db.getState();
  const n = state.notifications.find(item => item.id === req.params.id);
  if (n) {
    n.read = true;
    db.save();
  }
  res.json({ success: true });
});

// ==================== KUNDALIK INTEGRATION MODULE ====================

app.get('/api/kundalik/status', (_req: Request, res: Response) => {
  const state = db.getState();
  res.json({ success: true, kundalik: state.kundalik });
});

app.post('/api/kundalik/sync', (req: Request, res: Response) => {
  const state = db.getState();
  const { classId } = req.body;

  // Simulate real-world safe sync with Kundalik Gradebook API
  const syncedStudents = state.users.filter(u => u.role === 'student').length;
  const recentAttempts = state.test_attempts.length;

  const nowIso = new Date().toISOString();
  state.kundalik.lastSyncTime = nowIso;
  state.kundalik.syncedStudentsCount = 100 + syncedStudents;
  state.kundalik.syncedGradesCount += recentAttempts;

  state.kundalik.recentLogs.unshift({
    timestamp: nowIso,
    action: classId ? `${classId} sinf baholari sinxronlashtirildi` : "To'liq jurnal va baholar sinxronlashtirildi",
    status: 'success',
    details: `${recentAttempts} ta test bahosi (5, 4, 3 tizimida) Kundalik.com elektron jurnaliga xavfsiz uzatildi.`
  });

  if (state.kundalik.recentLogs.length > 20) {
    state.kundalik.recentLogs = state.kundalik.recentLogs.slice(0, 20);
  }

  db.save();
  res.json({ success: true, message: "Kundalik tizimi bilan sinxronizatsiya muvaffaqiyatli yakunlandi!", kundalik: state.kundalik });
});

app.post('/api/kundalik/settings', (req: Request, res: Response) => {
  const { schoolId, schoolName, autoSync, apiKey } = req.body;
  const state = db.getState();

  if (schoolId) state.kundalik.schoolId = schoolId;
  if (schoolName) state.kundalik.schoolName = schoolName;
  if (typeof autoSync === 'boolean') state.kundalik.autoSync = autoSync;
  if (apiKey) {
    state.kundalik.apiKeyMasked = apiKey.slice(0, 8) + '••••••••' + apiKey.slice(-4);
  }

  db.save();
  res.json({ success: true, message: "Kundalik sozlamalari yangilandi!", kundalik: state.kundalik });
});

// ==================== ADMIN OVERVIEW ====================

app.get('/api/admin/overview', (_req: Request, res: Response) => {
  const state = db.getState();
  res.json({
    success: true,
    overview: {
      totalUsers: state.users.length,
      studentsCount: state.users.filter(u => u.role === 'student').length,
      teachersCount: state.users.filter(u => u.role === 'teacher').length,
      classesCount: state.classes.length,
      topicsCount: state.topics.length,
      testsCount: state.tests.length,
      attemptsCount: state.test_attempts.length,
      kundalikConnected: state.kundalik.connected,
      users: state.users.map(u => ({
        id: u.id,
        name: `${u.name} ${u.surname}`,
        login: u.login,
        role: u.role,
        grade: u.grade,
        points: u.points,
        streak: u.streak,
        createdAt: u.createdAt
      }))
    }
  });
});

// ==================== VITE & STATIC HANDLING ====================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Matematika Pro server running at http://localhost:${PORT}`);
  });
}

startServer();
