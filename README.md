# MERNStore – MERN E-commerce Platform

## 1. Tổng quan dự án
MERNStore là một hệ thống thương mại điện tử hoàn chỉnh, được phát triển nhằm mô phỏng một nền tảng mua bán trực tuyến thực tế, trong đó hỗ trợ đa vai trò người dùng, đa luồng nghiệp vụ, và quy trình kiểm thử – triển khai hiện đại theo hướng Agile/CI-CD.
Hệ thống gồm 3 luồng nghiệp vụ chính tương ứng với 3 vai trò người dùn:
- Client (Khách hàng)
- Merchant (Nhà cung cấp)
- Admin (Quản trị hệ thống) 
Hệ thống được thiết kế theo mô hình Frontend – Backend – Database tách biệt, hỗ trợ CI/CD, Docker, Testing Automation và có thể deploy thực tế trên Vercel.

## **2. Mục tiêu của dự án**
### **2.1 Mục tiêu chức năng**
- Xây dựng một website TMĐT với đầy đủ nghiệp vụ cốt lõi
- Hỗ trợ nhiều vai trò người dùng với quyền hạn khác nhau
- Đảm bảo dữ liệu nhất quán giữa Frontend – Backend – Database

### **2.2 Mục tiêu kỹ thuật**
- Áp dụng MERN stack theo best practices
- Thiết kế RESTful API rõ ràng
- Tích hợp Redux để quản lý state phức tạp
- Áp dụng CI/CD và automation testing
- Đóng gói & triển khai hệ thống bằng Docker

## **3. Kiến trúc hệ thống**
### **3.1 Kiến trúc tổng thể**
Hệ thống được chia thành 3 tầng chính:
   1. Frontend (Client)
      - React.js
      - Giao tiếp với Backend thông qua REST API
      - Chạy độc lập trên port riêng 

   2. Backend (Server)
      - Node.js + Express
      - Xử lý logic nghiệp vụ, xác thực, phân quyền
      - Kết nối MongoDB qua Atlas
      - Cung cấp API cho client và admin

   3. Database: Mongo Atlas

## **4. Kiểm thử & CI/CD**
- Test Plan & Test Cases: docs/testing
- Chạy test nhanh: npm run test:server
- Chạy full suite: npm run test:server:full
- CI tự động qua GitHub Actions
- Báo cáo test theo template chuẩn

## **5. Phạm vi ứng dụng**
- Đồ án môn Kiểm thử phần mềm
- Demo Agile + CI/CD
