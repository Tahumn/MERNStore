**MERN Store — Test Plan**

- Project Code: MERN-STORE
- Document Code: TP-MERN-STORE-v1.0
- Issue Date: 2025-12-15
- Status: Draft

**Record of Change**
- v1.0 — Initial plan generated from current codebase and UI.

**Sign-off**
- Prepared by: <Your Name>
- Reviewed by: <Reviewer>
- Approved by: <Approver>

**TABLE OF CONTENTS**
1	INTRODUCTION
1.1	Purpose
1.2	Definitions, Acronyms, and Abbreviations
1.3	References
1.4	Background information
1.5	Scope of testing
1.6	Constraints
1.7	Risk list
1.8	Training needs
2	REQUIREMENTS FOR TEST
2.1	Test items
2.2	Acceptance Test Criteria
3	TEST STRATEGY
3.1	Test types
3.1.1	Function Testing
3.1.1.1	Function Testing
3.1.1.2	Business Cycle Testing
3.1.2	User Interface Testing
3.1.3	Data and Database Integrity Testing
3.1.4	Performance testing
3.1.4.1	Performance testing
3.1.4.2	Load Testing
3.1.4.3	Stress Testing
3.1.4.4	Volume Testing
3.1.5	Security and Access Control Testing
3.1.6	Regression Testing
3.2	Test stages
4	RESOURCE
4.1	Human Resource
4.2	Test management
5	TEST ENVIRONMENT
5.1	Hardware
5.2	Software
5.3	Infrastructure
6	TEST MILESTONES
7	DELIVERABLES

**1 INTRODUCTION**

1.1 Purpose
- Xác định phạm vi, chiến lược, môi trường, nguồn lực, mốc và tiêu chí vào/ra để xác minh các chức năng MERN Store hiện có trong codebase.

1.2 Definitions, Acronyms, and Abbreviations
- UAT (User Acceptance Test), ST (System Test), API, JWT, CRUD, P0/P1/P2 (mức ưu tiên lỗi).

1.3 References
- Workbook: `docs/test_plan/Test_Plan_Combined_updated.xlsx` (tổng hợp các sheet kế hoạch)
- Checklist: `4.Test Plan Review Checklist.xls`
- Source code: `server/routes/api/*`, `client/*`
- SR01 UI spec: `2.MRSW-Software (MoTaUC)_online.xlsx` (sheet SR01 + images)

1.4 Background information
- Ứng dụng thương mại điện tử MERN (React + Express + MongoDB) cung cấp: danh mục, tìm kiếm/lọc, chi tiết sản phẩm, giỏ hàng, đặt hàng, yêu thích, đánh giá, dashboard, newsletter, contact.

1.5 Scope of testing
- In-scope (trích sheet Scope_Strategy): Auth, Profile, Address, Catalogue + Filters/Sort, Search, Product Detail, Wishlist, Cart, Checkout/Order, Reviews, Brand/Category (active), Dashboard summary, Newsletter, Contact.
- Out-of-scope: Payment gateway thật; SLA email provider; hiệu năng nặng ngoài smoke; mobile native.

1.6 Constraints
- Cần seed dữ liệu ổn định; email dùng sandbox/test; không thực hiện thanh toán thật; môi trường hạn chế.

1.7 Risk list (trích sheet Risks)

Risk | Impact | Likelihood | Mitigation
-|-|-|-
Thiếu role-check (order status/review) | High | Medium | Negative tests, raise bug, fix sớm
Address PUT/DELETE/GET thiếu auth | High | High | Middleware + owner-check, theo dõi fix
Giới hạn sandbox email | Low | Medium | Stub/verify 200, không giả định SLA
Thiếu seed data | Medium | Medium | Seed xác định; reset DB các vòng
Thoái lui hiệu năng listing/search | Medium | Low | Smoke với phân trang/limit

1.8 Training needs
- REST API/JWT/MongoDB; quy trình báo cáo/defect và công cụ Postman/DevTools.

**2 REQUIREMENTS FOR TEST**

2.1 Test items (trích sheet Coverage_By_Module)

Module | Key Scenarios | Priority
-|-|-
Authentication | Login valid/invalid; Register unique; Forgot/Reset; social callback | P0
User Profile | View/update; block non‑auth | P1
Address | Add/list; invalid phone/zip; (BUG) edit/delete/get without auth (negative) | P0
Catalog | List + sort/filter; category/brand active; name search | P0
Product Detail | 404 if brand inactive/not found; fields & image fallback | P0
Wishlist | Add/remove; duplicate; block non‑auth/admin; invalid ObjectId | P1
Cart | Create; add/remove; inc/dec qty; qty bounds; admin blocked; stock adjust | P0
Checkout/Order | Submit w/ address+payment; history/detail; complete rules; cancel | P0
Reviews | Only after Delivered/Completed; moderation; duplicate; auth | P1
Newsletter | Subscribe valid/duplicate/invalid | P2
Contact | Required fields; duplicate email | P2
Brand/Category | Active lists; select endpoints; cascade | P2
Dashboard | Admin revenue/orders/pending/topProducts | P1
Health | /health 200 OK | P2

