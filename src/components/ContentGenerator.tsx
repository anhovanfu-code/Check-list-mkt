import React, { useState } from 'react';
import { Personnel } from '../types';
import { Sparkles, Send, Copy, Check, Eye, HelpCircle, FileText, AlertCircle } from 'lucide-react';

interface ContentGeneratorProps {
  personnelList: Personnel[];
  selectedMember: Personnel;
}

export default function ContentGenerator({ personnelList, selectedMember }: ContentGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('script');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sample quick-topics based on user's media group specialties
  const presets: { [key: string]: string[] } = {
    an: [
      'Kế hoạch ngân sách Marketing quý tới gửi Ban giám đốc',
      'Chiến lược tăng trưởng ROAS và tối ưu hóa CPL tổng thể',
      'Báo cáo hiệu quả chiến dịch xây dựng thương hiệu Long Bùi',
      'Kế hoạch phân bổ KPIs và nguồn lực cho Team Media'
    ],
    tan: [
      'Gỗ gụ mật Quảng Bình lâu năm',
      'Đại tự cuốn thư dát vàng 24K',
      'Tâm sự đam mê đồ gỗ mỹ nghệ của Anh Long',
      'Cách phân biệt sập gụ thật và giả'
    ],
    truong: [
      'Đồng hồ Rolex Datejust kim cương thiên nhiên',
      'Túi xách Hermes Birkin da cá sấu',
      'Nước hoa Clive Christian đắt nhất thế giới',
      'Review chi tiết thắt lưng Louis Vuitton chính hãng'
    ],
    panh: [
      'Kịch bản livestream xả hàng túi xách VIP',
      'Mẫu seeding hỏi giá, đặt mua tự nhiên',
      'Cách setup âm thanh mic chuẩn khi live',
      'Mẫu seeding kích thích tạo hiệu ứng đám đông'
    ],
    nhan: [
      'Ý tưởng seeding video ngắn đồ nội thất',
      'Cấu hình chạy buff comment an toàn bằng MaxCare',
      'Kịch bản seeding tăng mắt xem livestream',
      'Mẫu kịch bản trả lời nhanh inbox khách hàng'
    ],
    chau: [
      'Mẫu content chạy ads Facebook đồ gỗ mỹ nghệ',
      'Mẫu content chạy ads TikTok túi hàng hiệu',
      'Chiến lược quảng cáo tối ưu CPM và CPL thấp',
      'Mẫu đăng social định hướng thương hiệu Long Bùi'
    ],
    duy: [
      'Quy trình sản xuất media 5 bước của team',
      'Tiêu chí đánh giá chất lượng video Vlog chuẩn',
      'Kế hoạch cải tiến công cụ livestream & seeding',
      'Chương trình đào tạo dựng phim ngắn cho nhân viên'
    ],
    kiem: [
      'Quy trình rà soát rủi ro nội dung trước phát sóng',
      'Tiêu chuẩn kịch bản truyền thông Anh Long',
      'Cách kiểm duyệt hình ảnh poster Fugalo',
      'Brief sản xuất video beauty hàng hiệu'
    ],
    long: [
      'Setup ánh sáng chụp beauty túi hàng hiệu',
      'Phương án backup dữ liệu thẻ nhớ khi quay',
      'Kịch bản setup góc quay Vlog Long Bùi',
      'Kỹ thuật đồng bộ âm thanh mic không dây'
    ]
  };

  const currentPresets = presets[selectedMember.id] || presets['tan'];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGeneratedResult('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedMember.role,
          personnelName: selectedMember.name,
          topic: topic,
          type: contentType
        })
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedResult(data.result);
      } else {
        setErrorMessage(data.error || 'Đã xảy ra lỗi khi tạo nội dung.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple, elegant custom markdown formatter to render response cleanly
  const parseMarkdown = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2 first:mt-0 font-sans border-l-2 border-blue-600 pl-2">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-blue-600 mt-5 mb-2 first:mt-0 font-sans border-b border-slate-200 pb-1">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-bold text-blue-600 mt-6 mb-3 first:mt-0 font-sans">{line.replace('# ', '')}</h2>;
      }

      // Bullets
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const cleanText = line.replace(/^[-*]\s+/, '');
        // Bold helper within bullet
        const parts = cleanText.split('**');
        return (
          <li key={idx} className="text-xs text-slate-600 ml-4 list-disc py-1 font-sans">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-blue-600 font-bold">{part}</strong> : part)}
          </li>
        );
      }

      // Strong paragraphs
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={idx} className="text-xs text-slate-600 py-1 leading-relaxed font-sans">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-blue-600 font-bold">{part}</strong> : part)}
          </p>
        );
      }

      // Normal lines or spacing
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return <p key={idx} className="text-xs text-slate-600 py-0.5 leading-relaxed font-sans">{line}</p>;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration Area (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Sáng tạo ý tưởng & Kịch bản AI
            </h3>
            <p className="text-xs text-slate-500 mt-1">Trợ lý trí tuệ nhân tạo hỗ trợ sản xuất nội dung nhanh chóng</p>
          </div>

          {/* Member Selection Display */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center gap-3">
            <img src={selectedMember.avatar} alt={selectedMember.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">{selectedMember.name}</div>
              <div className="text-xs text-slate-500 leading-normal">{selectedMember.role}</div>
            </div>
          </div>

          {/* Output Format Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Định dạng nội dung</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setContentType('script')}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold border text-center transition cursor-pointer ${
                  contentType === 'script'
                    ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                Kịch bản video / Live
              </button>
              <button
                onClick={() => setContentType('seeding')}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold border text-center transition cursor-pointer ${
                  contentType === 'seeding'
                    ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                Seeding & Comments
              </button>
              <button
                onClick={() => setContentType('ad-copy')}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold border text-center transition cursor-pointer ${
                  contentType === 'ad-copy'
                    ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                Mẫu viết quảng cáo Ads
              </button>
              <button
                onClick={() => setContentType('checklist')}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold border text-center transition cursor-pointer ${
                  contentType === 'checklist'
                    ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                Quy trình & Checklist
              </button>
            </div>
          </div>

          {/* Quick Preset Topics */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chủ đề gợi ý gợi ý riêng</label>
            <div className="flex flex-wrap gap-2">
              {currentPresets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setTopic(p)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition cursor-pointer text-left leading-tight w-full"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nhập chủ đề tùy chỉnh</label>
            <div className="relative">
              <textarea
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 h-20 placeholder-slate-400"
                placeholder="Nhập bất kỳ sản phẩm đồ cổ, đồ hiệu hoặc nghiệp vụ IT nào..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-450 transition-colors text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Trí tuệ nhân tạo đang phân tích...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Sáng tạo nội dung với Gemini
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display Area (7 cols) */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-blue-600" />
              Kết quả tạo bởi AI
            </span>
            {generatedResult && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    Đã sao chép!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Sao chép nội dung
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-20">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  <div className="h-2 w-2 bg-blue-600 rounded-full delay-75" />
                  <div className="h-2 w-2 bg-blue-600 rounded-full delay-150" />
                </div>
                <p className="text-xs text-slate-500 italic">Đang tổng hợp kịch bản, ý tưởng seeding và phân bổ chỉ số...</p>
              </div>
            ) : errorMessage ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-rose-600 space-y-2">
                <AlertCircle className="h-8 w-8 text-rose-600" />
                <p className="text-xs leading-relaxed max-w-sm">{errorMessage}</p>
              </div>
            ) : generatedResult ? (
              <div className="prose max-w-none text-slate-700 space-y-2 select-all">
                {parseMarkdown(generatedResult)}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-20">
                <Sparkles className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-xs font-semibold">Chọn một định dạng, nhập chủ đề của bạn và nhấp nút để tạo.</p>
                <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-normal">
                  Sử dụng công nghệ Gemini 3.5 Flash để bám sát chuyên môn của đồ nội thất, đồ hiệu cổ và kỹ thuật IT.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
