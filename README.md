# MyVTC Demo

## Quy tắc chỉnh sửa
- Chỉ chỉnh sửa mã nguồn trong thư mục `src`.
- Sau khi chỉnh sửa, build lại thư mục `dist` bằng `python build.py`.
- Không chỉnh sửa trực tiếp file trong `dist` nếu có file nguồn tương ứng trong `src`.
- Toàn bộ ghi chú cập nhật của dự án được duy trì trong duy nhất file `README.md` này.
- Không tạo thêm README riêng cho từng lần sửa.

## CMS Sản phẩm

### Quản trị sản phẩm
- Quản lý thông tin nghiệp vụ của sản phẩm.
- Danh sách gồm: Mã sản phẩm, Tên sản phẩm, Loại sản phẩm, Đơn vị phân phối, Nhà cung cấp, Loại tài khoản, Loại hồ sơ, Trạng thái, Chức năng.
- Không hiển thị cấu hình tích hợp hoặc cấu hình hiển thị trong danh sách.
- Đã bỏ icon con mắt dùng để mở popup cấu hình.
- Form Thêm mới/Cập nhật không có ReturnURL và không có cấu hình hiển thị.

### Quản trị tích hợp sản phẩm
- Là CMS riêng trong tab Sản phẩm.
- Toàn bộ cấu hình được đặt trên một màn hình, không dùng popup.
- Chọn sản phẩm ở đầu màn hình để tải cấu hình tương ứng.

#### Thông tin tích hợp
- Hiển thị thông tin sản phẩm tham chiếu từ Quản trị sản phẩm.
- Service ID lấy theo Mã sản phẩm và ở trạng thái chỉ đọc.
- Service Key cho phép cập nhật.

#### Redirect URLs
- Cho phép khai báo nhiều URL cho một sản phẩm.
- Có nút Thêm URI và xóa từng URI.
- URL phải bắt đầu bằng `http://` hoặc `https://`.
- Không cho khai báo trùng URL trong cùng sản phẩm.

#### Đăng nhập MXH
Cấu hình theo cấu trúc:
```json
{
  "Authentication": {
    "Google": {
      "ClientID": "",
      "ClientSecret": ""
    },
    "Facebook": {
      "AppID": "",
      "AppSecret": ""
    },
    "Apple": {
      "ClientID": "",
      "TeamID": "",
      "KeyID": "",
      "PrivateKey": "",
      "RedirectUri": ""
    }
  }
}
```

#### Thông tin hiển thị
Cấu hình trên 3 trang:
- Trang chủ.
- Trang Dịch vụ.
- Trang Cửa hàng.

Mỗi trang gồm:
- Kênh hiển thị: Website, App.
- Thứ tự ưu tiên: 1 đến 20.

Quy ước:
- Không có trường Cho phép hiển thị.
- Không có trường Nhóm hiển thị.
- Nếu Website và App đều không được chọn thì sản phẩm không hiển thị tại trang tương ứng.
- Số ưu tiên nhỏ hơn được xếp trước.

## Rule Dịch vụ của tôi
Rule nằm trong code, không cấu hình riêng trong CMS.

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

## File nguồn liên quan
- `src/cms.template.html`
- `src/scripts/cms.js`
- `src/styles/cms.css`

## File build tương ứng
- `dist/CMS.html`
- `dist/scripts/cms.js`
- `dist/styles/cms.css`

## Cập nhật Quản trị tích hợp sản phẩm 2026-09-14
- Không tạo mục CMS Quản trị tích hợp sản phẩm riêng trong menu Sản phẩm.
- Từ icon con mắt tại cột Chức năng của Quản trị sản phẩm, chuyển sang màn hình Quản trị tích hợp sản phẩm của đúng sản phẩm được chọn.
- Màn hình cấu hình là trang riêng, không dùng popup, bố cục theo kiểu Thêm mới/Cập nhật sản phẩm.
- Thông tin tích hợp gồm Service ID và Service Key tự sinh, hiển thị dạng chỉ đọc.
- Redirect URLs cho phép khai báo nhiều URL, thêm/xóa từng dòng và kiểm tra trùng/định dạng.
- Thông tin hiển thị cấu hình Website/App và thứ tự ưu tiên cho Trang chủ, Trang Dịch vụ, Trang Cửa hàng.
- Đăng nhập MXH gồm Google (ClientID, ClientSecret), Facebook (AppID, AppSecret), Apple (ClientID, TeamID, KeyID, RedirectUri, PrivateKey).
- Có các nút Quay lại, Làm mới và Cập nhật ở cuối màn hình.
- Fix giao diện màn Quản trị tích hợp sản phẩm: bỏ chiều cao tối thiểu gây khoảng trắng lớn giữa các khối, mở rộng nội dung theo chiều ngang, căn lại Redirect URLs, Thông tin hiển thị và Đăng nhập MXH theo cùng bố cục form Thêm mới/Cập nhật sản phẩm.

- Bổ sung khung viền cho từng phần cấu hình trên màn Quản trị tích hợp sản phẩm để giao diện đồng nhất với màn Thêm mới/Cập nhật sản phẩm.
