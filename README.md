# MyVTC Home, bản đã tách component

Cấu trúc thư mục:

- `src/index.template.html`: khung trang chính, chứa placeholder cho từng phần.
- `src/components/header.html`: thanh trên cùng và menu chính.
- `src/components/hero.html`: phần banner đầu trang.
- `src/components/services.html`: phần hệ sinh thái dịch vụ.
- `src/components/features.html`: phần lợi ích chính.
- `src/components/faq.html`: phần câu hỏi thường gặp.
- `src/components/footer.html`: chân trang.
- `src/components/auth-modal.html`: popup đăng nhập, đăng ký.
- `src/styles/main.css`: toàn bộ CSS tự viết.
- `src/scripts/app.js`: toàn bộ JavaScript.
- `dist/MyVTC_Home.html`: file HTML đã ghép, mở trực tiếp bằng trình duyệt.

Cách sửa nhanh:

1. Sửa nội dung trong `src/components/*.html`.
2. Sửa giao diện chung trong `src/styles/main.css`.
3. Sửa luồng xử lý trong `src/scripts/app.js`.
4. Chạy `build.bat` trên Windows hoặc `python build.py`.
5. Mở file mới tại `dist/MyVTC_Home.html`.

Lưu ý:

- Không sửa trực tiếp file trong `dist` nếu bạn muốn quản lý theo component.
- Sau mỗi lần sửa trong `src`, chạy lại build để cập nhật file trong `dist`.
