# MERN Ecommerce

## Description

An ecommerce store built with MERN stack, and utilizes third party API's. This ecommerce store enable three main different flows or implementations:

1. Buyers browse the store categories, products and brands
2. Sellers or Merchants manage their own brand component
3. Admins manage and control the entire store components 

### Features:

  * Node provides the backend environment for this application
  * Express middleware is used to handle requests, routes
  * Mongoose schemas to model the application data
  * React for displaying UI components
  * Redux to manage application's state
  * Redux Thunk middleware to handle asynchronous redux actions

## Demo

This application is deployed on Vercel Please check it out :smile: [here](https://mern-store-gold.vercel.app).

See admin dashboard [demo](https://mernstore-bucket.s3.us-east-2.amazonaws.com/admin.mp4)

## Docker Guide

To run this project locally you can use docker compose provided in the repository. Here is a guide on how to run this project locally using docker compose.

Clone the repository
```
git clone https://github.com/mohamedsamara/mern-ecommerce.git
```

Edit the dockercompose.yml file and update the the values for MONGO_URI and JWT_SECRET

Then simply start the docker compose:

```
docker-compose build
docker-compose up
```

## Database Seed

* The seed command will create an admin user in the database
* The email and password are passed with the command as arguments
* Like below command, replace brackets with email and password. 
* For more information, see code [here](server/utils/seed.js)

```
npm run seed:db [email-***@****.com] [password-******] // This is just an example.
```

## Install

`npm install` in the project root will install dependencies in both `client` and `server`. [See package.json](package.json)

Some basic Git commands are:

```
git clone https://github.com/mohamedsamara/mern-ecommerce.git
cd project
npm install
```

## ENV

Create `.env` file for both client and server. See examples:

[Frontend ENV](client/.env.example)

[Backend ENV](server/.env.example)


## Vercel Deployment

Both frontend and backend are deployed on Vercel from the same repository. When deploying on Vercel, make sure to specifiy the root directory as `client` and `server` when importing the repository. See [client vercel.json](client/vercel.json) and [server vercel.json](server/vercel.json).

## Start development

```
npm run dev
```

## QA & Testing

- **Test plan & cases**: xem `docs/testing/TEST_PLAN.md` và `docs/testing/TEST_CASES.md`.
- **Chạy automation**: 
  - Cài deps: `npm install && npm run install:server`.
  - Run nhanh 4 chức năng chính: `npm run test:server`.
  - Run full suite (edge cases + integration search/cart/order/role, tổng 43 tests): `npm run test:server:full`.
- **Báo cáo**: copy template từ `docs/testing/TEST_REPORT_TEMPLATE.md` vào thư mục `docs/testing/reports`.
- **CI**: GitHub Actions workflow `ci.yml` tự động cài đặt & chạy test trên mọi push/PR.
- **Monitoring & Agile note**: `docs/testing/CI_MONITORING.md`.

## CI/CD & Monitoring

- **CI pipeline**: `.github/workflows/ci.yml` chạy tự động khi push/PR. Local run tương đương: `npm install && npm run test:server`.
- **Docker compose**: `docker-compose up -d` để chạy client (8081), server (3001) và Mongo. Seed dữ liệu (tùy chọn): `docker-compose --profile seed up mongo-seed`.
- **Deploy thủ công**: build images `docker compose build`, push/redeploy trên server bằng `docker compose pull && docker compose up -d`.
- **Health check**: `GET http://localhost:3001/health` trả JSON gồm trạng thái tổng thể + tình trạng Mongo (`connected`, `disconnected`, ...). Có thể dùng UptimeRobot/ELB giám sát endpoint này.
- **Log & metrics**: theo gợi ý trong `docs/testing/CI_MONITORING.md` (Winston/Sentry/log shipping, Prometheus/Grafana). Tích hợp alert nếu `/health` trả mã 503 hoặc CI thất bại.

## Languages & tools

- [Node](https://nodejs.org/en/)

- [Express](https://expressjs.com/)

- [Mongoose](https://mongoosejs.com/)

- [React](https://reactjs.org/)

- [Webpack](https://webpack.js.org/)


### Code Formatter

- Add a `.vscode` directory
- Create a file `settings.json` inside `.vscode`
- Install Prettier - Code formatter in VSCode
- Add the following snippet:  

```json

    {
      "editor.formatOnSave": true,
      "prettier.singleQuote": true,
      "prettier.arrowParens": "avoid",
      "prettier.jsxSingleQuote": true,
      "prettier.trailingComma": "none",
      "javascript.preferences.quoteStyle": "single",
    }

```