2.2 Acceptance Test Criteria (trích sheet Entry_Exit_Criteria – phần Exit)
- Đóng toàn bộ P0/P1.
- P2 có workaround/kế hoạch fix được chấp nhận.
- Pass rate kịch bản trọng yếu ≥ 95%.
- Báo cáo & bằng chứng phát hành; Stakeholders ký duyệt.

**3 TEST STRATEGY**

3.1 Test types (trích sheet TestTypes)

Type | Objective | Notes
-|-|-
Functional | Xác nhận tính năng theo yêu cầu trên luồng chính | UI + API
API Integration | Mã trạng thái, payload, DB effects | Postman/REST client
Security & Access | Auth/role/ownership | Negative tests thiếu role-check
Regression | Phòng lỗi quay lại | Smoke mỗi release
Compatibility | Hoạt động trên Chrome/Firefox mới | Edge/Safari best‑effort
Performance (smoke) | Listing/search/featured/popular tải danh nghĩa | Phân trang/giới hạn

3.1.1 Function Testing
3.1.1.1 Function Testing
- Kiểm thử E2E các luồng: browse → detail → add to cart → checkout → orders history/detail → review.
- Xác minh nút/label/state đúng; luồng điều hướng hợp lệ; dữ liệu hiển thị đúng.

Test cases (Auth & Profile, Address, Catalog/Product, Wishlist, Cart/Order, Reviews/Newsletter/Contact/Brand-Category)

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route | Notes
-|-|-|-|-|-|-|-
FT-AUTH-01 | Login valid (Member) | Tài khoản member hợp lệ | 1) Mở Login 2) Nhập email/pass 3) Submit | 200; trả `Bearer <token>`; JWT payload chỉ chứa id; redirect hợp lệ | P0 | POST /auth/login |
FT-AUTH-02 | Login valid (Admin) | Tài khoản admin hợp lệ | Như FT-AUTH-01 | 200; token; user.role=Admin | P0 | POST /auth/login |
FT-AUTH-03 | Wrong password | User tồn tại | Nhập pass sai | 400 “Password Incorrect” | P0 | POST /auth/login | Negative
FT-AUTH-04 | Wrong email | Không có user | Nhập email không tồn tại | 400 “No user found…” | P0 | POST /auth/login | Negative
FT-AUTH-05 | Missing email/password |  | Bỏ trống field, submit | 400 thông báo thiếu | P1 | POST /auth/login | FE/BE
FT-AUTH-08 | Register unique | Email mới | Điền đủ field | 200; trả token; password được hash | P0 | POST /auth/register |
FT-AUTH-09 | Register duplicate | Email đã có | Đăng ký lại | 400 “already in use.” | P0 | POST /auth/register | Negative
FT-AUTH-10 | Forgot password | User tồn tại | POST forgot | 200 “check your email…” | P1 | POST /auth/forgot |
FT-AUTH-12 | Reset with valid token | Có token còn hạn | POST reset | 200 “Password changed successfully” | P0 | POST /auth/reset/:token |
FT-AUTH-15 | /user/me profile | Đã login | GET /user/me | 200 trả user + role | P0 | GET /user/me |
FT-AUTH-16 | Update profile | Đã login | PUT /user | 200 updated | P1 | PUT /user |
FT-ADDR-01 | Add address | Member login | POST địa chỉ hợp lệ | 200; gắn user hiện tại | P0 | POST /address/add |
FT-ADDR-02 | List my addresses | Member login | GET /address | 200 danh sách của mình | P0 | GET /address |
FT-ADDR-03 | Invalid phone/zipcode |  | POST dữ liệu sai | 400/validation | P1 | POST /address/add | FE/BE
FT-ADDR-05 | (BUG) Edit other’s address | Không sở hữu | PUT /address/:id | (Hiện có thể) → log defect | P0 | PUT /address/:id | Negative
FT-CAT-01 | List products paginate | Có dữ liệu | GET /product/list?page&limit | 200; có count/totalPages/currentPage | P0 | GET /product/list |
FT-CAT-02 | Sort by price asc/desc |  | sortOrder hợp lệ | 200; thứ tự đúng | P0 | GET /product/list |
FT-CAT-03 | Sort fallback | sortOrder lỗi JSON | Gọi API | 200; fallback `{created:-1}` | P1 | GET /product/list |
FT-CAT-04 | Filter by category/brand/price/rating |  | Gọi các tham số | 200; filter đúng | P1 | GET /product/list |
FT-PROD-01 | Product detail by slug | SP & brand active | GET /product/item/:slug | 200; fields đúng | P0 | GET /product/item/:slug |
FT-PROD-02 | Brand inactive/null | Brand off/null | GET detail | 404 “No product found.” | P0 | GET /product/item/:slug | Negative
FT-PROD-03 | Name search |  | /product/list/search/:name | 200 hoặc 404 nếu không có | P1 | GET /product/list/search/:name |
FT-WL-01 | Add to wishlist | Member login | POST {product,isLiked:true} | 200; tạo/cập nhật record | P1 | POST /wishlist |
FT-WL-02 | Duplicate add | Đã like | POST lại | Không duplicate; updated | P1 | POST /wishlist |
FT-CART-01 | Create cart + add items | Member login | POST /cart/add products | 200; cartId; quantity giảm | P0 | POST /cart/add | Verify tồn kho
FT-CART-03 | Remove item | Có cartId | DELETE /cart/delete/:cartId/:productId | 200; item bị remove | P1 | DELETE /cart/delete/... |
FT-ORD-01 | Submit order valid | Có cartId, shipping, payment | POST /order/add | 200; orderId; email sent | P0 | POST /order/add |
FT-ORD-06 | Order detail owner | Member login | GET /order/:orderId | 200 nếu owner; 404 nếu không | P1 | GET /order/:orderId |
FT-REV-01 | Add review allowed | Delivered/Completed | POST /review/add | 200; status Approved | P1 | POST /review/add |
FT-NEWS-01 | Subscribe newsletter | Email hợp lệ | POST subscribe | 200; gửi mail | P2 | POST /newsletter/subscribe |
FT-CT-01 | Contact valid | Name/email/message hợp lệ | POST contact | 200; gửi mail | P2 | POST /contact/add |

