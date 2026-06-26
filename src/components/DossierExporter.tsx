import React, { useState } from 'react';
import { Personnel, Task, KPI } from '../types';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  Check, 
  Shield, 
  Briefcase, 
  Award, 
  ListTodo, 
  Info,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

interface DossierExporterProps {
  member: Personnel;
  variant?: 'full' | 'mini';
}

// Weekly recurring duties mapping (from ReportCompiler.tsx for full consistency)
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
    'Xây dựng kế hoạch Social Content tuần, duyệt kịch bản kĩ lưỡng và trực tiếp xuất bản video cho Đồ cổ (Tân) & Hàng hiệu (Trường).'
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

export default function DossierExporter({ member, variant = 'full' }: DossierExporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportTheme, setExportTheme] = useState<'modern' | 'classic'>('modern');
  const [copied, setCopied] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const calculateKPICompletion = (kpi: KPI) => {
    if (kpi.targetValue === 0) return 0;
    if (kpi.name.toLowerCase().includes('chi phí') || kpi.name.toLowerCase().includes('thời gian')) {
      return Math.min(Math.max((kpi.targetValue / kpi.currentValue) * 105, 0), 150);
    }
    return Math.min(Math.max((kpi.currentValue / kpi.targetValue) * 100, 0), 150);
  };

  const getKPIColor = (rate: number) => {
    if (rate >= 100) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (rate >= 80) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-amber-600 bg-amber-50 border-amber-100';
  };

  const weeklyTasks = weeklyList[member.id] || [];

  // Generate Markdown Format
  const generateMarkdown = () => {
    let md = `# BÁO CÁO HỒ SƠ NĂNG LỰC & NHIỆM VỤ VỊ TRÍ\n`;
    md += `**Thời gian xuất bản:** ${new Date().toLocaleDateString('vi-VN')} | **Vị trí:** ${member.role}\n`;
    md += `========================================================================\n\n`;
    
    md += `## I. THÔNG TIN NHÂN SỰ CƠ BẢN\n`;
    md += `- **Họ và tên:** ${member.name}\n`;
    md += `- **Chức danh chính thức:** ${member.role}\n`;
    md += `- **Mã số vị trí:** ${member.code || '[Chưa cấp]'}\n`;
    md += `- **Nhóm / Phòng ban:** ${member.tag}\n`;
    md += `- **Email liên hệ:** ${member.email || 'N/A'}\n`;
    md += `- **Số điện thoại:** ${member.phone || 'N/A'}\n\n`;

    md += `## II. PHẠM VI TRÁCH NHIỆM (JOB SCOPES)\n`;
    md += `1. **Nhiệm vụ trọng tâm chính (Main Scope):**\n   ${member.mainScope}\n`;
    md += `2. **Nhiệm vụ chuyên môn phụ (Sub Scope):**\n   ${member.subScope}\n`;
    md += `3. **Nhiệm vụ hỗ trợ & Phối hợp (Support Scope):**\n   ${member.supportScope}\n\n`;

    md += `## III. QUY TRÌNH NHIỆM VỤ HẰNG NGÀY & PHỐI HỢP\n`;
    member.tasks.forEach((task, idx) => {
      md += `${idx + 1}. **${task.title}** (${task.type === 'daily' ? 'Hằng ngày' : task.type === 'support' ? 'Hỗ trợ' : 'Đột xuất'})\n`;
      md += `   - *Mô tả:* ${task.description}\n`;
      md += `   - *Trạng thái hiện tại:* ${task.completed ? '🟢 Đã hoàn thành' : '🟡 Đang triển khai'}\n`;
    });
    md += `\n`;

    if (weeklyTasks.length > 0) {
      md += `## IV. ĐẦU VIỆC ĐỊNH KỲ HẰNG TUẦN (WEEKLY ROUTINE)\n`;
      weeklyTasks.forEach((wt, idx) => {
        md += `- [ ] ${wt}\n`;
      });
      md += `\n`;
    }

    md += `## V. KHUNG ĐÁNH GIÁ HIỆU SUẤT SMART KPI\n`;
    md += `| Chỉ số KPI | Chỉ tiêu cam kết | Tỷ trọng | Thực tế hiện tại | Đơn vị | Tỷ lệ đạt |\n`;
    md += `| :--- | :--- | :---: | :---: | :---: | :---: |\n`;
    member.kpis.forEach(kpi => {
      const rate = Math.round(calculateKPICompletion(kpi));
      const currentFormatted = kpi.unit === 'VND' ? formatCurrency(kpi.currentValue).replace(/\s?₫/, '') : kpi.currentValue.toLocaleString('vi-VN');
      const targetFormatted = kpi.unit === 'VND' ? formatCurrency(kpi.targetValue).replace(/\s?₫/, '') : kpi.targetValue.toLocaleString('vi-VN');
      md += `| ${kpi.name} | ${kpi.target} | ${kpi.weight}% | ${currentFormatted} | ${kpi.unit} | ${rate}% |\n`;
    });
    md += `\n`;

    md += `## VI. CƠ CẤU LƯƠNG & THƯỞNG ĐỀ XUẤT\n`;
    md += `- **Mức lương cơ bản đề xuất:** ${formatCurrency(member.baseSalaryMin)} - ${formatCurrency(member.baseSalaryMax)} / tháng\n`;
    md += `- **Thu nhập dự kiến trung bình (gồm KPI đạt chuẩn):** ${formatCurrency(member.estimatedTotalMin)} - ${formatCurrency(member.estimatedTotalMax)} / tháng\n`;
    md += `*Ghi chú: Thưởng KPI được tính toán tự động dựa trên tỷ trọng đóng góp của từng đầu việc được lượng hóa.*\n\n`;

    md += `## VII. NGUYÊN TẮC VẬN HÀNH & BẢO MẬT TÀI SẢN SỐ\n`;
    md += `1. **Bảo mật tuyệt đối:** Admin buộc sử dụng 2FA Authenticator và lưu mã dự phòng ngoại tuyến.\n`;
    md += `2. **Ủy quyền phân cấp:** Chỉ cấp quyền Editor/Advertiser cho nhân viên; Admin BM tối cao do Quản lý nắm giữ.\n`;
    md += `3. **Chống Checkpoint:** Sử dụng Proxy tĩnh IP sạch đối với hệ thống Seeding và tương tác hàng loạt.\n`;
    md += `4. **Kiểm duyệt rủi ro:** Rà soát từ khóa cấm, bản quyền nhạc và tuân thủ chính sách nền tảng trước khi đăng tải.\n\n`;
    md += `------------------------------------------------------------------------\n`;
    md += `*Báo cáo được trích xuất tự động từ Hệ thống Quản trị Media Fugalo*`;
    return md;
  };

  // Generate HTML Format with Inline Styled Card Layout (Ideal for leaders and MS Word)
  const generateHTML = () => {
    const isModern = exportTheme === 'modern';
    const primaryColor = isModern ? '#2563eb' : '#0f172a';
    const secondaryColor = isModern ? '#eff6ff' : '#f1f5f9';
    const accentColor = isModern ? '#3b82f6' : '#475569';

    let html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hồ sơ Vị trí & KPIs - ${member.name}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, Arial;
            line-height: 1.6;
            color: #334155;
            background-color: #f8fafc;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 850px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
        }
        .header {
            border-bottom: 3px solid ${primaryColor};
            padding-bottom: 24px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header-left h1 {
            margin: 0;
            color: ${primaryColor};
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: -0.5px;
        }
        .header-left p {
            margin: 4px 0 0 0;
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
        }
        .badge-tag {
            background-color: ${secondaryColor};
            color: ${primaryColor};
            border: 1px solid #bfdbfe;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .grid-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
        }
        .info-item {
            font-size: 13px;
        }
        .info-label {
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .info-value {
            color: #1e293b;
            font-size: 14px;
            font-weight: 600;
        }
        .section-title {
            color: ${primaryColor};
            font-size: 16px;
            font-weight: bold;
            border-left: 4px solid ${primaryColor};
            padding-left: 12px;
            margin-top: 35px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .scope-card {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 16px;
            background: #ffffff;
            margin-bottom: 12px;
        }
        .scope-card h4 {
            margin: 0 0 6px 0;
            font-size: 13px;
            color: #1e293b;
            font-weight: bold;
        }
        .scope-card p {
            margin: 0;
            font-size: 12.5px;
            color: #475569;
            line-height: 1.5;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0 25px 0;
            font-size: 13px;
        }
        th {
            background-color: ${primaryColor};
            color: #ffffff;
            text-align: left;
            padding: 10px 12px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .kpi-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 11px;
        }
        .kpi-excellent { background-color: #d1fae5; color: #065f46; }
        .kpi-good { background-color: #dbeafe; color: #1e40af; }
        .kpi-average { background-color: #fef3c7; color: #92400e; }
        
        .task-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .task-item {
            display: flex;
            align-items: flex-start;
            padding: 10px;
            border: 1px solid #f1f5f9;
            border-radius: 8px;
            margin-bottom: 8px;
            background: #ffffff;
        }
        .task-status {
            margin-right: 12px;
            font-weight: bold;
            font-size: 14px;
        }
        .task-details h5 {
            margin: 0 0 2px 0;
            font-size: 13px;
            color: #1e293b;
        }
        .task-details p {
            margin: 0;
            font-size: 11.5px;
            color: #64748b;
        }
        .footer-note {
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
        }
        .security-box {
            background-color: #fff1f2;
            border: 1px solid #ffe4e6;
            border-radius: 12px;
            padding: 15px 20px;
            margin-top: 25px;
        }
        .security-box h4 {
            margin: 0 0 8px 0;
            color: #9f1239;
            font-size: 13px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .security-box ul {
            margin: 0;
            padding-left: 20px;
            font-size: 12px;
            color: #4c0519;
        }
        .security-box li {
            margin-bottom: 5px;
        }
        @media print {
            body {
                background-color: #ffffff;
                padding: 0;
            }
            .container {
                box-shadow: none;
                border: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <h1>Hồ sơ năng lực & KPIs vị trí</h1>
                <p>Hệ thống Quản lý Nhân sự & Phục vụ Hoạch định Lãnh đạo</p>
            </div>
            <div class="badge-tag">${member.tag}</div>
        </div>

        <div class="grid-info">
            <div class="info-item">
                <div class="info-label">Họ và tên nhân sự</div>
                <div class="info-value">${member.name}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Mã vị trí / code</div>
                <div class="info-value" style="font-family: monospace;">${member.code || '[Chưa định nghĩa]'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Chức danh / Vai trò</div>
                <div class="info-value">${member.role}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Email & SĐT liên hệ</div>
                <div class="info-value" style="font-size: 12px;">${member.email || 'N/A'} | ${member.phone || 'N/A'}</div>
            </div>
        </div>

        <div class="section-title">I. Phạm vi trách nhiệm vị trí (Job Scopes)</div>
        <div class="scope-card" style="border-left: 4px solid ${primaryColor};">
            <h4>1. Công việc cốt lõi chính (Main Scope)</h4>
            <p>${member.mainScope}</p>
        </div>
        <div class="scope-card" style="border-left: 4px solid #64748b;">
            <h4>2. Công việc bổ trợ phụ (Sub Scope)</h4>
            <p>${member.subScope}</p>
        </div>
        <div class="scope-card" style="border-left: 4px solid #94a3b8;">
            <h4>3. Phạm vi phối hợp & Hỗ trợ (Support Scope)</h4>
            <p>${member.supportScope}</p>
        </div>

        <div class="section-title">II. Quy trình công việc hằng ngày</div>
        <ul class="task-list">`;

    member.tasks.forEach(task => {
      const statusIcon = task.completed ? '🟢' : '🟡';
      const statusText = task.completed ? 'Đã hoàn thành' : 'Đang triển khai';
      html += `
            <li class="task-item">
                <div class="task-status">${statusIcon}</div>
                <div class="task-details">
                    <h5>${task.title} <span style="font-size: 10px; color: #94a3b8; font-weight: normal;">(${task.type === 'daily' ? 'Hàng ngày' : 'Hỗ trợ/Định kỳ'})</span></h5>
                    <p>${task.description} | Trạng thái: <strong>${statusText}</strong></p>
                </div>
            </li>`;
    });

    html += `
        </ul>`;

    if (weeklyTasks.length > 0) {
      html += `
        <div class="section-title">III. Nhiệm vụ định kỳ hằng tuần</div>
        <ul style="font-size: 12.5px; padding-left: 20px; color: #475569; line-height: 1.8;">`;
      weeklyTasks.forEach(wt => {
        html += `<li>${wt}</li>`;
      });
      html += `</ul>`;
    }

    html += `
        <div class="section-title">IV. Khung chỉ số SMART KPI thực tế</div>
        <table>
            <thead>
                <tr>
                    <th>Chỉ số KPI</th>
                    <th>Chỉ tiêu Cam kết</th>
                    <th style="text-align: center;">Tỷ trọng</th>
                    <th style="text-align: center;">Thực tế đạt</th>
                    <th style="text-align: center;">Đơn vị</th>
                    <th style="text-align: center;">Hiệu suất</th>
                </tr>
            </thead>
            <tbody>`;

    member.kpis.forEach(kpi => {
      const rate = Math.round(calculateKPICompletion(kpi));
      const rateClass = rate >= 100 ? 'kpi-excellent' : rate >= 80 ? 'kpi-good' : 'kpi-average';
      const currentFormatted = kpi.unit === 'VND' ? formatCurrency(kpi.currentValue).replace(/\s?₫/, '') : kpi.currentValue.toLocaleString('vi-VN');
      html += `
                <tr>
                    <td style="font-weight: 600; color: #1e293b;">${kpi.name}</td>
                    <td>${kpi.target}</td>
                    <td style="text-align: center; font-weight: bold;">${kpi.weight}%</td>
                    <td style="text-align: center; font-family: monospace;">${currentFormatted}</td>
                    <td style="text-align: center; color: #64748b;">${kpi.unit}</td>
                    <td style="text-align: center;">
                        <span class="kpi-badge ${rateClass}">${rate}%</span>
                    </td>
                </tr>`;
    });

    html += `
            </tbody>
        </table>

        <div class="section-title">V. Khung thu nhập đề xuất</div>
        <div class="grid-info" style="background: ${secondaryColor}; border: 1px solid #bfdbfe;">
            <div class="info-item">
                <div class="info-label" style="color: ${primaryColor};">Mức lương cơ bản đề xuất</div>
                <div class="info-value" style="color: ${primaryColor}; font-size: 16px;">
                    ${formatCurrency(member.baseSalaryMin).replace(',000,000', 'M').replace(/\s?₫/, '')} - ${formatCurrency(member.baseSalaryMax).replace(',000,000', 'M').replace(/\s?₫/, '')} / Tháng
                </div>
            </div>
            <div class="info-item">
                <div class="info-label" style="color: ${primaryColor};">Tổng thu nhập dự kiến (gồm KPI)</div>
                <div class="info-value" style="color: ${primaryColor}; font-size: 16px;">
                    ${formatCurrency(member.estimatedTotalMin).replace(',000,000', 'M').replace(/\s?₫/, '')} - ${formatCurrency(member.estimatedTotalMax).replace(',000,000', 'M').replace(/\s?₫/, '')} / Tháng
                </div>
            </div>
        </div>

        <div class="security-box">
            <h4>⚠️ Quy chế Vận hành mạng xã hội & Bảo mật tài khoản</h4>
            <ul>
                <li>Bắt buộc bật <strong>mã xác thực 2 lớp (2FA)</strong> qua ứng dụng Authenticator, sao lưu mã dự phòng an toàn.</li>
                <li>Không chia sẻ quyền Admin trực tiếp; cấp quyền thông qua hệ thống Trình quản lý Doanh nghiệp (BM) chuẩn hóa.</li>
                <li>Hệ thống Seeding (như clone, via MaxCare) bắt buộc vận hành qua <strong>Proxy IP tĩnh sạch</strong> để phòng ngừa checkpoint.</li>
                <li>Kiểm duyệt chặt chẽ bản quyền âm nhạc, từ ngữ nhạy cảm tránh bị đánh gậy hoặc khóa trang fanpage doanh nghiệp.</li>
            </ul>
        </div>

        <div class="footer-note">
            Báo cáo Hồ sơ năng lực được kết xuất tự động từ hệ thống quản trị nhóm Media Fugalo.<br>
            Ngày kết xuất: ${new Date().toLocaleDateString('vi-VN')} | Đăng ký tài khoản: ${member.email || 'Hệ thống'}
        </div>
    </div>
</body>
</html>`;
    return html;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    const content = generateHTML();
    downloadFile(content, `Ho_So_Vi_Tri_${member.id}.html`, 'text/html');
  };

  const handleDownloadMD = () => {
    const content = generateMarkdown();
    downloadFile(content, `Ho_So_Vi_Tri_${member.id}.md`, 'text/markdown');
  };

  const handlePrint = () => {
    // Generate styled print preview
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateHTML());
      printWindow.document.close();
      printWindow.focus();
      // Add small delay to let graphics/styles render
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert('Vui lòng cho phép popup để hiển thị giao diện In ấn hồ sơ vị trí.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Prompt button */}
      <button
        onClick={() => setIsOpen(true)}
        className={variant === 'mini'
          ? "h-7 w-7 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-500 border border-slate-200 hover:border-blue-200 transition cursor-pointer"
          : "flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/10 hover:shadow-lg cursor-pointer"
        }
        title={`Xuất hồ sơ vị trí ${member.name}`}
        id={`dossier-export-btn-${member.id}`}
      >
        <FileText className={variant === 'mini' ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {variant !== 'mini' && <span>Xuất File Hồ sơ</span>}
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    Xuất hồ sơ nhân lực vị trí
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      {member.name}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Tải file tài liệu đầy đủ các mảng công việc, KPIs & lương để trình duyệt lãnh đạo.</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Layout body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/40">
              
              {/* Left Column: Actions & Advice (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* 1. Theme Configuration */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cấu hình Giao diện file</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setExportTheme('modern')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        exportTheme === 'modern'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      🔷 Xanh Hiện đại
                    </button>
                    <button
                      onClick={() => setExportTheme('classic')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        exportTheme === 'classic'
                          ? 'bg-slate-900 text-slate-100 border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      ⬛ Classic Đen tối giản
                    </button>
                  </div>
                </div>

                {/* 2. Download Core Actions */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Định dạng file tải xuống</span>
                  <div className="space-y-2">
                    {/* HTML / Word compatible download */}
                    <button
                      onClick={handleDownloadHTML}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer shadow-sm"
                    >
                      <span className="flex items-center gap-1.5">
                        <Download className="h-4 w-4" />
                        Tải file báo cáo (.HTML)
                      </span>
                      <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-mono font-normal">Đẹp nhất / Mở bằng Word</span>
                    </button>

                    {/* Markdown download */}
                    <button
                      onClick={handleDownloadMD}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        Tải tệp văn bản (.MD)
                      </span>
                      <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono font-normal">Gọn nhẹ</span>
                    </button>

                    {/* Print PDF directly */}
                    <button
                      onClick={handlePrint}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Printer className="h-4 w-4 text-slate-500" />
                        In ấn / Lưu File PDF
                      </span>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-normal">Phổ biến</span>
                    </button>

                    {/* Copy Markdown to Clipboard */}
                    <button
                      onClick={copyToClipboard}
                      className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span>Đã sao chép Markdown!</span>
                        </>
                      ) : (
                        <>
                          <span>Sao chép dạng văn bản</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Leadership Submission Advisory */}
                <div className="bg-blue-50/50 p-4.5 rounded-2xl border border-blue-100 space-y-2.5 text-xs text-slate-600 leading-relaxed">
                  <h4 className="font-extrabold text-blue-800 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    💡 Hướng dẫn trình Lãnh đạo
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Khi trình bày hồ sơ vị trí này cho cấp trên, anh có thể áp dụng các bước:
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside text-[10.5px]">
                    <li>Dùng <strong>File HTML</strong> để nộp qua Zalo/Email. Lãnh đạo nhấp đúp là xem trực tiếp trên trình duyệt máy tính cực kỳ bóng bẩy.</li>
                    <li>Sử dụng chức năng <strong>Lưu file PDF (In ấn)</strong> để lưu thành tệp hồ sơ lưu trữ chính thức dạng văn bản cứng.</li>
                    <li>Có thể kéo trực tiếp file <strong>.HTML</strong> đã tải vào <strong>Microsoft Word</strong> hoặc <strong>Google Docs</strong> để tùy chỉnh thêm chữ ký, đóng dấu công ty cực kỳ linh hoạt!</li>
                  </ul>
                </div>

              </div>

              {/* Right Column: Live Dossier Preview (8 cols) */}
              <div className="lg:col-span-8 flex flex-col h-full space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Xem trước nội dung kết xuất</span>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-y-auto max-h-[50vh] lg:max-h-[60vh] space-y-6">
                  
                  {/* Header info card */}
                  <div className="border-b border-slate-150 pb-4 flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                        {member.tag}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-800 mt-1">{member.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                    </div>
                    {member.code && (
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                        {member.code}
                      </span>
                    )}
                  </div>

                  {/* Contact Block */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{member.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{member.phone || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Scopes Section */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      I. Phạm vi trách nhiệm chính
                    </h5>
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl border border-slate-200 text-xs">
                        <strong className="text-slate-800 text-[11px] block mb-1">🎯 1. Nhiệm vụ trọng tâm chính (Main Scope)</strong>
                        <span className="text-slate-600 leading-relaxed block">{member.mainScope}</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-200 text-xs">
                        <strong className="text-slate-800 text-[11px] block mb-1">📋 2. Nhiệm vụ chuyên môn phụ (Sub Scope)</strong>
                        <span className="text-slate-600 leading-relaxed block">{member.subScope}</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-200 text-xs">
                        <strong className="text-slate-800 text-[11px] block mb-1">🤝 3. Phạm vi phối hợp (Support Scope)</strong>
                        <span className="text-slate-600 leading-relaxed block">{member.supportScope}</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Tasks Section */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ListTodo className="h-4 w-4 text-slate-400" />
                      II. Quy trình nhiệm vụ hằng ngày ({member.tasks.length} việc)
                    </h5>
                    <div className="space-y-1.5">
                      {member.tasks.map((task, idx) => (
                        <div key={task.id} className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs text-slate-600 leading-relaxed">
                          <span className="text-slate-400 font-bold shrink-0">{idx + 1}.</span>
                          <div>
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              {task.title}
                              <span className="font-mono text-[9px] text-slate-400 font-normal">
                                ({task.type === 'daily' ? 'Hàng ngày' : 'Hỗ trợ'})
                              </span>
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">{task.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Routines Section */}
                  {weeklyTasks.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <UserCheck className="h-4 w-4 text-slate-400" />
                        III. Đầu việc định kỳ hằng tuần
                      </h5>
                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600 leading-relaxed">
                        {weeklyTasks.map((wt, idx) => (
                          <li key={idx} className="marker:text-blue-500">{wt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* KPIs Section */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-slate-400" />
                      IV. Chỉ số SMART KPI & Tiến độ hiện tại
                    </h5>
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200 text-[10px] uppercase">
                          <tr>
                            <th className="p-2.5 text-slate-500 bg-transparent">Chỉ số KPI</th>
                            <th className="p-2.5 text-slate-500 bg-transparent text-center">Tỷ trọng</th>
                            <th className="p-2.5 text-slate-500 bg-transparent text-center">Mục tiêu</th>
                            <th className="p-2.5 text-slate-500 bg-transparent text-center font-mono">Đã đạt</th>
                            <th className="p-2.5 text-slate-500 bg-transparent text-center">Tỷ lệ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {member.kpis.map(kpi => {
                            const rate = Math.round(calculateKPICompletion(kpi));
                            const currentFormatted = kpi.unit === 'VND' ? formatCurrency(kpi.currentValue).replace(/\s?₫/, 'đ') : kpi.currentValue.toLocaleString('vi-VN');
                            return (
                              <tr key={kpi.id} className="hover:bg-slate-50/50">
                                <td className="p-2.5 font-bold text-slate-700">{kpi.name}</td>
                                <td className="p-2.5 text-center font-bold text-slate-500">{kpi.weight}%</td>
                                <td className="p-2.5 text-center text-slate-600">{kpi.target}</td>
                                <td className="p-2.5 text-center font-mono text-slate-600">{currentFormatted}</td>
                                <td className="p-2.5 text-center">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getKPIColor(rate)}`}>
                                    {rate}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Salary section */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      🪙 V. Cơ cấu tài chính đề xuất
                    </h5>
                    <div className="grid grid-cols-2 gap-4 bg-blue-50/20 p-4 rounded-xl border border-blue-100 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Lương cơ bản</span>
                        <div className="font-mono font-bold text-blue-600 text-sm">
                          {formatCurrency(member.baseSalaryMin)} - {formatCurrency(member.baseSalaryMax)}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Thu nhập gồm KPI</span>
                        <div className="font-mono font-bold text-blue-600 text-sm">
                          {formatCurrency(member.estimatedTotalMin)} - {formatCurrency(member.estimatedTotalMax)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="bg-red-50/30 border border-red-100 p-4 rounded-xl space-y-2 text-xs">
                    <strong className="text-red-800 text-[11px] block uppercase">⚠️ Nguyên tắc vận hành mạng xã hội bắt buộc</strong>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                      <li>Bật <strong>mã xác thực 2 lớp (2FA)</strong> cho toàn bộ tài sản số của công ty.</li>
                      <li>Phân cấp quyền nhân viên an toàn (Hạn chế tối đa cấp quyền Quản trị viên trực tiếp).</li>
                      <li>Vận hành Nick Seeding bằng <strong>Proxy tĩnh IP sạch</strong> để chống quét hàng loạt.</li>
                      <li>Kiểm soát kỹ lưỡng vấn đề bản quyền âm nhạc và từ khóa cấm của thuật toán quảng cáo.</li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-150 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
