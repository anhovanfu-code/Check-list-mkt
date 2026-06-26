import React, { useState } from 'react';
import { Personnel, Task } from '../types';
import { 
  CheckSquare, 
  ArrowRight, 
  Video, 
  Camera, 
  Clock, 
  Check, 
  Eye, 
  HelpCircle, 
  Plus, 
  Trash2, 
  SlidersHorizontal, 
  Sparkles, 
  CalendarDays, 
  RefreshCw, 
  AlertCircle,
  ShieldAlert,
  Lock,
  Shield,
  Key
} from 'lucide-react';

interface TaskTrackerProps {
  selectedMember: Personnel;
  onToggleTask: (memberId: string, taskId: string) => void;
  onAddTask: (
    memberId: string, 
    title: string, 
    description: string, 
    type: 'daily' | 'support' | 'adhoc', 
    frequency: 'once' | 'daily' | 'weekly' | 'monthly',
    category?: 'Daily' | 'Weekly' | 'Monthly'
  ) => void;
  onDeleteTask: (memberId: string, taskId: string) => void;
}

const frequencyLabels = {
  once: 'Không lặp lại (Một lần)',
  daily: 'Lặp lại Hằng ngày (Daily)',
  weekly: 'Lặp lại Hằng tuần (Weekly)',
  monthly: 'Lặp lại Hằng tháng (Monthly)'
};

