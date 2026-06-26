import { Personnel } from './types';

export const initialPersonnelData: Personnel[] = [
  {
    id: 'an',
    name: 'Hồ Văn An',
    role: 'Trưởng phòng Marketing kiêm Tech Lead (MKT & IT Solutions)',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    tag: 'MKT & Công nghệ (AI/IT)',
    baseSalaryMin: 25000000,
    baseSalaryMax: 35000000,
    estimatedTotalMin: 40000000,
    estimatedTotalMax: 65000000,
    mainScope: 'Hoạch định chiến lược Marketing, trực tiếp thiết kế giải pháp AI, lập trình phần mềm và thiết lập kiến trúc bảo mật tài sản số (tài khoản doanh nghiệp, Fanpage, Business Manager).',
    subScope: 'Vận hành hạ tầng IT, quản trị Server, đồng bộ API KiotViet và bảo vệ hệ thống tài khoản tránh bị checkpoint/hack.',
    supportScope: 'Tự động hóa quy trình sản xuất của toàn bộ Media Team bằng AI (Auto-subtitle, Auto-seeding, AI-agent kịch bản).',
    email: 'anhovan.fu@gmail.com',
    phone: '0939 81 00 86',
    code: '[TP.MKT-kiem-TechLead]',
    tasks: [
      { id: 'an_mkt_1', title: 'Lập chỉ tiêu KPIs & Phân bổ ngân sách Marketing', type: 'daily', frequency: 'weekly', category: 'Weekly', description: 'Hoạch định chỉ tiêu KPI chi tiết, phân chia ngân sách chạy quảng cáo hàng tuần, hàng tháng cho các showroom và toàn bộ media team.', completed: false },
      { id: 'an_mkt_2', title: 'Kiểm duyệt nội dung vĩ mô & Định hướng kịch bản', type: 'daily', frequency: 'daily', category: 'Daily', description: 'Trực tiếp duyệt kịch bản cốt lõi, kiểm duyệt chất lượng nội dung và hình ảnh của anh Long & Công ty Fugalo để định vị đúng thương hiệu.', completed: false },
      { id: 'an_mkt_3', title: 'Giám sát & Tối ưu chi phí CPL chiến dịch', type: 'daily', frequency: 'daily', category: 'Daily', description: 'Theo dõi chỉ số chuyển đổi, kiểm soát giá thầu quảng cáo từ Châu, tối ưu chi phí Lead (CPL) đạt mục tiêu tối ưu < 140,000 VND.', completed: false },
      { id: 'an_mkt_4', title: 'Báo cáo hiệu quả kinh doanh & Chỉ số ROAS', type: 'daily', frequency: 'weekly', category: 'Weekly', description: 'Thống kê hiệu quả doanh số, đối soát doanh thu KiotViet và đo lường tỷ suất hoàn vốn quảng cáo (ROAS) báo cáo trực tiếp cho Ban Giám đốc.', completed: false },
      { id: 'an_mkt_5', title: 'Họp giao ban, điều phối & Tháo gỡ khó khăn team MKT', type: 'support', frequency: 'weekly', category: 'Weekly', description: 'Họp định kỳ để điều phối tiến độ, hướng dẫn tối ưu kỹ thuật quảng cáo cho Châu, định hướng creative cho Duy & Kiêm, gỡ lỗi tool seeding cho Nhân.', completed: false },
      { id: 'an_1', title: 'Giám sát vận hành IT, Server & Cloud', type: 'daily', frequency: 'daily', category: 'Daily', description: 'Đảm bảo server NAS hoạt động ổn định, backup dữ liệu an toàn, hệ thống mạng nội bộ luôn thông suốt.', completed: false },
      { id: 'an_2', title: 'Đồng bộ & Kiểm tra dữ liệu KiotViet', type: 'daily', frequency: 'daily', category: 'Daily', description: 'Kiểm tra API kết nối, đồng bộ dữ liệu tồn kho, đơn hàng và đối soát doanh thu tự động về dashboard.', completed: false },
      { id: 'an_3', title: 'Rà soát hiệu suất AI & Automation', type: 'daily', frequency: 'daily', category: 'Daily', description: 'Giám sát hoạt động của các AI Agent lập kịch bản, tool tự động tải video và chatbot tự động.', completed: false },
      { id: 'an_4', title: 'Phát triển & Bảo trì phần mềm nội bộ', type: 'support', frequency: 'weekly', category: 'Weekly', description: 'Lập trình tính năng mới cho các tool nội bộ, tối ưu mã nguồn và fix lỗi phát sinh.', completed: false },
      { id: 'an_6', title: 'Quản trị bảo mật tài khoản & Chống hack tài sản số', type: 'support', frequency: 'monthly', category: 'Monthly', description: 'Thiết lập xác thực 2 lớp (2FA), lưu trữ mã khẩn cấp (Backup codes), kiểm tra định kỳ quyền quản trị Business Manager (BM) và phân quyền nhân sự an toàn.', completed: false },
      { id: 'an_7', title: 'Kháng nghị & Khôi phục khi gặp sự cố quảng cáo', type: 'support', frequency: 'weekly', category: 'Weekly', description: 'Trực tiếp thực hiện gửi yêu cầu kháng nghị (appeal) khi tài khoản quảng cáo hoặc bài viết bị chặn nhầm, chủ trì xử lý checkpoint hệ thống.', completed: false },
      { id: 'an_8', title: 'Quản lý Proxy & Bảo mật nick Seeding', type: 'support', frequency: 'weekly', category: 'Weekly', description: 'Mua và phân bổ proxy IP tĩnh sạch cho đội seeding, backup token/cookie và trực tiếp mở khóa các tài khoản clone quan trọng.', completed: false }
    ],
    kpis: [
      { id: 'an_kpi_cpl', name: 'Chi phí Lead (CPL) Toàn hệ thống', target: 'CPL < 140,000 VND', weight: 20, unit: 'VND', currentValue: 132000, targetValue: 140000 },
      { id: 'an_kpi_uptime', name: 'Độ ổn định hệ thống IT & Server', target: 'Uptime > 99.9%', weight: 15, unit: '%', currentValue: 99.8, targetValue: 99.9 },
      { id: 'an_kpi_kiotviet', name: 'Độ chính xác đồng bộ KiotViet', target: 'Sai lệch 0%', weight: 15, unit: '%', currentValue: 100, targetValue: 100 },
      { id: 'an_kpi_ai', name: 'Hiệu quả triển khai hệ thống AI & Tooling', target: 'Đạt 100% KPI tự động hóa', weight: 20, unit: '%', currentValue: 95, targetValue: 100 },
      { id: 'an_kpi_revenue', name: 'Doanh thu Tổng Công ty Cam kết (KiotViet)', target: '10 Tỷ VND / Tháng', weight: 30, unit: 'VND', currentValue: 10000000000, targetValue: 10000000000 }
    ]
  },
  {
    id: 'chau',
    name: 'Nguyễn Hồ Á Châu',
    role: 'Chuyên viên Vận hành quảng cáo & Social Content',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    tag: 'Media & Quảng cáo',
    baseSalaryMin: 12000000,
    baseSalaryMax: 16000000,
    estimatedTotalMin: 16000000,
    estimatedTotalMax: 30000000,
    mainScope: 'Trực tiếp thiết lập, quản lý và tối ưu hóa ngân sách các chiến dịch quảng cáo; lập kế hoạch và trực tiếp xuất bản nội dung lên toàn bộ kênh Social thương hiệu.',
    subScope: 'Phối hợp cùng đội ngũ Content Creator biên tập kịch bản, kiểm duyệt hình ảnh/âm thanh đạt chuẩn chính sách và định hướng hình ảnh thương hiệu.',
    supportScope: 'Phối hợp cùng Tech Lead thực hiện các chiến dịch truyền thông nội bộ, tổ chức sự kiện đặc biệt và quản trị bảo mật các tài nguyên tài khoản.',
    email: 'chau.nha@fugalo.vn',
    phone: '0889805815',
    code: '[Marketing-Ads-Social]',
    tasks: [
      { id: 'chau_1', title: 'Thiết lập & Tối ưu quảng cáo', type: 'daily', category: 'Daily', description: 'Theo dõi chỉ số CPL, ROAS, điều chỉnh giá thầu và phân bổ ngân sách tối ưu cho các chiến dịch Ads.', completed: false },
      { id: 'chau_2', title: 'Biên tập & Lên lịch Social Content', type: 'daily', category: 'Daily', description: 'Xây dựng kế hoạch, trực tiếp viết bài và lên lịch đăng bài cho các kênh mạng xã hội thương hiệu.', completed: false },
      { id: 'chau_3', title: 'Kiểm soát rủi ro kịch bản & Bản quyền', type: 'daily', category: 'Daily', description: 'Rà soát kịch bản, hình ảnh, nhạc nền của đội Creator tránh dính bản quyền hoặc từ khóa cấm của nền tảng.', completed: false },
      { id: 'chau_4', title: 'Vận hành nội dung mảng Đồ Cổ', type: 'daily', category: 'Daily', description: 'Tiếp nhận video từ Tân, biên tập nội dung bài đăng đồ cổ và trực tiếp đăng tải lên Fanpage Fugalo.', completed: false },
      { id: 'chau_5', title: 'Vận hành nội dung mảng Hàng Hiệu', type: 'daily', category: 'Daily', description: 'Tiếp nhận video từ Trường, viết bài quảng bá hàng hiệu và xuất bản lên các kênh Social Luxury.', completed: false }
    ],
    kpis: [
      { id: 'chau_kpi_1', name: 'Chi phí trên mỗi lead (CPL)', target: '< 150,000 VND', weight: 30, unit: 'VND', currentValue: 135000, targetValue: 150000 },
      { id: 'chau_kpi_2', name: 'Tỷ lệ hoàn vốn quảng cáo (ROAS)', target: '> 3.5x', weight: 30, unit: 'x', currentValue: 3.8, targetValue: 3.5 },
      { id: 'chau_kpi_3', name: 'Tỷ lệ nhấp chuột (CTR)', target: '> 2.0%', weight: 20, unit: '%', currentValue: 2.2, targetValue: 2.0 },
      { id: 'chau_kpi_4', name: 'Tương tác & hiển thị Social', target: '100,000 Reach', weight: 20, unit: 'Reach', currentValue: 105000, targetValue: 100000 }
    ]
  },
  {
    id: 'tan',
    name: 'Trần Nhật Tân',
    role: 'Content Creator - Đồ cổ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    tag: 'Content - Đồ cổ',
    baseSalaryMin: 8000000,
    baseSalaryMax: 15000000,
    estimatedTotalMin: 11000000,
    estimatedTotalMax: 15000000,
    mainScope: 'Sản xuất Vlog đồ cổ cho thương hiệu Long Bùi (2 clip/ngày), xuất SRT phụ đề gửi Seeding.',
    subScope: 'Chụp ảnh & quay hình beauty đồ nội thất; viết nội dung fanpage Fugalo.',
    supportScope: 'Quay chụp tại Kiot, seeding livestream bán hàng theo yêu cầu nhóm.',
    email: 'tan.tn@fugalo.vn',
    phone: '0908905565',
    code: '[Marketing-Media-Edit]',
    tasks: [
      { id: 'tan_1', title: 'Sản xuất 2 Vlog Long Bùi', type: 'daily', category: 'Daily', description: 'Setup quay và dựng hoàn chỉnh 2 video vlog đồ cổ mỗi ngày', completed: false },
      { id: 'tan_2', title: 'Xuất SRT gửi seeding', type: 'daily', category: 'Daily', description: 'Tạo file phụ đề SRT cho 2 video và gửi cho nhóm seeding', completed: false },
      { id: 'tan_3', title: 'Chụp hình beauty nội thất', type: 'daily', category: 'Daily', description: 'Chụp ảnh sản phẩm đồ gỗ nội thất độc đáo tại showroom', completed: false },
      { id: 'tan_4', title: 'Viết bài fanpage Fugalo', type: 'daily', category: 'Daily', description: 'Viết nội dung đồ cổ gửi chị Châu duyệt và lên lịch đăng', completed: false },
      { id: 'tan_5', title: 'Seeding livestream / Quay Kiot', type: 'support', category: 'Weekly', description: 'Hỗ trợ quay hình tại Kiot và đẩy tương tác livestream khi có yêu cầu', completed: false }
    ],
    kpis: [
      { id: 'tan_kpi_1', name: 'Số video xuất bản', target: '60 video/tháng', weight: 40, unit: 'Video', currentValue: 56, targetValue: 60 },
      { id: 'tan_kpi_2', name: 'Lượt xem video trung bình', target: '15,000 views/video', weight: 30, unit: 'Views', currentValue: 16200, targetValue: 15000 },
      { id: 'tan_kpi_3', name: 'Lượt tương tác fanpage', target: '5,000 Engagements', weight: 20, unit: 'Tương tác', currentValue: 4800, targetValue: 5000 },
      { id: 'tan_kpi_4', name: 'Tăng trưởng followers', target: '1,000 Followers', weight: 10, unit: 'Followers', currentValue: 1150, targetValue: 1000 }
    ]
  },
  {
    id: 'truong',
    name: 'Phạm Lê Nhật Trường',
    role: 'Content Creator - Hàng hiệu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    tag: 'Content - Hàng hiệu',
    baseSalaryMin: 8000000,
    baseSalaryMax: 15000000,
    estimatedTotalMin: 11000000,
    estimatedTotalMax: 15000000,
    mainScope: 'Sản xuất Vlog hàng hiệu (2 clip/ngày), xuất SRT phụ đề gửi Seeding.',
    subScope: 'Chụp ảnh & quay video beauty sản phẩm hàng hiệu (túi xách, đồng hồ); viết nội dung các fanpage Luxury.',
    supportScope: 'Hỗ trợ quay Kiot showroom và seeding livestream theo phân công.',
    email: 'truong.pln@fugalo.vn',
    phone: '0786255969',
    code: '[Marketing-Media-Edit]',
    tasks: [
      { id: 'truong_1', title: 'Sản xuất 2 Vlog Hàng hiệu', type: 'daily', category: 'Daily', description: 'Setup quay và dựng hoàn chỉnh 2 video vlog hàng hiệu mỗi ngày', completed: false },
      { id: 'truong_2', title: 'Xuất SRT gửi seeding', type: 'daily', category: 'Daily', description: 'Tạo phụ đề SRT cho 2 video hàng hiệu gửi team seeding', completed: false },
      { id: 'truong_3', title: 'Quay video beauty hàng hiệu', type: 'daily', category: 'Daily', description: 'Quay sản phẩm túi xách, đồng hồ cao cấp theo điều phối của leader', completed: false },
      { id: 'truong_4', title: 'Viết nội dung Luxury Pages', type: 'daily', category: 'Daily', description: 'Viết nội dung đăng bài trên Long Bùi Luxury, Fugalo Long Bùi, Fugalo Rất Ổn', completed: false },
      { id: 'truong_5', title: 'Seeding livestream / Quay Kiot', type: 'support', category: 'Weekly', description: 'Tham gia hỗ trợ quay và seeding tương tác live khi có yêu cầu', completed: false }
    ],
    kpis: [
      { id: 'truong_kpi_1', name: 'Số video xuất bản', target: '60 video/tháng', weight: 40, unit: 'Video', currentValue: 58, targetValue: 60 },
      { id: 'truong_kpi_2', name: 'Lượt xem video trung bình', target: '20,000 views/video', weight: 30, unit: 'Views', currentValue: 21500, targetValue: 20000 },
      { id: 'truong_kpi_3', name: 'Lượt tương tác fanpage', target: '6,000 Engagements', weight: 20, unit: 'Tương tác', currentValue: 6300, targetValue: 6000 },
      { id: 'truong_kpi_4', name: 'Tăng trưởng followers', target: '1,500 Followers', weight: 10, unit: 'Followers', currentValue: 1400, targetValue: 1500 }
    ]
  },
  {
    id: 'panh',
    name: 'Vũ Thị Phương Anh',
    role: 'Chuyên viên Live & Seeding',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    tag: 'Live & Seeding',
    baseSalaryMin: 8000000,
    baseSalaryMax: 12000000,
    estimatedTotalMin: 10000000,
    estimatedTotalMax: 13000000,
    mainScope: 'Vận hành kỹ thuật & trực tương tác livestream bán hàng; quản lý bình luận live.',
    subScope: 'Tải video livestream lưu trữ lên hệ thống NAS của công ty.',
    supportScope: 'Nuôi dưỡng và phát triển hệ thống tài khoản seeding (MaxCare, kết bạn, xác thực nick mới).',
    email: 'anh.vtp@fugalo.vn',
    phone: '0342659358',
    code: '[Marketing-Seeding]',
    tasks: [
      { id: 'panh_1', title: 'Setup kỹ thuật Livestream', type: 'daily', category: 'Daily', description: 'Kiểm tra mic, đường truyền, ánh sáng, góc quay trước giờ phát', completed: false },
      { id: 'panh_2', title: 'Kiểm soát & Ghim bình luận', type: 'daily', category: 'Daily', description: 'Ghim bình luận, ẩn bình luận rác/tiêu cực, chặn nick giả mạo khi live', completed: false },
      { id: 'panh_3', title: 'Tải video live lên NAS', type: 'daily', category: 'Daily', description: 'Sau mỗi buổi livestream, tải file ghi hình lên hệ thống lưu trữ NAS', completed: false },
      { id: 'panh_4', title: 'Chăm sóc & Nuôi tài khoản seeding', type: 'daily', category: 'Daily', description: 'Sử dụng MaxCare buff tương tác, kết bạn, xác thực tài khoản clone mới', completed: false }
    ],
    kpis: [
      { id: 'panh_kpi_1', name: 'Hỗ trợ livestream thành công', target: '20 buổi/tháng', weight: 45, unit: 'Buổi', currentValue: 19, targetValue: 20 },
      { id: 'panh_kpi_2', name: 'Tương tác livestream', target: '500 Comments/phiên', weight: 25, unit: 'Comments', currentValue: 480, targetValue: 500 },
      { id: 'panh_kpi_3', name: 'Tỷ lệ tài khoản seeding active', target: '> 90%', weight: 20, unit: '%', currentValue: 92, targetValue: 90 },
      { id: 'panh_kpi_4', name: 'Chỉ số chặn nick rác / xử lý tiêu cực', target: '100% xử lý', weight: 10, unit: '%', currentValue: 100, targetValue: 100 }
    ]
  },
  {
    id: 'kiem',
    name: 'Lê Hoàn Kiếm',
    role: 'Điều phối Media / DOP',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    tag: 'Điều phối Media',
    baseSalaryMin: 18000000,
    baseSalaryMax: 24000000,
    estimatedTotalMin: 30000000,
    estimatedTotalMax: 35000000,
    mainScope: 'Kiểm duyệt chất lượng đầu ra (QC) hình ảnh/video theo chuẩn của Anh Long và Fugalo.',
    subScope: 'Lập kế hoạch sản xuất media và phối hợp phân công nhiệm vụ cho team sản xuất.',
    supportScope: 'Đầu mối phối hợp giữa Marketing và sản xuất media, lên ý tưởng và kịch bản truyền thông.',
    email: 'kiem.lh@fugalo.vn',
    phone: '0933338648',
    code: '[Marketing-DOP]',
    tasks: [
      { id: 'kiem_1', title: 'Kiểm duyệt QC video/hình ảnh', type: 'daily', category: 'Daily', description: 'Duyệt chất lượng khung hình, âm thanh, màu sắc của Tân/Trường/Long', completed: false },
      { id: 'kiem_2', title: 'Lập kế hoạch sản xuất tuần', type: 'daily', category: 'Weekly', description: 'Xây dựng timeline sản xuất dựa theo yêu cầu phòng Marketing và Anh Long', completed: false },
      { id: 'kiem_3', title: 'Xây dựng ý tưởng kịch bản mới', type: 'daily', category: 'Weekly', description: 'Phối hợp lên ý tưởng kịch bản cho các ấn phẩm truyền thông thương hiệu', completed: false },
      { id: 'kiem_4', title: 'Điều phối lịch quay chụp', type: 'daily', category: 'Weekly', description: 'Phân công lịch quay chụp cụ thể cho cameraman Long và team Content', completed: false }
    ],
    kpis: [
      { id: 'kiem_kpi_1', name: 'Tỷ lệ sản phẩm đạt chuẩn QC', target: '> 95%', weight: 40, unit: '%', currentValue: 97, targetValue: 95 },
      { id: 'kiem_kpi_2', name: 'Tiến độ hoàn thành đúng hạn', target: '> 90%', weight: 30, unit: '%', currentValue: 92, targetValue: 90 },
      { id: 'kiem_kpi_3', name: 'Độ chính xác ý tưởng so với brief', target: '95% match', weight: 30, unit: '%', currentValue: 96, targetValue: 95 }
    ]
  },
  {
    id: 'long',
    name: 'Phạm Minh Long',
    role: 'Cameraman / Editor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    tag: 'Cameraman & Editor',
    baseSalaryMin: 8000000,
    baseSalaryMax: 12000000,
    estimatedTotalMin: 10000000,
    estimatedTotalMax: 13000000,
    mainScope: 'Quay chụp sản phẩm gian hàng Kiot, concept túi xách, video beauty hàng hiệu.',
    subScope: 'Ghi hình các clip theo lịch trình nội bộ của Anh Long.',
    supportScope: 'Setup thiết bị quay (âm thanh, ánh sáng) và dựng ảnh/video theo yêu cầu của team Content.',
    email: 'long.pm@fugalo.vn',
    phone: '0343098873',
    code: '[Marketing-Photo]',
    tasks: [
      { id: 'long_1', title: 'Quay chụp sản phẩm Kiot', type: 'daily', category: 'Daily', description: 'Quay chụp chi tiết sản phẩm tại Kiot và showroom', completed: false },
      { id: 'long_2', title: 'Quay clip Anh Long', type: 'daily', category: 'Daily', description: 'Thực hiện quay video nội dung cá nhân của Anh Long theo lịch', completed: false },
      { id: 'long_3', title: 'Setup thiết bị âm thanh/ánh sáng', type: 'daily', category: 'Daily', description: 'Setup đèn, mic, máy quay chuẩn bị cho các lịch quay trong ngày', completed: false },
      { id: 'long_4', title: 'Hậu kỳ, edit video/poster', type: 'daily', category: 'Daily', description: 'Hậu kỳ ảnh poster, video ngắn theo yêu cầu kịch bản', completed: false }
    ],
    kpis: [
      { id: 'long_kpi_1', name: 'Số buổi quay hoàn thành', target: '25 buổi/tháng', weight: 40, unit: 'Buổi', currentValue: 26, targetValue: 25 },
      { id: 'long_kpi_2', name: 'Thời gian hậu kỳ trung bình', target: '< 12 giờ/clip', weight: 30, unit: 'Giờ', currentValue: 10.5, targetValue: 12 },
      { id: 'long_kpi_3', name: 'Đánh giá chất lượng kỹ thuật video', target: '9.0/10 điểm', weight: 30, unit: 'Điểm', currentValue: 9.2, targetValue: 9.0 }
    ]
  },
  {
    id: 'duy',
    name: 'Lê Thanh Duy',
    role: 'Trưởng nhóm Media (Team Leader)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    tag: 'Trưởng nhóm Media',
    baseSalaryMin: 14000000,
    baseSalaryMax: 18000000,
    estimatedTotalMin: 18000000,
    estimatedTotalMax: 25000000,
    mainScope: 'Quản lý toàn bộ hoạt động đội Media, lập kế hoạch tuần/tháng và theo dõi tiến độ.',
    subScope: 'Duyệt sản phẩm cuối (kiểm soát thiết kế, video, âm thanh, phụ đề, chính tả, nhận diện thương hiệu).',
    supportScope: 'Định hướng sáng tạo truyền thông (moodboard, style guide); huấn luyện chuyên môn và cải tiến đội ngũ.',
    email: 'duy.lt@fugalo.vn',
    phone: '0911046073',
    code: '[Marketing-Media-Leader]',
    tasks: [
      { id: 'duy_1', title: 'Quản lý & Theo dõi tiến độ team', type: 'daily', category: 'Daily', description: 'Giám sát tiến độ hoàn thành các đầu việc theo timeline của nhóm', completed: false },
      { id: 'duy_2', title: 'Phê duyệt sản phẩm cuối', type: 'daily', category: 'Daily', description: 'Kiểm soát kỹ thiết kế, video, âm thanh, phụ đề chính tả toàn bộ sản phẩm', completed: false },
      { id: 'duy_3', title: 'Định hướng sáng tạo & Moodboard', type: 'daily', category: 'Weekly', description: 'Xây dựng concept thiết kế, moodboard truyền thông mới', completed: false },
      { id: 'duy_4', title: 'Tổng hợp báo cáo tuần/tháng', type: 'daily', category: 'Weekly', description: 'Tổng hợp báo cáo gửi Giám đốc Marketing và Ban giám đốc', completed: false }
    ],
    kpis: [
      { id: 'duy_kpi_1', name: 'Tiến độ chiến dịch (Đạt deadline)', target: '100% đúng hạn', weight: 35, unit: '%', currentValue: 98, targetValue: 100 },
      { id: 'duy_kpi_2', name: 'Chất lượng đầu ra toàn team', target: '> 95% đạt duyệt', weight: 25, unit: '%', currentValue: 96, targetValue: 95 },
      { id: 'duy_kpi_3', name: 'Hiệu quả truyền thông tổng thể', target: 'Đạt target tháng', weight: 20, unit: '%', currentValue: 102, targetValue: 100 },
      { id: 'duy_kpi_4', name: 'Cải tiến quy trình & đào tạo', target: '1 buổi/tháng', weight: 20, unit: 'Buổi', currentValue: 1, targetValue: 1 }
    ]
  },
  {
    id: 'nhan',
    name: 'Võ Trọng Nhân',
    role: 'Nhân viên Seeding & Ads kiêm IT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    tag: 'Seeding & Ads kiêm IT',
    baseSalaryMin: 10000000,
    baseSalaryMax: 15000000,
    estimatedTotalMin: 12000000,
    estimatedTotalMax: 18000000,
    mainScope: 'Vận hành seeding (kịch bản comment, buff tương tác bài viết/video mới, điều phối nick khi livestream).',
    subScope: 'Hỗ trợ setup chiến dịch quảng cáo Facebook, TikTok theo ngân sách duyệt, giám sát CPM, CPC, CPL.',
    supportScope: 'Xử lý sự cố phần cứng/phần mềm IT cơ bản, backup dữ liệu hệ thống, đảm bảo mạng ổn định.',
    email: 'nhan.vt@fugalo.vn',
    phone: '0587958126',
    code: '[Marketing-Seeding-Leader]',
    tasks: [
      { id: 'nhan_1', title: 'Lên kịch bản comment seeding', type: 'daily', category: 'Daily', description: 'Viết mẫu comment seeding tự nhiên cho bài đăng và video mới', completed: false },
      { id: 'nhan_2', title: 'Nuôi tài khoản & Chạy tool seeding', type: 'daily', category: 'Daily', description: 'Kiểm tra tài khoản clone, via, điều khiển nick seeding livestream tăng mắt', completed: false },
      { id: 'nhan_3', title: 'Setup & Giám sát chiến dịch quảng cáo', type: 'daily', category: 'Daily', description: 'Theo dõi CPM, CPC, ROAS để báo cáo và tối ưu hóa quảng cáo', completed: false },
      { id: 'nhan_4', title: 'Bảo trì kỹ thuật IT & Network', type: 'daily', category: 'Daily', description: 'Kiểm tra hạ tầng mạng, backup dữ liệu máy chủ, hỗ trợ team media', completed: false },
      { id: 'nhan_5', title: 'Quản lý Proxy & Bảo mật nick Seeding', type: 'support', frequency: 'weekly', category: 'Weekly', description: 'Gán proxy IP sạch tĩnh cho từng nick clone/via để tránh checkpoint và hỗ trợ backup tệp token/cookie an toàn.', completed: false }
    ],
    kpis: [
      { id: 'nhan_kpi_1', name: 'Tương tác seeding tạo ra', target: '5,000 comment/tháng', weight: 35, unit: 'Comments', currentValue: 5200, targetValue: 5000 },
      { id: 'nhan_kpi_2', name: 'Tỷ lệ hoạt động hệ thống clone', target: '> 85% active', weight: 25, unit: '%', currentValue: 88, targetValue: 85 },
      { id: 'nhan_kpi_3', name: 'Hiệu quả tối ưu hóa ads (CPL)', target: '< 160,000 VND', weight: 20, unit: 'VND', currentValue: 145000, targetValue: 160000 },
      { id: 'nhan_kpi_4', name: 'Thời gian giải quyết sự cố IT', target: '< 1 giờ', weight: 20, unit: 'Giờ', currentValue: 0.8, targetValue: 1 }
    ]
  },
  {
    id: 'thinh',
    name: 'Đào Thị Như Thịnh',
    role: 'Nhân sự Công ty (Giám sát phòng Marketing)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    tag: 'Giám sát / Monitor',
    baseSalaryMin: 0,
    baseSalaryMax: 0,
    estimatedTotalMin: 0,
    estimatedTotalMax: 0,
    mainScope: 'Tài khoản nhân sự công ty được ủy quyền đăng nhập để theo dõi, giám sát tiến trình, lịch trình công việc và chỉ số hiệu suất (KPIs) của phòng Marketing.',
    subScope: 'Hệ thống tự động phân quyền Chỉ Xem (View-only) đối với toàn bộ dữ liệu, bảng lương giả định và tiến độ nhiệm vụ.',
    supportScope: 'Mọi ý kiến đóng góp hoặc phản hồi chuyên môn vui lòng trao đổi trực tiếp với Trưởng phòng Hồ Văn An.',
    email: 'thinh.dtn@fugalo.vn',
    phone: '0938690664',
    code: '[COMPANY-SUPERVISOR]',
    tasks: [],
    kpis: []
  }
];