3.1.1.2 Business Cycle Testing
- Chu trình thương mại: tìm kiếm/lọc → chọn sản phẩm → giỏ → đặt hàng → hoàn tất; admin theo dõi dashboard.
- Tình huống bất thường: hết hàng, địa chỉ không hợp lệ, thanh toán thiếu phương thức.

Key business flows

ID | Title | Preconditions | Steps | Expected Result | Priority | Notes
-|-|-|-|-|-|-
BC-01 | Member purchase E2E | Seed sẵn SP | Browse → Detail → Add → Checkout | Đơn hàng thành công; evidence đầy đủ | P0 | Flow chính
BC-02 | Return & resume session | Đã login, có cart | Reload/Back | Session vẫn còn; giỏ còn | P1 | Persistence
BC-03 | Admin overview | Admin login | GET /dashboard/summary | 200; đủ trường summary/topProducts | P1 | Báo cáo
BC-04 | Error handling |  | Thiếu payment/thiếu shipping | 400 thông báo rõ ràng | P0 | Negative

3.1.2 User Interface Testing
- Kiểm tra bố cục, khả dụng, trạng thái disabled/hover/focus; hỗ trợ bàn phím cơ bản theo SR01 (focus ring, tab order) ở mức smoke.

Accessibility & focus rules

ID | Title | Preconditions | Steps | Expected Result | Priority | Area
-|-|-|-|-|-|-
UI-ACC-01 | Tab order header | UI loaded | Tab qua header | Thứ tự đúng; focus rõ ràng | P1 | Header
UI-ACC-02 | Skip to content |  | Kích skip link | Focus tới main content | P2 | Global
UI-ACC-03 | Buttons/links Enter/Space |  | Kích Enter/Space | Hành vi đúng như click | P2 | Global
UI-ACC-04 | Dropdown keyboard |  | Enter mở; Up/Down chọn; Esc đóng | aria-expanded đúng; trap hợp lệ | P2 | Menus
UI-ACC-05 | Price slider keys | Listing | ←/→ ±1; PgUp/PgDn ±10; Home/End | Giá trị cập nhật; label sống | P1 | Listing
UI-ACC-06 | Star rating keys | Review | ←/→ 1–5 sao | SR đọc “x of 5 stars” | P2 | Reviews
UI-ACC-07 | Disabled states | Out of stock | Tab tới control | Không nhận focus/kích hoạt | P1 | Product/Cart

3.1.3 Data and Database Integrity Testing
- Kiểm tác động DB: trừ/tăng tồn kho khi add/cancel; ràng buộc owner address/order; email unique; review chỉ cho delivered/completed.

Data checks

ID | Title | Preconditions | Steps | Expected Result | Priority | Data Check
-|-|-|-|-|-|-
DB-CART-01 | Decrease quantity on create cart | Có products | POST /cart/add | Product.quantity giảm đúng | P0 | Mongo: products
DB-CART-02 | Increase quantity on cancel item | Có item Cancelled | PUT status=Cancelled | Product.quantity tăng lại | P0 | Mongo: products
DB-ORD-01 | Order totals formatting | Có order | GET /order/me | total làm tròn 2 số | P2 | Order.total
DB-ADDR-01 | Owner enforced listing | Login | GET /address | Chỉ trả địa chỉ của user | P1 | Address.user == req.user
DB-REV-01 | Review linked to delivered cart | Có delivered cart | POST review | Review.user/product/status hợp lệ | P1 | relations

