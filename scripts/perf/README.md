# MERN Store k6 Performance Suite

## Chuẩn bị

1. **Cài k6**  
   - Windows + Chocolatey: `choco install k6`  
   - Hoặc tải binary từ [https://k6.io](https://k6.io)
2. **Cài & seed backend**  
   ```bash
   npm install
   npm run install:server
   cd server
   npm run seed:db admin@example.com AdminPass123 -- --reset
   npm run dev
   ```
   Server mặc định lắng nghe `http://localhost:3000`.

## Script

- File chính: `scripts/perf/mernstore-load-test.js`
- Bao gồm 4 scenario:
  - `browseFlow`: người dùng công khai duyệt health, featured, popular và chi tiết sản phẩm.
  - `buyerFlow`: đăng nhập user seed, tạo giỏ hàng và đặt hàng.
  - `adminFlow`: admin đăng nhập, đọc `/product`, `/order`, `/dashboard/summary`.
  - `merchantFlow`: merchant đăng nhập, đọc `/product`, `/product/list/select`, `/order`.

## Chạy nhanh

```bash
k6 run scripts/perf/mernstore-load-test.js ^
  --env BASE_URL=http://localhost:3000 ^
  --env TEST_EMAIL=jane.doe@example.com ^
  --env TEST_PASSWORD=customer123 ^
  --env ADMIN_EMAIL=admin@example.com ^
  --env ADMIN_PASSWORD=AdminPass123 ^
  --env MERCHANT_EMAIL=contact@techwave.com ^
  --env MERCHANT_PASSWORD=merchant123
```

> Windows PowerShell dùng dấu `^`, macOS/Linux thay bằng `\`.

## Biến môi trường hữu ích

| Biến | Default | Ý nghĩa |
| --- | --- | --- |
| `BASE_URL` | `http://localhost:3000` | URL backend |
| `API_PREFIX` | `/api` | Prefix router server |
| `TEST_EMAIL` / `TEST_PASSWORD` | `jane.doe@example.com` / `customer123` | Tài khoản seed dùng checkout |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `admin@example.com` / `AdminPass123` | Tài khoản admin tạo khi seed |
| `MERCHANT_EMAIL` / `MERCHANT_PASSWORD` | `contact@techwave.com` / `merchant123` | Merchant seed mặc định |
| `PAYMENT_METHOD` | `COD` | Giá trị `paymentMethod` gửi lên API |
| `CART_QTY` | `1` | Số lượng sản phẩm thêm vào cart |
| `PRODUCT_PAGE_MAX` | `3` | Trang tối đa chọn ngẫu nhiên khi duyệt |
| `BROWSE_*` | xem file script | Điều khiển traffic scenario duyệt |
| `CHECKOUT_*` | xem file script | Điều khiển load scenario checkout |
| `ADMIN_*` / `MERCHANT_*` | xem file script | Điều chỉnh VUs, thời gian cho scenario admin/merchant |
| `K6_SEED` | `20241218` | Seed random để tái hiện |

## Báo cáo

- Xuất JSON: `k6 run ... --summary-export reports/k6-summary.json`
- Xuất stream để phân tích thêm: `--out json=reports/k6-stream.json`

> Script gửi cart/order thật nên sau test có thể reset DB:  
> `cd server && npm run seed:db admin@example.com AdminPass123 -- --reset`.
