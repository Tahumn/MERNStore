# Hướng Dẫn Chạy MERN E-commerce

## Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt](#cài-đặt)
3. [Cấu Hình Environment Variables](#cấu-hình-environment-variables)
4. [Chạy Với Docker](#chạy-với-docker)
5. [Chạy Trực Tiếp (Development)](#chạy-trực-tiếp-development)
6. [Database Seeding](#database-seeding)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết

#### Option 1: Chạy với Docker (Recommended)
- **Docker Desktop**: Version 20.10+ 
  - Download: https://www.docker.com/products/docker-desktop
- **Docker Compose**: Included with Docker Desktop

#### Option 2: Chạy trực tiếp
- **Node.js**: Version 16.20.2 hoặc cao hơn
  - Download: https://nodejs.org/
- **MongoDB**: Version 5.x hoặc cao hơn
  - Download: https://www.mongodb.com/try/download/community
  - Hoặc sử dụng MongoDB Atlas (cloud)
- **npm**: Version 8+ (đi kèm với Node.js)
- **Git**: Để clone repository

### Yêu Cầu Phần Cứng (Tối Thiểu)
- RAM: 4GB (8GB recommended)
- Disk Space: 2GB trống
- CPU: 2 cores

---

## Cài Đặt

### Bước 1: Clone Repository

```bash
git clone https://github.com/mohamedsamara/mern-ecommerce.git
cd mern-ecommerce
```

Hoặc nếu đang dùng fork của Tahumn:
```bash
git clone https://github.com/Tahumn/MERNStore.git
cd MERNStore
```

### Bước 2: Checkout Branch (Nếu Cần)

```bash
git checkout final
```

---

## Cấu Hình Environment Variables

### Server Environment Variables

Tạo file `.env` trong thư mục `server/`:

```bash
# server/.env

# Database
MONGO_URI=mongodb://mongodb:27017/mern-ecommerce
# Hoặc nếu chạy local không dùng Docker:
# MONGO_URI=mongodb://localhost:27017/mern-ecommerce
# Hoặc MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-ecommerce

# JWT Secret (Thay đổi với secret key mạnh)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Server Port
PORT=3000

# Client URL
CLIENT_URL=http://localhost:8081

# Email Service (Mailgun)
MAILGUN_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
MAILGUN_EMAIL_SENDER=noreply@yourdomain.com

# Newsletter (Mailchimp)
MAILCHIMP_KEY=your_mailchimp_api_key
MAILCHIMP_LIST_KEY=your_mailchimp_list_id

# AWS S3 (For Product Images)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_s3_bucket_name

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/auth/facebook/callback

# Node Environment
NODE_ENV=development
```

### Client Environment Variables

Tạo file `.env` trong thư mục `client/`:

```bash
# client/.env

# API URL
API_URL=http://localhost:3001

# Client Port (for webpack dev server)
PORT=8080

# Node Environment
NODE_ENV=development
```

### Ví Dụ Files

Server có file mẫu: `server/.env.example`  
Client có file mẫu: `client/.env.example`

Bạn có thể copy và chỉnh sửa:
```bash
# Copy server env
cp server/.env.example server/.env

# Copy client env
cp client/.env.example client/.env
```

---

## Chạy Với Docker

### Phương Pháp 1: Docker Compose (Recommended)

#### Bước 1: Cấu Hình docker-compose.yml

Mở file `docker-compose.yml` và đảm bảo đúng cấu hình:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

  server:
    build: ./server
    container_name: server
    ports:
      - '3001:3000'
    environment:
      - MONGO_URI=mongodb://mongodb:27017/mern-ecommerce
      - JWT_SECRET=your_jwt_secret_here
      - NODE_ENV=production
    depends_on:
      - mongodb

  client:
    build: ./client
    container_name: client
    ports:
      - '8081:8080'
    depends_on:
      - server

volumes:
  mongo-data:
```

#### Bước 2: Build Images

```bash
docker-compose build
```

Build time: ~10-20 phút lần đầu (có cache sẽ nhanh hơn)

#### Bước 3: Start Containers

```bash
# Start all services
docker-compose up -d

# Hoặc không dùng detached mode để xem logs
docker-compose up
```

#### Bước 4: Kiểm Tra Logs

```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs từng service
docker-compose logs -f client
docker-compose logs -f server
docker-compose logs -f mongodb
```

#### Bước 5: Truy Cập Application

- **Client**: http://localhost:8081
- **Server API**: http://localhost:3001
- **MongoDB**: localhost:27017

#### Dừng Services

```bash
# Stop containers
docker-compose down

# Stop và xóa volumes (database data sẽ mất)
docker-compose down -v
```

### Phương Pháp 2: Docker Individual Build

```bash
# Build client
docker build -t mern-ecommerce-client ./client

# Build server
docker build -t mern-ecommerce-server ./server

# Run MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Run server
docker run -d -p 3001:3000 --name server \
  -e MONGO_URI=mongodb://host.docker.internal:27017/mern-ecommerce \
  -e JWT_SECRET=your_secret \
  mern-ecommerce-server

# Run client
docker run -d -p 8081:8080 --name client mern-ecommerce-client
```

---

## Chạy Trực Tiếp (Development)

### Bước 1: Install Dependencies

Từ thư mục root:

```bash
# Install dependencies cho cả client và server
npm install
```

Lệnh này sẽ tự động chạy:
- `npm install` trong thư mục `server/`
- `npm install` trong thư mục `client/`

Hoặc install riêng:

```bash
# Server
cd server
npm install
cd ..

# Client
cd client
npm install
cd ..
```

### Bước 2: Start MongoDB

**Option 1: Local MongoDB**
```bash
# Windows
mongod --dbpath C:\data\db

# Linux/Mac
mongod --dbpath /data/db
```

**Option 2: MongoDB Docker Container**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option 3: MongoDB Atlas**
- Sử dụng connection string từ Atlas trong `.env`

### Bước 3: Start Development Servers

**Option 1: Start cả hai cùng lúc (Recommended)**

Từ thư mục root:
```bash
npm run dev
```

Lệnh này sẽ chạy:
- Server trên port 3001 (với nodemon - auto reload)
- Client trên port 8080 (với webpack-dev-server - hot reload)

**Option 2: Start riêng từng service**

Terminal 1 - Server:
```bash
cd server
npm run dev
```

Terminal 2 - Client:
```bash
cd client
npm run dev
```

### Bước 4: Truy Cập Application

- **Client Dev Server**: http://localhost:8080
- **Server API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/

---

## Database Seeding

Để tạo dữ liệu mẫu (admin user, products, categories, etc.):

### Syntax

```bash
cd server
npm run seed:db [email] [password]
```

### Ví Dụ

```bash
cd server
npm run seed:db admin@example.com Admin123!
```

### Kết Quả

Lệnh này sẽ tạo:
- ✅ Admin user với email và password đã cung cấp
- ✅ Sample categories (Electronics, Fashion, etc.)
- ✅ Sample brands
- ✅ Sample products với faker data
- ✅ Sample merchants

### Login Admin

Sau khi seed:
1. Truy cập: http://localhost:8081/login
2. Email: `admin@example.com` (hoặc email bạn đã dùng)
3. Password: `Admin123!` (hoặc password bạn đã dùng)
4. Role: Admin

---

## Build For Production

### Client Build

```bash
cd client
npm run build
```

Kết quả: Tạo thư mục `client/dist/` chứa optimized production files

### Server Production

```bash
cd server
npm start
```

Chạy server với NODE_ENV=production

### Full Production Deploy

```bash
# Build client
cd client
npm run build
cd ..

# Start server (production mode)
cd server
NODE_ENV=production node index.js
```

---

## Testing

### Run Tests

```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test
```

### API Testing

Sử dụng Postman hoặc curl:

```bash
# Health check
curl http://localhost:3001/api/

# Get products
curl http://localhost:3001/api/product

# Login (get JWT token)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

---

## Troubleshooting

### 1. Docker Build Lỗi

**Vấn đề**: Build bị fail hoặc timeout

**Giải pháp**:
```bash
# Clear Docker cache và rebuild
docker-compose build --no-cache

# Xóa tất cả containers và volumes
docker-compose down -v

# Xóa unused images
docker system prune -a
```

### 2. MongoDB Connection Error

**Vấn đề**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Giải pháp**:
```bash
# Kiểm tra MongoDB đang chạy
docker ps | grep mongodb

# Hoặc với local MongoDB
mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB container
docker-compose restart mongodb

# Kiểm tra logs
docker-compose logs mongodb
```

### 3. Port Already in Use

**Vấn đề**: `Error: Port 3001 is already in use`

**Giải pháp**:
```powershell
# Windows - Tìm process đang dùng port
netstat -ano | findstr :3001

# Kill process (thay <PID>)
taskkill /PID <PID> /F

# Hoặc thay đổi port trong .env và docker-compose.yml
```

### 4. Client Build Lỗi

**Vấn đề**: Webpack build failed

**Giải pháp**:
```bash
cd client

# Xóa node_modules và reinstall
rm -rf node_modules
npm install

# Clear webpack cache
rm -rf dist
npm run clean

# Rebuild
npm run build
```

### 5. JWT Token Invalid

**Vấn đề**: Authentication không hoạt động

**Giải pháp**:
- Đảm bảo `JWT_SECRET` trong server/.env khớp
- Clear localStorage trong browser (F12 > Application > Local Storage)
- Login lại để lấy token mới

### 6. CORS Errors

**Vấn đề**: `Access-Control-Allow-Origin` error

**Giải pháp**:
- Kiểm tra `CLIENT_URL` trong server/.env
- Đảm bảo CORS được cấu hình đúng trong `server/index.js`
- Restart server sau khi thay đổi

### 7. Slow Docker Build

**Vấn đề**: Build mất quá nhiều thời gian

**Giải pháp**:
```bash
# Sử dụng BuildKit (faster)
DOCKER_BUILDKIT=1 docker-compose build

# Hoặc set environment variable (Windows PowerShell)
$env:DOCKER_BUILDKIT=1
docker-compose build
```

### 8. Database Seed Lỗi

**Vấn đề**: Seed command không hoạt động

**Giải pháp**:
```bash
# Đảm bảo MongoDB đang chạy
docker-compose ps

# Xóa database cũ
mongosh mern-ecommerce --eval "db.dropDatabase()"

# Seed lại
cd server
npm run seed:db admin@test.com Admin123!
```

---

## Useful Commands

### Docker Commands

```bash
# Build specific service
docker-compose build client
docker-compose build server

# Restart specific service
docker-compose restart client

# View logs with timestamp
docker-compose logs -f --timestamps client

# Execute command in container
docker-compose exec server npm run seed:db admin@test.com pass123

# Stop and remove everything
docker-compose down -v --remove-orphans

# Check container stats
docker stats
```

### Development Commands

```bash
# Root level
npm run dev              # Start both client and server
npm install              # Install all dependencies

# Server
cd server
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production
npm run seed:db          # Seed database

# Client
cd client
npm run dev              # Start webpack-dev-server
npm run build            # Build for production
npm run clean            # Clean dist folder
```

### MongoDB Commands

```bash
# Connect to MongoDB
mongosh mern-ecommerce

# Show collections
show collections

# Count documents
db.users.countDocuments()
db.products.countDocuments()

# Find admin user
db.users.findOne({role: 'ROLE_ADMIN'})

# Drop database (CAREFUL!)
db.dropDatabase()
```

### Git Commands

```bash
# Check current branch
git branch

# Switch branch
git checkout final

# Pull latest changes
git pull origin final

# Check status
git status
```

---

## Environment Variables Reference

### Server Required Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)

### Server Optional Variables
- `CLIENT_URL` - Frontend URL for CORS
- `MAILGUN_KEY` - Mailgun API key for emails
- `MAILGUN_DOMAIN` - Mailgun domain
- `AWS_ACCESS_KEY_ID` - AWS S3 access key
- `AWS_SECRET_ACCESS_KEY` - AWS S3 secret key
- `AWS_BUCKET_NAME` - S3 bucket name
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `FACEBOOK_CLIENT_ID` - Facebook OAuth app ID

### Client Variables
- `API_URL` - Backend API URL (default: http://localhost:3001)
- `PORT` - Dev server port (default: 8080)

---

## Production Deployment

### Vercel Deployment

#### Deploy Server
```bash
cd server
vercel --prod
```

#### Deploy Client
```bash
cd client
vercel --prod
```

#### Environment Variables
Thêm environment variables trong Vercel Dashboard:
- Settings > Environment Variables
- Thêm tất cả variables từ `.env`

### Docker Production

```bash
# Build với production config
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Performance Tips

1. **Enable BuildKit** cho Docker builds nhanh hơn
2. **Use npm ci** thay vì npm install trong production
3. **Clear cache** nếu build lỗi: `docker-compose build --no-cache`
4. **Monitor logs** khi development: `docker-compose logs -f`
5. **Database indexing** cho queries nhanh hơn
6. **Use Redis** cho caching (optional enhancement)

---

## Support & Resources

- **GitHub Issues**: https://github.com/mohamedsamara/mern-ecommerce/issues
- **Documentation**: README.md, ARCHITECTURE.md
- **MERN Stack**: https://www.mongodb.com/mern-stack
- **Docker Docs**: https://docs.docker.com/
- **React Docs**: https://react.dev/

---

## Quick Start Checklist

- [ ] Clone repository
- [ ] Create `.env` files (server & client)
- [ ] Install Docker Desktop
- [ ] Run `docker-compose build`
- [ ] Run `docker-compose up -d`
- [ ] Seed database: `docker-compose exec server npm run seed:db admin@test.com Admin123!`
- [ ] Access http://localhost:8081
- [ ] Login với admin credentials
- [ ] Test Orders và Products tabs

---

## Lưu Ý Quan Trọng

⚠️ **Security**: Đổi `JWT_SECRET` trong production  
⚠️ **Database**: Backup data trước khi drop database  
⚠️ **Ports**: Đảm bảo ports 27017, 3001, 8081 không bị chiếm  
⚠️ **Environment**: Không commit `.env` files lên Git  
⚠️ **Dependencies**: Sử dụng đúng Node version (16.20.2)  

---

Chúc bạn phát triển thành công! 🚀