3.1.4 Performance testing
3.1.4.1 Performance testing
- Smoke performance: thời gian phản hồi danh sách/tìm kiếm với phân trang, limit; featured/popular trả về trong ngưỡng chấp nhận.

Performance (smoke)

ID | Title | Preconditions | Steps | Expected Result | Priority | Metric
-|-|-|-|-|-|-
PERF-LIST-01 | List page size | Seed >= 30 SP | GET /product/list?limit=10 | Trả đúng 10 SP; latency trong ngưỡng | P2 | time(ms), count
PERF-LIST-02 | Sort fallback cost | sortOrder lỗi | GET list với sort hỏng | Không lỗi; dùng default; latency ổn | P2 | time(ms)
PERF-FEAT-01 | Featured limit | Seed featured | GET /product/featured?limit=8 | Chính xác 8; latency ổn | P2 | time, count
PERF-POP-01 | Popular limit | Seed reviews | GET /product/popular?limit=8 | Chính xác 8; latency ổn | P2 | time, count

3.1.4.2 Load Testing
- Ngoài phạm vi full load; thực hiện sample nhỏ để kiểm tra ngưỡng cấu hình page/limit.

Load (sample)

ID | Title | Preconditions | Steps | Expected Result | Priority
-|-|-|-|-|-
LOAD-01 | Sample paged load | Seed dữ liệu | Lặp GET list nhiều page | Phản hồi ổn, không lỗi 5xx | P3

3.1.4.3 Stress Testing
- Ngoài phạm vi (OOS). Ghi nhận rủi ro và kế hoạch thực hiện riêng nếu yêu cầu.

Stress (OOS)

ID | Title | Status | Notes
-|-|-|-
STRESS-NA-01 | Stress scenarios | Out-of-scope | Thực hiện theo kế hoạch riêng khi có yêu cầu

3.1.4.4 Volume Testing
- Ngoài phạm vi; chỉ xác nhận hệ thống xử lý dataset seed tiêu chuẩn.

Volume (OOS)

ID | Title | Status | Notes
-|-|-|-
VOLUME-NA-01 | Volume scenarios | Out-of-scope | Thực hiện theo kế hoạch riêng khi có yêu cầu

3.1.5 Security and Access Control Testing
- Auth bắt buộc với route cần token; role-based (Admin/Member) đúng; owner-check cho address/order.
- Negative tests cho các endpoint đang thiếu role-check (được đánh dấu “BUG” trong Traceability).

