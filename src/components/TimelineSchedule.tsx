import React, { useState } from 'react';
import { Personnel } from '../types';
import { 
  Clock, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  CheckSquare, 
  ArrowRight,
  Search,
  Inbox,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

interface TimelineScheduleProps {
  personnelList: Personnel[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
}

// Compact Hourly Activity Database (08:00 - 18:00) mapped directly to core roles and guidelines
const hourlyActivities: { 
  [key: string]: { 
    [hour: string]: { 
      taskName: string; 
      desc: string; 
      cat: 'core' | 'support' | 'admin' | 'review'; 
      coop: string 
    } 
  } 
} = {
  an: {
    '08_09': { taskName: 'Kiểm tra ngân sách & Chỉ số Ads', desc: 'Đọc báo cáo ngày từ các tài khoản Ads, phân tích CPL tổng thể so với mốc < 140K VND.', cat: 'core', coop: 'Châu, Nhân' },
    '09_10': { taskName: 'Duyệt định hướng & Kế hoạch', desc: 'Xem xét đề xuất chiến dịch marketing mới, khớp timeline tuần.', cat: 'review', coop: 'Leader Duy' },
    '10_11': { taskName: 'Hoạch định KPIs phòng ban', desc: 'Lập kế hoạch phân bổ KPIs và ngân sách cho các showroom.', cat: 'admin', coop: 'Ban Giám Đốc' },
    '11_12': { taskName: 'Tối ưu hóa tổng chi phí CPL', desc: 'Đưa ra chỉ thị điều chỉnh giá thầu, điều phối phân bổ ngân sách.', cat: 'core', coop: 'Châu, Nhân' },
    '12_13': { taskName: 'Nghỉ trưa & Theo dõi livestream', desc: 'Nghỉ trưa. Quan sát chất lượng phiên livestream bán hàng của Phương Anh.', cat: 'support', coop: 'Phương Anh' },
    '13_14': { taskName: 'Xử lý sự cố vận hành khẩn', desc: 'Giải quyết các vấn đề tài khoản ads bị khóa hoặc duyệt kịch bản gấp.', cat: 'admin', coop: 'Trọng Nhân' },
    '14_15': { taskName: 'Họp chiến lược thương hiệu cá nhân', desc: 'Họp cùng anh Long và key members định hướng phát triển thương hiệu.', cat: 'core', coop: 'Anh Long, Kiếm, Châu' },
    '15_16': { taskName: 'Hoạch định kế hoạch Marketing lớn', desc: 'Lên outline kế hoạch tiếp thị dài hạn và chuẩn bị nguồn lực.', cat: 'admin', coop: 'Độc lập' },
    '16_17': { taskName: 'Họp định kỳ với Leader Media', desc: 'Đánh giá tiến độ, tháo gỡ khó khăn về chất lượng sản xuất và kịch bản.', cat: 'review', coop: 'Leader Duy' },
    '17_18': { taskName: 'Báo cáo hiệu quả kinh doanh cho BGĐ', desc: 'Hoàn thiện báo cáo doanh số, chi phí quảng cáo và chỉ số ROAS trong ngày.', cat: 'review', coop: 'Ban Giám Đốc' }
  },
  duy: {
    '08_09': { taskName: 'Họp giao ban & Rà soát Timeline', desc: 'Nhận kế hoạch từ Marketing, lập timeline thực hiện cho ngày mới.', cat: 'admin', coop: 'Designer, Editor, Cameraman' },
    '09_10': { taskName: 'Phân công công việc chi tiết', desc: 'Giao việc thiết kế banner cho Designer, video TikTok/Reels cho Editor.', cat: 'admin', coop: 'Tân, Trường, Long' },
    '10_11': { taskName: 'Theo dõi tiến độ & Hỗ trợ chuyên môn', desc: 'Giám sát quá trình thiết kế/dựng video thô, giải quyết các lỗi kỹ thuật.', cat: 'support', coop: 'Team Media' },
    '11_12': { taskName: 'Đào tạo và cải tiến đội ngũ', desc: 'Chia sẻ kinh nghiệm thiết kế đồ họa, hướng dẫn quy trình cho nhân sự mới.', cat: 'support', coop: 'Tân, Trường' },
    '12_13': { taskName: 'Nghỉ trưa', desc: 'Nghỉ ngơi chuẩn bị cho các buổi phê duyệt nội dung buổi chiều.', cat: 'support', coop: 'Nghỉ ngơi tự do' },
    '13_14': { taskName: 'Giải quyết sự cố phát sinh', desc: 'Xử lý các lỗi phần mềm dựng phim, hoặc điều phối bối cảnh phát sinh.', cat: 'admin', coop: 'Trọng Nhân' },
    '14_15': { taskName: 'Định hướng sáng tạo & Moodboard', desc: 'Nghiên cứu xu hướng thiết kế mới, lên moodboard cho các chiến dịch.', cat: 'core', coop: 'Phòng Marketing' },
    '15_16': { taskName: 'Phát triển ý tưởng nội dung mới', desc: 'Nghiên cứu đối thủ, đề xuất định dạng video ngắn dễ cắn xu hướng.', cat: 'core', coop: 'Team Content' },
    '16_17': { taskName: 'Kiểm duyệt chất lượng đầu ra (QC)', desc: 'Kiểm tra dựng phim, chính tả, nhạc nền và độ đồng bộ thương hiệu.', cat: 'review', coop: 'Editor' },
    '17_18': { taskName: 'Tổng hợp báo cáo tuần/tháng', desc: 'Tổng hợp sản lượng xuất bản, đánh giá hiệu suất gửi Giám đốc Marketing.', cat: 'review', coop: 'Manager An' }
  },
  kiem: {
    '08_09': { taskName: 'Họp điều phối Media đầu giờ', desc: 'Sắp xếp lịch trình quay chụp trong ngày, họp nhanh cùng team.', cat: 'admin', coop: 'Long, Tân, Trường' },
    '09_10': { taskName: 'Lập kế hoạch sản xuất tuần', desc: 'Thiết lập timeline sản xuất cho từng showroom, đảm bảo tiến độ.', cat: 'core', coop: 'Leader Duy' },
    '10_11': { taskName: 'Xây dựng ý tưởng kịch bản mới', desc: 'Phối hợp cùng Marketing lên kịch bản truyền thông thương hiệu.', cat: 'core', coop: 'Á Châu' },
    '11_12': { taskName: 'Chuẩn hóa quy trình kỹ thuật QC', desc: 'Rà soát quy chuẩn quay phim, chụp ảnh để đạt chất lượng tối đa.', cat: 'review', coop: 'Cameraman Long' },
    '12_13': { taskName: 'Nghỉ trưa', desc: 'Nghỉ ngơi ăn trưa.', cat: 'support', coop: 'Nghỉ ngơi' },
    '13_14': { taskName: 'Chuẩn bị hiện trường & bối cảnh', desc: 'Khảo sát góc quay, setup ánh sáng phục vụ cho buổi quay vlog.', cat: 'support', coop: 'Cameraman Long' },
    '14_15': { taskName: 'Điều phối hiện trường quay chụp', desc: 'Giám sát quá trình ghi hình vlog của anh Long, đảm bảo đúng kịch bản.', cat: 'core', coop: 'Anh Long, Long Photo' },
    '15_16': { taskName: 'Hỗ trợ kỹ thuật ánh sáng & âm thanh', desc: 'Trực tiếp hỗ trợ set thiết bị chuyên sâu tại phòng studio.', cat: 'support', coop: 'Cameraman Long' },
    '16_17': { taskName: 'Kiểm duyệt QC video/hình ảnh', desc: 'Duyệt chất lượng thô của video, kiểm tra lỗi cắt ghép và phụ đề.', cat: 'review', coop: 'Tân, Trường' },
    '17_18': { taskName: 'Báo cáo chất lượng và lưu trữ', desc: 'Đánh giá tiến độ hoàn thành, kiểm tra tình trạng thiết bị.', cat: 'review', coop: 'Leader Duy' }
  },
  chau: {
    '08_09': { taskName: 'Rà soát tài khoản & Ngân sách', desc: 'Kiểm tra trạng thái hoạt động của tài khoản quảng cáo và các Fanpage.', cat: 'admin', coop: 'Trọng Nhân' },
    '09_10': { taskName: 'Vận hành quảng cáo & Tối ưu ads', desc: 'Setup chiến dịch mới, theo dõi chi phí CPM, CPL và chỉ số ROAS.', cat: 'core', coop: 'Manager An' },
    '10_11': { taskName: 'Test tệp khách hàng mới', desc: 'Thiết lập các nhóm đối tượng thử nghiệm trên Ads Manager.', cat: 'core', coop: 'Độc lập' },
    '11_12': { taskName: 'Kiểm duyệt bài viết của Tân/Trường', desc: 'Kiểm tra chính tả, từ khóa nhạy cảm trong bài viết đồ cổ và hàng hiệu.', cat: 'review', coop: 'Tân, Trường' },
    '12_13': { taskName: 'Hỗ trợ setup Livestream trưa', desc: 'Hỗ trợ Phương Anh kiểm tra kịch bản mini game và Tpos.', cat: 'support', coop: 'Phương Anh' },
    '13_14': { taskName: 'Nghỉ trưa', desc: 'Nghỉ ngơi ăn trưa muộn.', cat: 'support', coop: 'Nghỉ ngơi' },
    '14_15': { taskName: 'Quản lý Social & Concept quay chụp', desc: 'Lên ý tưởng truyền thông, soạn kịch bản quay chụp cho các ngày tới.', cat: 'core', coop: 'Anh Long' },
    '15_16': { taskName: 'Hỗ trợ quay chụp cùng anh Long', desc: 'Trực tiếp tham gia buổi quay phim, ghi chú ý chính kịch bản.', cat: 'support', coop: 'Anh Long, Cameraman' },
    '16_17': { taskName: 'Kiểm soát rủi ro vi phạm chính sách', desc: 'Rà soát kỹ nội dung chữ và hình ảnh quảng cáo để tránh bị khóa.', cat: 'review', coop: 'Trọng Nhân' },
    '17_18': { taskName: 'Tổng hợp số liệu ads ngày', desc: 'Thống kê ngân sách tiêu thụ và số lượng lead trong ngày để báo cáo.', cat: 'review', coop: 'Manager An' }
  },
  tan: {
    '08_09': { taskName: 'Nghiên cứu sản phẩm đồ cổ', desc: 'Tìm hiểu thông tin món đồ nội thất độc đáo để phác kịch bản.', cat: 'core', coop: 'Hoàn Kiếm' },
    '09_10': { taskName: 'Chuẩn bị thiết bị & showroom', desc: 'Lau dọn bối cảnh đồ gỗ, chuẩn bị góc quay đẹp nhất.', cat: 'support', coop: 'Cameraman Long' },
    '10_11': { taskName: 'Setup & Quay vlog daily (Clip 1)', desc: 'Thực hiện quay video clip đầu tiên cùng anh Long nói về đồ gỗ xưa.', cat: 'core', coop: 'Anh Long' },
    '11_12': { taskName: 'Chụp hình beauty đồ nội thất', desc: 'Chụp chi tiết hoa văn dát vàng phục vụ đăng bài viết showroom.', cat: 'core', coop: 'Hoàn Kiếm' },
    '12_13': { taskName: 'Nghỉ trưa', desc: 'Nghỉ trưa tái tạo sức lao động.', cat: 'support', coop: 'Tự do' },
    '13_14': { taskName: 'Đồng bộ media & Upload thô', desc: 'Tải file thô lên NAS để sao lưu dữ liệu và hỗ trợ editer.', cat: 'support', coop: 'Phương Anh' },
    '14_15': { taskName: 'Dựng video & Hậu kỳ vlog', desc: 'Cắt ghép, lồng nhạc nền xưa cho video vlog đồ cổ của anh Long.', cat: 'core', coop: 'Độc lập' },
    '15_16': { taskName: 'Xuất phụ đề SRT gửi seeding', desc: 'Viết phụ đề tiếng Việt, xuất file SRT gửi Trọng Nhân kiểm tra.', cat: 'support', coop: 'Trọng Nhân' },
    '16_17': { taskName: 'Viết bài fanpage đồ cổ Fugalo', desc: 'Soạn nội dung mô tả chi tiết sản phẩm gửi chị Châu duyệt.', cat: 'admin', coop: 'Á Châu' },
    '17_18': { taskName: 'Hỗ trợ quay showroom / Seeding', desc: 'Tham gia dọn dẹp studio, đẩy tương tác livestream bán hàng.', cat: 'support', coop: 'Phương Anh, Nhân' }
  },
  truong: {
    '08_09': { taskName: 'Nghiên cứu sản phẩm luxury', desc: 'Tìm hiểu xuất xứ các dòng đồng hồ hiệu, túi xách hiệu để lên kịch bản.', cat: 'core', coop: 'Leader Duy' },
    '09_10': { taskName: 'Chuẩn bị lịch trình quay chụp', desc: 'Sắp xếp bối cảnh trưng bày hàng hiệu sang trọng, chuẩn bị găng tay.', cat: 'support', coop: 'Cameraman Long' },
    '10_11': { taskName: 'Setup & Quay vlog luxury (Clip 1)', desc: 'Thực hiện quay clip vlog hàng hiệu sang trọng cùng anh Long.', cat: 'core', coop: 'Anh Long' },
    '11_12': { taskName: 'Quay video beauty sản phẩm hiệu', desc: 'Quay các góc macro bắt trọn chi tiết tinh xảo của đồng hồ hiệu.', cat: 'core', coop: 'Leader Duy' },
    '12_13': { taskName: 'Nghỉ trưa', desc: 'Nghỉ ngơi ăn trưa.', cat: 'support', coop: 'Nghỉ ngơi' },
    '13_14': { taskName: 'Đồng bộ tệp tin & Upload NAS', desc: 'Tải dữ liệu thẻ nhớ lên hệ thống lưu trữ dùng chung của công ty.', cat: 'support', coop: 'Hoàn Kiếm' },
    '14_15': { taskName: 'Hậu kỳ dựng video Vlog hàng hiệu', desc: 'Dựng, lồng hiệu ứng chuyển cảnh sang trọng, chỉnh màu cao cấp.', cat: 'core', coop: 'Độc lập' },
    '15_16': { taskName: 'Làm phụ đề SRT gửi seeding', desc: 'Xuất file SRT phụ đề gửi Trọng Nhân kiểm tra nạp tool.', cat: 'support', coop: 'Trọng Nhân' },
    '16_17': { taskName: 'Soạn nội dung đăng Pages Luxury', desc: 'Soạn bài viết cho Long Bùi Luxury, Fugalo Long Bùi gửi chị Châu duyệt.', cat: 'admin', coop: 'Á Châu' },
    '17_18': { taskName: 'Hỗ trợ quay hình showroom / Live', desc: 'Hỗ trợ quay chụp thêm hoặc hỗ trợ đẩy seeding live bán hàng.', cat: 'support', coop: 'Phương Anh, Nhân' }
  },
  long: {
    '08_09': { taskName: 'Chuẩn bị phòng studio', desc: 'Kiểm tra pin máy ảnh, thẻ nhớ trống, dọn dẹp studio sạch thế.', cat: 'admin', coop: 'Hoàn Kiếm' },
    '09_10': { taskName: 'Kiểm tra máy móc & Thử âm thanh', desc: 'Thử micro chống ồn, setup hệ thống đèn chiếu sáng tiêu chuẩn.', cat: 'admin', coop: 'Hoàn Kiếm' },
    '10_11': { taskName: 'Quay chụp sản phẩm hàng Kiot', desc: 'Quay chụp chi tiết hàng hoá thực tế tại các kiot showroom.', cat: 'core', coop: 'Tân' },
    '11_12': { taskName: 'Chụp ảnh concept túi hàng hiệu', desc: 'Dàn dựng bối cảnh chụp nghệ thuật cho túi xách hiệu làm poster.', cat: 'core', coop: 'Trường' },
    '12_13': { taskName: 'Nghỉ trưa', desc: 'Nghỉ ngơi ăn trưa.', cat: 'support', coop: 'Nghỉ ngơi' },
    '13_14': { taskName: 'Bảo dưỡng và vệ sinh máy quay', desc: 'Lau sạch bụi bẩn ống kính, bảo quản chân máy quay phim.', cat: 'admin', coop: 'Độc lập' },
    '14_15': { taskName: 'Quay Vlog Anh Long theo lịch', desc: 'Bấm máy quay các vlog trải nghiệm thực tế cùng anh Long.', cat: 'core', coop: 'Anh Long' },
    '15_16': { taskName: 'Setup thiết bị ánh sáng studio', desc: 'Cân chỉnh tản sáng, điều chỉnh đèn theo yêu cầu cảnh quay.', cat: 'support', coop: 'Hoàn Kiếm' },
    '16_17': { taskName: 'Hậu kỳ & Edit ảnh poster thô', desc: 'Chỉnh sửa ánh sáng, màu sắc cơ bản cho ảnh thô sản phẩm.', cat: 'support', coop: 'Editor' },
    '17_18': { taskName: 'Tải file thô lên ổ lưu trữ NAS', desc: 'Tải toàn bộ dữ liệu ghi hình trong ngày lên máy chủ lưu trữ.', cat: 'admin', coop: 'Hoàn Kiếm' }
  },
  nhan: {
    '08_09': { taskName: 'Kiểm tra hạ tầng IT & Box Phone', desc: 'Kiểm tra đường truyền mạng nội bộ, khởi động hệ thống Box Phone.', cat: 'admin', coop: 'Manager An' },
    '09_10': { taskName: 'Soạn kịch bản comment seeding', desc: 'Viết sẵn các mẫu bình luận tự nhiên chuẩn bị chạy tool seeding.', cat: 'core', coop: 'Độc lập' },
    '10_11': { taskName: 'Nuôi tài khoản clone bằng MaxCare', desc: 'Cài đặt kịch bản lướt feed, kết bạn cho dàn tài khoản clone.', cat: 'core', coop: 'Độc lập' },
    '11_12': { taskName: 'Cấu hình tool chạy buff tương tác', desc: 'Set tăng 60-100 comment mồi tự nhiên cho bài đăng mới.', cat: 'core', coop: 'Tân, Trường' },
    '12_13': { taskName: 'Seeding trực tiếp trong phiên live', desc: 'Điều khiển nick clone spam bình luận, thả tim hỗ trợ live.', cat: 'support', coop: 'Phương Anh' },
    '13_14': { taskName: 'Nghỉ trưa & backup dữ liệu', desc: 'Ăn trưa, kết hợp chạy tiến trình tự động sao lưu máy chủ.', cat: 'admin', coop: 'Tự động' },
    '14_15': { taskName: 'Setup & Vận hành quảng cáo Ads', desc: 'Lên camp quảng cáo mới, theo dõi ngân sách và hiệu suất.', cat: 'core', coop: 'Á Châu' },
    '15_16': { taskName: 'Giám sát chỉ số quảng cáo CPM, CPL', desc: 'Tối ưu quảng cáo, lọc tắt các nhóm có chi phí CPL quá cao.', cat: 'core', coop: 'Á Châu' },
    '16_17': { taskName: 'Đối chiếu số liệu đơn hàng KiotViet', desc: 'Kiểm tra khớp chéo lượng lead mang về từ Ads với KiotViet.', cat: 'review', coop: 'Ban Kế Toán' },
    '17_18': { taskName: 'Hỗ trợ kỹ thuật IT văn phòng', desc: 'Khắc phục sự cố mạng, máy tính, máy in cho toàn bộ nhân sự.', cat: 'admin', coop: 'Team Media' }
  },
  panh: {
    '08_09': { taskName: 'Chuẩn bị kỹ thuật & Setup Live', desc: 'Kiểm tra sạc pin Tpos, mic thu âm, căn góc máy livestream.', cat: 'admin', coop: 'Hoàn Kiếm' },
    '09_10': { taskName: 'Cập nhật danh sách nick seeding', desc: 'Nạp danh sách tài khoản seeding live trưa, chuẩn bị bình luận.', cat: 'support', coop: 'Trọng Nhân' },
    '10_11': { taskName: 'Sẵn sàng lên sóng livestream', desc: 'Chuẩn bị trang phục, chuẩn bị sản phẩm mẫu để bán live trưa.', cat: 'core', coop: 'Anh Long' },
    '11_12': { taskName: 'Trực livestream bán hàng trưa (P1)', desc: 'Lên sóng live trực tiếp, ghim bình luận mua hàng, chốt đơn.', cat: 'core', coop: 'Khách hàng' },
    '12_13': { taskName: 'Trực livestream bán hàng trưa (P2)', desc: 'Chạy mini game, ẩn số điện thoại khách hàng tránh cướp đơn.', cat: 'core', coop: 'Trọng Nhân' },
    '13_14': { taskName: 'Nghỉ trưa muộn & Báo cáo nhanh', desc: 'Ăn trưa muộn, thống kê nhanh số đơn chốt và gửi báo cáo sau live.', cat: 'admin', coop: 'Leader Duy' },
    '14_15': { taskName: 'Tải video live & Up lên NAS', desc: 'Tải video ghi hình live đồng bộ lên hệ thống lưu trữ NAS.', cat: 'support', coop: 'Editor' },
    '15_16': { taskName: 'Chăm sóc dàn tài khoản MaxCare', desc: 'Chạy tool kết bạn tự động nuôi nick seeding luôn hoạt động.', cat: 'support', coop: 'Trọng Nhân' },
    '16_17': { taskName: 'Kiểm tra feedback & Tư vấn', desc: 'Xử lý tin nhắn khách hàng gửi về Fanpage, giải checkpoint nick.', cat: 'core', coop: 'Khách hàng' },
    '17_18': { taskName: 'Xây dựng thư viện seeding mới', desc: 'Soạn sẵn kịch bản seeding cho buổi live sau, kiểm group Fugalo.', cat: 'core', coop: 'Leader Duy' }
  }
};

// Map hourKeys to actual personnel tasks from data.ts
const hourTaskMapping: { [memberId: string]: { [hourKey: string]: string[] } } = {
  an: { '08_09': ['an_1'], '09_10': ['an_1'], '11_12': ['an_1'], '14_15': ['an_2'], '16_17': ['an_2'], '17_18': ['an_3'] },
  chau: { '08_09': ['chau_3'], '09_10': ['chau_1'], '10_11': ['chau_1'], '11_12': ['chau_4', 'chau_5'], '14_15': ['chau_2'], '15_16': ['chau_2'], '16_17': ['chau_3'], '17_18': ['chau_1'] },
  tan: { '08_09': ['tan_4'], '09_10': ['tan_1'], '10_11': ['tan_1'], '11_12': ['tan_3'], '14_15': ['tan_1'], '15_16': ['tan_2'], '16_17': ['tan_4'], '17_18': ['tan_5'] },
  truong: { '08_09': ['truong_4'], '09_10': ['truong_1'], '10_11': ['truong_1'], '11_12': ['truong_3'], '14_15': ['truong_1'], '15_16': ['truong_2'], '16_17': ['truong_4'], '17_18': ['truong_5'] },
  long: { '08_09': ['long_3'], '09_10': ['long_3'], '10_11': ['long_1'], '11_12': ['long_1'], '14_15': ['long_2'], '15_16': ['long_2'], '16_17': ['long_4'], '17_18': ['long_4'] },
  nhan: { '08_09': ['nhan_4'], '09_10': ['nhan_1'], '10_11': ['nhan_2'], '11_12': ['nhan_2'], '12_13': ['nhan_2'], '14_15': ['nhan_3'], '15_16': ['nhan_3'], '16_17': ['nhan_3'], '17_18': ['nhan_4'] },
  panh: { '08_09': ['panh_1'], '09_10': ['panh_1'], '10_11': ['panh_2'], '11_12': ['panh_2'], '12_13': ['panh_2'], '14_15': ['panh_3'], '15_16': ['panh_4'], '16_17': ['panh_4'], '17_18': ['panh_4'] },
  kiem: { '08_09': ['kiem_4'], '09_10': ['kiem_2'], '10_11': ['kiem_3'], '11_12': ['kiem_3'], '14_15': ['kiem_4'], '15_16': ['kiem_4'], '16_17': ['kiem_1'], '17_18': ['kiem_1'] },
  duy: { '08_09': ['duy_1'], '09_10': ['duy_1'], '10_11': ['duy_1'], '11_12': ['duy_2'], '14_15': ['duy_3'], '15_16': ['duy_3'], '16_17': ['duy_2'], '17_18': ['duy_4'] }
};

const hoursList = [
  { key: '08_09', range: '08:00 - 09:00', focus: 'Khởi động & Setup' },
  { key: '09_10', range: '09:00 - 10:00', focus: 'Tập trung sản xuất' },
  { key: '10_11', range: '10:00 - 11:00', focus: 'Peak-Hour thực thi' },
  { key: '11_12', range: '11:00 - 12:00', focus: 'Rà soát trưa' },
  { key: '12_13', range: '12:00 - 13:00', focus: 'Nghỉ trưa / Live' },
  { key: '13_14', range: '13:00 - 14:00', focus: 'Khởi động ca chiều' },
  { key: '14_15', range: '14:00 - 15:00', focus: 'Tập trung cao độ' },
  { key: '15_16', range: '15:00 - 16:00', focus: 'Hỗ trợ & Seeding' },
  { key: '16_17', range: '16:00 - 17:00', focus: 'Kiểm duyệt & QC' },
  { key: '17_18', range: '17:00 - 18:00', focus: 'Báo cáo & Checkout' }
];

export default function TimelineSchedule({ personnelList, selectedMemberId, onSelectMember }: TimelineScheduleProps) {
  const [scheduleView, setScheduleView] = useState<'daily' | 'weekly'>('daily');
  const [selectedHourKey, setSelectedHourKey] = useState<string>('08_09');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local state to keep track of checked hour-specific tasks for interactive simulation
  const [completedTaskIds, setCompletedTaskIds] = useState<{ [key: string]: boolean }>({});

  const toggleTaskLocal = (taskId: string) => {
    setCompletedTaskIds(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const memberObj = personnelList.find(p => p.id === selectedMemberId) || personnelList[0];
  const memberSchedule = hourlyActivities[memberObj.id] || hourlyActivities.duy;

  // Retrieve matching database tasks for the current selected hour
  const getMappedTasks = (hourKey: string) => {
    const taskIds = hourTaskMapping[memberObj.id]?.[hourKey] || [];
    return memberObj.tasks.filter(t => taskIds.includes(t.id));
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'core':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">Công việc chính</span>;
      case 'support':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-md">Hỗ trợ</span>;
      case 'admin':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md">Hành chính / IT</span>;
      case 'review':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">Kiểm duyệt</span>;
      default:
        return null;
    }
  };

  const filteredPersonnel = personnelList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="timeline-schedule-tab">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR: Personnel Selection (4 columns, 3 columns on xl+) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">Chọn nhân sự phối hợp</h3>
            <p className="text-xs text-slate-500">Xem kịch bản khung giờ, việc hằng ngày & luồng báo cáo riêng biệt.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm nhanh nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[380px] xl:max-h-[580px] overflow-y-auto pr-1">
            {filteredPersonnel.map((p) => {
              const isSelected = p.id === selectedMemberId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectMember(p.id)}
                  className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between border cursor-pointer group ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/15' 
                      : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={p.avatar} 
                      alt={p.name} 
                      className={`w-8.5 h-8.5 rounded-full object-cover border ${
                        isSelected ? 'border-white/30' : 'border-slate-200'
                      }`} 
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">{p.name}</div>
                      <div className={`text-[10px] truncate ${
                        isSelected ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {p.role.split('(')[0]}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${
                    isSelected ? 'translate-x-0.5 text-white' : 'text-slate-400 group-hover:translate-x-0.5'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN PANEL: Schedule Workspaces (8 columns, 9 columns on xl+) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img src={memberObj.avatar} alt={memberObj.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-sm" />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[8px] bg-blue-600 text-white rounded-md font-mono border border-white font-bold">
                  {memberObj.code?.replace(/[\[\]]/g, '') || 'MKT'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {memberObj.tag}
                </span>
                <h2 className="text-base font-bold text-slate-800 mt-1">{memberObj.name}</h2>
                <p className="text-xs text-slate-500">{memberObj.role}</p>
              </div>
            </div>

            {/* Selection Tabs between Daily Schedule and Weekly/Monthly Reports */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setScheduleView('daily')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  scheduleView === 'daily' 
                    ? 'bg-white text-slate-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📅 Hàng ngày (08:00 - 18:00)
              </button>
              <button 
                onClick={() => setScheduleView('weekly')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  scheduleView === 'weekly' 
                    ? 'bg-white text-slate-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📋 Việc tuần & Báo cáo
              </button>
            </div>
          </div>

          {/* VIEW 1: DAILY SPLIT SCREEN VIEW */}
          {scheduleView === 'daily' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 p-1 rounded-3xl">
              
              {/* LEFT COLUMN: Time slot picker (08:00 - 18:00) */}
              <div className="md:col-span-5 xl:col-span-4 space-y-2 max-h-[500px] xl:max-h-[620px] overflow-y-auto pr-1">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Trục thời gian làm việc</h4>
                  <p className="text-[10px] text-slate-400">Chọn khung giờ để xem chi tiết đầu việc đổ từ hệ thống.</p>
                </div>

                {hoursList.map((hr) => {
                  const isActive = selectedHourKey === hr.key;
                  const activity = memberSchedule[hr.key] || { taskName: 'Nghỉ ngơi', cat: 'support' };
                  const matchedTasksCount = getMappedTasks(hr.key).length;

                  return (
                    <button
                      key={hr.key}
                      onClick={() => setSelectedHourKey(hr.key)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                            isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {hr.range}
                          </span>
                          {!isActive && (
                            <span className="text-[9px] text-slate-400 font-medium">
                              {hr.focus}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                          {activity.taskName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {matchedTasksCount > 0 && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {matchedTasksCount} việc
                          </span>
                        )}
                        <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT COLUMN: Hourly Details Panel */}
              <div className="md:col-span-7 xl:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                
                {/* Active hour focus info */}
                {(() => {
                  const hrInfo = hoursList.find(h => h.key === selectedHourKey)!;
                  const actDetail = memberSchedule[selectedHourKey] || { taskName: 'Hoạt động tự do', desc: 'Sắp xếp chuẩn bị cho ca làm việc hoặc phối hợp hỗ trợ nhóm.', cat: 'support', coop: 'Team Media' };
                  const mappedTasks = getMappedTasks(selectedHourKey);

                  return (
                    <>
                      <div className="border-b border-slate-100 pb-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                              {hrInfo.range}
                            </span>
                          </div>
                          {getCategoryBadge(actDetail.cat)}
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                          {actDetail.taskName}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {actDetail.desc}
                        </p>
                      </div>

                      {/* SECTION 1: Automatic Pull of Tasks from data.ts */}
                      <div className="space-y-3">
                        <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                          Công việc chính trong giờ này (Tự động từ data.ts)
                        </h4>

                        <div className="space-y-2">
                          {mappedTasks.map((task) => {
                            const isDone = !!completedTaskIds[task.id];
                            return (
                              <div 
                                key={task.id} 
                                onClick={() => toggleTaskLocal(task.id)}
                                className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                                  isDone 
                                    ? 'bg-emerald-50/50 border-emerald-100 text-slate-500' 
                                    : 'bg-slate-50 hover:bg-slate-100/70 border-slate-150 text-slate-700'
                                }`}
                              >
                                <div className="mt-0.5">
                                  {isDone ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-md border-2 border-slate-300 bg-white" />
                                  )}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <span className={`text-xs font-bold leading-none ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                    {task.title}
                                  </span>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {task.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}

                          {mappedTasks.length === 0 && (
                            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 space-y-1">
                              <p className="text-xs font-semibold">Tập trung tác vụ vận hành chung</p>
                              <p className="text-[10px] text-slate-400">Không có nhiệm vụ cố định trong data.ts tại khung giờ này. Đảm bảo hỗ trợ, phối hợp và dọn dẹp bối cảnh.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SECTION 2: Coordination Flow */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                        <h4 className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          Luồng phối hợp liên đới
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-sm">
                            Hỗ trợ chính:
                          </span>
                          <span className="text-xs text-slate-600 font-semibold truncate">
                            {actDetail.coop}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}

              </div>
            </div>
          )}

          {/* VIEW 2: WEEKLY TASKS & REPORTING FLOWS */}
          {scheduleView === 'weekly' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Weekly Tasks Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="h-4.5 w-4.5 text-blue-600" />
                    Nhiệm vụ theo tuần / tháng
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">Weekly</span>
                </div>

                <ul className="space-y-2.5">
                  {(() => {
                    // Extract custom weekly tasks
                    const weeklyList: { [key: string]: string[] } = {
                      an: [
                        'Lập chỉ tiêu KPIs và phân bổ ngân sách Marketing hàng tháng/hàng tuần cho toàn đội ngũ.',
                        'Kiểm duyệt nội dung vĩ mô, tối ưu hoá chi phí CPL chiến dịch đạt chỉ tiêu < 140,000 VND.',
                        'Hoạch định chiến lược thương hiệu cá nhân của anh Long & Công ty Fugalo.'
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
                        'Tổng hợp số liệu báo cáo, phân tích hiệu quả quảng cáo và tối ưu hóa chi phí CPL.',
                        'Lập kế hoạch nội dung Social cho công ty và thương hiệu cá nhân anh Long theo tuần.',
                        'Truyền thông nội bộ, setup chuẩn bị khi công ty tổ chức sự kiện đặc biệt.'
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

                    const list = weeklyList[memberObj.id] || weeklyList.duy;
                    return list.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-150/60">
                        <CheckSquare className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{task}</span>
                      </li>
                    ));
                  })()}
                </ul>
              </div>

              {/* Reporting Flows Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-blue-600" />
                    Luồng báo cáo & Tiến độ
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Reports</span>
                </div>

                <div className="space-y-3">
                  {(() => {
                    const reportList: { [key: string]: { title: string; del: string; freq: string; rec: string }[] } = {
                      an: [
                        { title: 'Báo cáo hiệu quả kinh doanh & Marketing', del: 'Báo cáo doanh số, chi phí Ads, CPL và chỉ số ROAS.', freq: 'Hàng ngày', rec: 'Ban Giám Đốc Fugalo' },
                        { title: 'Bản phân bổ KPIs và nguồn lực', del: 'Bảng phân bổ chỉ tiêu KPIs và ngân sách chạy quảng cáo.', freq: 'Hàng tuần', rec: 'Team Media & Seeding' }
                      ],
                      duy: [
                        { title: 'Báo cáo tiến độ công việc hàng tuần', del: 'Tổng hợp sản lượng, các công việc đã hoàn thành, chậm tiến độ và phương án xử lý.', freq: 'Hàng tuần', rec: 'Giám đốc Marketing (An)' },
                        { title: 'Báo cáo hiệu quả hoạt động Media', del: 'Đánh giá chất lượng sản phẩm, kết quả thực hiện KPI và đề xuất cải tiến nhân sự.', freq: 'Hàng tháng', rec: 'Ban Lãnh Đạo & Marketing Manager' }
                      ],
                      kiem: [
                        { title: 'Kế hoạch sản xuất tuần', del: 'Timeline quay chụp chi tiết, phân công nhân sự và thiết bị tương ứng.', freq: 'Hàng tuần', rec: 'Trưởng nhóm Media (Duy)' },
                        { title: 'Báo cáo chất lượng QC hình ảnh/video', del: 'Danh sách sản phẩm media đạt chuẩn và lỗi kỹ thuật cần khắc phục.', freq: 'Hàng tuần', rec: 'Team Media & Leader' }
                      ],
                      chau: [
                        { title: 'Báo cáo hiệu quả Ads theo tuần', del: 'Báo cáo ngân sách đã tiêu, số Lead mang về, chi phí CPL và hiệu suất các tệp.', freq: 'Hàng tuần', rec: 'Giám đốc Marketing (An)' },
                        { title: 'Kế hoạch truyền thông tuần tới', del: 'Bản kế hoạch tuyến nội dung Social đăng tải cho các Page thương hiệu.', freq: 'Hàng tuần', rec: 'Trưởng phòng (An) & Leader (Duy)' }
                      ],
                      tan: [
                        { title: 'Báo cáo bàn giao sản phẩm ngày', del: 'File video hoàn chỉnh + file SRT phụ đề gửi seeding kiểm tra nạp tool.', freq: 'Hàng ngày', rec: 'Trọng Nhân (Seeding)' },
                        { title: 'Báo cáo chỉ số tương tác Fanpage', del: 'Tổng số lượt xem, tương tác bài đăng đồ gỗ và tỷ lệ tăng trưởng follower.', freq: 'Hàng tuần', rec: 'Trưởng nhóm Media (Duy)' }
                      ],
                      truong: [
                        { title: 'Báo cáo xuất bản video & bài đăng', del: 'Link bài viết, video đã đăng tải kèm theo file SRT tương ứng.', freq: 'Hàng ngày', rec: 'Châu (Social) & Nhân (Seeding)' },
                        { title: 'Báo cáo tiến độ nội dung hàng tuần', del: 'Tổng số bài đăng và kịch bản video đã hoàn thành của mảng Luxury.', freq: 'Hàng tuần', rec: 'Trưởng nhóm Media (Duy)' }
                      ],
                      long: [
                        { title: 'Nhật ký thiết bị & Hiện trạng quay', del: 'Danh sách buổi quay hoàn thành và báo cáo tình trạng kỹ thuật thiết bị.', freq: 'Hàng tuần', rec: 'Lê Hoàn Kiếm (DOP)' }
                      ],
                      nhan: [
                        { title: 'Báo cáo seeding & tương tác hàng ngày', del: 'Số lượng comment seeding tạo ra, tỷ lệ hoạt động của dàn tài khoản clone.', freq: 'Hàng ngày', rec: 'Trưởng nhóm Media (Duy)' },
                        { title: 'Báo cáo đối chiếu số liệu đơn hàng Ads', del: 'Bảng đối chiếu khớp số lượng Lead/đơn hàng thực tế so với KiotViet.', freq: 'Hàng tuần', rec: 'Giám đốc Marketing (An)' }
                      ],
                      panh: [
                        { title: 'Báo cáo nhanh sau phiên live', del: 'Báo cáo số lượt xem, comment, tỷ lệ chốt đơn, thời gian có nội dung hay và lỗi kỹ thuật.', freq: 'Sau phiên live', rec: 'Team Seeding & Leader' },
                        { title: 'Báo cáo hoạt động Group Fugalo', del: 'Số lượng thành viên mới duyệt, danh sách SĐT thu thập được.', freq: 'Hàng tuần', rec: 'Trưởng nhóm Media (Duy)' }
                      ]
                    };

                    const list = reportList[memberObj.id] || [];
                    return list.map((report, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-slate-100/50 transition">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{report.title}</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono bg-blue-50 text-blue-700 border border-blue-100">
                            {report.freq}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5"><span className="font-bold text-slate-600">Sản phẩm:</span> {report.del}</p>
                        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-150/50 text-[10px] text-slate-500">
                          <Users className="h-3 w-3 text-slate-400" />
                          <span>Báo cáo cho: <strong className="text-slate-700 font-semibold">{report.rec}</strong></span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

            </div>
          )}

          {/* Workflow Guidelines Alert */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 flex gap-3 text-xs text-amber-900 leading-relaxed">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Quy chuẩn phối hợp & Đảm bảo tiến độ giữa Marketing và Media:</p>
              <p className="mt-1 text-slate-600">
                Toàn bộ kịch bản thô của <strong>Tân</strong> và <strong>Trường</strong> phải do <strong>Hoàn Kiếm</strong> duyệt kỹ thuật QC, sau đó gửi <strong>Châu</strong> duyệt nội dung trước khi bấm máy quay. File thô cuối ngày của <strong>Cameraman Long</strong> phải được phân loại đồng bộ lên hệ thống <strong>NAS</strong> để <strong>Phương Anh</strong> lưu trữ và <strong>Trọng Nhân</strong> nạp tool seeding.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
