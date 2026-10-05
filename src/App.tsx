/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MathBackground } from './components/MathBackground.tsx';
import { Navbar } from './components/Navbar.tsx';
import { MobileNav } from './components/MobileNav.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { TestRunner } from './components/TestRunner.tsx';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard.tsx';
import { LessonsView } from './components/student/LessonsView.tsx';
import { TestsView } from './components/student/TestsView.tsx';
import { ExercisesView } from './components/student/ExercisesView.tsx';
import { StatsView } from './components/student/StatsView.tsx';
import { AchievementsView } from './components/student/AchievementsView.tsx';
import { DailyReportView } from './components/student/DailyReportView.tsx';
import { ProfileView } from './components/student/ProfileView.tsx';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard.tsx';
import { ClassManagement } from './components/teacher/ClassManagement.tsx';
import { TeacherTestBuilder } from './components/teacher/TeacherTestBuilder.tsx';
import { TeacherStats } from './components/teacher/TeacherStats.tsx';
import { TeacherDailyReport } from './components/teacher/TeacherDailyReport.tsx';
import { KundalikIntegrationView } from './components/teacher/KundalikIntegrationView.tsx';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

import { User, TestAttempt } from './types/index.ts';
import { Sparkles, Bell } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);

  // Live real-time notification toast
  const [realtimeToast, setRealtimeToast] = useState<{ title: string; message: string } | null>(null);

  // Fetch demo users and initialize default user
  useEffect(() => {
    fetch('/api/auth/demo-users')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users?.length > 0) {
          setDemoUsers(data.users);
          // Default to student 5-sinf (Nodir Karimov)
          const nodir = data.users.find((u: User) => u.login === 'nodir') || data.users[0];
          setUser(nodir);
        }
      })
      .catch(console.error);
  }, []);

  // Listen to Server-Sent Events for real-time live events
  useEffect(() => {
    const sse = new EventSource('/api/realtime/stream');
    
    sse.addEventListener('new_test_assigned', (e) => {
      try {
        const payload = JSON.parse(e.data);
        setRealtimeToast({
          title: "Yangi test topshirig'i! 🔔",
          message: `"${payload.title}" testi sizning sinfingiz uchun e'lon qilindi.`
        });
        setTimeout(() => setRealtimeToast(null), 6000);
      } catch (err) {
        console.error(err);
      }
    });

    sse.addEventListener('test_completed', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (user?.role === 'teacher' || user?.role === 'admin') {
          setRealtimeToast({
            title: "Yangi test natijasi 📊",
            message: `${payload.studentName} "${payload.testTitle}" testidan ${payload.percentage}% (${payload.gradeMark}) oldi.`
          });
          setTimeout(() => setRealtimeToast(null), 6000);
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      sse.close();
    };
  }, [user]);

  // Handle switching tabs and roles cleanly
  const handleSelectDemoUser = (selectedUser: User) => {
    setUser(selectedUser);
    if (selectedUser.role === 'teacher') {
      setActiveTab('teacher_dashboard');
    } else if (selectedUser.role === 'admin') {
      setActiveTab('admin_panel');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthModalOpen(true);
  };

  const handleUpdateUser = (updated: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  const handleNavigateTab = (tab: string, param?: any) => {
    if (tab === 'lessons' && param) {
      setSelectedTopicId(param);
    }
    setActiveTab(tab);
  };

  const handleStartTest = (testId: string) => {
    setActiveTestId(testId);
  };

  const handleTestCompleted = (result: TestAttempt) => {
    // Refresh user points and streak in state
    if (user) {
      setUser({
        ...user,
        points: (user.points || 0) + result.score + (result.percentage >= 90 ? 20 : 10),
        streak: (user.streak || 0) + 1
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-indigo-500 selection:text-white">
      {/* Background with floating mathematical formulas and geometric figures */}
      <MathBackground />

      {/* Top Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSelectDemoUser={handleSelectDemoUser}
        demoUsers={demoUsers}
      />

      {/* Real-time Toast Banner */}
      {realtimeToast && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 p-4 rounded-2xl glass-panel border border-indigo-500/40 shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{realtimeToast.title}</div>
            <div className="text-[11px] text-slate-300">{realtimeToast.message}</div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 z-10">
        {/* STUDENT VIEWS */}
        {user?.role === 'student' && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                user={user}
                onNavigateTab={handleNavigateTab}
                onStartTest={handleStartTest}
              />
            )}
            {activeTab === 'lessons' && (
              <LessonsView
                initialTopicId={selectedTopicId}
                userGrade={user.grade || 5}
                onStartTestByTopic={(topicId) => {
                  handleStartTest('test-5-diag');
                }}
              />
            )}
            {activeTab === 'tests' && (
              <TestsView
                userGrade={user.grade || 5}
                onStartTest={handleStartTest}
              />
            )}
            {activeTab === 'exercises' && (
              <ExercisesView />
            )}
            {activeTab === 'stats' && (
              <StatsView user={user} />
            )}
            {activeTab === 'achievements' && (
              <AchievementsView user={user} />
            )}
            {activeTab === 'daily_report' && (
              <DailyReportView user={user} />
            )}
            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

        {/* TEACHER VIEWS */}
        {user?.role === 'teacher' && (
          <>
            {activeTab === 'teacher_dashboard' && (
              <TeacherDashboard
                user={user}
                onNavigateTab={handleNavigateTab}
              />
            )}
            {activeTab === 'teacher_classes' && (
              <ClassManagement currentUser={user} />
            )}
            {activeTab === 'teacher_create_test' && (
              <TeacherTestBuilder
                onTestCreated={() => setActiveTab('teacher_dashboard')}
              />
            )}
            {activeTab === 'teacher_stats' && (
              <TeacherStats />
            )}
            {activeTab === 'teacher_daily' && (
              <TeacherDailyReport />
            )}
            {activeTab === 'kundalik' && (
              <KundalikIntegrationView />
            )}
            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

        {/* ADMIN VIEWS */}
        {user?.role === 'admin' && (
          <>
            {activeTab === 'admin_panel' && (
              <AdminDashboard />
            )}
            {activeTab === 'kundalik' && (
              <KundalikIntegrationView />
            )}
            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

        {/* When user is not logged in */}
        {!user && (
          <div className="py-20 text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-white">
              Matematika Pro Platformasiga Xush Kelibsiz!
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              5–8-sinf o'quvchilari va o'qituvchilari uchun interaktiv darslar va test tizimi.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30"
            >
              Kirish / Ro'yxatdan o'tish
            </button>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation: Bosh sahifa | Testlar | Statistika | Profil */}
      <MobileNav
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          if (loggedUser.role === 'teacher') {
            setActiveTab('teacher_dashboard');
          } else if (loggedUser.role === 'admin') {
            setActiveTab('admin_panel');
          } else {
            setActiveTab('dashboard');
          }
        }}
        demoUsers={demoUsers}
      />

      {/* Active Fullscreen Test Runner */}
      {activeTestId && user && (
        <TestRunner
          testId={activeTestId}
          user={user}
          onClose={() => setActiveTestId(null)}
          onTestCompleted={handleTestCompleted}
        />
      )}
    </div>
  );
}
