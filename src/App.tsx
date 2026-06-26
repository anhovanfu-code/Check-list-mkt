import React, { useState, useEffect } from 'react';
import { initialPersonnelData } from './data';
import { Personnel, Task } from './types';
import TeamOverview from './components/TeamOverview';
import TaskTracker from './components/TaskTracker';
import KPISimulator from './components/KPISimulator';
import ContentGenerator from './components/ContentGenerator';
import ReportCompiler from './components/ReportCompiler';
import TimelineSchedule from './components/TimelineSchedule';
import DossierExporter from './components/DossierExporter';
import Login from './components/Login';
import { 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Sparkles, 
  ClipboardList, 
  DollarSign, 
  Award, 
  HelpCircle,
  Video,
  FileText,
  AlertCircle,
  Clock,
  Lock,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'media_group_dashboard_data_v2';

export default function App() {
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [currentUser, setCurrentUser] = useState<Personnel | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('duy');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  // Initialize data from localStorage or default static dataset
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: Personnel[] = JSON.parse(savedData);
        // Merge parsed data with initialPersonnelData to ensure all 9 members are present
        // and have up-to-date static properties (email, phone, code, role, name, etc.)
        const merged = initialPersonnelData.map((initialPerson) => {
          const savedPerson = parsed.find(p => p.id === initialPerson.id);
          if (savedPerson) {
            // Keep task status and KPI values if they match
            const mergedTasks = initialPerson.tasks.map(t => {
              const savedTask = savedPerson.tasks.find(st => st.id === t.id);
              return savedTask ? { ...t, completed: savedTask.completed } : t;
            });
            // Keep custom tasks
            const customTasks = savedPerson.tasks.filter(st => !initialPerson.tasks.some(it => it.id === st.id));
            const mergedKPIs = initialPerson.kpis.map(k => {
              const savedKPI = savedPerson.kpis.find(sk => sk.id === k.id);
              return savedKPI ? { ...k, currentValue: savedKPI.currentValue } : k;
            });
            return {
              ...initialPerson,
              tasks: [...mergedTasks, ...customTasks],
              kpis: mergedKPIs
            };
          }
          return initialPerson;
        });

        // Also add any saved members that aren't in initial
        parsed.forEach(p => {
          if (!merged.some(m => m.id === p.id)) {
            merged.push(p);
          }
        });

        setPersonnelList(merged);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));

        // Restore login session
        const savedUserId = localStorage.getItem('media_group_logged_in_user_id');
        if (savedUserId) {
          const found = merged.find(p => p.id === savedUserId);
          if (found) {
            setCurrentUser(found);
            if (found.id !== 'an') {
              setSelectedMemberId(found.id);
            }
          }
        }
      } catch (e) {
        console.error('Error parsing saved local storage data:', e);
        setPersonnelList(initialPersonnelData);
      }
    } else {
      setPersonnelList(initialPersonnelData);
      // Restore login session
      const savedUserId = localStorage.getItem('media_group_logged_in_user_id');
      if (savedUserId) {
        const found = initialPersonnelData.find(p => p.id === savedUserId);
        if (found) {
          setCurrentUser(found);
          if (found.id !== 'an') {
            setSelectedMemberId(found.id);
          }
        }
      }
    }

    // Verify if Gemini API key is available on the backend
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setHasApiKey(data.hasApiKey);
      })
      .catch(() => {
        setHasApiKey(true); // default to true to let server-side handle errors
      });
  }, []);

  // Sync state to localStorage on modification
  const saveToLocalStorage = (updatedList: Personnel[]) => {
    setPersonnelList(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Toggle a task's completed status
  const handleToggleTask = (memberId: string, taskId: string) => {
    const updated = personnelList.map((person) => {
      if (person.id === memberId) {
        return {
          ...person,
          tasks: person.tasks.map((task) => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return person;
    });
    saveToLocalStorage(updated);
  };

  // Add a new task for a member
  const handleAddTask = (
    memberId: string, 
    title: string, 
    description: string, 
    type: 'daily' | 'support' | 'adhoc', 
    frequency: 'once' | 'daily' | 'weekly' | 'monthly',
    category?: 'Daily' | 'Weekly' | 'Monthly'
  ) => {
    const updated = personnelList.map((person) => {
      if (person.id === memberId) {
        const inferredCategory: 'Daily' | 'Weekly' | 'Monthly' = category || 
          (frequency === 'daily' ? 'Daily' : 
           frequency === 'weekly' ? 'Weekly' : 
           frequency === 'monthly' ? 'Monthly' : 'Daily');
        const newTask: Task = {
          id: `${memberId}_task_${Date.now()}`,
          title,
          description,
          type,
          frequency,
          category: inferredCategory,
          completed: false
        };
        return {
          ...person,
          tasks: [...person.tasks, newTask]
        };
      }
      return person;
    });
    saveToLocalStorage(updated);
  };

  // Delete a task for a member
  const handleDeleteTask = (memberId: string, taskId: string) => {
    const updated = personnelList.map((person) => {
      if (person.id === memberId) {
        return {
          ...person,
          tasks: person.tasks.filter((task) => task.id !== taskId)
        };
      }
      return person;
    });
    saveToLocalStorage(updated);
  };

  // Update a KPI's actual current value
  const handleUpdateKPIValue = (memberId: string, kpiId: string, newValue: number) => {
    const updated = personnelList.map((person) => {
      if (person.id === memberId) {
        return {
          ...person,
          kpis: person.kpis.map((kpi) => 
            kpi.id === kpiId ? { ...kpi, currentValue: newValue } : kpi
          )
        };
      }
      return person;
    });
    saveToLocalStorage(updated);
  };

  // Reset all daily task completions for a new day
  const handleResetDailyTasks = () => {
    if (window.confirm(`Bạn có chắc chắn muốn reset toàn bộ tiến độ nhiệm vụ ngày của cả ${personnelList.length} nhân sự?`)) {
      const updated = personnelList.map((person) => ({
        ...person,
        tasks: person.tasks.map((task) => ({ ...task, completed: false }))
      }));
      saveToLocalStorage(updated);
    }
  };

  // Find currently selected member object
  const selectedMember = personnelList.find(p => p.id === selectedMemberId) || personnelList[0];

  // CALCULATE AGGREGATE STATS FOR EXECUTIVE PANEL
  
  // 1. Total team size
  const totalStaff = personnelList.length;

  // 2. Cumulative daily tasks completion rate
  const allDailyTasks = personnelList.flatMap(p => p.tasks);
  const completedDailyTasks = allDailyTasks.filter(t => t.completed).length;
  const totalDailyTasksCount = allDailyTasks.length;
  const teamDailyProgress = totalDailyTasksCount > 0 
    ? Math.round((completedDailyTasks / totalDailyTasksCount) * 100) 
    : 0;

  // 3. Average KPI completion rate across the whole team
  const calculateKPICompletion = (kpi: any) => {
    if (kpi.targetValue === 0) return 0;
    if (kpi.name.toLowerCase().includes('chi phí') || kpi.name.toLowerCase().includes('thời gian')) {
      return Math.min(Math.max((kpi.targetValue / kpi.currentValue) * 100, 0), 150);
    }
    return Math.min(Math.max((kpi.currentValue / kpi.targetValue) * 100, 0), 150);
  };

  const allKPIs = personnelList.flatMap(p => p.kpis);
  const averageKPIIndex = allKPIs.length > 0
    ? Math.round(allKPIs.reduce((sum, k) => sum + calculateKPICompletion(k), 0) / allKPIs.length)
    : 0;

  // 4. Cumulative simulated total salary budget
  const totalSalaryBudget = personnelList.reduce((sum, person) => {
    const baseAvg = (person.baseSalaryMin + person.baseSalaryMax) / 2;
    const maxBonus = person.estimatedTotalMax - person.baseSalaryMax;
    
    // Weighted KPI achievement
    const kpis = person.kpis;
    const totalW = kpis.reduce((s, k) => s + k.weight, 0);
    const weightedIdx = totalW > 0
      ? kpis.reduce((s, k) => s + (calculateKPICompletion(k) * (k.weight / totalW)), 0)
      : 0;

    let multiplier = 0;
    if (weightedIdx >= 100) {
      multiplier = 1 + (weightedIdx - 100) * 0.02;
    } else if (weightedIdx >= 80) {
      multiplier = 0.4 + (weightedIdx - 80) * 0.03;
    } else {
      multiplier = 0;
    }

    const bonus = maxBonus > 0 ? maxBonus * multiplier : 0;
    return sum + baseAvg + bonus;
  }, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (personnelList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Login 
        personnelList={personnelList} 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('media_group_logged_in_user_id', user.id);
          if (user.id !== 'an') {
            setSelectedMemberId(user.id);
          } else {
            setSelectedMemberId('an');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500/20 selection:text-blue-800 pb-12">
      {/* Upper Brand Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-[1700px] 2xl:max-w-[1850px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Video className="h-5.5 w-5.5 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-blue-600 uppercase flex items-center gap-2">
                Hệ thống Quản lý Nhóm Media
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Ban chỉ huy, điều phối & Đánh giá hiệu suất {personnelList.length} nhân sự chính (Fugalo & Anh Long)
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* User Session Info Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-5.5 h-5.5 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">{currentUser.name}</span>
                <span className="text-[9px] text-slate-500 font-medium block leading-none">{currentUser.id === 'an' ? 'TP.MKT & Tech Lead' : 'Nhân sự Media'}</span>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Đăng xuất"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>

            {currentUser.id === 'an' && (
              <button
                onClick={handleResetDailyTasks}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-800 transition cursor-pointer"
              >
                Reset nhiệm vụ ngày
              </button>
            )}

            {!hasApiKey && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>Chưa cấu hình API Key</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] 2xl:max-w-[1850px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 space-y-6">
        {/* Executive High-Level Analytics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentUser.id === 'an' ? (
            <>
              {/* Card 1: Team Size */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng nhân sự</span>
                  <div className="text-2xl font-mono font-bold text-slate-800">{totalStaff} nhân sự</div>
                  <p className="text-[10px] text-slate-500">
                    {personnelList.filter(p => p.id === 'an').length} Manager + {personnelList.filter(p => p.id === 'duy').length} Leader + {personnelList.length - personnelList.filter(p => p.id === 'an').length - personnelList.filter(p => p.id === 'duy').length} Chuyên viên
                  </p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              {/* Card 2: Combined Team Progress */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiến độ hôm nay</span>
                  <div className="text-2xl font-mono font-bold text-slate-800">{teamDailyProgress}%</div>
                  <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5 border border-slate-200/60">
                    <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${teamDailyProgress}%` }} />
                  </div>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <CheckSquare className="h-5 w-5 text-sky-500" />
                </div>
              </div>

              {/* Card 3: Team KPI Index */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm KPI Trung bình</span>
                  <div className="text-2xl font-mono font-bold text-slate-800">{averageKPIIndex}%</div>
                  <p className="text-[10px] text-blue-600 font-medium">Đạt chỉ tiêu chung tốt</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                </div>
              </div>

              {/* Card 4: Salary Fund Simulation */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mô phỏng quỹ lương</span>
                  <div className="text-xl font-mono font-bold text-blue-600">{formatCurrency(totalSalaryBudget).replace(/\s?₫/, 'M').replace(',000,000', ' triệu')}</div>
                  <p className="text-[10px] text-slate-500">Gồm lương cơ bản & KPI</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Scoped Card 1: Personal Role */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vai trò của bạn</span>
                  <div className="text-lg font-bold text-slate-800 line-clamp-1">{currentUser.name}</div>
                  <p className="text-[10px] text-blue-600 font-medium leading-tight line-clamp-1">
                    {currentUser.role}
                  </p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              {/* Scoped Card 2: Personal Progress */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nhiệm vụ hôm nay</span>
                  <div className="text-2xl font-mono font-bold text-slate-800">
                    {(() => {
                      const userRec = personnelList.find(p => p.id === currentUser.id) || currentUser;
                      const done = userRec.tasks.filter(t => t.completed).length;
                      const pct = userRec.tasks.length > 0 ? Math.round((done / userRec.tasks.length) * 100) : 0;
                      return `${pct}%`;
                    })()}
                  </div>
                  <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5 border border-slate-200/60">
                    <div 
                      className="bg-blue-600 h-1 rounded-full" 
                      style={{ 
                        width: `${(() => {
                          const userRec = personnelList.find(p => p.id === currentUser.id) || currentUser;
                          const done = userRec.tasks.filter(t => t.completed).length;
                          return userRec.tasks.length > 0 ? Math.round((done / userRec.tasks.length) * 100) : 0;
                        })()}%` 
                      }} 
                    />
                  </div>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <CheckSquare className="h-5 w-5 text-sky-500" />
                </div>
              </div>

              {/* Scoped Card 3: Personal KPI Completion */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm KPI cá nhân</span>
                  <div className="text-2xl font-mono font-bold text-slate-800">
                    {(() => {
                      const userRec = personnelList.find(p => p.id === currentUser.id) || currentUser;
                      return userRec.kpis.length > 0
                        ? `${Math.round(userRec.kpis.reduce((sum, k) => sum + calculateKPICompletion(k), 0) / userRec.kpis.length)}%`
                        : '0%';
                    })()}
                  </div>
                  <p className="text-[10px] text-blue-600 font-medium">Bảo mật & riêng tư</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                </div>
              </div>

              {/* Scoped Card 4: Personal Proposed Salary */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mô phỏng thu nhập</span>
                  <div className="text-xl font-mono font-bold text-blue-600">
                    {(() => {
                      const userRec = personnelList.find(p => p.id === currentUser.id) || currentUser;
                      const baseAvg = (userRec.baseSalaryMin + userRec.baseSalaryMax) / 2;
                      const maxBonus = userRec.estimatedTotalMax - userRec.baseSalaryMax;
                      const totalW = userRec.kpis.reduce((s, k) => s + k.weight, 0);
                      const weightedIdx = totalW > 0
                        ? userRec.kpis.reduce((s, k) => s + (calculateKPICompletion(k) * (k.weight / totalW)), 0)
                        : 0;

                      let multiplier = 0;
                      if (weightedIdx >= 100) {
                        multiplier = 1 + (weightedIdx - 100) * 0.02;
                      } else if (weightedIdx >= 80) {
                        multiplier = 0.4 + (weightedIdx - 80) * 0.03;
                      } else {
                        multiplier = 0;
                      }

                      const bonus = maxBonus > 0 ? maxBonus * multiplier : 0;
                      return formatCurrency(baseAvg + bonus).replace(/\s?₫/, 'M').replace(',000,000', ' triệu');
                    })()}
                  </div>
                  <p className="text-[10px] text-slate-500">Chỉ hiển thị với bạn (Đã bảo mật)</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Primary Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            Hồ sơ Nhân sự ({totalStaff})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            Nhiệm vụ & Quy trình
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kpis'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="h-4 w-4" />
            SMART KPI & Lương
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Sáng tạo ý tưởng AI
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="h-4 w-4" />
            Lịch trình & Khung giờ
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Tổng hợp Báo cáo ngày
          </button>
        </div>

        {/* Selected Member dossier banner (sticky for coordination tasks) */}
        {activeTab !== 'reports' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <img src={selectedMember.avatar} alt={selectedMember.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">{selectedMember.tag}</span>
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  Đang thao tác: {selectedMember.name} 
                  <span className="text-xs text-slate-500 font-normal">({selectedMember.role})</span>
                </h4>
              </div>
            </div>
            
            {/* Quick picker dropdown and Exporter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {currentUser.id === 'an' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Đổi nhân sự:</span>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
                  >
                    {personnelList.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.role.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs">
                  🔒 Chỉ truy cập dữ liệu cá nhân
                </div>
              )}
              <DossierExporter member={selectedMember} />
            </div>
          </div>
        )}

        {/* TAB RENDERING ROUTER */}
        <div className="transition-all duration-300">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Sơ đồ cơ cấu & Nhiệm vụ nhóm Media ({currentUser.id === 'an' ? personnelList.length : 1} nhân sự)
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-4xl">
                  {currentUser.id === 'an' 
                    ? 'Hãy nhấp vào bất kỳ thẻ nhân sự nào để xem chi tiết, tích chọn tiến độ hàng ngày, mô phỏng bảng lương, hoặc kích hoạt trợ lý AI tạo kịch bản, ý tưởng seeding chuyên biệt.'
                    : 'Xem hồ sơ nhiệm vụ, thang lương cơ bản và bảng tính chỉ số KPIs bảo mật của riêng bạn.'
                  }
                </p>
              </div>
              <TeamOverview 
                personnelList={currentUser.id === 'an' ? personnelList : personnelList.filter(p => p.id === currentUser.id)} 
                onSelectMember={(id) => { setSelectedMemberId(id); setActiveTab('tasks'); }} 
                selectedMemberId={selectedMemberId}
              />
            </div>
          )}

          {activeTab === 'tasks' && (
            <TaskTracker 
              selectedMember={selectedMember} 
              onToggleTask={handleToggleTask} 
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'kpis' && (
            <KPISimulator 
              selectedMember={selectedMember} 
              onUpdateKPIValue={handleUpdateKPIValue} 
            />
          )}

          {activeTab === 'ai' && (
            <ContentGenerator 
              personnelList={personnelList}
              selectedMember={selectedMember}
            />
          )}

          {activeTab === 'schedule' && (
            <TimelineSchedule 
              personnelList={currentUser.id === 'an' ? personnelList : personnelList.filter(p => p.id === currentUser.id)}
              selectedMemberId={selectedMemberId}
              onSelectMember={(id) => currentUser.id === 'an' ? setSelectedMemberId(id) : null}
            />
          )}

          {activeTab === 'reports' && (
            <ReportCompiler 
              personnelList={currentUser.id === 'an' ? personnelList : personnelList.filter(p => p.id === currentUser.id)} 
            />
          )}
        </div>
      </main>

      {/* Elegant Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Xác Nhận Đăng Xuất</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bạn có chắc chắn muốn đăng xuất khỏi hệ thống bảo mật? Lần đăng nhập tiếp theo cần đăng nhập bằng tài khoản Google (Gmail) của bạn.
                </p>
              </div>
              <div className="pt-2 flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('media_group_logged_in_user_id');
                    setCurrentUser(null);
                    setShowLogoutConfirm(false);
                  }}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-500/10 transition cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
