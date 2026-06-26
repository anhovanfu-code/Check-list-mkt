import React, { useState } from 'react';
import { Personnel } from '../types';
import { Users, DollarSign, Award, CheckCircle, Flame } from 'lucide-react';
import DossierExporter from './DossierExporter';

interface TeamOverviewProps {
  personnelList: Personnel[];
  onSelectMember: (id: string) => void;
  selectedMemberId: string;
}

export default function TeamOverview({ personnelList, onSelectMember, selectedMemberId }: TeamOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const tags = ['All', 'Quản lý Marketing', 'Media & Quảng cáo', 'Content - Đồ cổ', 'Content - Hàng hiệu', 'Live & Seeding', 'Điều phối Media', 'Cameraman & Editor', 'Trưởng nhóm Media', 'Seeding & Ads kiêm IT'];

  const filteredList = personnelList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = filterTag === 'All' || p.tag === filterTag;
    return matchesSearch && matchesTag;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Users className="h-5 w-5 text-slate-400" />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm"
            placeholder="Tìm kiếm nhân sự theo tên, vai trò hoặc mã..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                filterTag === tag
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tag === 'All' ? 'Tất cả nhóm' : tag.replace('Content - ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredList.map((person) => {
          const isSelected = person.id === selectedMemberId;
          const completedTasksCount = person.tasks.filter(t => t.completed).length;
          const totalTasksCount = person.tasks.length;
          const taskProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

          return (
            <div
              key={person.id}
              onClick={() => onSelectMember(person.id)}
              className={`group relative flex flex-col justify-between bg-white p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-xs hover:shadow-md ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/10 shadow-lg shadow-blue-500/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header Profile */}
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-slate-250 group-hover:border-blue-500 transition-colors"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] border border-slate-200 font-mono text-blue-600 font-bold shadow-xs">
                      {person.tasks.length}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 flex items-center gap-1.5 flex-wrap">
                      {person.name}
                      {person.id === 'duy' && (
                        <span className="px-1.5 py-0.5 text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">Leader</span>
                      )}
                      {person.id === 'an' && (
                        <span className="px-1.5 py-0.5 text-[9px] bg-red-50 text-red-700 border border-red-200 rounded font-medium">Manager</span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{person.role}</p>
                    {person.code && (
                      <span className="inline-block text-[10px] text-slate-400 font-mono mt-0.5 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">{person.code}</span>
                    )}
                  </div>
                </div>

                {/* Tag pill */}
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  {person.tag}
                </div>

                {/* Scope Preview */}
                <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-700">Nhiệm vụ chính: </span>
                    <span className={expandedCardId === person.id ? "" : "line-clamp-2"}>
                      {person.mainScope}
                    </span>
                  </div>

                  {expandedCardId === person.id && (
                    <div className="pt-2 border-t border-slate-200/60 space-y-2 text-xs text-slate-600 animate-in fade-in slide-in-from-top-1 duration-200">
                      {person.subScope && (
                        <div>
                          <span className="font-bold text-slate-700">Mảng bổ trợ: </span>
                          <span>{person.subScope}</span>
                        </div>
                      )}
                      {person.supportScope && (
                        <div>
                          <span className="font-bold text-slate-700">Tối ưu / Công cụ AI: </span>
                          <span>{person.supportScope}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCardId(expandedCardId === person.id ? null : person.id);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1 cursor-pointer pt-0.5"
                  >
                    {expandedCardId === person.id ? "Thu gọn nội dung ▲" : "Xem đầy đủ nhiệm vụ ▼"}
                  </button>
                </div>

                {/* Contact Info */}
                {(person.email || person.phone) && (
                  <div className="text-[10px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
                    {person.email && (
                      <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="text-slate-400">✉</span>
                        <span>{person.email}</span>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">📞</span>
                        <span>{person.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Task progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-slate-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-blue-500" />
                      Tiến độ ngày
                    </span>
                    <span className="text-blue-600 font-semibold">
                      {completedTasksCount}/{totalTasksCount} ({taskProgress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/40">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${taskProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Info: Salaries & Select Trigger */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-0.5">
                    <DollarSign className="h-3 w-3" /> Thu nhập đề xuất
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-600">
                    {formatCurrency(person.estimatedTotalMin).replace(/\s?₫/, 'M').replace(',000,000', '')} - {formatCurrency(person.estimatedTotalMax).replace(/\s?₫/, 'M').replace(',000,000', '')}
                  </div>
                </div>
                <div className="flex gap-1.5 items-center" onClick={(e) => e.stopPropagation()}>
                  <DossierExporter member={person} variant="mini" />
                  {person.kpis.length > 0 && (
                    <span className="h-7 px-2 flex items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-[10px] font-mono text-blue-600 gap-0.5 font-bold" title="KPIs">
                      <Award className="h-3.5 w-3.5" />
                      {person.kpis.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">Không tìm thấy nhân sự phù hợp với bộ lọc hiện tại.</p>
          <button
            onClick={() => { setSearchQuery(''); setFilterTag('All'); }}
            className="mt-3 text-xs text-blue-600 hover:underline cursor-pointer"
          >
            Reset tìm kiếm và bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
