# MERN Store - Test Plan

## 1. Mục tiêu
- Bảo đảm 4 luồng quan trọng hoạt động ổn định: tìm kiếm sản phẩm, giỏ hàng, đặt đơn và phân quyền.
- Chuẩn hóa cách kết hợp QA thủ công với automation để phù hợp Agile sprint 1-2 tuần.
- Tạo nền tảng cho CI/CD: mọi Pull Request phải chạy toàn bộ test suite trước khi merge.

## 2. Phạm vi & chức năng
| Chức năng | Ý nghĩa | Phạm vi kiểm thử |
| --- | --- | --- |
| Người dùng tìm kiếm hàng | Người mua tìm sản phẩm theo tên/từ khóa | API `/api/product/list/search/:name`, UI `SearchBar`, bộ lọc liên quan |
| Giỏ hàng | Lưu & cập nhật các item đã chọn | Cart reducer/UI, API `/api/cart/*`, thuế & tồn kho |
| Đơn hàng | Checkout, tính tiền, lưu shipping/payment | API `/api/order/*`, logic thuế `utils/store`, email |
| Phân quyền | Phân tách User/Admin/Merchant | Middleware `auth`, `role`, API nhạy cảm (`/dashboard`, `/admin`) |

Out-of-scope: thanh toán thật, tối ưu hiệu năng, bảo mật chuyên sâu (đưa vào backlog riêng).

## 3. Lộ trình Sprint
1. **Sprint 0 (hiện tại)**: Viết test plan, test cases, thiết lập Jest + CI.
2. **Sprint 1**: 
   - Unit test cho store utils, phân quyền.
   - Integration test cho search API và cart permission.
   - Manual test UI (tìm kiếm, giỏ hàng).
3. **Sprint 2**:
   - Thêm E2E (Cypress/Playwright) cho checkout.
   - Theo dõi monitoring/alert cơ bản và gom log.

## 4. Phương pháp kiểm thử
- **Unit test**: chạy bằng Jest + Node `testEnvironment`, nhắm vào `utils` và middleware.
- **Integration test**: dùng `supertest` mô phỏng request lên router Express (có mock DB).
- **Manual test**: chạy workflow UI, xác nhận trải nghiệm (đè bù cho trường hợp chưa auto hóa).
- **Automation bổ sung**:
  - *Kiểm thử cấu hình*: test module config & healthcheck.
  - *Kiểm thử nhất quán dữ liệu*: test giảm tồn kho, cập nhật thuế.
  - *Kiểm thử hồi quy*: toàn bộ suite chạy tự động trong CI.
- **Suite tách biệt**:
  - `npm run test:server`: 17 test case cho 4 chức năng chính.
  - `npm run test:server:full`: 43 test case (bao gồm edge case, snapshot pipeline, fuzz, integration search/cart/order/role, error handling).

Ưu điểm automation: chạy nhanh, tái lập, thích hợp regression. Ưu điểm manual: khám phá lỗi UX, case chưa rõ.

## 5. Môi trường & dữ liệu
- Local dev qua `docker-compose up` (client:8081, server:3001, mongo:27017).
- Seed dữ liệu với `docker-compose --profile seed up mongo-seed`.
- Secrets dùng `.env` (xem `server/.env` mẫu).
- Test account: `admin@gmail.com / admin123`, `member@example.com / member123`.

## 6. Tiêu chí bắt đầu/kết thúc
- **Start**: API ổn định, dữ liệu seed xong, Jira user stories “Ready for QA”.
- **Exit**:
  - ≥ 95% test cases pass cho 4 luồng trên.
  - Không còn bug Critical/High hởng luồng chính.
  - Báo cáo test + defect cập nhật.

## 7. Rủi ro & kế hoạch giảm thiểu
- Thiếu môi trường giống production → dùng Docker + seed script chuẩn.
- Không thể giả lập thanh toán thật → mock providers, test logic nội bộ.
- Dữ liệu lớn -> pipeline chậm → tách job unit vs integration, chỉ chạy E2E khi cần.

## 8. Tài liệu liên quan
- `docs/testing/TEST_CASES.md`
- `docs/testing/TEST_REPORT_TEMPLATE.md`
- `.github/workflows/ci.yml` (CI)
