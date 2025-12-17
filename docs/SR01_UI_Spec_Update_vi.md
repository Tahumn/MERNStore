**SR01 — Danh mục sản phẩm (Client)**

- Nguồn: 2.MRSW-Software (MoTaUC)_online.xlsx → sheet `SR01`
- Cơ sở: các ảnh chụp UI nằm trong workbook (xl/media image7–image16)

Bản cập nhật này viết lại 3 phần để khớp với UI hiện tại: Hành động, Phông chữ và Quy tắc Focus. Dùng nội dung dưới đây để thay thế các khối tương ứng trong SR01.

**Hành động**

Dùng bảng CSV ở `docs/SR01_UI_Spec_Update_vi.csv` để nhập vào Excel (các cột: `ID,Tên mục,Hành động`). Tóm tắt hành vi chính:

- Tìm kiếm toàn cục: nhập từ khóa trong `Search Products` rồi nhấn Enter để tới trang kết quả.
- Biểu tượng giỏ hàng: mở túi hàng; huy hiệu hiển thị số sản phẩm; Enter/Space kích hoạt.
- Menu Brands, Shop, Welcome: mở bằng click hoặc Enter/Space; đóng bằng Esc hoặc click ra ngoài; phím mũi tên điều hướng các mục.
- Menu cạnh (hamburger/overlay): mở/đóng; khi mở sẽ bẫy focus bên trong; Esc để đóng.
- Nút kêu gọi hành động ở hero `Shop Now`: điều hướng sang trang danh sách Shop.
- Banner/thẻ khuyến mãi: click để tới bộ sưu tập/ưu đãi tương ứng.
- Thẻ sản phẩm: click ảnh/tiêu đề để xem chi tiết; `Add To Cart` thêm 1 đơn vị; disabled khi hết hàng; có thông báo thân thiện với trình đọc màn hình.
- Bộ lọc danh sách:
  - Thanh trượt giá (2 đầu) đặt min/max; kết quả cập nhật theo khoảng.
  - Lọc đánh giá: hiển thị các sản phẩm có số sao ≥ lựa chọn.
  - Sắp xếp: `Newest First`, `Price: Low → High`, `Price: High → Low`, `Top Rated`.
  - Tóm tắt kết quả: hiển thị khoảng (ví dụ “Showing 1–4 of 4 products”).
- Chi tiết sản phẩm: chọn số lượng; thêm/gỡ khỏi túi; chia sẻ qua biểu tượng mạng xã hội; hiển thị tồn kho.
- Đánh giá: nhập sao (1–5), nội dung, đề xuất Yes/No, Đăng.
- Newsletter ở footer: nhập email và `Subscribe`; kiểm tra định dạng.

**Phông chữ**

Thống nhất thang đo responsive và chuẩn hóa tên kích thước (thay “Very Small” bằng “Extra Small”). Dùng rem để mở rộng theo root; bảng quy đổi px chỉ mang tính tham khảo.

- Font-family: system stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`).
- Line-height: 1.4–1.6 cho body; 1.2–1.35 cho heading.
- Trọng lượng: 700 (heading đậm), 600 (nút/nhãn), 400 (đoạn văn).
- Màu: body `#1f2937`, chữ phụ `#6b7280`, link `#2563eb`.

Bảng kích thước:

- Extra Large — 1.875rem ≈ 30px (heading hero)
- Large — 1.5rem ≈ 24px (tiêu đề khu vực)
- Medium — 1.25rem ≈ 20px (tiêu đề thẻ, giá)
- Small — 1rem ≈ 16px (nội dung, input)
- Extra Small — 0.875rem ≈ 14px (meta, badge)

Áp dụng theo thành phần:

- H1: 2.0–2.25rem/700; H2: 1.5rem/700; H3: 1.25rem/600.
- Button/CTA: 0.9375–1rem/600; có thể viết hoa; vùng chạm tối thiểu 44×44px.
- Input/placeholder: 1rem/400; nhãn 0.875–1rem/600.

**Quy tắc Focus**

Hành vi bàn phím và focus tuân thủ WCAG 2.1 AA.

- Chung: dùng `:focus-visible` cho người dùng bàn phím; không xóa outline toàn cục. Cung cấp vòng focus 2px có độ tương phản cao và offset 2px.
  - Nền sáng: vòng `#2563eb` 2px + offset 2px bóng `rgba(37,99,235,0.35)`.
  - Banner nền tối/màu: vòng `#ffffff` 2px + offset 2px `rgba(255,255,255,0.5)`.
  - Tương phản: vòng phải ≥ 3:1 so với nền lân cận.
- Thứ tự tab: điều hướng trên cùng → tìm kiếm → menu → CTA hero → nội dung (trái→phải, trên→dưới). Có liên kết bỏ qua (`Skip to content`).
- Kích hoạt:
  - Nút/liên kết: Enter/Space.
  - Dropdown: Enter để bật/tắt; Up/Down để di chuyển; Esc đóng; công bố bằng `aria-expanded`.
  - Menu cạnh/overlay: bẫy focus; focus vào phần tử đầu tiên khi mở; Esc hoặc nút Close để đóng; hoàn trả focus về nút mở.
  - Thanh trượt giá (2 đầu): `Left/Right` ±1, `PageUp/PageDown` ±10, `Home/End` min/max; từng đầu có `aria-valuemin/max/now`.
  - Đánh giá sao: `Left/Right` (hoặc `Down/Up`) chọn 1–5; công bố trạng thái, ví dụ “4 of 5 stars selected”.
- Trạng thái vô hiệu: `disabled` thật hoặc `aria-disabled="true"` cùng `tabindex="-1"`; không focusable.
- Thông báo trực tiếp (live): các hành động thay đổi túi hàng dùng vùng thông báo nhẹ (polite), ví dụ “Added GameForge Nexus Console to bag”.

Tham chiếu CSS (ví dụ):

```css
:where(button, [role="button"], a, input, select, textarea) {
  outline: none;
}
:where(button, [role="button"], a, input, select, textarea):focus-visible {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #2563eb; /* 2px offset + 2px ring */
  border-radius: 6px; /* bo tròn theo control */
}
/* Dùng trên banner tối */
.on-dark :focus-visible { box-shadow: 0 0 0 2px rgba(37,99,235,0.55), 0 0 0 4px #fff; }
```

Thứ tự bàn phím và ghi chú (khớp ảnh chụp):

- Header: hamburger → logo → search → cart → Brands → Shop → Welcome.
- Home: hero `Shop Now` → ba thẻ promo → carousel/thẻ sản phẩm.
- Listing: `Price` slider (đầu min rồi đến đầu max) → `Rating` filter → `Sort` combobox → các thẻ (mỗi thẻ: ảnh/liên kết → tiêu đề → giá → Add To Cart).
- Chi tiết sản phẩm: combobox số lượng → Add/Remove Bag → biểu tượng chia sẻ → tabs/reviews.
- Đánh giá: nhập sao → textarea → combobox recommend → Publish.
- Newsletter: ô email → Subscribe.

Nhập CSV vào bảng “Action” của SR01 và thay thế các khối “Font” và “Focus Rule” bằng nội dung ở trên.

