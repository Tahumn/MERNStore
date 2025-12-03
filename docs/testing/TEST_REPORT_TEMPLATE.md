# Test Report Template (Sprint Regression)

## 1. Thông tin chung
- **Sprint**: `Sprint-XX`
- **Commit / Tag**: `<hash>`
- **Môi trường**: Docker (`client:8081`, `server:3001`, Mongo local)
- **Tester**: `<tên>`
- **Ngày chạy**: `<dd/mm/yyyy>`

## 2. Tình trạng Test Case
| Nhóm | Tổng | Pass | Fail | Blocked | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Search | 4 | | | | |
| Cart | 4 | | | | |
| Order | 4 | | | | |
| Auth/Role | 4 | | | | |

## 3. Automation Suite
- `npm run test:server`
  - Tổng test: `<n>`
  - Pass: `<n>`
  - Coverage: `Statements <x>% | Branches <y>%`
  - Log build: `<link CI>`

## 4. Manual Test Notes
- SRCH-03: …  
- CART-03: …

## 5. Bug / Defect Summary
| ID | Title | Severity | Status | Liên quan test case |
| --- | --- | --- | --- | --- |
| BUG-XX | … | Critical/High/Medium/Low | Open/Resolved | CART-03 |

## 6. Kết luận
- ✅ Sẵn sàng release / ⚠️ Cần fix thêm.
- Rủi ro còn lại: ví dụ chưa test performance, chưa test payment thật.

> Khi hoàn tất, lưu file báo cáo thực tế tại `docs/testing/reports/Sprint-XX.md`.
