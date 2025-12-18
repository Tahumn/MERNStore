# MERNStore – MERN E-commerce Platform

## 1. Tổng quan dự án
MERNStore là một hệ thống thương mại điện tử hoàn chỉnh được xây dựng trên nền tảng MERN stack (MongoDB, Express.js, React.js, Node.js).
Dự án mô phỏng một nền tảng mua bán trực tuyến thực tế, hỗ trợ đa vai trò người dùng, đa luồng nghiệp vụ và quy trình kiểm thử – triển khai hiện đại theo hướng Agile kết hợp CI/CD.
Hệ thống được thiết kế xoay quanh ba luồng nghiệp vụ chính, tương ứng với ba vai trò người dùng:
- Client (Khách hàng)
- Merchant (Nhà cung cấp)
- Admin (Quản trị hệ thống) 
Hệ thống được xây dựng theo mô hình Frontend – Backend – Database tách biệt, hỗ trợ:
- Tự động hóa kiểm thử (Automation Testing)
- Tích hợp CI/CD
- Container hóa bằng Docker
- Triển khai thực tế trên MongoDB Atlas

## **2. Mục tiêu của dự án**
### **2.1 Mục tiêu chức năng**
- Xây dựng một website thương mại điện tử với đầy đủ các nghiệp vụ cốt lõi.
- Hỗ trợ nhiều vai trò người dùng với quyền hạn và phạm vi truy cập khác nhau.
- Đảm bảo dữ liệu được xử lý nhất quán giữa Frontend – Backend – Database.
- 
### **2.2 Mục tiêu kỹ thuật**
- Áp dụng MERN stack
- Thiết kế hệ thống RESTful API rõ ràng, dễ mở rộng.
- Áp dụng CI/CD pipeline để tự động hóa build – test – deploy.
- Đóng gói và triển khai hệ thống bằng Docker.

## Hình 1: Luồng nghiệp vụ tổng quát

![Luồng nghiệp vụ tổng quát](https://github.com/user-attachments/assets/5cc2b291-5f18-4d5b-9adf-82c3224c9871)



## **3. Kiến trúc hệ thống**
### **3.1 Kiến trúc tổng thể**
Hệ thống được chia thành 3 tầng chính:
   1. Frontend (Client)
      - Xây dựng bằng React.js
      - Giao tiếp với Backend thông qua REST API
      - Chạy độc lập trên port riêng
      - Phục vụ giao diện cho Client, Merchant và Admin

   2. Backend (Server)
      - Xây dựng bằng Node.js + Express.js
      - Xử lý logic nghiệp vụ, xác thực và phân quyền người dùng
      - Cung cấp các REST API cho frontend
      - Kết nối cơ sở dữ liệu MongoDB thông qua MongoDB Atlas

   3. Database: Mongo Atlas

## Hình 2: Overall Architecture Diagram

![Overall Architecture Diagram](https://github.com/user-attachments/assets/285b5ee4-72d0-41af-b1a9-2014b74b273f)

## Hình 3: Context Diagram

![Context Diagram](https://github.com/user-attachments/assets/b38ee0a9-845d-4a8d-8c18-d0dd2f556edb)

## Hình 4: Container Diagram

![Container Diagram](https://github.com/user-attachments/assets/6580eed6-991c-4e60-8872-3119fabc89f6)

## Hình 5: Component Diagram

![Component Diagram](https://github.com/user-attachments/assets/eb9ae18a-d2dc-42b4-8b3f-72787aa69e96)


## **4. Kiểm thử & CI/CD**
Hệ thống MERNStore được kiểm thử theo nhiều cấp độ nhằm đảm bảo chất lượng phần mềm:
- **Test Plan & Test Cases:** lưu tại thư mục docs/testing
- **Chạy test nhanh:**
  ``` bash
  npm run test:server
  ```
- **Chạy full suite:**
  ``` bash
  npm run test:server:full
  ```
- **CI/CD:** GitHub Actions tự động chạy test khi có push hoặc pull request
- **Báo cáo kiểm thử:** được tổng hợp theo template chuẩn trong tài liệu dự án

## **5. Phạm vi ứng dụng**
- Đồ án môn Kiểm thử phần mềm
- Demo Agile + CI/CD
