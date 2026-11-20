# Ngọc Vân Các — Trang Sức Phong Thủy (web demo)

Web demo tĩnh (không backend, không cơ sở dữ liệu) làm cho bài thi đua / tiểu luận.
Mở `index.html` bằng trình duyệt là chạy (nháy đúp file, hoặc chạy `python3 -m http.server`
trong thư mục này rồi mở `http://localhost:8000`).

## Cấu trúc thư mục

```
ngoc-van-cac/
├── index.html          Khung trang: header, các trang (home / shop / chi tiết / giỏ / đơn hàng...),
│                       modal thanh toán, footer. Chỉ chứa HTML, không chứa CSS/JS.
├── css/
│   └── style.css       Toàn bộ giao diện: màu, chữ, bố cục, hiệu ứng.
├── js/
│   ├── data.js         DỮ LIỆU: 16 sản phẩm (PRODUCTS) + 2 bài viết (ARTICLES).
│   │                   Muốn sửa giá / tên / tồn kho / ảnh sản phẩm thì sửa ở đây.
│   └── app.js          LOGIC: khối CẤU HÌNH NHANH (CAU_HINH) ở đầu file,
│                       rồi tới giỏ hàng, thanh toán mô phỏng, theo dõi đơn hàng,
│                       phụ lục chọn size, yêu thích, tìm kiếm/lọc...
├── images/             Toàn bộ ảnh của web, đặt tên theo nội dung:
│   ├── logo.jpg                Logo shop (dùng ở header + hero)
│   ├── banner-khuyen-mai.jpg   Banner lớn đầu trang chính
│   ├── sp-<MÃ>.jpg            Ảnh từng sản phẩm (VD: sp-NTV-001.jpg)
│   └── baiviet-<SỐ>.jpg       Ảnh bài viết
└── README.md           File này.
```

## Sửa nhanh không cần đọc code

- **Banner / hotline / email / địa chỉ / Zalo:** sửa khối `CAU_HINH` ở đầu `js/app.js`.
- **Giá, tên, tồn kho, ảnh sản phẩm:** sửa trong `PRODUCTS` ở `js/data.js`
  (mỗi sản phẩm 1 khối; ảnh thì thay file trong `images/` rồi sửa trường `img:`).
- **Màu toàn web:** sửa biến trong `:root` ở đầu `css/style.css`.
- Các chỗ khác có ghi chú `<!-- [SỬA ...] -->` trong `index.html` và
  `/* [SỬA ...] */` trong `css/style.css` / `js/app.js`.

## Lưu ý khi demo / chấm bài

- Thanh toán và theo dõi đơn hàng là **mô phỏng**: bấm “Xác nhận đặt hàng” chỉ
  sinh mã đơn `NVC-...`, đơn được lưu trên trình duyệt (localStorage) để xem
  lại ở trang “Đơn hàng”, không trừ kho, không gửi email, không thu tiền thật.
- Trang “Đơn hàng” có ô tra cứu mã đơn + hành trình 5 bước kiểu TikTok Shop
  (đã đặt → đã xác nhận → đang chuẩn bị → đang giao → đã giao) với ngày giao dự kiến.
- Trang chi tiết mỗi sản phẩm có “Phụ lục 1 · Cách đo size cổ tay” và
  “Phụ lục 2 · Bảng chọn size” (chu vi 13–20 cm → size vòng 14–20 cm).
