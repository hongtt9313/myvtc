# MyVTC Demo

## Quy tắc chỉnh sửa
- Chỉ chỉnh sửa mã nguồn trong thư mục `src`.
- Sau khi chỉnh sửa, build lại thư mục `dist` bằng `python build.py`.
- Không chỉnh sửa trực tiếp các file trong `dist` nếu thay đổi có nguồn tương ứng trong `src`.
- Toàn bộ ghi chú cập nhật của dự án được duy trì trong duy nhất file `README.md` này.
- Không tạo thêm các file `README_UPDATE_*.md`, `README_FIX_*.md` hoặc file README riêng cho từng lần sửa.

## Cập nhật CMS Quản trị sản phẩm

### Danh sách sản phẩm
- Không hiển thị cột `Cấu hình hiển thị`.
- Giữ các thông tin nghiệp vụ của sản phẩm gồm:
  - Mã sản phẩm.
  - Tên sản phẩm.
  - Loại sản phẩm.
  - Đơn vị phân phối.
  - Nhà cung cấp.
  - Loại tài khoản.
  - Loại hồ sơ.
  - Trạng thái.
  - Chức năng.
- Cột `Đơn vị phân phối` và `Nhà cung cấp` được tăng độ rộng.
- Cột `Trạng thái` được thu hẹp.

### Icon con mắt tại cột Chức năng
- Icon con mắt mở popup thông tin sản phẩm gồm 2 tab:
  1. `Thông tin tích hợp`.
  2. `Thông tin hiển thị`.
- Popup mặc định mở tab `Thông tin hiển thị`.

### Tab Thông tin tích hợp
Hiển thị các thông tin tích hợp của sản phẩm như Service ID, Service Key, Return URL và các dữ liệu tích hợp liên quan đang có trong demo.

### Tab Thông tin hiển thị
Cho phép cấu hình sản phẩm trên 3 trang:
- Trang chủ.
- Trang Dịch vụ.
- Trang Cửa hàng.

Mỗi trang cấu hình:
- Kênh hiển thị: `Website`, `App`.
- Thứ tự ưu tiên: từ `1` đến `20`.

Quy ước:
- Không có trường `Cho phép hiển thị`.
- Không có trường `Nhóm hiển thị`.
- Nếu cả `Website` và `App` đều không được chọn thì sản phẩm không hiển thị tại trang tương ứng.
- Số ưu tiên nhỏ hơn được xếp trước.
- Nút lưu cấu hình trong popup hiển thị là `Cập nhật`.

### Thêm mới/Cập nhật sản phẩm
- Không hiển thị khối `Cấu hình hiển thị của sản phẩm` trong form Thêm mới/Cập nhật.
- Cấu hình hiển thị được thực hiện tại popup của icon con mắt trên danh sách sản phẩm.

## Rule Dịch vụ của tôi
Rule này nằm trong code, không cấu hình riêng trong CMS.

### Khách chưa đăng nhập
- Lấy tối đa 6 dịch vụ từ Danh sách dịch vụ.
- Ưu tiên dịch vụ có thứ tự ưu tiên cao nhất theo cấu hình hiện có.

### Khách đã đăng nhập
Hiển thị tối đa 6 dịch vụ theo thứ tự:
1. Dịch vụ đã liên kết hoặc từng đăng nhập.
2. Dịch vụ có giao dịch thành công gần đây.
3. Dịch vụ dùng thường xuyên.
4. Dịch vụ truy cập gần đây.
5. Dịch vụ đã xem nhiều lần.
6. Nếu chưa đủ 6, bổ sung các dịch vụ còn lại trong Danh sách dịch vụ theo thứ tự ưu tiên.

## File nguồn liên quan đã chỉnh sửa
- `src/cms.template.html`
- `src/scripts/cms.js`
- `src/styles/cms.css`

## File build tương ứng
- `dist/CMS.html`
- `dist/scripts/cms.js`
- `dist/styles/cms.css`
