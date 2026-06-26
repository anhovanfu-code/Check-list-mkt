import React, { useState } from 'react';
import { Personnel } from '../types';
import { 
  ClipboardList, 
  Copy, 
  Check, 
  Calendar, 
  CheckSquare, 
  AlertCircle, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Info, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Zap 
} from 'lucide-react';

interface ReportCompilerProps {
  personnelList: Personnel[];
}

// Full weekly recurring duties mapping directly to team roles & guidelines from data.ts
const weeklyList: { [key: string]: string[] } = {
  an: [
    'Lập chỉ tiêu KPIs và phân bổ ngân sách Marketing hàng tháng/hàng tuần cho toàn đội ngũ.',
    'Kiểm duyệt nội dung vĩ mô, tối ưu hoá chi phí CPL chiến dịch đạt chỉ tiêu < 140,000 VND.',
    'Hoạch định chiến lược thương hiệu cá nhân của anh Long & Công ty Fugalo.',
    'Quản trị bảo mật tài khoản quảng cáo, phân quyền nhân sự BM, rà soát rủi ro checkpoint và trực tiếp mở khóa tài khoản bị vô hiệu hóa.',
    'Trực tiếp gửi yêu cầu kháng nghị (appeal) khi tài khoản quảng cáo hoặc bài đăng bị chặn nhầm.'
  ],
  duy: [
    'Xây dựng kế hoạch công việc tuần, tháng và quý cho toàn bộ bộ phận Media.',
    'Đánh giá hiệu quả làm việc, theo dõi tỷ lệ hoàn thành công việc đúng hạn của từng thành viên.',
    'Xây dựng và chuẩn hóa quy trình sản xuất nội dung (quay phim, chụp ảnh, thiết kế, QC).'
  ],
  kiem: [
    'Lên kế hoạch sản xuất media tuần dựa theo yêu cầu của phòng Marketing và anh Long.',
    'Nghiên cứu cải tiến góc máy, bối cảnh quay và đảm bảo tỷ lệ sản phẩm đạt chuẩn QC thương hiệu > 95%.',
    'Phối hợp xử lý kịch bản cho các dự án truyền thông lớn của nhà Fugalo.'
  ],
  chau: [
    'Phân tích chỉ số quảng cáo định kỳ, phân bổ ngân sách tối ưu và kiểm soát chi phí CPL.',
    'Xây dựng kế hoạch Social Content tuần, duyệt kịch bản kĩ lượng và trực tiếp xuất bản video cho Đồ cổ (Tân) & Hàng hiệu (Trường).'
  ],
  tan: [
    'Cam kết sản xuất tối thiểu 60 video vlog đồ cổ chất lượng cao mỗi tháng.',
    'Nghiên cứu từ khóa, trào lưu để cải tiến hook thu hút người xem đồ gỗ xưa.',
    'Tham gia hỗ trợ chụp hình Kiot, showroom hoặc đẩy tương tác livestream khi có lịch.'
  ],
  truong: [
    'Đảm bảo xuất bản đều đặn 60 video hàng hiệu chất lượng cao mỗi tháng đúng tiến độ.',
    'Phối hợp xây dựng ý tưởng hình ảnh concept hàng hiệu độc đáo hàng tuần.',
    'Hỗ trợ quay hình showroom, Kiot, hoặc seeding livestream theo phân công.'
  ],
  long: [
    'Bảo dưỡng hệ thống máy quay, micro, đèn chiếu sáng định kỳ hàng tuần.',
    'Sắp xếp, lưu trữ và sao lưu dữ liệu toàn bộ file media thô vào hệ thống ổ cứng công ty.',
    'Hỗ trợ setup các buổi quay livestream hoặc sự kiện đặc biệt.'
  ],
  nhan: [
    'Bảo trì, cập nhật phần mềm MaxCare và Box Phone định kỳ hàng tuần để tránh checkpoint.',
    'Đối chiếu số liệu lead/đơn hàng từ Ads với phần mềm quản lý KiotViet để rà soát sai sót.',
    'Xử lý khẩn cấp các lỗi phần cứng/phần mềm máy tính văn phòng trong vòng 1 giờ.'
  ],
  panh: [
    'Kiểm duyệt và quản trị thành viên Group Fugalo Royal và Phong Thủy Bùi Gia (2-3 ngày/lần).',
    'Ghi nhận dữ liệu data số điện thoại của khách hàng khi đăng ký gia nhập Group.',
    'Thực hiện giải checkpoint, gỡ số điện thoại hoặc xác thực mail đối với các tài khoản clone mới.'
  ]
};

