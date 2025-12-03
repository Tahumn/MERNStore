# CI/CD & Monitoring Notes

## 1. CI Pipeline (GitHub Actions)
Workflow: `.github/workflows/ci.yml`

Steps:
1. Checkout code.
2. Setup Node 18.
3. Install root deps + `client` + `server`.
4. Run `npm run test:server` (Jest suite).
5. (Tùy chọn) `npm run build --prefix client` khi cần smoke build UI.

Gate: mọi Pull Request phải pass workflow trước khi merge.

## 2. CD gợi ý
- Dùng Docker Compose/Swarm để deploy client + server + mongo.
- Với môi trường staging/production: push image lên registry, HPC server `docker-compose pull && docker-compose up -d`.
- Sử dụng profile `seed` để chạy script seed 1 lần khi khởi tạo.

## 3. Monitoring
- **Health Check**: thêm endpoint `/health` ở server (simple 200 + DB status) → dùng UptimeRobot hoặc AWS ELB health check.
- **Logging**:
  - Backend: cấu hình `winston` / `pino`, log JSON -> ship sang ELK hoặc CloudWatch.
  - Frontend: bật Sentry/browser logging cho error runtime.
- **Metrics**:
  - Số request, error rate 4xx/5xx, thời gian phản hồi -> Prometheus + Grafana hoặc các dịch vụ cloud.
  - Tồn kho lệch/lỗi giỏ -> theo dõi qua job nightly.

## 4. Alerting
- Threshold gợi ý:
  - Error rate > 5% trong 5 phút
  - Latency P95 > 2s
  - Mongo connection fail
- Gửi alert qua Slack/Email.

## 5. Agile Integration
- Workflow Jira: `Backlog -> Ready for Dev -> In Progress -> Ready for QA -> In QA -> Done`.
- Link Pull Request với Jira ticket, CI comment trạng thái test vào ticket.

## 6. Checklist trước release
1. CI pass.
2. Test report cập nhật trong `docs/testing/reports`.
3. Không còn bug Critical/High mở.
4. Dashboard monitoring xanh.