Security tests

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route
-|-|-|-|-|-|-
SEC-ADDR-01 | Address API without token | Non-auth | POST/GET/PUT/DELETE | 401/403 (kỳ vọng) | P0 | /address/*
SEC-CART-01 | Cart with admin role | Admin login | Gọi /cart/* | 403 theo gate | P0 | /cart/*
SEC-USER-01 | Non-admin access /user | Member login | GET /user | 403; nếu 200 => bug | P0 | GET /user
SEC-ORD-01 | Update item status any user | Bất kỳ login | PUT status item | (Hiện 200) => defect | P0 | PUT /order/status/item/:id
SEC-REV-01 | Approve/reject review without admin | Member login | PUT approve/reject | Không cho phép; nếu cho => defect | P0 | /review/*

3.1.6 Regression Testing
- Bộ smoke bao phủ catalogue/search/cart/order; chạy sau mỗi vòng fix; đảm bảo không tái phát lỗi.

Regression (smoke)

ID | Title | Preconditions | Steps | Expected Result | Priority | Area
-|-|-|-|-|-|-
REG-01 | Browse → detail → add → checkout | Seed sẵn SP | E2E Member flow | Đơn hàng thành công | P0 | E2E
REG-02 | Auth flows |  | Login/Register/Forgot/Reset | 200 & thông báo đúng | P0 | Auth
REG-03 | Listing filters/sort/search |  | GET list với các tổ hợp | Trả về đúng lọc/sắp xếp | P1 | Catalog
REG-04 | Wishlist basic |  | Add/Get | Không duplicate; hiển thị đúng | P2 | Wishlist
REG-05 | Review allowed | Có order delivered | POST review | 200 | P2 | Review
REG-06 | Dashboard summary | Admin login | GET /dashboard/summary | 200; trường đủ | P2 | Dashboard

3.2 Test stages
- System Test (QA): chạy chính trên local/staging; log defects.
- UAT (optional): xác nhận của stakeholder dựa trên bản ổn định.

**3.1.x — Detailed Test Case Tables**

Ghi chú chung
- Các bảng dưới đây được trình bày theo mẫu của mục 3.1.1.x trong Test Plan Word: mỗi test có ID, Title, Preconditions, Steps, Expected Result, Priority, Endpoint/Route, Evidence/Notes.
- ID đặt theo nhóm: FT-* (Functional), UI-*, DB-*, PERF-*, SEC-*, REG-*.

3.1.1.1 Function Testing — Authentication & Profile

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route | Evidence/Notes
-|-|-|-|-|-|-|-
FT-AUTH-01 | Login valid (Member) | Tài khoản member hợp lệ | 1) Mở Login 2) Nhập email/pass 3) Submit | 200 OK; trả `Bearer <token>`; payload JWT chỉ chứa id; redirect trang chủ/đích | P0 | POST /auth/login | Lưu response token
FT-AUTH-02 | Login valid (Admin) | Tài khoản admin hợp lệ | Tương tự FT-AUTH-01 | 200 OK; trả token; role=Admin trong user | P0 | POST /auth/login |  
FT-AUTH-03 | Wrong password | User tồn tại | Nhập email đúng, pass sai | 400 + thông báo “Password Incorrect” | P0 | POST /auth/login | Negative
FT-AUTH-04 | Wrong email | Không có user | Nhập email không tồn tại | 400 + “No user found…” | P0 | POST /auth/login | Negative
FT-AUTH-05 | Missing email |  | Để trống email, submit | 400 + “You must enter an email address.” | P1 | POST /auth/login | FE/BE
FT-AUTH-06 | Missing password |  | Để trống password, submit | 400 + “You must enter a password.” | P1 | POST /auth/login | FE/BE
FT-AUTH-07 | SQL-injection in email |  | Email: `' OR 1=1 --` | 400; không rò rỉ lỗi hệ thống | P1 | POST /auth/login | Security smoke
FT-AUTH-08 | Register unique email | Email chưa dùng | Điền đủ field, submit | 200 OK; trả token; user lưu với password hash | P0 | POST /auth/register | Verify mật khẩu đã hash
FT-AUTH-09 | Register duplicate email | Email đã dùng | Đăng ký lại | 400 “That email address is already in use.” | P0 | POST /auth/register | Negative
FT-AUTH-10 | Forgot password valid | User tồn tại | Gửi forgot | 200 “Please check your email…” | P1 | POST /auth/forgot | Mail sandbox
FT-AUTH-11 | Forgot password no user | Không có user | Gửi forgot | 400 “No user found…” | P1 | POST /auth/forgot | Negative
FT-AUTH-12 | Reset with valid token | Có reset token còn hạn | Gửi password mới | 200 “Password changed successfully” | P0 | POST /auth/reset/:token |  
FT-AUTH-13 | Reset with expired token | Token hết hạn | Gửi reset | 400 “token has expired” | P1 | POST /auth/reset/:token | Negative
FT-AUTH-14 | Reset (self) with old/new | Đã login | Gửi password cũ/confirm | 200 changed; login bằng mật khẩu mới OK | P1 | POST /auth/reset |  
FT-AUTH-15 | /user/me profile | Đã login | Gọi /user/me | 200 trả user + role + merchant/brand (nếu có) | P0 | GET /user/me |  
FT-AUTH-16 | Update profile fields | Đã login | PUT /user với profile | 200 updated | P1 | PUT /user |  

3.1.1.1 Function Testing — Address

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route | Evidence/Notes
-|-|-|-|-|-|-|-
FT-ADDR-01 | Add address success | Member đã login | POST địa chỉ hợp lệ | 200; address gắn user hiện tại | P0 | POST /address/add |  
FT-ADDR-02 | List my addresses | Member đã login | GET /address | 200 trả danh sách của chính mình | P0 | GET /address |  
FT-ADDR-03 | Invalid phone/zipcode |  | POST dữ liệu sai | 400/validation; FE cảnh báo | P1 | POST /address/add | FE/BE
FT-ADDR-04 | Missing required fields |  | Bỏ trống field bắt buộc | 400/validation | P1 | POST /address/add |  
FT-ADDR-05 | (BUG) Edit another user’s address | Không sở hữu | PUT /address/:id | (Hiện tại) có thể update/xóa; ghi bug “No owner check” | P0 | PUT /address/:id | Negative, defect
FT-ADDR-06 | (BUG) Delete without auth | Không token | DELETE /address/:id | (Hiện tại) cho phép; ghi bug “No auth on DELETE” | P0 | DELETE /address/:id | Negative, defect

3.1.1.1 Function Testing — Catalog & Product

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route | Evidence/Notes
-|-|-|-|-|-|-|-
FT-CAT-01 | List products paginate | Có dữ liệu | GET /product/list?page=1&limit=10 | 200; trả `products,count,totalPages,currentPage` | P0 | GET /product/list |  
FT-CAT-02 | Sort by price asc/desc |  | Gọi sortOrder | 200; thứ tự đúng | P0 | GET /product/list | sortOrder JSON
FT-CAT-03 | Sort fallback | sortOrder invalid | Gửi sortOrder lỗi JSON | 200; dùng `{created:-1}` mặc định | P1 | GET /product/list |  
FT-CAT-04 | Filter by category | Category active | Gọi category slug | 200; chỉ SP của category; count đúng | P0 | GET /product/list |  
FT-CAT-05 | Filter by brand | Brand active | brand=slug | 200; chỉ SP của brand | P0 | GET /product/list |  
FT-CAT-06 | Filter by price |  | min/max | 200; nằm trong range | P1 | GET /product/list |  
FT-CAT-07 | Filter by rating |  | rating>=x | 200; averageRating phù hợp | P1 | GET /product/list |  
FT-PROD-01 | Product detail by slug | SP active; brand active | GET /product/item/:slug | 200, fields đúng | P0 | GET /product/item/:slug |  
FT-PROD-02 | Brand inactive/null | Brand off/null | GET /product/item/:slug | 404 “No product found.” | P0 | GET /product/item/:slug | Negative
FT-PROD-03 | Name search |  | /product/list/search/:name | 200 trả gợi ý hoặc 404 khi none | P1 | GET /product/list/search/:name |  
FT-PROD-04 | Featured list |  | GET /product/featured?limit=n | 200; giới hạn n; active only | P1 | GET /product/featured |  
FT-PROD-05 | Popular list |  | GET /product/popular?limit=n | 200; sort theo reviews/rating/created | P1 | GET /product/popular |  

3.1.1.1 Function Testing — Wishlist

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route | Evidence/Notes
-|-|-|-|-|-|-|-
FT-WL-01 | Add to wishlist | Member login | POST {product, isLiked:true} | 200; record tạo/cập nhật | P1 | POST /wishlist |  
FT-WL-02 | Duplicate add | Đã like sản phẩm | POST lại | 200; không tạo bản ghi trùng; cập nhật updated | P1 | POST /wishlist | Unique by user+product
FT-WL-03 | Get wishlist | Member login | GET /wishlist | 200; danh sách có image fallback | P2 | GET /wishlist |  
FT-WL-04 | Invalid ObjectId |  | POST product id sai | 400 (CastError) | P1 | POST /wishlist | Negative
FT-WL-05 | Non-existing but valid ObjectId |  | POST id đúng định dạng nhưng không tồn tại | (Hiện tại) vẫn tạo — ghi nhận behavior | P2 | POST /wishlist | Behavior note
FT-WL-06 | Admin blocked | Admin login | POST/GET | 403 “Store management accounts…” | P0 | /wishlist | Security gate

3.1.1.1 Function Testing — Cart & Checkout/Order

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route | Evidence/Notes
-|-|-|-|-|-|-|-
FT-CART-01 | Create cart + add items | Member login | POST /cart/add products | 200; cartId; quantity giảm | P0 | POST /cart/add | Verify Product.quantity
FT-CART-02 | Add item to existing cart | Có cartId | POST /cart/add/:cartId | 200; items tăng | P1 | POST /cart/add/:cartId |  
FT-CART-03 | Remove item | Có cartId | DELETE /cart/delete/:cartId/:productId | 200; items giảm | P1 | DELETE /cart/delete/... |  
FT-CART-04 | Delete cart | Có cartId | DELETE /cart/delete/:cartId | 200; cart deleted | P1 | DELETE /cart/delete/:cartId |  
FT-CART-05 | Purchaser gate blocks admin | Admin login | Thực hiện bất kỳ action cart | 403 theo ensurePurchaser | P0 | /cart/* | Security gate
FT-ORD-01 | Submit order valid | cartId; shipping; paymentMethod | POST /order/add | 200; gửi mail; orderId trả về | P0 | POST /order/add |  
FT-ORD-02 | Missing payment method |  | Submit thiếu method | 400 “Please select a payment method” | P0 | POST /order/add | Negative
FT-ORD-03 | Missing shipping fields |  | Thiếu address/city/country/phone | 400 yêu cầu đủ thông tin | P0 | POST /order/add | Negative
FT-ORD-04 | Address not mine | Có address người khác | Chọn addressId của user khác | 404 “Selected address…not found” | P1 | POST /order/add | Negative
FT-ORD-05 | Order history | Member login | GET /order/me | 200; phân trang; format totals | P1 | GET /order/me |  
FT-ORD-06 | Order detail | Member login | GET /order/:orderId | 200 nếu own; 404 nếu không | P1 | GET /order/:orderId | Owner check
FT-ORD-07 | Complete order ready | Tất cả items Delivered | PUT /order/complete/:orderId | 200 “completed” | P1 | PUT /order/complete/:orderId |  
FT-ORD-08 | Complete not ready | Có item chưa Delivered | PUT complete | 400 “not ready to complete” | P1 | PUT /order/complete/:orderId | Negative
FT-ORD-09 | (BUG) Update item status w/o role | Bất kỳ user login | PUT /order/status/item/:itemId | (Hiện tại) thành công — log defect | P0 | PUT /order/status/item/:itemId | Negative, defect

3.1.1.1 Function Testing — Reviews / Newsletter / Contact / Brand-Category

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route | Evidence/Notes
-|-|-|-|-|-|-|-
FT-REV-01 | Add review allowed | Đã mua & Delivered/Completed | POST /review/add | 200, status Approved | P1 | POST /review/add | Kiểm delivered order
FT-REV-02 | Review without Delivered | Chưa delivered | POST review | 403 chặn | P1 | POST /review/add | Negative
FT-REV-03 | Admin approve review | Admin login | PUT /review/approve/:id | 200; isActive true | P2 | PUT /review/approve/:id | (Hiện thiếu role-check—defect)
FT-NEWS-01 | Subscribe newsletter | Email hợp lệ | POST /newsletter/subscribe | 200; gửi mail | P2 | POST /newsletter/subscribe |  
FT-NEWS-02 | Subscribe duplicate | Email đã subscribed | POST | 400 (Mailchimp title) | P2 | POST /newsletter/subscribe | Negative
FT-CT-01 | Contact valid | Name/email/message hợp lệ | POST /contact/add | 200; gửi mail | P2 | POST /contact/add |  
FT-CT-02 | Contact duplicate email | Đã tồn tại | POST lại | 400 “A request already existed…” | P2 | POST /contact/add | Negative
FT-BC-01 | Brand list active | Có brand active | GET /brand/list | 200 active only | P2 | GET /brand/list |  
FT-CC-01 | Category list |  | GET /category/list | 200 trả danh sách | P2 | GET /category/list |  

3.1.2 User Interface Testing — Accessibility & Focus (SR01)

ID | Title | Preconditions | Steps | Expected Result | Priority | Area | Notes
-|-|-|-|-|-|-|-
UI-ACC-01 | Tab order header | UI loaded | Tab qua header (menu, search, cart) | Thứ tự đúng; focus visible rõ ràng | P1 | Header | SR01 focus rule
UI-ACC-02 | Skip to content |  | Kích hoạt skip link | Focus nhảy vào main region | P2 | Global |  
UI-ACC-03 | Buttons/links Enter/Space |  | Kích Enter/Space | Hoạt động như click | P2 | Global |  
UI-ACC-04 | Dropdown keyboard |  | Enter mở; Up/Down chọn; Esc đóng | `aria-expanded` update; focus trap | P2 | Menus |  
UI-ACC-05 | Price slider keys | Trang listing | ←/→ ±1; PgUp/PgDn ±10; Home/End min/max | Giá trị cập nhật; live label | P1 | Listing |  
UI-ACC-06 | Star rating keys | Trang review | ←/→ 1–5 sao | SR đọc “x of 5 stars” | P2 | Reviews |  
UI-ACC-07 | Disabled states | Out of stock/disabled | Tab tới control | Không focus/không kích hoạt | P1 | Product/Cart |  

3.1.3 Data and Database Integrity Testing

ID | Title | Preconditions | Steps | Expected Result | Priority | Data Check | Notes
-|-|-|-|-|-|-|-
DB-CART-01 | Decrease quantity on create cart | Có products | POST /cart/add | Product.quantity giảm đúng | P0 | Mongo: products |  
DB-CART-02 | Increase quantity on cancel item | Có item Cancelled | PUT status=Cancelled | Product.quantity tăng lại | P0 | Mongo: products |  
DB-ORD-01 | Order totals formatting | Có order | GET /order/me | total làm tròn 2 số | P2 | Order.total |  
DB-ADDR-01 | Owner enforced listing | Login | GET /address | Chỉ trả địa chỉ của user | P1 | Address.user == req.user |  
DB-REV-01 | Review linked to delivered cart | Có delivered cart | POST review | Review.user, product, status hợp lệ | P1 | relations |  

3.1.4 Performance testing (smoke)

ID | Title | Preconditions | Steps | Expected Result | Priority | Metric | Notes
-|-|-|-|-|-|-|-
PERF-LIST-01 | List page size | Seed >= 30 SP | GET /product/list?limit=10 | Trả đúng 10 SP; latency trong ngưỡng | P2 | time(ms), count |  
PERF-LIST-02 | Sort fallback cost | sortOrder hỏng | GET list với sort hỏng | Không lỗi; dùng default; latency ổn | P2 | time(ms) |  
PERF-FEAT-01 | Featured limit | Seed featured | GET /product/featured?limit=8 | Chính xác 8; latency ổn | P2 | time, count |  
PERF-POP-01 | Popular limit | Seed reviews | GET /product/popular?limit=8 | Chính xác 8; latency ổn | P2 | time, count |  

3.1.5 Security and Access Control Testing

ID | Title | Preconditions | Steps | Expected Result | Priority | Endpoint/Route | Notes
-|-|-|-|-|-|-|-
SEC-ADDR-01 | Address API without token | Non-auth | POST/GET/PUT/DELETE | 401/403 (kỳ vọng); log defect điểm hở | P0 | /address/* | Negative
SEC-CART-01 | Cart with admin role | Admin login | Gọi /cart/* | 403 theo gate | P0 | /cart/* |  
SEC-USER-01 | Non-admin access /user | Member login | GET /user | 403; nếu 200 => bug “Missing role check” | P0 | GET /user | Negative
SEC-ORD-01 | Update item status any user | Bất kỳ login | PUT status item | (Hiện 200) => log defect | P0 | PUT /order/status/item/:id | Negative
SEC-REV-01 | Approve/reject review without admin | Member login | PUT approve/reject | (Nếu không chặn) => defect | P0 | /review/* | Negative

3.1.6 Regression Testing (Smoke Suite)

ID | Title | Preconditions | Steps | Expected Result | Priority | Area | Notes
-|-|-|-|-|-|-|-
REG-01 | Browse → detail → add → checkout | Seed sẵn sp | E2E Member flow | Đơn hàng thành công | P0 | E2E |  
REG-02 | Login/Register/Forgot/Reset |  | Chạy nhanh các nhánh | 200 & thông báo đúng | P0 | Auth |  
REG-03 | Listing filters/sort/search |  | GET list với các tổ hợp | Trả về đúng lọc/sắp xếp | P1 | Catalog |  
REG-04 | Wishlist basic |  | Add/Get | Không duplicate; hiển thị đúng | P2 | Wishlist |  
REG-05 | Review allowed | Có order delivered | POST review | 200 | P2 | Review |  
REG-06 | Dashboard summary | Admin login | GET /dashboard/summary | 200; trường đủ | P2 | Dashboard |  

**4 RESOURCE**

4.1 Human Resource (trích sheet Resources)

Role | Name/Team | Responsibilities
-|-|-
QA Engineer | <Your Name> | Thiết kế/thực thi/Report, bằng chứng
Backend Reviewer | Server Dev | Review API & xử lý lỗi
Frontend Reviewer | Client Dev | Review UI & xử lý lỗi
Project Manager | PM | Duyệt kế hoạch, lịch, rủi ro

4.2 Test management
- Công cụ: Browser DevTools, Postman/REST client, MongoDB GUI, logs.
- Báo cáo (trích sheet Reporting):
  - Daily Test Progress (daily, QA/Dev/PM, Email/Chat/Sheet)
  - Defect Reporting (realtime)
  - Weekly Summary (weekly)
  - Final Test Report (at exit)
  - Metrics: Pass rate, Defect density, Coverage by module
- Quy trình defect: chuẩn mô tả/steps/expected–actual/ảnh; gán mức độ; theo dõi trạng thái.

**5 TEST ENVIRONMENT** (trích sheet Environment)

5.1 Hardware
- Máy trạm QA (≥ 8GB RAM).

5.2 Software
- Node.js LTS; npm; MongoDB; Chrome/Firefox (Edge/Safari optional).

5.3 Infrastructure
- Localhost/Staging; internet ổn định cho sandbox mail; seed data; logging.

Environment tables

Hạng mục | Chi tiết
-|- 
Hardware | Máy trạm QA (≥8GB RAM), ổ SSD khuyến nghị
OS | Windows/macOS/Linux theo môi trường dev
Runtime | Node.js LTS, npm
Database | MongoDB (local/container)
Browsers | Chrome/Firefox latest; Edge/Safari optional
Network | Localhost/Staging; internet ổn định cho sandbox mail
Data | Seed SP/brand/category/user; email test; reset DB giữa các vòng
Logging | Server console, error logs nếu có

**6 TEST MILESTONES** (trích sheet Schedule_Milestones)

Milestone | Target Date | Owner | Notes
-|-|-|-
Approve Test Plan | 2025-12-16 | PM/Approver |
Complete Test Design | 2025-12-18 | QA |
Start Test Execution | 2025-12-18 | QA |
Cycle 1 Bug Fix/Retest | 2025-12-19 | Dev/QA |
Regression Pass | 2025-12-20 | QA |
Exit Review & Sign-off | 2025-12-21 | PM/QA/Dev |

**7 DELIVERABLES** (trích sheet Deliverables)

Deliverable | Owner | Format
-|-|-
Approved Test Plan | QA/PM | MD + Excel
Test Cases | QA | CSV/MD (linked to endpoints)
Test Data | QA | CSV/JSON seed
Execution Evidence | QA | Screenshots/Logs
Daily/Final Test Report | QA | MD/PDF + metrics
Defect Log | QA | Jira/Sheet

**Appendix — Traceability & Coverage**
- Xem `TestPlan_Traceability` và `TestPlan_Coverage_By_Module` trong Excel để truy vết route → tiêu chí kiểm thử → mức ưu tiên.
