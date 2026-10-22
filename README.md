# Smart Hotel 3D

Bản demo giao diện theo **Khách sạn Rex Sài Gòn** (141 Nguyễn Huệ): khách mở liên kết check-in, xác nhận thông tin mẫu, xem khối nhà 3D và được dẫn tới phòng minh họa **408**.

Đây là concept UI/UX. Không có backend, cơ sở dữ liệu, thanh toán, khóa cửa hay kết nối Booking.com, Agoda, PMS.

## Chạy demo

```bash
npm install
npm run dev
```

Mở [http://localhost:3000/stay/demo](http://localhost:3000/stay/demo).

Mã đặt phòng mẫu: `BK-DEMO-001`. Khách: Alex Morgan. Phòng minh họa: 408, tầng 4. Hồ bơi và Rooftop Garden Bar nằm ở sân thượng.

## Hành trình

1. `/stay/demo` — tóm tắt đặt phòng.
2. `/stay/demo/check-in` — ba bước check-in mô phỏng.
3. `/stay/demo/hotel` — mô hình 3D, chọn tầng, chọn phòng hoặc tiện ích.
4. `/stay/demo/navigate` — dẫn đường theo từng chặng, có chuyển tầng bằng thang máy.
5. `/stay/demo/services` — danh sách điểm đến.

Nút **Demo** ở góc trên bên phải đổi nguồn đặt phòng, trạng thái và reset toàn bộ kịch bản. Trạng thái được giữ trong `sessionStorage` của trình duyệt.

Nếu máy không chạy WebGL, các màn 3D chuyển sang sơ đồ mặt bằng. Vẫn chọn được phòng và đi hết các bước dẫn đường.

## Kiểm tra

```bash
npm run typecheck
npm run lint
npx tsx --test lib/pathfinding.test.ts
```

## Giới hạn của concept

- Tòa nhà mô phỏng 6 tầng của Rex: tầng trệt, tầng 2, tầng 4 và sân thượng mở được bên trong. Tầng 3 và tầng 5 chỉ là khối mặt đứng. Kéo “Tách tầng” để xem các sàn.
- Lộ trình xuất phát từ sảnh lễ tân trong kịch bản, không dùng GPS hay cảm biến.
- Khoảng cách và thời gian là số liệu mô phỏng.
- Camera tự khám phá chỉ xoay quanh tầng, không đi xuyên tường.

## Khi nối hệ thống thật

Cần API đặt phòng, hồ sơ khách, phân phòng, đồ thị điều hướng đúng công trình, và một lớp quyền truy cập riêng. Không dùng các nhãn “Demo access” hay “Simulated” như trạng thái vận hành.