const frequencyBadges = {
  once: { label: 'Một lần', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  daily: { label: 'Hằng ngày', color: 'bg-blue-50 text-blue-700 border-blue-150' },
  weekly: { label: 'Hằng tuần', color: 'bg-purple-50 text-purple-700 border-purple-150' },
  monthly: { label: 'Hằng tháng', color: 'bg-amber-50 text-amber-700 border-amber-150' }
};

const categoryBadges = {
  Daily: { label: 'Daily', color: 'bg-emerald-50 text-emerald-700 border-emerald-150' },
  Weekly: { label: 'Weekly', color: 'bg-indigo-50 text-indigo-700 border-indigo-150' },
  Monthly: { label: 'Monthly', color: 'bg-rose-50 text-rose-700 border-rose-150' }
};

const typeLabels = {
  daily: 'Định kỳ cốt lõi',
  support: 'Hỗ trợ & Phối hợp',
  adhoc: 'Phát sinh (Ad-hoc)'
};

export default function TaskTracker({ 
  selectedMember, 
  onToggleTask, 
  onAddTask, 
  onDeleteTask 
}: TaskTrackerProps) {
  // Filters state
  const [freqFilter, setFreqFilter] = useState<'all' | 'once' | 'daily' | 'weekly' | 'monthly'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'daily' | 'support' | 'adhoc'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Daily' | 'Weekly' | 'Monthly'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'daily' | 'support' | 'adhoc'>('daily');
  const [newFreq, setNewFreq] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [newCategory, setNewCategory] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [formError, setFormError] = useState('');

  // Helper helper to resolve task frequency (with backward compatibility)
  const getTaskFrequency = (task: Task): 'once' | 'daily' | 'weekly' | 'monthly' => {
    if (task.frequency) return task.frequency;
    if (task.type === 'daily') return 'daily';
    if (task.type === 'support') return 'weekly';
    return 'once';
  };

  // Helper to resolve task category (with backward compatibility)
  const getTaskCategory = (task: Task): 'Daily' | 'Weekly' | 'Monthly' => {
    if (task.category) return task.category;
    const freq = getTaskFrequency(task);
    if (freq === 'daily') return 'Daily';
    if (freq === 'weekly') return 'Weekly';
    if (freq === 'monthly') return 'Monthly';
    return 'Daily';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Vui lòng nhập tên công việc!');
      return;
    }
    
    onAddTask(
      selectedMember.id,
      newTitle.trim(),
      newDesc.trim() || 'Không có mô tả chi tiết.',
      newType,
      newFreq,
      newCategory
    );

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewType('daily');
    setNewFreq('daily');
    setNewCategory('Daily');
    setFormError('');
    setIsFormOpen(false);
  };

  // Filter tasks
  const filteredTasks = selectedMember.tasks.filter(task => {
    const taskFreq = getTaskFrequency(task);
    const taskCat = getTaskCategory(task);
    const matchesFreq = freqFilter === 'all' || taskFreq === freqFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || taskCat === categoryFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFreq && matchesType && matchesCategory && matchesSearch;
  });

  // Pipeline configuration showing the operational flow of media production
  const pipelineSteps = [
    {
      id: 'step1',
      title: 'Ý tưởng & Kịch bản',
      desc: 'Lên outline, kịch bản chi tiết.',
      pic: 'Tân, Trường, Kiếm',
      tag: 'Content & Planning'
    },
    {
      id: 'step2',
      title: 'Quay chụp sản phẩm',
      desc: 'Quay beauty, sản phẩm kiot, vlog.',
      pic: 'Long (Cameraman), Tân, Trường',
      tag: 'Production'
    },
    {
      id: 'step3',
      title: 'Hậu kỳ & Chỉnh sửa',
      desc: 'Edit video, tạo poster, xuất file SRT.',
      pic: 'Long, Tân, Trường',
      tag: 'Post-Production'
    },
    {
      id: 'step4',
      title: 'Kiểm duyệt chất lượng QC',
      desc: 'Kiểm tra chuẩn visual, âm thanh, kịch bản.',
      pic: 'Kiếm (QC Coordinator)',
      tag: 'Quality Control'
    },
    {
      id: 'step5',
      title: 'Phê duyệt & Đăng tải',
      desc: 'Rà soát rủi ro kịch bản, chính tả, thương hiệu.',
      pic: 'Duy (Leader), Châu (Social Ads), An (Manager)',
      tag: 'Publishing'
    },
    {
      id: 'step6',
      title: 'Livestream, Seeding & Ads',
      desc: 'Live bán hàng, ghim comment, chạy buff, tối ưu ads.',
      pic: 'P.Anh, Nhân, Châu',
      tag: 'Distribution'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="task-tracker-workflow">
      
      {/* Left Columns - Interactive Checklist with Repetition Rules (8 columns) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Advanced Task Control & Filters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                Bảng phân bổ & Phân loại việc: {selectedMember.name}
              </h3>
              <p className="text-xs text-slate-500">
                Linh hoạt lọc và quản lý công việc không lặp lại (một lần) hoặc lặp lại định kỳ (ngày, tuần, tháng).
              </p>
            </div>
            
            {/* Toggle form button */}
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-blue-500/10 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Giao việc mới
            </button>
          </div>

          {/* Task Addition Form Form */}
          {isFormOpen && (
            <form onSubmit={handleFormSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-250 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-blue-600" />
                  Khai báo đầu việc & Tần suất lặp lại
                </h4>
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Đóng
                </button>
              </div>

              {formError && (
                <div className="flex items-center gap-1.5 p-2 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Tên công việc</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ví dụ: Lập kịch bản Vlog tuần sau, Kiểm tra máy quay..."
                    className="w-full p-2.5 bg-white border border-slate-250 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Phân loại tính chất</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-250 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="daily">Định kỳ chính (Core)</option>
                    <option value="support">Hỗ trợ & Phối hợp (Support)</option>
                    <option value="adhoc">Phát sinh, Đột xuất (Ad-hoc)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Tần suất lặp lại (Chu kỳ)</label>
                  <select
                    value={newFreq}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setNewFreq(val);
                      if (val === 'daily') setNewCategory('Daily');
                      else if (val === 'weekly') setNewCategory('Weekly');
                      else if (val === 'monthly') setNewCategory('Monthly');
                    }}
                    className="w-full p-2.5 bg-white border border-slate-250 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="once">Không lặp lại (Làm một lần rồi thôi / Việc Ad-hoc)</option>
                    <option value="daily">Lặp lại Hằng ngày (Daily)</option>
                    <option value="weekly">Lặp lại Hằng tuần (Weekly)</option>
                    <option value="monthly">Lặp lại Hằng tháng (Monthly)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Phân nhóm công việc (Category)</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-250 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Daily">Daily (Công việc Hằng ngày)</option>
                    <option value="Weekly">Weekly (Công việc Hằng tuần)</option>
                    <option value="Monthly">Monthly (Công việc Hằng tháng)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-bold">Mô tả ngắn</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Ghi chú nhanh mục tiêu, chỉ dẫn..."
                    className="w-full p-2.5 bg-white border border-slate-250 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 bg-white text-xs font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Xác nhận giao việc
                </button>
              </div>
            </form>
          )}

          {/* Filter Inputs Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            {/* Search Input */}
            <div className="md:col-span-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm nhanh việc..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Phân nhóm:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 text-xs rounded-md text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-bold"
              >
                <option value="all">📂 Tất cả phân nhóm</option>
                <option value="Daily">🟢 Daily (Hằng ngày)</option>
                <option value="Weekly">🔵 Weekly (Hằng tuần)</option>
                <option value="Monthly">🔴 Monthly (Hằng tháng)</option>
              </select>
            </div>

            {/* Freq Filter */}
            <div className="md:col-span-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Tần suất:</span>
              <select
                value={freqFilter}
                onChange={(e) => setFreqFilter(e.target.value as any)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 text-xs rounded-md text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-bold"
              >
                <option value="all">🔄 Tất cả tần suất</option>
                <option value="once">📍 Làm 1 lần (Một lần)</option>
                <option value="daily">📅 Hằng ngày (Daily)</option>
                <option value="weekly">📅 Hằng tuần (Weekly)</option>
                <option value="monthly">📅 Hằng tháng (Monthly)</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-3 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Tính chất:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 text-xs rounded-md text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-bold"
              >
                <option value="all">🛠️ Tất cả tính chất</option>
                <option value="daily">🎯 Định kỳ cốt lõi</option>
                <option value="support">🤝 Hỗ trợ & Phối hợp</option>
                <option value="adhoc">⚡ Phát sinh đột xuất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List Display Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <CalendarDays className="h-4.5 w-4.5 text-blue-600" />
              Danh sách đầu việc đang theo dõi ({filteredTasks.length} việc)
            </h3>
            
            {/* Simple stats bar */}
            <div className="text-[11px] font-bold text-slate-400">
              Tiến độ: <span className="text-blue-600 font-mono">{filteredTasks.filter(t => t.completed).length}/{filteredTasks.length} Đã xong</span>
            </div>
          </div>

          {/* Quick Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              📂 Tất cả ({selectedMember.tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('Daily')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'Daily'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${categoryFilter === 'Daily' ? 'bg-white' : 'bg-emerald-500'}`} />
              Daily ({selectedMember.tasks.filter(t => getTaskCategory(t) === 'Daily').length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('Weekly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'Weekly'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-indigo-700 border-slate-200 hover:bg-indigo-50'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${categoryFilter === 'Weekly' ? 'bg-white' : 'bg-indigo-500'}`} />
              Weekly ({selectedMember.tasks.filter(t => getTaskCategory(t) === 'Weekly').length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('Monthly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'Monthly'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-rose-700 border-slate-200 hover:bg-rose-50'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${categoryFilter === 'Monthly' ? 'bg-white' : 'bg-rose-500'}`} />
              Monthly ({selectedMember.tasks.filter(t => getTaskCategory(t) === 'Monthly').length})
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
              <p className="text-xs text-slate-400 font-medium">Không tìm thấy công việc nào thỏa mãn tiêu chí lọc.</p>
              <button 
                onClick={() => { setFreqFilter('all'); setTypeFilter('all'); setCategoryFilter('all'); setSearchTerm(''); }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const taskFreq = getTaskFrequency(task);
                const taskCat = getTaskCategory(task);
                const badge = frequencyBadges[taskFreq];
                const catBadge = categoryBadges[taskCat];
                const isCustom = task.id.includes('_task_');

                return (
                  <div
                    key={task.id}
                    className={`group relative flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                      task.completed
                        ? 'bg-blue-50/20 border-blue-150/60 text-slate-500'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs text-slate-800'
                    }`}
                  >
                    {/* Left: Checkbox and text info */}
                    <div 
                      onClick={() => onToggleTask(selectedMember.id, task.id)}
                      className="flex items-start gap-3 flex-1 cursor-pointer"
                    >
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                        task.completed
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}>
                        {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                          </span>
                          
                          {/* Category Badge */}
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold border ${catBadge.color}`}>
                            {catBadge.label}
                          </span>

                          {/* Frequency Badge */}
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold border ${badge.color}`}>
                            {badge.label}
                          </span>

                          {/* Type Badge */}
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            {typeLabels[task.type] || task.type}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${task.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                          {task.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Delete button (only for user custom tasks to avoid deleting core system tasks easily, or we can allow it for all) */}
                    {isCustom && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn muốn xóa nhiệm vụ "${task.title}"?`)) {
                            onDeleteTask(selectedMember.id, task.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer self-center"
                        title="Xóa công việc này"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informative Help Guide for different Task Periods */}
        <div className="bg-blue-50/50 border border-blue-150 p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            Phương án phối hợp Quản lý Đa chu kỳ hiệu quả
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-1.5">
              <p>📌 <strong>Đầu việc Không lặp lại (Một lần):</strong></p>
              <p className="text-slate-500">
                Là việc phát sinh đột xuất hoặc vụ việc dự án (ví dụ: <em>"Bảo trì đột xuất máy quay"</em>, <em>"Setup studio mới"</em>). Làm xong tích hoàn tất là lưu lịch sử và không reset lại vào ngày mới.
              </p>
            </div>
            <div className="space-y-1.5">
              <p>🔄 <strong>Định kỳ Hàng ngày, Tuần, Tháng:</strong></p>
              <p className="text-slate-500">
                Công việc định kỳ chu kỳ (ví dụ: <em>"Quay 2 Vlog"</em>, <em>"Báo cáo tuần"</em>, <em>"Đối soát lương tháng"</em>). Sẽ tự động nhắc nhở và được theo dõi theo chu trình lặp để đánh giá mức độ duy trì đều đặn của nhân sự.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Workflow Pipeline & Coordination (4 columns) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Luồng phối hợp sản xuất Media
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Quy trình khép kín từ khâu kịch bản đến phát hành</p>
          </div>

          <div className="relative border-l border-slate-150 pl-4 ml-2 space-y-6 py-2">
            {pipelineSteps.map((step, idx) => {
              // Highlight steps that involve the currently selected personnel
              const isParticipant = step.pic.toLowerCase().includes(selectedMember.name.toLowerCase());
              
              return (
                <div key={step.id} className="relative">
                  {/* Pipeline node indicator */}
                  <span className={`absolute -left-[25px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-bold ${
                    isParticipant 
                      ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/10' 
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>

                  <div className={`p-3 rounded-xl border transition-colors ${
                    isParticipant 
                      ? 'bg-blue-50/50 border-blue-200/60' 
                      : 'bg-slate-50 border border-slate-100'
                  }`}>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-slate-800">{step.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border ${
                        isParticipant 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-slate-200/60 text-slate-500 border-transparent'
                      }`}>
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
                      <span className="font-medium text-slate-400">Phụ trách:</span>
                      <span className={isParticipant ? 'text-blue-600 font-bold' : 'text-slate-500'}>{step.pic}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Digital Asset Security & Account Protection Widget */}
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                An toàn tài sản số
              </h3>
              <p className="text-[10px] text-slate-400">Chính sách Vận hành & Phòng chống Hack/Khóa</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Rule 1 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-bold text-[11px]">
                <Lock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                1. Bảo mật tối đa (2FA & Backup)
              </div>
              <p className="text-slate-400 pl-5 leading-relaxed text-[10.5px]">
                Mọi tài khoản Admin (BM, Page, TikTok, KiotViet) bắt buộc bật <strong>xác thực 2 lớp (2FA)</strong> bằng Authenticator App. Mã khẩn cấp (Backup codes) lưu trữ ngoại tuyến bảo mật, tuyệt đối không dùng xác thực SMS đơn thuần.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-bold text-[11px]">
                <Key className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                2. Phân quyền chuẩn ISO (Không chia sẻ Admin)
              </div>
              <p className="text-slate-400 pl-5 leading-relaxed text-[10.5px]">
                Nhân viên Content chỉ được cấp quyền Biên tập viên (Editor). Quyền Quản trị viên (Admin) tối cao do <strong>TP.MKT & Tech Lead (Anh An)</strong> giữ qua Business Manager để bảo vệ quyền sở hữu tuyệt đối.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-bold text-[11px]">
                <RefreshCw className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                3. Chống Checkpoint Seeding (Proxy Sạch)
              </div>
              <p className="text-slate-400 pl-5 leading-relaxed text-[10.5px]">
                Đội ngũ chạy tool MaxCare seeding (như Phương Anh, Nhân) bắt buộc sử dụng <strong>Proxy tĩnh IP sạch</strong> riêng cho từng tài khoản clone. Khoảng cách thời gian giãn cách tự nhiên để tránh bị AI quét khóa hàng loạt.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-bold text-[11px]">
                <Shield className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                4. Kiểm duyệt từ khóa & Bản quyền
              </div>
              <p className="text-slate-400 pl-5 leading-relaxed text-[10.5px]">
                Tránh các từ ngữ vi phạm chính sách hoặc hứa hẹn quá mức khi quảng cáo. Âm nhạc trong video bắt buộc lấy từ kho thương mại hoặc được cấp phép để tránh bị dính "gậy" bản quyền từ nền tảng.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
            💡 <strong>Sự cố xảy ra?</strong> Báo ngay cho <strong>Tech Lead An</strong> và <strong>Chị Châu</strong> để phối hợp gửi Kháng nghị (Appeal) chính thức với nền tảng, tránh bị vô hiệu hóa vĩnh viễn.
          </div>
        </div>
      </div>
    </div>
  );
}
