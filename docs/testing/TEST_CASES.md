# Test Cases - MERN Store Core Flows

## 1. Search sản phẩm
| ID | Type | Mô tả | Bước chính | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| SRCH-01 | Automation | Search theo tên chính xác | Gọi `GET /api/product/list/search/camera` | HTTP 200, trả danh sách chứa sản phẩm có slug liên quan |
| SRCH-02 | Automation | Search không phân biệt hoa/thường | Nhập `CAMERA` ở UI search bar | Kết quả giống `camera` |
| SRCH-03 | Manual | Search không có dữ liệu | Nhập chuỗi ngẫu nhiên | UI thông báo “No product found.” |
| SRCH-04 | Manual | Search với ký tự đặc biệt | Nhập `sony+` | Không crash, lọc chính xác hoặc trả thông báo rõ ràng |
| SRCH-05 | Automation | Áp dụng filter min/max/rating | Gọi `GET /api/product/list?min=100&max=300&rating=4` | Pipeline `$match` chỉ trả sản phẩm nằm trong khoảng và rating ≥ 4 |
| SRCH-06 | Automation | Hiển thị trạng thái wishlist khi user đăng nhập | Gọi `GET /api/product/list` với token user, kiểm tra pipeline `getStoreProductsWishListQuery` | Response chứa trường `isLiked` đúng theo wishlist của user |

## 2. Giỏ hàng
| ID | Type | Mô tả | Bước chính | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| CART-01 | Automation | Từ chối user chưa login thêm giỏ server-side | Gọi `POST /api/cart/add` không token | HTTP 401 |
| CART-02 | Automation | Admin bị chặn tạo giỏ | Gọi `POST /api/cart/add` với JWT role Admin | HTTP 403, message “Store management accounts…” |
| CART-03 | Manual | Thêm sản phẩm nhiều lần | UI: nhấn “Add to cart” 2 lần | Số lượng tăng đúng, total cập nhật |
| CART-04 | Manual | Xóa item | UI: remove 1 item | Item biến mất, total giảm |
| CART-05 | Manual | Cập nhật số lượng về 0 | UI: giảm quantity xuống 0 | Sản phẩm bị loại khỏi giỏ, tổng tiền cập nhật |
| CART-06 | Manual | Xóa item server-side | Gọi `DELETE /api/cart/delete/:cartId/:productId` | HTTP 200, item bị loại khỏi DB |

## 3. Đơn hàng
| ID | Type | Mô tả | Bước chính | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| ORDER-01 | Automation | Thiếu cartId khi checkout | POST `/api/order/add` body thiếu `cartId` | HTTP 400, message “Missing cart reference…” |
| ORDER-02 | Automation | Thiếu shipping | Gửi order không đủ trường bắt buộc | HTTP 400, message “Please provide complete shipping…” |
| ORDER-03 | Manual | Happy path checkout | Add cart → Checkout → Chọn địa chỉ → Đặt hàng | Order lưu DB, email xác nhận gửi |
| ORDER-04 | Manual | Cancel order | Order history → Cancel | Quantity hoàn trả, order status cancelled |
| ORDER-05 | Manual | Admin cố đặt đơn | Gọi `/api/order/add` với token Admin | HTTP 403, message “Store management accounts cannot place customer orders.” |
| ORDER-06 | Automation | Load order history hiển thị đúng tổng + thuế | Gọi API lấy orders, kiểm tra dữ liệu từ `formatOrders` | Tổng, thuế và trạng thái từng item khớp dữ liệu cart |

## 4. Phân quyền
| ID | Type | Mô tả | Bước chính | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| AUTH-01 | Automation | Middleware từ chối khi thiếu user | Gọi role.check() không user | HTTP 401 |
| AUTH-02 | Automation | Middleware từ chối sai role | Gọi route admin bằng token member | HTTP 403 |
| AUTH-03 | Manual | User thường truy cập `/admin` | Gõ URL | Redirect về trang chủ hoặc 403 |
| AUTH-04 | Manual | Admin truy cập `/dashboard` | Login admin → dashboard | Truy cập thành công |

## 5. Coverage bổ sung
- `utils/store.caculateItemsSalesTax` → kiểm thử cấu hình thuế.
- `utils/store.caculateTaxAmount` + `formatOrders` → kiểm thử hồi quy khi trạng thái item thay đổi và xuất báo cáo đơn hàng.
- `utils/cartPermissions.ensurePurchaser` → kiểm thử phân quyền thiết lập giỏ hàng.
- `utils/queries.getStoreProductsQuery` + `getStoreProductsWishListQuery` → kiểm thử pipeline lọc & wishlist.

## 6. Mapping Automation
| Test ID | File/Script | Ghi chú |
| --- | --- | --- |
| SRCH-01 | `server/tests/integration/productSearch.test.js` | supertest |
| SRCH-05/06 | `server/tests/unit/queries.test.js` | kiểm tra pipeline filter + wishlist |
| CART-01/02 | `server/tests/unit/cartPermissions.test.js` | use ensurePurchaser |
| CART-01/02 (integration) | `server/tests-full/integration/cartRoutes.test.js` | supertest với mock auth/cart |
| ORDER-01/02/06 | `server/tests/unit/store.test.js` | validate logic & format order |
| ORDER-01..05 (integration) | `server/tests-full/integration/orderRoutes.test.js` | supertest (mock auth/cart/order/mail) |
| AUTH-01/02 | `server/tests/unit/roleMiddleware.test.js` | middleware |
| AUTH-01/02 (integration) | `server/tests-full/integration/roleAccess.test.js` | route giả lập dùng `role.check` |

Suite mở rộng (edge case, snapshot, fuzz, integration) được đặt tại `server/tests-full/*` và chạy bằng `npm run test:server:full`.

Manual test kết quả ghi lại trong `docs/testing/TEST_REPORT_TEMPLATE.md`.