export default function ReportCompiler({ personnelList }: ReportCompilerProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'daily' | 'weekly'>('all');
  const [copied, setCopied] = useState(false);
  
  // Daily Report Inputs
  const [issuesText, setIssuesText] = useState('Đường truyền mạng livestream đôi lúc bị chập chờn nhẹ, Nhân đã kiểm tra và backup đường truyền dự phòng.');
  const [directionText, setDirectionText] = useState('Tiếp tục đẩy mạnh tần suất sản xuất Vlog (đảm bảo KPI 2 video/ngày của Tân và Trường); Châu bám sát tối ưu CPC và tăng tương tác live.');

  // Weekly Report Inputs
  const [weeklyHighlightsText, setWeeklyHighlightsText] = useState('Đã xuất bản 24 video chất lượng cao (đạt mục tiêu tuần), chỉ số CPM ổn định ở mức trung bình, Phương Anh hoàn thành tốt 5 buổi live trưa.');
  const [weeklyObstaclesText, setWeeklyObstaclesText] = useState('Dàn nick clone bị checkpoint nhẹ do Facebook quét thuật toán mới, Nhân đã giải checkpoint 80% số tài khoản.');
  const [weeklyNextWeekFocusText, setWeeklyNextWeekFocusText] = useState('Chạy thử nghiệm tệp đối tượng Ads mới; tăng số bình luận mồi tự nhiên trong livestream lên 150 cmt/buổi; dọn dẹp bối cảnh showroom chuẩn bị quay chiến dịch mới.');

  // Interactive Weekly Task States
  const [completedWeeklyTasks, setCompletedWeeklyTasks] = useState<{ [key: string]: boolean }>({
    'an_0': true, 'an_1': true, 'an_2': false,
    'duy_0': true, 'duy_1': true, 'duy_2': false,
    'kiem_0': true, 'kiem_1': false, 'kiem_2': true,
    'chau_0': true, 'chau_1': true, 'chau_2': false,
    'tan_0': true, 'tan_1': false, 'tan_2': true,
    'truong_0': true, 'truong_1': true, 'truong_2': false,
    'long_0': true, 'long_1': true, 'long_2': false,
    'nhan_0': true, 'nhan_1': true, 'nhan_2': true,
    'panh_0': true, 'panh_1': true, 'panh_2': false,
  });

  const toggleWeeklyTask = (personId: string, index: number) => {
    const key = `${personId}_${index}`;
    setCompletedWeeklyTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const generateReportText = () => {
    let report = "";
    
    if (filterTab === 'daily') {
      report += `==================================================\n`;
      report += `    BÁO CÁO TIẾN ĐỘ HÀNG NGÀY - NHÓM MEDIA\n`;
      report += `==================================================\n`;
      report += `Ngày báo cáo: ${currentDate}\n`;
      report += `Người lập báo cáo: Lê Thanh Duy (Team Leader)\n`;
      report += `--------------------------------------------------\n\n`;

      personnelList.forEach((person) => {
        const completed = person.tasks.filter(t => t.completed);
        const pending = person.tasks.filter(t => !t.completed);
        
        report += `■ ${person.name} (${person.role})\n`;
        report += `  - Tiến độ công việc ngày: ${completed.length}/${person.tasks.length} hoàn thành\n`;
        
        if (completed.length > 0) {
          report += `  - Nhiệm vụ đã hoàn thành hôm nay:\n`;
          completed.forEach(t => {
            report += `    + [v] ${t.title}: ${t.description}\n`;
          });
        } else {
          report += `  - Chưa cập nhật nhiệm vụ hoàn thành hôm nay.\n`;
        }

        if (pending.length > 0) {
          report += `  - Nhiệm vụ đang thực hiện / tồn đọng:\n`;
          pending.forEach(t => {
            report += `    + [ ] ${t.title}: ${t.description}\n`;
          });
        }
        
        // KPI Status
        const compRates = person.kpis.map(k => {
          const compl = k.name.toLowerCase().includes('chi phí') || k.name.toLowerCase().includes('thời gian')
            ? Math.min((k.targetValue / k.currentValue) * 100, 150)
            : Math.min((k.currentValue / k.targetValue) * 100, 150);
          return { name: k.name, rate: Math.round(compl) };
        });

        if (compRates.length > 0) {
          const summaryKPIs = compRates.map(c => `${c.name}: ${c.rate}%`).join(' | ');
          report += `  - Chỉ số KPI hiện tại: ${summaryKPIs}\n`;
        }
        
        report += `\n`;
      });

      report += `--------------------------------------------------\n`;
      report += `● VẤN ĐỀ PHÁT SINH & RỦI RO TRONG NGÀY:\n`;
      report += `  ${issuesText}\n\n`;
      report += `● ĐỊNH HƯỚNG CÔNG VIỆC NGÀY MAI:\n`;
      report += `  ${directionText}\n`;
      
    } else if (filterTab === 'weekly') {
      report += `==================================================\n`;
      report += `    BÁO CÁO CÔNG VIỆC ĐỊNH KỲ HÀNG TUẦN - NHÓM MEDIA\n`;
      report += `==================================================\n`;
      report += `Tuần báo cáo: Tuần này (${currentDate})\n`;
      report += `Người lập báo cáo: Lê Thanh Duy (Team Leader)\n`;
      report += `--------------------------------------------------\n\n`;

      personnelList.forEach((person) => {
        const tasks = weeklyList[person.id] || [];
        
        // Count how many are completed
        let compCount = 0;
        tasks.forEach((_, idx) => {
          if (completedWeeklyTasks[`${person.id}_${idx}`]) compCount++;
        });
        
        report += `■ ${person.name} (${person.role})\n`;
        report += `  - Tiến độ việc tuần định kỳ: ${compCount}/${tasks.length} hoàn thành (${tasks.length > 0 ? Math.round((compCount/tasks.length)*100) : 0}%)\n`;
        
        if (tasks.length > 0) {
          report += `  - Chi tiết công việc định kỳ hàng tuần:\n`;
          tasks.forEach((task, idx) => {
            const isDone = completedWeeklyTasks[`${person.id}_${idx}`];
            report += `    + [${isDone ? 'v' : ' '}] ${task}\n`;
          });
        }
        
        // KPI status overview
        const compRates = person.kpis.map(k => {
          const compl = k.name.toLowerCase().includes('chi phí') || k.name.toLowerCase().includes('thời gian')
            ? Math.min((k.targetValue / k.currentValue) * 100, 150)
            : Math.min((k.currentValue / k.targetValue) * 100, 150);
          return { name: k.name, rate: Math.round(compl) };
        });

        if (compRates.length > 0) {
          const summaryKPIs = compRates.map(c => `${c.name}: ${c.rate}%`).join(' | ');
          report += `  - Hiệu suất KPI tuần: ${summaryKPIs}\n`;
        }
        
        report += `\n`;
      });

      report += `--------------------------------------------------\n`;
      report += `● THÀNH TÍCH NỔI BẬT TRONG TUẦN:\n`;
      report += `  ${weeklyHighlightsText}\n\n`;
      report += `● KHÓ KHĂN & TRỞ NGẠI TUẦN NÀY:\n`;
      report += `  ${weeklyObstaclesText}\n\n`;
      report += `● TRỌNG TÂM CÔNG VIỆC TUẦN TỚI:\n`;
      report += `  ${weeklyNextWeekFocusText}\n`;
      
    } else {
      // ALL CONSOLIDATED
      report += `==================================================\n`;
      report += ` BÁO CÁO TỔNG HỢP (HÀNG NGÀY & ĐỊNH KỲ TUẦN) - NHÓM MEDIA\n`;
      report += `==================================================\n`;
      report += `Ngày lập báo cáo: ${currentDate}\n`;
      report += `Người lập báo cáo: Lê Thanh Duy (Team Leader)\n`;
      report += `--------------------------------------------------\n\n`;

      report += `I. PHẦN 1: TIẾN ĐỘ CÔNG VIỆC HÀNG NGÀY\n\n`;
      personnelList.forEach((person) => {
        const completed = person.tasks.filter(t => t.completed);
        report += `  - ${person.name}: Đã hoàn thành ${completed.length}/${person.tasks.length} việc hôm nay.\n`;
      });
      report += `  - Vấn đề phát sinh hôm nay: ${issuesText}\n`;
      report += `  - Định hướng ngày mai: ${directionText}\n\n`;

      report += `--------------------------------------------------\n`;
      report += `II. PHẦN 2: CHI TIẾT ĐẦU VIỆC CHUNG & ĐỊNH KỲ TUẦN\n\n`;
      
      personnelList.forEach((person) => {
        const dCompleted = person.tasks.filter(t => t.completed);
        const dPending = person.tasks.filter(t => !t.completed);
        const wTasks = weeklyList[person.id] || [];
        
        let wCompCount = 0;
        wTasks.forEach((_, idx) => {
          if (completedWeeklyTasks[`${person.id}_${idx}`]) wCompCount++;
        });

        report += `■ ${person.name} (${person.role})\n`;
        report += `  * VIỆC HẰNG NGÀY:\n`;
        if (dCompleted.length > 0) {
          dCompleted.forEach(t => {
            report += `    + [v] (Hàng ngày) ${t.title}\n`;
          });
        }
        if (dPending.length > 0) {
          dPending.forEach(t => {
            report += `    + [ ] (Hàng ngày) ${t.title}\n`;
          });
        }
        
        report += `  * VIỆC ĐỊNH KỲ TUẦN:\n`;
        wTasks.forEach((task, idx) => {
          const isDone = completedWeeklyTasks[`${person.id}_${idx}`];
          report += `    + [${isDone ? 'v' : ' '}] (Tuần định kỳ) ${task}\n`;
        });
        report += `\n`;
      });

      report += `--------------------------------------------------\n`;
      report += `● THÀNH TÍCH & TIẾN ĐỘ CHUNG:\n`;
      report += `  ${weeklyHighlightsText}\n\n`;
      report += `● KHÓ KHĂN & TRỞ NGẠI CHÍNH:\n`;
      report += `  ${weeklyObstaclesText || issuesText}\n\n`;
      report += `● ĐỊNH HƯỚNG SẮP TỚI:\n`;
      report += `  ${weeklyNextWeekFocusText || directionText}\n`;
    }

    return report;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="report-compiler-view">
      
      {/* FILTER CONTROL: Dynamic Report Segment Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
              <ClipboardList className="h-4.5 w-4.5" />
            </span>
            <h2 className="text-base font-bold text-slate-800">Hệ thống Tổng hợp & Xuất báo cáo tự động</h2>
          </div>
          <p className="text-xs text-slate-500">Phân tách hoặc tích hợp linh hoạt giữa tiến độ hằng ngày và nhiệm vụ tuần của 9 nhân sự.</p>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
              filterTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Tổng hợp Toàn diện
          </button>
          <button
            onClick={() => setFilterTab('daily')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
              filterTab === 'daily'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📅 Báo cáo Hàng ngày
          </button>
          <button
            onClick={() => setFilterTab('weekly')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
              filterTab === 'weekly'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Việc Tuần Định kỳ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Input form & interactive checkboxes (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dynamic Configuration Fields card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-blue-600" />
                Thông tin điều hành & Định hướng nhóm
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                {currentDate}
              </span>
            </div>

            {/* Inputs for Daily Reports */}
            {(filterTab === 'daily' || filterTab === 'all') && (
              <div className="space-y-4 p-4.5 bg-slate-50/50 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="text-[10px] uppercase font-extrabold text-blue-600 tracking-wider">Mảng hằng ngày</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Sự cố & Rủi ro phát sinh trong ngày
                  </label>
                  <textarea
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 h-20 placeholder-slate-400"
                    placeholder="Nhập sự cố mạng, tài khoản Ads bị khóa, bối cảnh studio..."
                    value={issuesText}
                    onChange={(e) => setIssuesText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    Định hướng công việc ngày mai
                  </label>
                  <textarea
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 h-20 placeholder-slate-400"
                    placeholder="Lên lịch quay chụp mới, tối ưu hóa ngân sách..."
                    value={directionText}
                    onChange={(e) => setDirectionText(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Inputs for Weekly Reports */}
            {(filterTab === 'weekly' || filterTab === 'all') && (
              <div className="space-y-4 p-4.5 bg-slate-50/50 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="text-[10px] uppercase font-extrabold text-purple-600 tracking-wider">Mảng định kỳ tuần</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Thành tích & Điểm sáng nổi bật tuần này
                  </label>
                  <textarea
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 h-20 placeholder-slate-400"
                    placeholder="Nêu bật kết quả vượt KPI, tối ưu chi phí Ads, hoàn thành sớm video..."
                    value={weeklyHighlightsText}
                    onChange={(e) => setWeeklyHighlightsText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-purple-600" />
                    Trở ngại & Khó khăn định kỳ tuần
                  </label>
                  <textarea
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 h-20 placeholder-slate-400"
                    placeholder="Tài khoản quảng cáo bị hạn chế, bối cảnh studio ngoài trời mưa bão..."
                    value={weeklyObstaclesText}
                    onChange={(e) => setWeeklyObstaclesText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4 text-indigo-600" />
                    Trọng tâm hành động tuần tới
                  </label>
                  <textarea
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 h-20 placeholder-slate-400"
                    placeholder="Chạy thử nghiệm định dạng video mới, tăng lượt chia sẻ livestream..."
                    value={weeklyNextWeekFocusText}
                    onChange={(e) => setWeeklyNextWeekFocusText(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Personnel Workloads & Recurring Checklists card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-blue-600" />
                  {filterTab === 'weekly' ? 'Bảng kiểm việc Tuần Định kỳ' : filterTab === 'daily' ? 'Thông tin việc Ngày nhân sự' : 'Theo dõi Tiến độ Tổng hợp'}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {filterTab === 'weekly' 
                    ? 'Nhấp chọn để đánh dấu hoàn thành 3 việc định kỳ cốt lõi của từng nhân sự.'
                    : 'Thông tin tiến độ được đối soát trực tiếp từ hệ thống dữ liệu phòng ban.'
                  }
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
                {personnelList.length} Nhân sự hoạt động
              </span>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {personnelList.map((person) => {
                const completedDaily = person.tasks.filter(t => t.completed);
                const wTasks = weeklyList[person.id] || [];
                
                // Weekly Completion Rate calculations
                let wCompCount = 0;
                wTasks.forEach((_, idx) => {
                  if (completedWeeklyTasks[`${person.id}_${idx}`]) wCompCount++;
                });
                const weeklyPercent = wTasks.length > 0 ? Math.round((wCompCount / wTasks.length) * 100) : 0;

                return (
                  <div key={person.id} className="border border-slate-150 rounded-xl p-4 hover:bg-slate-50/30 transition-all space-y-3.5">
                    
                    {/* Header line */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{person.name}</h4>
                          <span className="text-[9px] text-slate-400 font-semibold">{person.role.split('(')[0]}</span>
                        </div>
                      </div>

                      {/* Display Badges dynamically based on filter */}
                      <div className="flex items-center gap-2">
                        {(filterTab === 'daily' || filterTab === 'all') && (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Ngày: {completedDaily.length}/{person.tasks.length}
                          </span>
                        )}
                        {(filterTab === 'weekly' || filterTab === 'all') && (
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                            weeklyPercent === 100 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : weeklyPercent >= 50 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            <CheckCircle2 className="h-3 w-3" />
                            Tuần: {weeklyPercent}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress slider bar for weekly tasks */}
                    {(filterTab === 'weekly' || filterTab === 'all') && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>Tiến độ việc định kỳ tuần</span>
                          <span>{wCompCount}/{wTasks.length} hoàn tất</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              weeklyPercent === 100 
                                ? 'bg-emerald-500' 
                                : weeklyPercent >= 50 
                                ? 'bg-purple-500' 
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${weeklyPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* INTERACTIVE WEEKLY CHECKBOXES FOR THIS PERSON */}
                    {filterTab === 'weekly' ? (
                      <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-slate-150">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">3 đầu việc định kỳ (Tích chọn để hoàn thành)</p>
                        <div className="space-y-1.5">
                          {wTasks.map((task, idx) => {
                            const isCompleted = !!completedWeeklyTasks[`${person.id}_${idx}`];
                            return (
                              <label
                                key={idx}
                                className={`flex items-start gap-2.5 text-xs p-2 rounded-md border cursor-pointer select-none transition ${
                                  isCompleted 
                                    ? 'bg-emerald-50/60 border-emerald-100 text-slate-500' 
                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isCompleted}
                                  onChange={() => toggleWeeklyTask(person.id, idx)}
                                  className="mt-0.5 h-3.5 w-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                />
                                <span className={isCompleted ? 'line-through text-slate-400' : 'font-medium'}>
                                  {task}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ) : filterTab === 'all' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-150">
                        {/* Summary views */}
                        <div className="space-y-1">
                          <p className="text-[9px] font-extrabold text-blue-600 uppercase tracking-wide">Việc ngày</p>
                          <ul className="space-y-1">
                            {person.tasks.map(t => (
                              <li key={t.id} className="text-[10px] text-slate-600 flex items-center gap-1.5 truncate">
                                <span className={`h-1.5 w-1.5 rounded-full ${t.completed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                <span className={t.completed ? 'line-through text-slate-400' : ''}>{t.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[9px] font-extrabold text-purple-600 uppercase tracking-wide">Tích việc tuần</p>
                          <div className="space-y-1">
                            {wTasks.map((task, idx) => {
                              const isCompleted = !!completedWeeklyTasks[`${person.id}_${idx}`];
                              return (
                                <button
                                  key={idx}
                                  onClick={() => toggleWeeklyTask(person.id, idx)}
                                  className={`w-full text-left text-[10px] p-1 px-1.5 rounded border transition-all flex items-center gap-1.5 truncate cursor-pointer ${
                                    isCompleted 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className={`h-2.5 w-2.5 rounded flex items-center justify-center text-[8px] font-bold ${isCompleted ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                                    {isCompleted && '✓'}
                                  </div>
                                  <span className={isCompleted ? 'line-through text-slate-400' : ''}>{task}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Daily view display list */
                      <div className="space-y-1 bg-slate-50/50 p-3 rounded-lg border border-slate-150">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">Đầu việc ngày hoạt động</p>
                        <div className="space-y-1">
                          {person.tasks.map(t => (
                            <div key={t.id} className="flex items-center gap-2 text-xs py-1 px-1.5 bg-white rounded border border-slate-150">
                              <span className={`h-2.5 w-2.5 rounded-full flex items-center justify-center text-[8px] font-bold ${t.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                {t.completed ? '✓' : '•'}
                              </span>
                              <span className={`truncate ${t.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800 font-bold'}`}>{t.title}</span>
                              <span className="text-[9px] text-slate-400 truncate ml-auto">- {t.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live compiled preview container (5 columns) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden h-full">
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                <span className="text-xs font-extrabold text-slate-800">Markdown Preview</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Thời gian thực</span>
            </div>

            <div className="p-5 bg-slate-50 flex-1 overflow-y-auto max-h-[580px] xl:max-h-[680px]">
              <pre className="text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap font-sans bg-white p-4.5 rounded-xl border border-slate-200 select-all shadow-xs">
                {generateReportText()}
              </pre>
            </div>

            <div className="p-4 bg-white border-t border-slate-150">
              <button
                onClick={handleCopy}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    Đã sao chép báo cáo vào bộ nhớ tạm!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Sao chép Báo cáo ({filterTab === 'all' ? 'Tổng hợp' : filterTab === 'daily' ? 'Hàng ngày' : 'Tuần định kỳ'})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
