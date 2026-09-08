/* Billing Report JS: giao diện giống CMS, nội dung là bảng báo cáo dữ liệu. */
function billingSafe(value){
  return String(value == null ? '' : value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

function billingNumber(value){
  return Number(value || 0).toLocaleString('vi-VN');
}

function billingCleanMenuText(value){
  return String(value || '').replace(/\s+/g,' ').replace(/[▾▼]/g,'').trim();
}

function billingStatusClass(value){
  var text = String(value || '').toLowerCase();
  if(text.indexOf('thành công') >= 0 || text.indexOf('hoạt động') >= 0 || text.indexOf('đã xử lý') >= 0) return 'status-success';
  if(text.indexOf('chờ') >= 0 || text.indexOf('đang') >= 0) return 'status-pending';
  if(text.indexOf('lỗi') >= 0 || text.indexOf('thất bại') >= 0 || text.indexOf('hủy') >= 0) return 'status-fail';
  return '';
}

function billingApplyBreadcrumbTitle(node,btn){
  if(!node || !btn) return;
  var title = node.querySelector('.cms-screen-title');
  if(!title) return;
  var menu = btn.closest('.cms-menu-item');
  var tabBtn = menu ? menu.querySelector('.cms-nav-btn') : null;
  var tabName = tabBtn ? billingCleanMenuText(tabBtn.textContent) : '';
  var functionName = billingCleanMenuText(btn.textContent);
  if(!tabName || !functionName) return;
  var icon = title.querySelector('i');
  title.innerHTML = '';
  if(icon) title.appendChild(icon.cloneNode(true));
  title.appendChild(document.createTextNode(' ' + tabName + ' > ' + functionName));
}

function showScreen(name,btn){
  document.querySelectorAll('.screen').forEach(function(screen){screen.classList.add('hidden');});
  var node = document.getElementById('screen-' + name);
  if(node){
    node.classList.remove('hidden');
    billingApplyBreadcrumbTitle(node,btn);
  }
  document.querySelectorAll('.cms-dropdown button').forEach(function(item){item.classList.remove('active');});
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.cms-nav-btn').forEach(function(item){item.classList.remove('active');});
  var activeMenu = btn ? btn.closest('.cms-menu-item') : document.querySelector('.cms-menu-item');
  if(activeMenu){
    var nav = activeMenu.querySelector('.cms-nav-btn');
    if(nav) nav.classList.add('active');
  }
}

var billingAdmins = [
  ['hongtt','Trần Thúy Hồng','Billing Admin','hongtt@vtc.vn','Hoạt động','08/07/2026 09:15'],
  ['minhnq','Nguyễn Quốc Minh','Report Viewer','minhnq@vtc.vn','Hoạt động','07/07/2026 17:20'],
  ['audit01','Tài khoản kiểm toán','Auditor','audit01@vtc.vn','Tạm khóa','01/07/2026 10:03']
];

var billingUserLogs = [
  ['08/07/2026 09:20','hongtt','Giao dịch Nạp Point','Xuất Excel','117.103.228.53','Thành công'],
  ['08/07/2026 09:12','hongtt','Báo cáo tổng quan','Tra cứu dữ liệu','117.103.228.53','Thành công'],
  ['07/07/2026 16:44','minhnq','Thống kê EXP','Lọc theo thời gian','14.225.12.90','Thành công'],
  ['07/07/2026 11:02','audit01','Giao dịch Hoàn tiền','Xem chi tiết','113.160.55.21','Thất bại']
];

var billingErrorLogs = [
  ['08/07/2026 08:58','BR-504','Billing Report API','Timeout khi tải dữ liệu giao dịch','Cao','Đã xử lý'],
  ['07/07/2026 19:10','BR-422','Report Filter','Ngày kết thúc nhỏ hơn ngày bắt đầu','Thấp','Đã xử lý'],
  ['06/07/2026 21:05','BR-500','Export Excel','Lỗi tạo file tạm','Trung bình','Chờ xử lý']
];

var reportConfigs = {
  userOverviewReport:{type:'userOverview'},
  newAccountStatReport:{type:'newAccountStat'},
  newAccountDetailReport:{type:'newAccountDetail'},
  pointTopupReport:{
    summaryRows:[
      ['Tổng số giao dịch','12.420','Tổng số giao dịch cộng Point thành công theo điều kiện lọc.'],
      ['Tổng Point đã cộng','8.920.000.000','Tổng số Point đã cộng từ tất cả giao dịch thỏa điều kiện lọc.'],
      ['Tổng giá trị thanh toán','8.215.000.000 VNĐ','Tổng số tiền thanh toán của các giao dịch nạp Point qua Thẻ Vcoin và các hình thức thanh toán của CTT VTC Pay. Không bao gồm Point tích lũy và cộng bù.']
    ],
    columns:['Mã giao dịch','Username','Họ tên','Nguồn nạp','Số Point','Thời gian giao dịch','Mã giao dịch MyVTC','Mã giao dịch VTC Pay','Serial thẻ Vcoin','Số tiền thanh toán - VNĐ','Số tiền thanh toán - Vcoin','Người thực hiện / Ghi chú'],
    rows:[
      ['TOP-260705-001','namnguyen91','Nguyễn Văn Nam','VTC Pay',250000,'05/07/2026 09:10:22','MYVTC-TOP-001','VTP-20260705-001','',250000,'','Hệ thống'],
      ['TOP-260705-002','minhpt','Phạm Tuấn Minh','Thẻ Vcoin',100000,'05/07/2026 09:40:03','MYVTC-TOP-002','','VCOIN****1234','',100000,'Hệ thống'],
      ['TOP-260705-003','lananh88','Trần Lan Anh','Thẻ ATM (Vietcombank)',500000,'05/07/2026 10:15:48','MYVTC-TOP-003','VTP-20260705-009','','505500','','Hệ thống'],
      ['TOP-260705-004','hoanglam','Hoàng Lâm','Chuyển khoản QR',300000,'05/07/2026 10:50:11','MYVTC-TOP-004','VTP-20260705-015','','300000','','Hệ thống'],
      ['TOP-260705-005','audit01','Tài khoản kiểm toán','Cộng bù',200000,'05/07/2026 11:21:39','','','','','','hongtt - Cộng bù do giao dịch lỗi']
    ],
    pieTitle:'Cơ cấu theo nguồn nạp',
    pieRows:[['Thẻ Vcoin',3240],['VTC Pay',4180],['Tích lũy Point',1860],['Cộng bù',720]]
  },
  promoPointReport:{
    summaryRows:[
      ['Tổng số lô Point phát hành','3.824','Tổng số lần hệ thống cộng Point thành công.'],
      ['Tổng người dùng nhận thưởng','3.210','Số lượng người dùng được cộng Point trong kỳ thống kê.'],
      ['Tổng Point đã phát hành','1.240.000','Tổng số Point đã cộng từ các chương trình ưu đãi.'],
      ['Tổng Point đã sử dụng','840.000','Tổng số Point đã được dùng để thanh toán hoặc đổi thưởng.'],
      ['Tổng Point còn hiệu lực','315.000','Tổng số Point chưa dùng và chưa hết hạn.'],
      ['Tổng Point hết hạn','55.000','Tổng số Point hết hạn theo cấu hình chương trình.'],
      ['Tổng Point thu hồi','30.000','Tổng số Point bị thu hồi do hủy giao dịch hoặc điều chỉnh nghiệp vụ.'],
      ['Tỷ lệ sử dụng Point','67,7%','Tổng Point đã sử dụng / Tổng Point đã phát hành.'],
      ['Tỷ lệ Point hết hạn','4,4%','Tổng Point hết hạn / Tổng Point đã phát hành.']
    ],
    columns:['Mã lô Point','Mã giao dịch','Username','Tên người dùng','Chương trình ưu đãi','Loại sự kiện','Dịch vụ','Đối tác','Point được phát hành','Point đã sử dụng','Point còn lại','Point hết hạn','Point thu hồi','Thời điểm ghi nhận','Ngày hết hạn','Trạng thái lô Point','Mã tham chiếu'],
    rows:[
      ['LOT-260705-001','PP-260705-001','namnguyen91','Nguyễn Văn Nam','NEW_USER_2026','Đăng ký mới','MyVTC','',300000,180000,120000,0,0,'05/07/2026 08:30:00','05/08/2026','Còn hiệu lực','ACC-00012881'],
      ['LOT-260705-002','PP-260705-002','minhpt','Phạm Tuấn Minh','BIRTHDAY_2026','Sinh nhật','Loyalty','',50000,50000,0,0,0,'05/07/2026 09:12:00','05/08/2026','Đã sử dụng hết','BD-260705-088'],
      ['LOT-260705-003','PP-260705-003','lananh88','Trần Lan Anh','DAILY_MISSION','Hoàn thành nhiệm vụ','VTC Game','',150000,60000,90000,0,0,'05/07/2026 10:45:00','12/07/2026','Còn hiệu lực','MIS-260705-102'],
      ['LOT-260705-004','PP-260705-004','hoanglam','Hoàng Lâm','REFERRAL_2026','Giới thiệu bạn bè thành công','MyVTC','Đối tác SSO',200000,0,0,0,200000,'05/07/2026 11:05:00','05/08/2026','Đã thu hồi','REF-260705-010'],
      ['LOT-260705-005','PP-260705-005','thuylinh','Nguyễn Thùy Linh','DOUBLE_POINT_JUL','Khuyến mại','VTC Edu','',120000,0,0,120000,0,'05/07/2026 14:22:00','06/07/2026','Hết hạn','EVT-DOUBLE-099']
    ]
  },
  paymentTransactionReport:{
    summaryRows:[
      ['Tổng số giao dịch','9.120','Tổng số giao dịch thanh toán thành công theo điều kiện lọc.'],
      ['Tổng Point đã thanh toán','6.450.000.000','Tổng số Point đã được dùng để thanh toán.'],
      ['Người dùng thanh toán','7.860','Tổng số Username phát sinh giao dịch thanh toán trong khoảng thời gian thống kê.']
    ],
    columns:['Thời gian giao dịch','Mã giao dịch MyVTC','Mã giao dịch đối tác','Mã giao dịch VTC Pay','Phương thức thanh toán','Username','Họ tên','Đối tác','Loại sản phẩm','Tên sản phẩm','Tên gói','Giá trị thanh toán - Point','Giá trị thanh toán - VNĐ','Ghi chú'],
    filterFields:[
      {label:'Loại sản phẩm', options:['Tất cả','Game item','Gói dịch vụ','Voucher']},
      {label:'Sản phẩm', options:['Tất cả','Vcoin Game','Au Mobile','VTC Edu','CrossFire','Voucher data']},
      {label:'Phương thức thanh toán', options:['Tất cả','Số dư MyVTC','VTC Pay','ATM','Thẻ quốc tế','QR']}
    ],
    rows:[
      ['05/07/2026 08:12','MYVTC-PAY-001','PART-AU-0001','','Số dư MyVTC','namnguyen91','Nguyễn Văn Nam','VTC Game','Game item','Au Mobile','Gói 120.000 Point',120000,'','Thanh toán thành công'],
      ['05/07/2026 08:33','MYVTC-PAY-002','PART-EDU-0008','VTP-20260705-201','VTC Pay','minhpt','Phạm Tuấn Minh','VTC Edu','Gói dịch vụ','VTC Edu','Gói học tập tháng',0,90000,'Thanh toán qua VTC Pay'],
      ['05/07/2026 09:01','MYVTC-PAY-003','PART-CF-0021','','Số dư MyVTC','lananh88','Trần Lan Anh','VTC Game','Game item','CrossFire','Gói 250.000 Point',250000,'','Trừ Point thành công'],
      ['05/07/2026 09:48','MYVTC-PAY-004','PART-VCH-0033','VTP-20260705-245','Thẻ ATM (BIDV)','hoanglam','Hoàng Lâm','Đối tác SSO','Voucher','Voucher data','Gói Data 4G',0,50000,'Thanh toán qua ngân hàng'],
      ['05/07/2026 10:20','MYVTC-PAY-005','PART-QR-0099','VTP-20260705-260','Chuyển khoản QR','thuylinh','Nguyễn Thùy Linh','VTC Pay','Gói dịch vụ','Vcoin Game','Gói 300.000 VNĐ',0,300000,'Thanh toán QR thành công']
    ]
  },
  pointRecallReport:{
    summaryRows:[
      ['Tổng số giao dịch','184'],
      ['Tổng Point thu hồi','94.500.000'],
      ['Thu hồi tự động','126'],
      ['Thu hồi thủ công','58'],
      ['Người dùng bị thu hồi','171']
    ],
    columns:['Thời gian giao dịch','Mã giao dịch MyVTC','Username','Họ tên','Loại thu hồi','Point thu hồi','Lý do thu hồi','Người thực hiện','Mã tham chiếu','Ghi chú'],
    rows:[
      ['05/07/2026 10:12','MYVTC-REC-001','namnguyen91','Nguyễn Văn Nam','Thu hồi thủ công',50000,'Điều chỉnh dữ liệu','hongtt','TOP-260705-001','Thu hồi phần Point cộng sai'],
      ['05/07/2026 11:03','MYVTC-REC-002','minhpt','Phạm Tuấn Minh','Thu hồi tự động do hết hạn',30000,'Hết hạn sử dụng','','LOT-260705-002',''],
      ['05/07/2026 14:22','MYVTC-REC-003','lananh88','Trần Lan Anh','Thu hồi thủ công',20000,'Thu hồi theo yêu cầu quản trị','minhnq','PAY-260704-244','Đã ghi nhận log xử lý'],
      ['05/07/2026 16:40','MYVTC-REC-004','hoanglam','Hoàng Lâm','Thu hồi tự động do hết hạn',120000,'Hết hạn sử dụng','','LOT-260705-005',''],
      ['05/07/2026 17:25','MYVTC-REC-005','thuylinh','Nguyễn Thùy Linh','Thu hồi thủ công',80000,'Điều chỉnh dữ liệu','hongtt','CMS-ADJ-260705-08','Theo biên bản đối soát']
    ]
  },
  refundTransactionReport:{
    summaryRows:[
      ['Tổng số giao dịch hoàn','315'],
      ['Tổng số tiền hoàn','98.000.000 VNĐ'],
      ['Tổng Point hoàn','215.000.000']
    ],
    columns:['Thời gian hoàn','Mã giao dịch hoàn','Mã giao dịch MyVTC','Mã giao dịch VTC Pay','Mã giao dịch đối tác','Username','Họ tên','Đối tác','Loại sản phẩm','Tên sản phẩm','Giá trị thanh toán - Point','Giá trị thanh toán - VNĐ','Giá trị hoàn - Point','Giá trị hoàn - VNĐ','Lý do hoàn','Người thực hiện','Ghi chú'],
    filterFields:[
      {label:'Loại sản phẩm', options:['Tất cả','Game item','Gói dịch vụ','Voucher']},
      {label:'Sản phẩm', options:['Tất cả','Au Mobile','VTC Edu','CrossFire','Voucher data','Vcoin Game']},
      {label:'Đối tác', options:['Tất cả','VTC Game','VTC Edu','Đối tác SSO','VTC Pay']},
      {label:'Dịch vụ', options:['Tất cả','MyVTC','VTC Pay','Loyalty']},
      {label:'Phương thức thanh toán', options:['Tất cả','Point','VTC Pay','ATM','QR']}
    ],
    rows:[
      ['05/07/2026 10:00','MYVTC-REF-001','MYVTC-PAY-001','','PART-AU-0001','namnguyen91','Nguyễn Văn Nam','VTC Game','Game item','Au Mobile',120000,'',120000,'','Giao dịch lỗi sau khi trừ Point','system','Hoàn Point tự động'],
      ['05/07/2026 11:20','MYVTC-REF-002','MYVTC-PAY-002','VTP-20260705-201','PART-EDU-0008','minhpt','Phạm Tuấn Minh','VTC Edu','Gói dịch vụ','VTC Edu',0,90000,0,90000,'Đối tác hủy đơn hàng','hongtt','Hoàn qua VTC Pay'],
      ['05/07/2026 15:10','MYVTC-REF-003','MYVTC-PAY-003','','PART-CF-0021','lananh88','Trần Lan Anh','VTC Game','Game item','CrossFire',250000,'',50000,'','Hoàn một phần theo yêu cầu CSKH','minhnq',''],
      ['05/07/2026 16:05','MYVTC-REF-004','MYVTC-PAY-004','VTP-20260705-245','PART-VCH-0033','hoanglam','Hoàng Lâm','Đối tác SSO','Voucher','Voucher data',0,50000,0,50000,'Không nhận được mã voucher','system','Hoàn tiền thành công'],
      ['05/07/2026 17:42','MYVTC-REF-005','MYVTC-PAY-005','VTP-20260705-260','PART-QR-0099','thuylinh','Nguyễn Thùy Linh','VTC Pay','Gói dịch vụ','Vcoin Game',0,300000,0,300000,'Giao dịch bị đối tác từ chối','hongtt','Đã đối soát']
    ]
  },
  rankStatReport:{
    filters:[
      {label:'Từ ngày', type:'date', value:'2026-07-01'},
      {label:'Đến ngày', type:'date', value:'2026-07-05'},
      {label:'Hạng thành viên', options:['Tất cả','Đồng','Bạc','Vàng','Bạch Kim','Kim Cương']}
    ],
    summaryRows:[
      ['Số lượt nâng hạng','807'],
      ['Số lượt giáng hạng','448'],
      ['Số lượt duy trì hạng','111.192']
    ],
    pieTitle:'Tỷ trọng và số lượng từng hạng thành viên',
    pieRows:[['Đồng',72500],['Bạc',28120],['Vàng',9450],['Bạch Kim',6120],['Kim Cương',3024]],
    columns:['Username','Họ tên','Hạng kết thúc','Hạng bắt đầu','Số lượt nâng hạng trong kỳ','Số lượt giáng hạng trong kỳ','Số lượt duy trì hạng trong kỳ','Tổng số lượt biến động trong kỳ'],
    rows:[
      ['namnguyen91','Nguyễn Văn Nam','Bạc','Đồng',1,0,0,1],
      ['minhpt','Phạm Tuấn Minh','Vàng','Bạc',1,0,0,1],
      ['lananh88','Trần Lan Anh','Bạch Kim','Vàng',1,0,0,1],
      ['hoanglam','Hoàng Lâm','Bạc','Vàng',0,1,0,1],
      ['thuylinh','Nguyễn Thùy Linh','Kim Cương','Kim Cương',0,0,1,1]
    ]
  },
  expStatReport:{
    filters:[
      {label:'Từ ngày', type:'date', value:'2026-07-01'},
      {label:'Đến ngày', type:'date', value:'2026-07-05'},
      {label:'Dịch vụ', options:['Tất cả','VTC Game','VTC Pay','VTC Edu','MyVTC','Đối tác SSO']}
    ],
    summaryRows:[
      ['Số lượt cộng T-EXP','18.420'],
      ['Số lượt cộng A-EXP','6.980'],
      ['Số người dùng phát sinh EXP','23.500']
    ],
    pieTitle:'Tỷ trọng và số lượng T-EXP / A-EXP',
    pieRows:[['T-EXP',3940000],['A-EXP',880000]],
    columns:['Username','Họ tên','Hạng trong kỳ','Tổng EXP phát sinh trong kỳ','Tổng T-EXP trong kỳ','Số GD cộng T-EXP trong kỳ','Tổng A-EXP trong kỳ','Số GD cộng A-EXP trong kỳ','Tỷ lệ T-EXP / A-EXP trong kỳ','Nguồn phát sinh T-EXP'],
    rows:[
      ['namnguyen91','Nguyễn Văn Nam','Bạc',185000,150000,8,35000,5,'81,1% / 18,9%','VTC Game'],
      ['minhpt','Phạm Tuấn Minh','Vàng',248000,210000,11,38000,4,'84,7% / 15,3%','VTC Pay'],
      ['lananh88','Trần Lan Anh','Bạch Kim',316000,260000,13,56000,7,'82,3% / 17,7%','VTC Edu'],
      ['hoanglam','Hoàng Lâm','Bạc',127000,98000,6,29000,3,'77,2% / 22,8%','Đối tác SSO'],
      ['thuylinh','Nguyễn Thùy Linh','Kim Cương',402000,335000,16,67000,8,'83,3% / 16,7%','VTC Game']
    ]
  },
  offerEventReport:{
    filters:[
      {label:'Từ ngày', type:'date', value:'2026-07-01'},
      {label:'Đến ngày', type:'date', value:'2026-07-05'},
      {label:'Nhóm ưu đãi', options:['Tất cả','Ưu đãi nâng hạng','Ưu đãi sự kiện hành vi']},
      {label:'Tên chương trình/sự kiện', options:['Tất cả','Đăng nhập hàng ngày','Xác minh eKYC','Ưu đãi lên hạng Vàng','Giới thiệu bạn bè']},
      {label:'Loại phần thưởng phát ra', options:['Tất cả','Point','Voucher']}
    ],
    summaryRows:[
      ['Tổng số lượt kích hoạt','8.420'],
      ['Số user duy nhất nhận thưởng','6.315'],
      ['Tổng quỹ Point đã phát','1.250.000'],
      ['Tổng số Voucher đã phát','3.180'],
      ['Tỷ lệ chuyển đổi sự kiện','47,6%'],
      ['Sự kiện thu hút nhất','Đăng nhập hàng ngày']
    ],
    columns:['Mã sự kiện / Mã chương trình','Tên sự kiện / Tên chương trình','Nhóm ưu đãi','Username','Họ tên','Thiết bị / IP kích hoạt','Giá trị Point nhận','Voucher nhận kèm','Thời điểm nhận thưởng','Chính sách áp dụng'],
    rows:[
      ['EVT_DAILY_LOGIN','Đăng nhập hàng ngày','Ưu đãi sự kiện hành vi','namnguyen91','Nguyễn Văn Nam','Android / 117.103.228.53',100,'','05/07/2026 08:15:22','Mỗi user nhận 1 lần/ngày'],
      ['EVT_EKYC_VERIFY','Xác minh eKYC','Ưu đãi sự kiện hành vi','minhpt','Phạm Tuấn Minh','iOS / 14.225.12.90',5000,'','05/07/2026 09:42:10','Tài khoản eKYC thành công lần đầu'],
      ['RANK_GOLD_2026','Ưu đãi lên hạng Vàng','Ưu đãi nâng hạng','lananh88','Trần Lan Anh','Web / 113.160.55.21',20000,'VOUCHER-GOLD-20','05/07/2026 10:30:45','Nhận thưởng khi lên hạng Vàng'],
      ['EVT_REFERRAL','Giới thiệu bạn bè','Ưu đãi sự kiện hành vi','hoanglam','Hoàng Lâm','Android / 42.113.10.88',10000,'','05/07/2026 11:05:33','Bạn được giới thiệu đăng ký và xác thực hợp lệ'],
      ['RANK_PLATINUM_2026','Ưu đãi lên hạng Bạch Kim','Ưu đãi nâng hạng','thuylinh','Nguyễn Thùy Linh','iOS / 123.24.88.12',30000,'VOUCHER-PLAT-50','05/07/2026 14:22:08','Nhận thưởng khi lên hạng Bạch Kim']
    ]
  }
};

var userOverviewGroups = [
  {title:'1. Summary bar', icon:'fa-chart-line', items:[
    ['Tổng người dùng','114.884','+2,4%','Tổng số tài khoản đã đăng ký và chưa bị xóa vĩnh viễn tại thời điểm cuối kỳ.','new-account-stat'],
    ['Người dùng hoạt động','68.240','+1,8%','Tài khoản có ít nhất một hoạt động hợp lệ trong 30 ngày gần nhất.','new-account-stat'],
    ['Người dùng hoạt động trong ngày','12.486','+4,1%','Tài khoản có ít nhất một hoạt động hợp lệ trong ngày báo cáo. Mỗi tài khoản chỉ tính một lần.','behavior-pending'],
    ['Tỷ lệ rời bỏ','8,7%','-0,6%','Tỷ lệ tài khoản không phát sinh bất kỳ hoạt động nào trong 90 ngày liên tiếp trên tập người dùng hoạt động đầu kỳ.','behavior-pending']
  ]},
  {title:'2. Đăng nhập & bảo mật', icon:'fa-shield-alt', items:[
    ['Phân bố phương thức đăng nhập','Mật khẩu 48,6% · OTP 31,2% · Social 20,2%','+1,1%','Tỷ lệ số lượt đăng nhập thành công theo từng phương thức trên tổng số lượt đăng nhập thành công trong kỳ.','behavior-pending'],
    ['Tỷ lệ bật xác thực 2 bước','27,7%','+0,9%','Tỷ lệ tài khoản đang bật xác thực 2 bước trên tổng số người dùng hoạt động.',''],
    ['Phương thức OTP ưa dùng','SMS 61,4% · Email 22,8% · Zalo 15,8%','—','Tỷ lệ người dùng đang dùng từng phương thức OTP mặc định trên tổng số người dùng đã bật 2FA.',''],
    ['Phiên đăng nhập đang hoạt động','18.920','+3,4%','Tổng số phiên đăng nhập còn hiệu lực tại thời điểm xem báo cáo.','']
  ]},
  {title:'3. Hồ sơ và danh tính', icon:'fa-id-card', items:[
    ['Tỷ lệ liên kết email','71,8%','+1,3%','Tỷ lệ tài khoản đã xác thực email thành công trên tổng số tài khoản.',''],
    ['Đã xác thực eKYC','36,8%','+2,0%','Tỷ lệ tài khoản có trạng thái eKYC được phê duyệt trên tổng số tài khoản.','behavior-pending'],
    ['Tài khoản liên kết Third Party','19,5%','+0,8%','Tỷ lệ tài khoản đã gắn kết hoặc xác thực ít nhất một đối tác tích hợp trên tổng số tài khoản.','behavior-pending']
  ]},
  {title:'4. Loyalty', icon:'fa-gem', items:[
    ['EXP bình quân / người dùng','42,0','+1,4%','Tổng EXP phát sinh trong kỳ chia cho số người dùng hoạt động trong kỳ.','exp-stat'],
    ['Tỷ lệ nâng hạng / giáng hạng','Nâng 2,1% · Giáng 0,4%','+0,2%','Tỷ lệ người dùng được nâng hạng hoặc giáng hạng trong kỳ trên tổng số người dùng hoạt động.','rank-stat'],
    ['Snapshot phân bố hạng thành viên','Đồng 63,1% · Bạc 24,5% · Vàng 9,8% · Kim cương 2,6%','—','Phân bố số lượng và tỷ lệ thành viên theo từng hạng tại thời điểm cuối kỳ báo cáo.',''],
    ['Tỷ lệ hoàn thành nhiệm vụ','64,7%','+3,2%','Tỷ lệ nhiệm vụ đã hoàn thành trên tổng số nhiệm vụ được giao trong kỳ.','offer-event-stat'],
    ['Tỷ lệ điểm danh hằng ngày','38,5%','+1,7%','Tỷ lệ người dùng điểm danh thành công trong ngày trên tổng số DAU. Mỗi người dùng chỉ tính một lần mỗi ngày.',''],
    ['Voucher đã phát / đã dùng','3.180 / 1.245','39,2%','Tổng voucher được cấp, tổng voucher được sử dụng và tỷ lệ dùng trên tổng voucher còn hiệu lực.','offer-event-stat'],
    ['Trung bình vật phẩm chưa sử dụng','2,4','—','Tổng vật phẩm chưa sử dụng chia cho số người dùng có vật phẩm còn hiệu lực.',''],
    ['Giới thiệu bạn bè thành công','420','+5,0%','Số lượt giới thiệu đáp ứng đầy đủ điều kiện ghi nhận thưởng trong kỳ báo cáo.','']
  ]},
  {title:'5. Thanh toán & Point', icon:'fa-coins', items:[
    ['Tổng Point đang lưu hành','12.840.000.000','+2,9%','Tổng số dư Point hiện tại trên toàn hệ thống. Point đã phát hành trừ Point đã tiêu dùng và thu hồi.','point-topup'],
    ['Point phát hành trong kỳ','8.920.000.000','+4,8%','Tổng Point được cộng cho người dùng từ giao dịch hợp lệ và nạp thủ công trong kỳ.',''],
    ['Point tiêu dùng trong kỳ','6.450.000.000','+3,5%','Tổng Point được dùng để thanh toán dịch vụ trong kỳ.','payment-transaction'],
    ['Tỷ lệ người dùng có giao dịch Point','18,6%','+1,2%','Tỷ lệ tài khoản hoạt động đã thực hiện ít nhất 1 giao dịch liên quan đến Point trong kỳ.',''],
    ['Phân bố phương thức thanh toán','Point 72,4% · VTC Pay 27,6%','—','Tỷ lệ giao dịch thực hiện qua Point so với VTC Pay.','payment-transaction'],
    ['Giá trị giao dịch bình quân (ATV)','Point 128.000 · VTC Pay 165.000','+2,3%','Giá trị trung bình mỗi giao dịch thanh toán trong kỳ, phân tách theo Point và VTC Pay.','payment-transaction'],
    ['Giao dịch hoàn Point','315 lượt · 215.000.000 Point','2,1%','Số lượt và tổng giá trị Point được hoàn trả trong kỳ. Tỷ lệ hoàn so với tổng giao dịch.','refund-transaction'],
    ['Top sản phẩm bán chạy trong cửa hàng','Vcoin Game · Au Mobile · VTC Edu · CrossFire · Voucher data','—','Danh sách 5–10 sản phẩm hoặc dịch vụ được mua nhiều nhất bằng Point.','payment-transaction']
  ]}
];

var newAccountStatDimensionOptions = {
  accountType:['Username','SĐT','Email','Google','Facebook','Apple','Guest'],
  channel:['SSO','API','SDK'],
  product:['MyVTC','Silkroad Origin VTC','Football Pro VTC','Audition'],
  device:['Android','iOS','Web']
};

var newAccountStatDimensionLabels = {
  accountType:'Loại tài khoản',
  channel:'Kênh tạo tài khoản',
  product:'Sản phẩm phát sinh',
  device:'Thiết bị'
};

var newAccountStatDailyTotals = [
  ['01/07/2026',2860],
  ['02/07/2026',3240],
  ['03/07/2026',3680],
  ['04/07/2026',4120],
  ['05/07/2026',4760],
  ['06/07/2026',4820],
  ['07/07/2026',5240]
];

var newAccountStatSource = null;
var newAccountStatLastState = null;

function billingDateDisplayToISO(value){
  var parts = String(value || '').split('/');
  if(parts.length !== 3) return value;
  return parts[2] + '-' + parts[1] + '-' + parts[0];
}

function billingDateISOToDisplay(value){
  var parts = String(value || '').split('-');
  if(parts.length !== 3) return value;
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function billingNewAccountBuildSource(){
  if(newAccountStatSource) return newAccountStatSource;
  var typeWeight = {'Username':30,'SĐT':22,'Email':14,'Google':12,'Facebook':10,'Apple':6,'Guest':6};
  var channelWeight = {'SSO':40,'API':25,'SDK':35};
  var productWeight = {'MyVTC':46,'Silkroad Origin VTC':24,'Football Pro VTC':18,'Audition':12};
  var deviceWeight = {'Android':48,'iOS':30,'Web':22};
  var rows = [];

  newAccountStatDailyTotals.forEach(function(dayRow,dayIndex){
    var target = dayRow[1];
    var dayCells = [];
    var weightTotal = 0;
    newAccountStatDimensionOptions.accountType.forEach(function(accountType,typeIndex){
      newAccountStatDimensionOptions.channel.forEach(function(channel,channelIndex){
        newAccountStatDimensionOptions.product.forEach(function(product,productIndex){
          newAccountStatDimensionOptions.device.forEach(function(device,deviceIndex){
            var compatibility = 1;
            if(channel === 'SDK' && device === 'Web') compatibility = 0.12;
            if(channel === 'API' && device !== 'Web') compatibility *= 0.45;
            if(channel === 'API' && device === 'Web') compatibility *= 1.35;
            if(channel === 'SSO' && ['Google','Facebook','Apple'].indexOf(accountType) >= 0) compatibility *= 1.55;
            if(accountType === 'Guest' && channel === 'SDK') compatibility *= 1.35;
            if(product === 'MyVTC') compatibility *= 1.08;
            var dayVariation = 1 + (((dayIndex + typeIndex * 2 + channelIndex + productIndex * 3 + deviceIndex) % 7) - 3) * 0.012;
            var weight = typeWeight[accountType] * channelWeight[channel] * productWeight[product] * deviceWeight[device] * compatibility * dayVariation;
            var cell = {date:dayRow[0],accountType:accountType,channel:channel,product:product,device:device,weight:weight,count:0,fraction:0};
            dayCells.push(cell);
            weightTotal += weight;
          });
        });
      });
    });

    var allocated = 0;
    dayCells.forEach(function(cell){
      var exact = target * cell.weight / weightTotal;
      cell.count = Math.floor(exact);
      cell.fraction = exact - cell.count;
      allocated += cell.count;
    });
    dayCells.sort(function(a,b){return b.fraction - a.fraction;});
    for(var i=0;i<target-allocated;i++) dayCells[i % dayCells.length].count += 1;
    dayCells.forEach(function(cell){
      delete cell.weight;
      delete cell.fraction;
      if(cell.count > 0) rows.push(cell);
    });
  });
  newAccountStatSource = rows;
  return rows;
}

function billingNewAccountDefaultState(){
  return {
    from:'2026-07-01',
    to:'2026-07-07',
    accountType:[],
    channel:[],
    product:[],
    device:[],
    statistic:'accountType'
  };
}

var newAccountDetailRows = [
  ['ACC-00012881','namnguyen91','0912345678','namnguyen91@vtc.vn','05/07/2026 10:22','App','Android','Hoạt động','Chưa xác thực'],
  ['ACC-00012882','minhpt','0987654321','minhpt@vtc.vn','05/07/2026 10:35','Web','Web','Hoạt động','Đã xác thực'],
  ['ACC-00012883','google_001283','0901122334','google001283@gmail.com','05/07/2026 11:08','SSO đối tác','iOS','Hoạt động','Đã xác thực'],
  ['ACC-00012884','apple_001284','0933445566','apple001284@icloud.com','05/07/2026 13:44','App','iOS','Hoạt động','Chưa xác thực'],
  ['ACC-00012885','partner_api_1285','0922110099','partner1285@vtc.vn','05/07/2026 14:12','API đối tác','Web','Tạm khóa','Chưa xác thực'],
  ['ACC-00012886','hoanglam','0966887799','hoanglam@vtc.vn','05/07/2026 15:30','Web','Web','Hoạt động','Chưa xác thực']
];
function billingRenderSimpleRows(targetId,rows,columns){
  var target = document.getElementById(targetId);
  if(!target) return;
  target.innerHTML = rows.map(function(row){
    return '<tr>' + row.map(function(cell,index){
      var cls = index >= columns - 2 && typeof cell === 'number' ? ' class="number"' : '';
      var value = typeof cell === 'number' ? billingNumber(cell) : billingSafe(cell);
      return '<td' + cls + '>' + value + '</td>';
    }).join('') + '</tr>';
  }).join('');
}

function billingRenderAdminTables(){
  billingRenderSimpleRows('billingAdminRows',billingAdmins,7);
  billingRenderSimpleRows('billingUserLogRows',billingUserLogs,6);
  billingRenderSimpleRows('billingErrorLogRows',billingErrorLogs,6);

  document.querySelectorAll('#billingUserLogRows tr td:last-child,#billingErrorLogRows tr td:last-child,#billingAdminRows tr td:nth-child(5)').forEach(function(td){
    td.className = billingStatusClass(td.textContent);
  });
}

function billingValue(value){
  return value === null || value === undefined || value === '' ? '—' : billingSafe(value);
}

function billingDetailButton(screen){
  if(!screen) return '';
  return '<button class="report-detail-btn" type="button" onclick="billingGoReportDetail(\'' + billingSafe(screen) + '\')">Xem chi tiết</button>';
}

function billingGoReportDetail(screen){
  var node = document.getElementById('screen-' + screen);
  if(node){
    showScreen(screen);
    window.scrollTo({top:0,behavior:'smooth'});
    return;
  }
  alert('Màn hình báo cáo chuyên sâu đang chờ cập nhật.');
}

function billingBuildGlobalFilter(includeExport){
  return '<div class="report-filter report-filter-global">'
    + '<label>Kỳ thời gian<select class="select"><option>Hôm nay</option><option selected>7 ngày</option><option>30 ngày</option><option>Tùy chọn</option></select></label>'
    + '<label>Từ ngày<input class="input" type="date" value="2026-07-01"></label>'
    + '<label>Đến ngày<input class="input" type="date" value="2026-07-05"></label>'
    + '<label>Đơn vị tích hợp<select class="select"><option>All</option><option>VTC Game</option><option>VTC Pay</option><option>VTC Edu</option><option>Đối tác SSO</option></select></label>'
    + '<label>So sánh kỳ<select class="select"><option selected>Bật</option><option>Tắt</option></select></label>'
    + '<div class="report-actions"><button class="btn green" type="button" onclick="billingSearchReport()"><i class="fa fa-search"></i> Tìm kiếm</button>'
    + (includeExport ? '<button class="btn orange" type="button" onclick="billingExportReport()"><i class="fa fa-file-excel"></i> Xuất Excel</button>' : '')
    + '</div></div>';
}

function billingBuildLineChart(rows){
  var width = 720;
  var height = 240;
  var padX = 44;
  var padY = 28;
  var values = rows.map(function(row){return row[1];});
  var max = Math.max.apply(null,values);
  var min = Math.min.apply(null,values);
  var range = Math.max(1,max - min);
  var points = rows.map(function(row,index){
    var x = padX + (rows.length === 1 ? 0 : index * ((width - padX * 2) / (rows.length - 1)));
    var y = height - padY - ((row[1] - min) / range) * (height - padY * 2);
    return [Math.round(x),Math.round(y),row];
  });
  var area = points.map(function(point){return point[0] + ',' + point[1];}).join(' ');
  var axis = [min,Math.round((min + max) / 2),max].map(function(value){
    var y = height - padY - ((value - min) / range) * (height - padY * 2);
    return '<g><line x1="' + padX + '" y1="' + Math.round(y) + '" x2="' + (width - padX) + '" y2="' + Math.round(y) + '" class="line-grid"/><text x="8" y="' + (Math.round(y) + 4) + '" class="line-axis">' + billingNumber(value) + '</text></g>';
  }).join('');
  var dots = points.map(function(point){
    return '<g><circle cx="' + point[0] + '" cy="' + point[1] + '" r="4" class="line-dot"/><text x="' + point[0] + '" y="' + (height - 6) + '" class="line-label">' + billingSafe(point[2][0]) + '</text></g>';
  }).join('');
  return '<div class="line-chart"><svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Người dùng hoạt động theo thời gian">'
    + axis + '<polyline class="line-stroke" points="' + area + '"/>' + dots + '</svg></div>';
}

function billingBuildPieChart(rows){
  var total = rows.reduce(function(sum,row){return sum + row[1];},0) || 1;
  var start = 0;
  var stops = rows.map(function(row,index){
    var pct = row[1] / total * 100;
    var color = ['#1a73e8','#34a853','#fbbc04','#ea4335','#8e44ad','#00acc1'][index % 6];
    var part = color + ' ' + start.toFixed(2) + '% ' + (start + pct).toFixed(2) + '%';
    start += pct;
    return part;
  }).join(',');
  var legend = rows.map(function(row,index){
    var color = ['#1a73e8','#34a853','#fbbc04','#ea4335','#8e44ad','#00acc1'][index % 6];
    var pct = (row[1] / total * 100).toFixed(1).replace('.',',') + '%';
    return '<div class="pie-legend-row"><i style="background:' + color + '"></i><span>' + billingSafe(row[0]) + '</span><b>' + billingNumber(row[1]) + '</b><em>' + pct + '</em></div>';
  }).join('');
  return '<div class="pie-chart-wrap"><div class="pie-chart" style="background:conic-gradient(' + stops + ')"></div><div class="pie-legend">' + legend + '</div></div>';
}


function billingBuildUserOverviewReport(){
  var kpis = [
    ['Người dùng','114.884','+2,4%'],
    ['Người dùng mới','2.344','+10,7%'],
    ['Người dùng hoạt động','68.240','+1,8%'],
    ['Tỷ lệ rời bỏ','8,7%','-0,6%']
  ].map(function(item){
    return '<div class="ga-kpi-card"><span>' + billingSafe(item[0]) + '</span><strong>' + billingValue(item[1]) + '</strong><small>' + billingValue(item[2]) + ' so kỳ trước</small></div>';
  }).join('');

  var trendRows = [
    ['01/07',8200],
    ['02/07',7900],
    ['03/07',8750],
    ['04/07',9300],
    ['05/07',10120],
    ['06/07',9880],
    ['07/07',10460]
  ];
  var trend = billingBuildLineChart(trendRows);

  var sourceRows = [
    ['App',42120],
    ['Web',18340],
    ['API đối tác',5220],
    ['SSO đối tác',2560]
  ];
  var sourceChart = billingBuildPieChart(sourceRows);

  var loginRows = [
    ['Mật khẩu','48,6%',486],
    ['OTP','31,2%',312],
    ['Google / Apple / Facebook','20,2%',202]
  ].map(function(row){
    return '<div class="ga-progress-row"><div><b>' + billingSafe(row[0]) + '</b><span>' + billingSafe(row[1]) + '</span></div><em><i style="width:' + row[2] / 10 + '%"></i></em></div>';
  }).join('');

  var realtimeRows = [
    ['Đang online','1.286'],
    ['DAU','12.486'],
    ['Phiên còn hiệu lực','18.920'],
    ['Bật 2FA','27,7%']
  ].map(function(row){
    return '<div class="ga-mini-metric"><span>' + billingSafe(row[0]) + '</span><strong>' + billingSafe(row[1]) + '</strong></div>';
  }).join('');

  var loyaltyRows = [
    ['Đồng',72500],
    ['Bạc',28120],
    ['Vàng',11240],
    ['Kim cương',3024]
  ];
  var loyaltyChart = billingBuildPieChart(loyaltyRows);

  return billingBuildGlobalFilter(false)
    + '<div class="ga-dashboard">'
    + '<div class="ga-kpi-grid">' + kpis + '</div>'
    + '<div class="ga-main-grid">'
    + '<section class="ga-panel ga-panel-wide"><div class="ga-panel-head"><h3>Người dùng hoạt động theo thời gian</h3><span>7 ngày gần nhất</span></div><div class="ga-chart">' + trend + '</div></section>'
    + '<section class="ga-panel"><div class="ga-panel-head"><h3>Thời gian thực</h3><span>30 phút gần nhất</span></div><div class="ga-mini-grid">' + realtimeRows + '</div></section>'
    + '</div>'
    + '<div class="ga-two-grid">'
    + '<section class="ga-panel"><div class="ga-panel-head"><h3>Nguồn người dùng</h3><button class="report-detail-btn" type="button" onclick="billingGoReportDetail(\'new-account-stat\')">Xem chi tiết</button></div>' + sourceChart + '</section>'
    + '<section class="ga-panel"><div class="ga-panel-head"><h3>Phương thức đăng nhập</h3><button class="report-detail-btn" type="button" onclick="billingGoReportDetail(\'behavior-pending\')">Xem chi tiết</button></div><div class="ga-progress-list">' + loginRows + '</div></section>'
    + '<section class="ga-panel"><div class="ga-panel-head"><h3>Phân bố hạng thành viên</h3><button class="report-detail-btn" type="button" onclick="billingGoReportDetail(\'rank-stat\')">Xem chi tiết</button></div>' + loyaltyChart + '</section>'
    + '<section class="ga-panel"><div class="ga-panel-head"><h3>Hồ sơ và bảo mật</h3><button class="report-detail-btn" type="button" onclick="billingGoReportDetail(\'new-account-detail\')">Xem chi tiết</button></div><div class="ga-mini-grid"><div class="ga-mini-metric"><span>Liên kết email</span><strong>71,8%</strong></div><div class="ga-mini-metric"><span>Đã eKYC</span><strong>36,8%</strong></div><div class="ga-mini-metric"><span>Liên kết Third Party</span><strong>19,5%</strong></div><div class="ga-mini-metric"><span>OTP SMS</span><strong>61,4%</strong></div></div></section>'
    + '</div></div>';
}

function billingNewAccountMultiSelect(key,label,options){
  var optionHtml = '<label class="report-multi-option all-option"><input type="checkbox" value="__all__" checked onchange="billingNewAccountMultiChange(this)"><span>Tất cả</span></label>'
    + options.map(function(option){
      return '<label class="report-multi-option"><input type="checkbox" value="' + billingSafe(option) + '" onchange="billingNewAccountMultiChange(this)"><span>' + billingSafe(option) + '</span></label>';
    }).join('');
  return '<div class="new-account-field"><span class="new-account-field-label">' + billingSafe(label) + '</span>'
    + '<details class="report-multi" data-key="' + billingSafe(key) + '"><summary><span class="report-multi-text">Tất cả</span><i class="fa fa-chevron-down"></i></summary><div class="report-multi-menu">' + optionHtml + '</div></details></div>';
}

function billingNewAccountMultiChange(input){
  var details = input.closest('.report-multi');
  if(!details) return;
  var all = details.querySelector('input[value="__all__"]');
  var items = Array.prototype.slice.call(details.querySelectorAll('input:not([value="__all__"])'));
  if(input.value === '__all__'){
    if(input.checked) items.forEach(function(item){item.checked = false;});
  }else if(input.checked){
    all.checked = false;
  }
  if(!all.checked && !items.some(function(item){return item.checked;})) all.checked = true;
  var selected = items.filter(function(item){return item.checked;}).map(function(item){return item.value;});
  var text = details.querySelector('.report-multi-text');
  if(text){
    if(all.checked || !selected.length) text.textContent = 'Tất cả';
    else if(selected.length <= 2) text.textContent = selected.join(', ');
    else text.textContent = 'Đã chọn ' + selected.length + ' giá trị';
  }
}

function billingNewAccountGetMultiValues(key){
  var details = document.querySelector('#newAccountStatReport .report-multi[data-key="' + key + '"]');
  if(!details) return [];
  var all = details.querySelector('input[value="__all__"]');
  if(all && all.checked) return [];
  return Array.prototype.slice.call(details.querySelectorAll('input:not([value="__all__"]):checked')).map(function(input){return input.value;});
}

function billingNewAccountReadState(){
  var defaults = billingNewAccountDefaultState();
  var stat = document.getElementById('newAccountStatistic');
  var from = document.getElementById('newAccountFrom');
  var to = document.getElementById('newAccountTo');
  return {
    from:from ? from.value : defaults.from,
    to:to ? to.value : defaults.to,
    accountType:billingNewAccountGetMultiValues('accountType'),
    channel:billingNewAccountGetMultiValues('channel'),
    product:billingNewAccountGetMultiValues('product'),
    device:billingNewAccountGetMultiValues('device'),
    statistic:stat ? stat.value : defaults.statistic
  };
}

function billingNewAccountFilterRows(state){
  var from = state.from || '0000-01-01';
  var to = state.to || '9999-12-31';
  if(from > to){
    var temp = from; from = to; to = temp;
  }
  return billingNewAccountBuildSource().filter(function(row){
    var iso = billingDateDisplayToISO(row.date);
    if(iso < from || iso > to) return false;
    if(state.accountType.length && state.accountType.indexOf(row.accountType) < 0) return false;
    if(state.channel.length && state.channel.indexOf(row.channel) < 0) return false;
    if(state.product.length && state.product.indexOf(row.product) < 0) return false;
    if(state.device.length && state.device.indexOf(row.device) < 0) return false;
    return true;
  });
}

function billingNewAccountOrderedValues(key,rows){
  if(key === 'time'){
    return rows.map(function(row){return row.date;}).filter(function(value,index,self){return self.indexOf(value) === index;}).sort(function(a,b){return billingDateDisplayToISO(a).localeCompare(billingDateDisplayToISO(b));});
  }
  var canonical = newAccountStatDimensionOptions[key] || [];
  var found = {};
  rows.forEach(function(row){found[row[key]] = true;});
  return canonical.filter(function(value){return found[value];});
}

function billingNewAccountGroupRows(rows,state){
  var dimension = state.statistic || 'accountType';
  var dimensionValues = billingNewAccountOrderedValues(dimension,rows);
  var dates = rows.map(function(row){return row.date;}).filter(function(value,index,self){return self.indexOf(value) === index;});
  dates.sort(function(a,b){return billingDateDisplayToISO(a).localeCompare(billingDateDisplayToISO(b));});

  var map = {};
  dates.forEach(function(date){
    var breakdown = {};
    dimensionValues.forEach(function(value){breakdown[value] = 0;});
    map[date] = {label:date,total:0,breakdown:breakdown};
  });

  rows.forEach(function(row){
    var date = row.date;
    var value = row[dimension];
    if(!map[date]){
      var breakdown = {};
      dimensionValues.forEach(function(item){breakdown[item] = 0;});
      map[date] = {label:date,total:0,breakdown:breakdown};
      dates.push(date);
    }
    if(dimensionValues.indexOf(value) < 0){
      dimensionValues.push(value);
      dates.forEach(function(itemDate){if(map[itemDate]) map[itemDate].breakdown[value] = map[itemDate].breakdown[value] || 0;});
    }
    map[date].total += row.count;
    map[date].breakdown[value] = (map[date].breakdown[value] || 0) + row.count;
  });

  dates = dates.filter(function(value,index,self){return self.indexOf(value) === index;});
  dates.sort(function(a,b){return billingDateDisplayToISO(a).localeCompare(billingDateDisplayToISO(b));});
  var groups = dates.map(function(date){return map[date];});
  var totalBreakdown = {};
  dimensionValues.forEach(function(value){totalBreakdown[value] = 0;});
  var total = 0;
  groups.forEach(function(group){
    total += group.total;
    dimensionValues.forEach(function(value){totalBreakdown[value] += group.breakdown[value] || 0;});
  });

  return {
    groups:groups,
    dimensionValues:dimensionValues,
    totalGroup:{label:'Tổng',total:total,breakdown:totalBreakdown}
  };
}

function billingNewAccountDaysInRange(state){
  var start = new Date((state.from || '2026-07-01') + 'T00:00:00');
  var end = new Date((state.to || '2026-07-07') + 'T00:00:00');
  if(isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  if(start > end){var tmp=start;start=end;end=tmp;}
  return Math.max(1,Math.round((end-start)/86400000)+1);
}

function billingNewAccountKpis(rows,grouped,state){
  var total = rows.reduce(function(sum,row){return sum + row.count;},0);
  var average = Math.round(total / billingNewAccountDaysInRange(state));
  var days = grouped.groups;
  var max = days.length ? days.reduce(function(best,row){return row.total > best.total ? row : best;},days[0]) : {total:0,label:'—'};
  var min = days.length ? days.reduce(function(best,row){return row.total < best.total ? row : best;},days[0]) : {total:0,label:'—'};
  return '<div class="new-account-kpi-grid">'
    + '<div class="new-account-kpi"><div class="new-account-kpi-icon blue"><i class="fa fa-user-plus"></i></div><div><span>Tổng tài khoản mới</span><strong>' + billingNumber(total) + '</strong></div></div>'
    + '<div class="new-account-kpi"><div class="new-account-kpi-icon green"><i class="fa fa-chart-column"></i></div><div><span>Trung bình/ngày</span><strong>' + billingNumber(average) + '</strong></div></div>'
    + '<div class="new-account-kpi"><div class="new-account-kpi-icon orange"><i class="fa fa-arrow-trend-up"></i></div><div><span>Cao nhất</span><strong>' + billingNumber(max.total) + '</strong><small>' + billingSafe(max.label) + '</small></div></div>'
    + '<div class="new-account-kpi"><div class="new-account-kpi-icon red"><i class="fa fa-arrow-trend-down"></i></div><div><span>Thấp nhất</span><strong>' + billingNumber(min.total) + '</strong><small>' + billingSafe(min.label) + '</small></div></div>'
    + '</div>';
}

function billingNewAccountSeriesColor(index){
  return ['#1a73e8','#34a853','#f9ab00','#8e44ad','#00acc1','#e8710a','#d93025','#5f6368','#7cb342','#3949ab'][index % 10];
}

function billingNewAccountLineChart(grouped,state){
  var groups = grouped.groups;
  if(!groups.length) return '<div class="new-account-empty-chart">Không có dữ liệu phù hợp với điều kiện lọc.</div>';
  var dimensionValues = grouped.dimensionValues;
  if(!dimensionValues.length) return '<div class="new-account-empty-chart">Không có dữ liệu phù hợp với tiêu chí thống kê.</div>';

  var series = dimensionValues.map(function(value){
    return {
      label:value,
      values:groups.map(function(row){return row.breakdown[value] || 0;}),
      total:grouped.totalGroup.breakdown[value] || 0
    };
  });

  var width = 980, height = 320, left = 62, right = 24, top = 28, bottom = 58;
  var allValues = [];
  series.forEach(function(item){allValues = allValues.concat(item.values);});
  var max = Math.max.apply(null,allValues.concat([1]));
  var stepBase = max > 5000 ? 1000 : (max > 1000 ? 500 : (max > 300 ? 100 : 50));
  var maxAxis = Math.ceil(max / stepBase) * stepBase;
  if(maxAxis < stepBase) maxAxis = stepBase;
  var plotW = width-left-right, plotH = height-top-bottom;
  var xAt = function(index){return groups.length === 1 ? left + plotW/2 : left + index * plotW/(groups.length-1);};
  var yAt = function(value){return top + plotH - (value/maxAxis)*plotH;};
  var grid = '';
  for(var i=0;i<=4;i++){
    var value = Math.round(maxAxis*(4-i)/4);
    var y = top + plotH*i/4;
    grid += '<line x1="' + left + '" y1="' + y + '" x2="' + (width-right) + '" y2="' + y + '" class="na-chart-grid"/><text x="' + (left-10) + '" y="' + (y+4) + '" class="na-chart-axis" text-anchor="end">' + billingNumber(value) + '</text>';
  }
  var xLabels = groups.map(function(row,index){
    return '<text x="' + xAt(index) + '" y="' + (height-18) + '" class="na-chart-label" text-anchor="middle">' + billingSafe(row.label.slice(0,5)) + '</text>';
  }).join('');
  var lines = series.map(function(item,index){
    var color = billingNewAccountSeriesColor(index);
    var points = item.values.map(function(value,i){return xAt(i) + ',' + yAt(value);}).join(' ');
    var dots = item.values.map(function(value,i){
      return '<circle cx="' + xAt(i) + '" cy="' + yAt(value) + '" r="4" fill="#fff" stroke="' + color + '" stroke-width="3"><title>' + billingSafe(groups[i].label) + ' · ' + billingSafe(item.label) + ': ' + billingNumber(value) + '</title></circle>';
    }).join('');
    return '<polyline points="' + points + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' + dots;
  }).join('');
  var legend = '<div class="new-account-chart-legend">' + series.map(function(item,index){
    return '<span title="Tổng trong khoảng thời gian"><i style="background:' + billingNewAccountSeriesColor(index) + '"></i>' + billingSafe(item.label) + ': ' + billingNumber(item.total) + '</span>';
  }).join('') + '</div>';
  return '<div class="new-account-chart-svg"><svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Biểu đồ tài khoản mới theo thời gian và ' + billingSafe(newAccountStatDimensionLabels[state.statistic] || 'tiêu chí') + '">' + grid + xLabels + lines + '</svg></div>' + legend;
}

function billingNewAccountBarChart(grouped,state){
  var groups = grouped.groups;
  if(!groups.length) return '<div class="new-account-empty-chart">Không có dữ liệu phù hợp với điều kiện lọc.</div>';
  var max = Math.max.apply(null,groups.map(function(row){return row.total;}).concat([1]));
  var rows = groups.map(function(row){
    return '<div class="na-bar-row"><span title="' + billingSafe(row.label) + '">' + billingSafe(row.label) + '</span><div class="na-bar-track"><span class="na-bar-single" style="width:' + Math.max(2,row.total/max*100) + '%"></span></div><b>' + billingNumber(row.total) + '</b></div>';
  }).join('');
  return '<div class="new-account-bar-chart">' + rows + '</div>';
}

function billingNewAccountTable(grouped,state){
  var dimensionLabel = newAccountStatDimensionLabels[state.statistic] || 'Tiêu chí';
  var headers = ['Thời gian','Tổng tài khoản mới'].concat(grouped.dimensionValues);
  var rows = grouped.groups.map(function(row){
    var cells = ['<td>' + billingSafe(row.label) + '</td>','<td class="number"><strong>' + billingNumber(row.total) + '</strong></td>'];
    grouped.dimensionValues.forEach(function(value){cells.push('<td class="number">' + billingNumber(row.breakdown[value] || 0) + '</td>');});
    return '<tr>' + cells.join('') + '</tr>';
  }).join('');

  var totalLabel = 'Tổng ' + (state.from ? billingDateISOToDisplay(state.from) : '') + ' - ' + (state.to ? billingDateISOToDisplay(state.to) : '');
  var totalCells = ['<td><strong>' + billingSafe(totalLabel) + '</strong></td>','<td class="number"><strong>' + billingNumber(grouped.totalGroup.total) + '</strong></td>'];
  grouped.dimensionValues.forEach(function(value){totalCells.push('<td class="number"><strong>' + billingNumber(grouped.totalGroup.breakdown[value] || 0) + '</strong></td>');});
  var totalRow = '<tr class="new-account-total-row">' + totalCells.join('') + '</tr>';

  return '<div class="report-title-row new-account-table-title"><h3><i class="fa fa-table"></i> Bảng thống kê</h3><span>Theo từng ngày · Thống kê theo ' + billingSafe(dimensionLabel.toLowerCase()) + '</span></div>'
    + '<div class="table-wrap"><table class="data-table new-account-stat-table"><thead><tr>' + headers.map(function(header){return '<th>' + billingSafe(header) + '</th>';}).join('') + '</tr></thead><tbody>' + rows + totalRow + '</tbody></table></div>'
    + '<div class="page-foot"><span>' + grouped.groups.length + ' ngày · Có tổng toàn khoảng thời gian</span><div class="pager"><button class="active">1</button></div></div>';
}

function billingBuildNewAccountStatResult(state){
  var rows = billingNewAccountFilterRows(state);
  var grouped = billingNewAccountGroupRows(rows,state);
  var dimensionLabel = newAccountStatDimensionLabels[state.statistic] || 'tiêu chí';
  var chartTitle = 'Xu hướng tài khoản mới theo ' + dimensionLabel.toLowerCase();
  var chart = billingNewAccountLineChart(grouped,state);
  return billingNewAccountKpis(rows,grouped,state)
    + '<section class="new-account-chart-card"><div class="new-account-chart-head"><h3><i class="fa fa-chart-line"></i> ' + billingSafe(chartTitle) + '</h3><span>Theo ngày · ' + billingSafe(state.from ? billingDateISOToDisplay(state.from) : '') + ' - ' + billingSafe(state.to ? billingDateISOToDisplay(state.to) : '') + '</span></div>' + chart + '</section>'
    + billingNewAccountTable(grouped,state);
}

function billingBuildNewAccountStatReport(){
  var state = billingNewAccountDefaultState();
  newAccountStatLastState = state;
  return '<div class="report-filter new-account-filter">'
    + '<label class="new-account-field new-account-time-field">Thời gian tạo<div class="new-account-time-control"><input class="input" id="newAccountFrom" type="date" value="' + state.from + '"><span>đến</span><input class="input" id="newAccountTo" type="date" value="' + state.to + '"></div></label>'
    + billingNewAccountMultiSelect('accountType','Loại tài khoản',newAccountStatDimensionOptions.accountType)
    + billingNewAccountMultiSelect('channel','Kênh tạo tài khoản',newAccountStatDimensionOptions.channel)
    + billingNewAccountMultiSelect('product','Sản phẩm phát sinh',newAccountStatDimensionOptions.product)
    + billingNewAccountMultiSelect('device','Thiết bị',newAccountStatDimensionOptions.device)
    + '<label class="new-account-field">Thống kê theo<select class="select" id="newAccountStatistic"><option value="accountType" selected>Loại tài khoản</option><option value="channel">Kênh tạo tài khoản</option><option value="product">Sản phẩm phát sinh</option><option value="device">Thiết bị</option></select></label>'
    + '<div class="report-actions new-account-actions"><button class="btn green" type="button" onclick="billingSearchNewAccountReport()"><i class="fa fa-search"></i> Tìm kiếm</button><button class="btn orange" type="button" onclick="billingExportNewAccountReport()"><i class="fa fa-file-excel"></i> Xuất Excel</button></div></div>'
    + '<div id="newAccountStatResult">' + billingBuildNewAccountStatResult(state) + '</div>';
}

function billingSearchNewAccountReport(){
  var state = billingNewAccountReadState();
  if(state.from && state.to && state.from > state.to){
    alert('Từ ngày không được lớn hơn Đến ngày.');
    return;
  }
  newAccountStatLastState = state;
  var result = document.getElementById('newAccountStatResult');
  if(result) result.innerHTML = billingBuildNewAccountStatResult(state);
}

function billingExportNewAccountReport(){
  var state = billingNewAccountReadState();
  var rows = billingNewAccountFilterRows(state);
  var grouped = billingNewAccountGroupRows(rows,state);
  var headers = ['Thời gian','Tổng tài khoản mới'].concat(grouped.dimensionValues);
  var csvRows = [headers];
  grouped.groups.forEach(function(row){
    var line = [row.label,row.total];
    grouped.dimensionValues.forEach(function(value){line.push(row.breakdown[value] || 0);});
    csvRows.push(line);
  });
  var totalLine = ['Tổng ' + (state.from ? billingDateISOToDisplay(state.from) : '') + ' - ' + (state.to ? billingDateISOToDisplay(state.to) : ''),grouped.totalGroup.total];
  grouped.dimensionValues.forEach(function(value){totalLine.push(grouped.totalGroup.breakdown[value] || 0);});
  csvRows.push(totalLine);
  var escapeCsv = function(value){var text=String(value == null ? '' : value);return '"' + text.replace(/"/g,'""') + '"';};
  var content = '\ufeff' + csvRows.map(function(row){return row.map(escapeCsv).join(',');}).join('\r\n');
  var blob = new Blob([content],{type:'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'MyVTC_Thong_ke_tai_khoan_moi_' + state.statistic + '_' + (state.from || '') + '_' + (state.to || '') + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function billingBuildNewAccountDetailReport(){
  var rows = newAccountDetailRows.map(function(row){
    return '<tr>' + row.map(function(cell,index){
      var cls = index === 7 ? billingStatusClass(cell) : '';
      return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + billingSafe(cell) + '</td>';
    }).join('') + '</tr>';
  }).join('');
  return '<div class="report-filter new-account-detail-filter">'
    + '<label>Tìm kiếm<input class="input" placeholder="UserID, Số điện thoại, Email, Tên tài khoản"></label>'
    + '<label>Kênh đăng ký<select class="select"><option>Tất cả</option><option>App</option><option>Web</option><option>API đối tác</option><option>SSO đối tác</option></select></label>'
    + '<label>Nền tảng<select class="select"><option>Tất cả</option><option>Android</option><option>iOS</option><option>Web</option></select></label>'
    + '<label>Trạng thái tài khoản<select class="select"><option>Tất cả</option><option>Hoạt động</option><option>Tạm khóa</option></select></label>'
    + '<label>Từ ngày<input class="input" type="date" value="2026-07-01"></label>'
    + '<label>Đến ngày<input class="input" type="date" value="2026-07-05"></label>'
    + '<label>Sắp xếp<select class="select"><option>Thời gian đăng ký giảm dần</option><option>Thời gian đăng ký tăng dần</option></select></label>'
    + '<div class="report-actions"><button class="btn green" type="button" onclick="billingSearchReport()"><i class="fa fa-search"></i> Tìm kiếm</button><button class="btn orange" type="button" onclick="billingExportReport()"><i class="fa fa-file-excel"></i> Xuất Excel/CSV</button></div></div>'
    + '<div class="report-title-row"><h3>Danh sách chi tiết tài khoản mới</h3><span>Hỗ trợ xuất Excel/CSV</span></div>'
    + '<div class="table-wrap"><table class="data-table new-account-detail-table"><thead><tr><th>User ID</th><th>Tên tài khoản</th><th>Số điện thoại</th><th>Email</th><th>Thời gian đăng ký</th><th>Kênh đăng ký</th><th>Nền tảng</th><th>Trạng thái tài khoản</th><th>Trạng thái eKYC</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
    + '<div class="page-foot"><span>Hiển thị ' + newAccountDetailRows.length + ' bản ghi dữ liệu mẫu</span><div class="pager"><button class="active">1</button><button>2</button><button>3</button></div></div>';
}

function billingBuildReport(config){
  if(config.type === 'userOverview') return billingBuildUserOverviewReport();
  if(config.type === 'newAccountStat') return billingBuildNewAccountStatReport();
  if(config.type === 'newAccountDetail') return billingBuildNewAccountDetailReport();

  var kpis = '';
  if(config.summaryRows){
    kpis = '<div class="ga-kpi-grid report-summary-grid">' + config.summaryRows.map(function(row){
        return '<div class="ga-kpi-card report-summary-card"><span>' + billingSafe(row[0]) + '</span><strong>' + billingSafe(row[1]) + '</strong></div>';
      }).join('') + '</div>';
  }else{
    kpis = '<div class="report-title-row"><h3>Số liệu tổng quan</h3></div>'
      + '<div class="ga-kpi-grid report-summary-grid">' + config.kpis.map(function(item){
        return '<div class="ga-kpi-card report-summary-card"><span>' + billingSafe(item[0]) + '</span><strong>' + billingSafe(item[1]) + '</strong></div>';
      }).join('') + '</div>';
  }

  var defaultFilters = [
    {label:'Từ ngày', type:'date', value:'2026-07-01'},
    {label:'Đến ngày', type:'date', value:'2026-07-05'},
    {label:'Dịch vụ', options:['Tất cả','VTC Game','VTC Pay','VTC Edu']},
    {label:'Trạng thái', options:['Tất cả','Thành công','Chờ xử lý','Thất bại']}
  ];
  var filterFields = config.filters || defaultFilters.concat(config.filterFields || []);
  var filterInputs = filterFields.map(function(field){
    if(field.type === 'date'){
      return '<label>' + billingSafe(field.label) + '<input class="input" type="date" value="' + billingSafe(field.value || '') + '"></label>';
    }
    return '<label>' + billingSafe(field.label) + '<select class="select">' + (field.options || []).map(function(option){
      return '<option>' + billingSafe(option) + '</option>';
    }).join('') + '</select></label>';
  }).join('');

  var filter = '<div class="report-filter">'
    + filterInputs
    + '<div class="report-actions"><button class="btn green" type="button" onclick="billingSearchReport()"><i class="fa fa-search"></i> Tìm kiếm</button><button class="btn orange" type="button" onclick="billingExportReport()"><i class="fa fa-file-excel"></i> Xuất Excel</button></div>'
    + '</div>';

  var pie = config.pieRows ? '<div class="report-chart-card"><div class="report-title-row"><h3>' + billingSafe(config.pieTitle || 'Cơ cấu') + '</h3></div>' + billingBuildPieChart(config.pieRows) + '</div>' : '';

  var table = '<div class="table-wrap report-table-wrap"><table class="data-table report-detail-table"><thead><tr>'
    + config.columns.map(function(col){return '<th>' + billingSafe(col) + '</th>';}).join('')
    + '</tr></thead><tbody>'
    + config.rows.map(function(row){
      return '<tr>' + row.map(function(cell){
        var cls = '';
        if(typeof cell === 'number') cls = ' class="number"';
        if(typeof cell === 'string' && billingStatusClass(cell)) cls = ' class="' + billingStatusClass(cell) + '"';
        return '<td' + cls + '>' + (typeof cell === 'number' ? billingNumber(cell) : billingSafe(cell)) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>'
    + '<div class="page-foot"><span>Hiển thị ' + config.rows.length + ' bản ghi dữ liệu mẫu</span><div class="pager"><button class="active">1</button><button>2</button><button>3</button></div></div>';

  return filter + kpis + pie + table;
}

function billingRenderReports(){
  Object.keys(reportConfigs).forEach(function(id){
    var target = document.getElementById(id);
    if(target) target.innerHTML = billingBuildReport(reportConfigs[id]);
  });
}

function billingSearchReport(){
  alert('Đã mô phỏng lọc dữ liệu báo cáo.');
}

function billingExportReport(){
  alert('Đã mô phỏng xuất Excel cho bảng dữ liệu hiện tại.');
}

function billingBindMenuClose(){
  document.addEventListener('click',function(e){
    if(!e.target.closest('.cms-menu-item')){
      document.querySelectorAll('.cms-menu-item').forEach(function(item){item.classList.remove('open');});
    }
    if(!e.target.closest('.report-multi')){
      document.querySelectorAll('.report-multi[open]').forEach(function(item){item.removeAttribute('open');});
    }
  });
}

document.addEventListener('DOMContentLoaded',function(){
  billingRenderAdminTables();
  billingRenderReports();
  billingBindMenuClose();
});
