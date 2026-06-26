import React, { useState, useEffect } from 'react';
import { Personnel, KPI } from '../types';
import { 
  Sliders, 
  Award, 
  DollarSign, 
  ArrowUpRight, 
  Percent, 
  HelpCircle,
  TrendingUp,
  Target,
  ShieldCheck,
  Calendar,
  Flame,
  ChevronRight
} from 'lucide-react';

interface KPISimulatorProps {
  selectedMember: Personnel;
  onUpdateKPIValue: (memberId: string, kpiId: string, newValue: number) => void;
}

export default function KPISimulator({ selectedMember, onUpdateKPIValue }: KPISimulatorProps) {
  const [localKPIs, setLocalKPIs] = useState<KPI[]>([]);
  const [includeCommission, setIncludeCommission] = useState<boolean>(true);
  const [commissionRate, setCommissionRate] = useState<number>(0.2); // Default to 0.2% commission rate

  useEffect(() => {
    setLocalKPIs(selectedMember.kpis);
  }, [selectedMember]);

  const handleSliderChange = (kpiId: string, value: number) => {
    setLocalKPIs(prev => prev.map(k => k.id === kpiId ? { ...k, currentValue: value } : k));
    onUpdateKPIValue(selectedMember.id, kpiId, value);
  };

  // Calculate metrics based on KPI values
  const calculateKPICompletion = (kpi: KPI) => {
    if (kpi.targetValue === 0) return 0;
    
    // For KPIs where lower is better (like CPL or Response Time)
    if (kpi.name.toLowerCase().includes('chi phí') || kpi.name.toLowerCase().includes('thời gian')) {
      const ratio = kpi.targetValue / kpi.currentValue;
      return Math.min(Math.max(ratio * 100, 0), 150); // cap at 150%
    }

    const ratio = kpi.currentValue / kpi.targetValue;
    return Math.min(Math.max(ratio * 100, 0), 150); // cap at 150%
  };

  // Weighted KPI Index
  const totalWeight = localKPIs.reduce((sum, k) => sum + k.weight, 0);
  const weightedIndex = totalWeight > 0 
    ? localKPIs.reduce((sum, k) => sum + (calculateKPICompletion(k) * (k.weight / totalWeight)), 0)
    : 0;

  // Simulate total salary: Base Salary + KPI Bonus
  const baseSalaryAverage = (selectedMember.baseSalaryMin + selectedMember.baseSalaryMax) / 2;
  const maxPotentialBonus = selectedMember.estimatedTotalMax - selectedMember.baseSalaryMax;

  // Let's formulate an incentive calculation
  let bonusMultiplier = 0;
  if (weightedIndex >= 100) {
    // 100% KPI achievement yields 100% of standard bonus, up to 150% for high achievements
    bonusMultiplier = 1 + (weightedIndex - 100) * 0.02; // 2% additional bonus for every 1% over target
  } else if (weightedIndex >= 80) {
    // Scales linearly down from 100% bonus at 100% KPI to 40% bonus at 80% KPI
    bonusMultiplier = 0.4 + (weightedIndex - 80) * 0.03;
  } else {
    // No bonus if weighted KPI is below 80%
    bonusMultiplier = 0;
  }

  // Find revenue-based KPI
  const revenueKPI = localKPIs.find(k => k.name.toLowerCase().includes('doanh thu') && k.unit === 'VND');
  const commissionAmount = (revenueKPI && includeCommission) ? (revenueKPI.currentValue * (commissionRate / 100)) : 0;

  const simulatedBonus = maxPotentialBonus > 0 ? maxPotentialBonus * bonusMultiplier : 0;
  const simulatedTotalSalary = baseSalaryAverage + simulatedBonus + commissionAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Determine performance class
  const getPerformanceLabel = (index: number) => {
    if (index >= 110) return { text: 'Xuất Sắc (A+)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (index >= 95) return { text: 'Hoàn Thành Tốt (A)', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (index >= 80) return { text: 'Đạt Yêu Cầu (B)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: 'Cần Cải Thiện (C)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const perfLabel = getPerformanceLabel(weightedIndex);

  // Split local KPIs into management revenue KPI and standard team KPIs
  const isManagementMember = selectedMember.id === 'an';
  const managementRevenueKPI = localKPIs.find(k => k.id === 'an_kpi_revenue');
  const displayStandardKPIs = localKPIs.filter(k => k.id !== 'an_kpi_revenue');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sliders Area (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-150 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-amber-600" />
                Mô phỏng Chỉ số KPI & Hiệu suất
              </h3>
              <p className="text-xs text-slate-500">Kéo thanh trượt để thay đổi kết quả thực tế của {selectedMember.name}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold font-mono ${perfLabel.color}`}>
              Xếp loại: {perfLabel.text}
            </div>
          </div>

          <div className="space-y-6">
            {/* Special Management Revenue KPI Panel */}
            {isManagementMember && managementRevenueKPI && (
              <div className="bg-gradient-to-br from-amber-600/10 via-amber-500/5 to-transparent p-5 rounded-2xl border border-amber-300/60 shadow-xs space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none -mr-4 -mt-4 animate-pulse"></div>
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-200/45 pb-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-250 uppercase tracking-wide">
                      <ShieldCheck className="h-3 w-3 text-amber-700 animate-pulse" />
                      KPI Cấp Quản Lý • Trưởng Phòng Marketing
                    </span>
                    <h4 className="text-base font-black text-slate-800 flex items-center gap-2 mt-1">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                      {managementRevenueKPI.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Trọng số KPI</span>
                    <span className="text-base font-mono font-black text-amber-700">{managementRevenueKPI.weight}%</span>
                  </div>
                </div>

                {/* KPI Breakdown details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Monthly card */}
                  <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/40 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-450" />
                        Chỉ tiêu Doanh thu Tháng
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600 border border-slate-200">Tháng này</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400">Mục tiêu:</span>
                        <span className="text-sm font-semibold text-slate-700">{formatCurrency(managementRevenueKPI.targetValue)}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400">Thực tế:</span>
                        <span className="text-base font-mono font-black text-amber-700">{formatCurrency(managementRevenueKPI.currentValue)}</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <div className="flex justify-between text-[10px] text-slate-450 mb-1">
                        <span>Đạt cam kết tháng</span>
                        <span className="font-bold text-amber-700">{Math.round(calculateKPICompletion(managementRevenueKPI))}%</span>
                      </div>
                      <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden border border-slate-200/60">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(calculateKPICompletion(managementRevenueKPI), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly card */}
                  <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/40 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Target className="h-3.5 w-3.5 text-slate-450" />
                        Chỉ tiêu Doanh thu Tuần
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-[10px] font-semibold text-amber-700 border border-amber-100">Phân rã tuần</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400">Mục tiêu tuần:</span>
                        <span className="text-sm font-semibold text-slate-700">{formatCurrency(managementRevenueKPI.targetValue / 4)}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400">Thực tế tuần (Tạm tính):</span>
                        <span className="text-base font-mono font-black text-amber-650">{formatCurrency(managementRevenueKPI.currentValue / 4)}</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <div className="flex justify-between text-[10px] text-slate-450 mb-1">
                        <span>Đạt cam kết tuần</span>
                        <span className="font-bold text-amber-650">{Math.round(calculateKPICompletion(managementRevenueKPI))}%</span>
                      </div>
                      <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden border border-slate-200/60">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(calculateKPICompletion(managementRevenueKPI), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slider Control for Management Revenue */}
                <div className="bg-white p-4 rounded-xl border border-amber-200/60 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
                      Điều chỉnh Doanh thu Thực tế Công ty (KiotViet):
                    </span>
                    <span className="font-mono text-sm font-black text-amber-850 bg-amber-50 border border-amber-150 px-2.5 py-0.5 rounded-lg">
                      {managementRevenueKPI.currentValue.toLocaleString()} VND
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">1 Tỷ</span>
                    <input
                      type="range"
                      min={1000000000}
                      max={50000000000}
                      step={100000000}
                      value={managementRevenueKPI.currentValue}
                      onChange={(e) => handleSliderChange(managementRevenueKPI.id, Number(e.target.value))}
                      className="flex-1 accent-amber-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-400 font-bold">50 Tỷ</span>
                  </div>

                  {/* Dynamic Status / Commitment Evaluation Message */}
                  <div className="pt-1 text-[11px] leading-relaxed">
                    {calculateKPICompletion(managementRevenueKPI) >= 100 ? (
                      <p className="text-emerald-750 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60 font-semibold">
                        🎉 <strong>Cam kết doanh thu hoàn thành xuất sắc ({Math.round(calculateKPICompletion(managementRevenueKPI))}%):</strong> Đạt mục tiêu tổng doanh thu công ty. Đủ điều kiện nhận tối đa lương hiệu suất và quỹ thưởng hoa hồng doanh số bổ sung!
                      </p>
                    ) : calculateKPICompletion(managementRevenueKPI) >= 80 ? (
                      <p className="text-amber-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 font-semibold">
                        ⚠️ <strong>Cam kết doanh thu tiệm cận mục tiêu ({Math.round(calculateKPICompletion(managementRevenueKPI))}%):</strong> Cần đẩy mạnh các chiến dịch quảng cáo ROAS cao và nâng cao hiệu suất viết kịch bản AI tự động để tối ưu chi phí chuyển đổi.
                      </p>
                    ) : (
                      <p className="text-rose-700 bg-rose-50/70 p-2.5 rounded-lg border border-rose-200/60 font-semibold">
                        🚨 <strong>Cảnh báo rủi ro cam kết doanh số ({Math.round(calculateKPICompletion(managementRevenueKPI))}%):</strong> Doanh số đang ở mức báo động đỏ. Đề xuất Trưởng phòng rà soát khẩn cấp tệp kịch bản truyền thông và tối ưu CPL chiến dịch.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Standard KPI Sliders */}
            {displayStandardKPIs.map((kpi) => {
              const compPercentage = Math.round(calculateKPICompletion(kpi));
              // Determine dynamic step and limits based on target value
              let minSlider = 0;
              let maxSlider = kpi.targetValue * 1.5;
              let step = 1;

              if (kpi.unit === '%') {
                minSlider = 0;
                maxSlider = 100;
                step = 1;
              } else if (kpi.name.toLowerCase().includes('chi phí') || kpi.unit === 'VND') {
                minSlider = Math.round(kpi.targetValue * 0.4);
                maxSlider = Math.round(kpi.targetValue * 1.8);
                step = 1000;
              } else if (kpi.unit === 'Views') {
                minSlider = Math.round(kpi.targetValue * 0.2);
                maxSlider = Math.round(kpi.targetValue * 2);
                step = 100;
              } else if (kpi.unit === 'Reach') {
                minSlider = Math.round(kpi.targetValue * 0.2);
                maxSlider = Math.round(kpi.targetValue * 2);
                step = 1000;
              } else if (kpi.unit === 'Comments' || kpi.unit === 'Followers') {
                minSlider = Math.round(kpi.targetValue * 0.2);
                maxSlider = Math.round(kpi.targetValue * 2);
                step = 10;
              } else {
                minSlider = 0;
                maxSlider = Math.round(kpi.targetValue * 1.5);
                step = 1;
              }

              // Ensure value respects boundaries
              const displayVal = Math.min(Math.max(kpi.currentValue, minSlider), maxSlider);

              return (
                <div key={kpi.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Trọng số {kpi.weight}%</span>
                        <span className="text-slate-700 font-semibold text-sm">{kpi.name}</span>
                      </div>
                      <p className="text-xs text-slate-500">Mục tiêu: {kpi.target} (Định mức: {kpi.targetValue.toLocaleString()} {kpi.unit})</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-blue-600">
                        {displayVal.toLocaleString()} {kpi.unit}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Đạt: <span className={compPercentage >= 100 ? 'text-emerald-600 font-bold' : compPercentage >= 80 ? 'text-amber-600' : 'text-rose-600 font-bold'}>{compPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-450 w-12 text-left">{minSlider.toLocaleString()}</span>
                    <input
                      type="range"
                      min={minSlider}
                      max={maxSlider}
                      step={step}
                      value={displayVal}
                      onChange={(e) => handleSliderChange(kpi.id, Number(e.target.value))}
                      className="flex-1 accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-450 w-12 text-right">{maxSlider.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculator Summary Area (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        {/* KPI Score Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Điểm hiệu suất (KPI Index)
          </h3>

          <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-bl-full border-b border-l border-blue-500/10 flex items-center justify-center">
              <Percent className="h-4 w-4 text-blue-500/40" />
            </div>
            <span className="text-5xl font-mono font-black text-blue-600">
              {Math.round(weightedIndex)}%
            </span>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Chỉ số hoàn thành có trọng số</p>
          </div>

          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="flex justify-between">
              <span className="text-slate-400">Điều kiện thưởng:</span>
              <span className="font-mono">Đạt KPI &gt;= 80%</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Hiệu suất hiện tại:</span>
              <span className={`font-mono font-semibold ${weightedIndex >= 100 ? 'text-emerald-600' : weightedIndex >= 80 ? 'text-amber-600' : 'text-rose-600'}`}>
                {weightedIndex >= 100 ? 'Xuất Sắc Thưởng Thêm' : weightedIndex >= 80 ? 'Đạt Thưởng Chuẩn' : 'Không Đạt Chỉ Tiêu'}
              </span>
            </p>
          </div>
        </div>

        {/* Salary Calculator Card */}
        <div className="bg-white p-6 rounded-2xl border border-blue-100 space-y-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
          
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Mô phỏng tiền lương đề xuất
          </h3>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Lương cơ bản (Trung bình):</span>
              <span className="font-mono text-slate-700">{formatCurrency(baseSalaryAverage)}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="flex items-center gap-1">
                Thưởng hiệu suất (Simulated):
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                  x{(bonusMultiplier).toFixed(2)}
                </span>
              </span>
              <span className="font-mono text-blue-600">+{formatCurrency(simulatedBonus)}</span>
            </div>

            {/* Special Commission Block if member has revenue-based KPI (e.g. TP.MKT committing to company revenue) */}
            {revenueKPI && (
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-blue-800 uppercase flex items-center gap-1">
                    🌟 Thưởng hoa hồng Doanh số
                  </span>
                  <input 
                    type="checkbox"
                    checked={includeCommission}
                    onChange={(e) => setIncludeCommission(e.target.checked)}
                    className="h-4.5 w-4.5 text-blue-600 rounded border-slate-350 cursor-pointer accent-blue-600"
                  />
                </div>
                
                {includeCommission ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-slate-600 font-medium">
                      <span>Tỷ lệ hoa hồng: <strong className="font-mono text-blue-600 text-xs">{commissionRate}%</strong></span>
                      <span className="font-mono text-blue-700 font-bold">+{formatCurrency(commissionAmount)}</span>
                    </div>
                    <input 
                      type="range"
                      min={0.05}
                      max={1.0}
                      step={0.05}
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>0.05% (Tối thiểu)</span>
                      <span>1.0% (Tối đa)</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">Đã tắt mô phỏng thưởng doanh số.</div>
                )}
                
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Tính dựa trên <strong>{formatCurrency(revenueKPI.currentValue)}</strong> doanh thu KiotViet thực tế được kéo trên thanh trượt bên trái.
                </p>
              </div>
            )}

            <div className="border-t border-slate-150 pt-3.5 space-y-1">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Tổng thu nhập đề xuất</div>
              <div className="text-2xl font-mono font-bold text-blue-600">
                {formatCurrency(simulatedTotalSalary)}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal italic mt-1">
                * Mức thưởng KPI đề xuất đã được tính toán công bằng dựa trên trọng số KPI riêng biệt của {selectedMember.name}.
              </p>
            </div>
          </div>
        </div>

        {/* Advisory Box on how to structure TP.MKT Revenue KPI and system architecture */}
        {revenueKPI && (
          <div className="bg-slate-55 p-4 rounded-2xl border border-slate-200 text-xs space-y-3 leading-relaxed text-slate-600">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              💡 Giải pháp Quản trị KPI Doanh thu của TP.MKT
            </h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Cân bằng 2 Trọng tâm:</strong> Doanh thu chiếm trọng số cao (<strong>40%</strong>) giúp tập trung mục tiêu, trong khi 3 chỉ số còn lại (IT Server, Đồng bộ KiotViet, AI Automation) chiếm <strong>60%</strong> để giữ gìn chất lượng kỹ thuật, tính ổn định và tự động hóa.
              </li>
              <li>
                <strong>Cơ chế Thưởng Kết hợp:</strong> Áp dụng lương cứng + thưởng KPI hoạt động + hoa hồng doanh thu (ví dụ <strong>0.1% - 0.3%</strong> doanh thu tổng). Điều này kích thích TP.MKT vừa viết code tối ưu tự động hóa, vừa đẩy chiến dịch quảng cáo ra đơn trực tiếp.
              </li>
              <li>
                <strong>Tích hợp KiotViet tự động:</strong> Dùng API đồng bộ doanh số để tự động cập nhật số liệu lên dashboard hằng ngày, giảm tải đối soát thủ công và đảm bảo minh bạch tuyệt đối.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
