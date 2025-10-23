# Kiến Trúc Hệ Thống MERN E-commerce

## Tổng Quan Hệ Thống

MERN E-commerce là một ứng dụng thương mại điện tử full-stack được xây dựng với MERN stack (MongoDB, Express, React, Node.js), hỗ trợ 3 luồng người dùng chính: Buyers (Người mua), Sellers/Merchants (Người bán), và Admins (Quản trị viên).

---

## Stack Công Nghệ

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework, xử lý routing và middleware
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Data Modeling) cho MongoDB
- **JWT**: Authentication token
- **Passport.js**: Authentication middleware (Facebook, Google OAuth)
- **Socket.io**: Real-time communication (Support chat)
- **Multer**: File upload handling
- **AWS SDK**: Cloud storage cho product images
- **Mailgun**: Email service
- **Mailchimp**: Newsletter service

### Frontend
- **React 16.8+**: UI library với Hooks
- **Redux + Redux Thunk**: State management và async actions
- **React Router**: Client-side routing
- **Bootstrap 4 + Reactstrap**: UI components
- **Webpack**: Module bundler
- **SASS**: CSS preprocessor
- **Axios**: HTTP client
- **Socket.io-client**: Real-time client

### DevOps
- **Docker + Docker Compose**: Containerization
- **Nginx**: Web server cho production
- **Vercel**: Deployment platform
- **Nodemon**: Development auto-reload

---

## Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Port 8081)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      React App                            │  │
│  │  ├── Components (UI Components)                           │  │
│  │  ├── Containers (Smart Components with Redux)             │  │
│  │  ├── Actions (Redux Actions)                              │  │
│  │  ├── Reducers (Redux Reducers)                            │  │
│  │  └── Store (Redux Store)                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓↑ HTTP/WebSocket                      │
└─────────────────────────────────────────────────────────────────┘
                               ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (Port 3001)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Express API                            │  │
│  │  ├── Routes (API Endpoints)                               │  │
│  │  ├── Controllers (Business Logic)                         │  │
│  │  ├── Models (Mongoose Schemas)                            │  │
│  │  ├── Middleware (Auth, Role)                              │  │
│  │  ├── Services (Mailgun, Mailchimp)                        │  │
│  │  └── Socket (Real-time Support)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓↑                                     │
└─────────────────────────────────────────────────────────────────┘
                               ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB (Port 27017)                          │
│  ├── users                                                       │
│  ├── products                                                    │
│  ├── brands                                                      │
│  ├── categories                                                  │
│  ├── orders                                                      │
│  ├── carts                                                       │
│  ├── reviews                                                     │
│  └── merchants                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cấu Trúc Thư Mục

### Root Level
```
mern-ecommerce/
├── client/                 # Frontend React application
├── server/                 # Backend Express API
├── docker-compose.yml      # Docker orchestration
├── package.json           # Root package manager
└── README.md              # Project documentation
```

### Client Structure
```
client/
├── app/
│   ├── components/         # Reusable UI components
│   │   ├── Common/        # Shared components (Button, Badge, etc.)
│   │   ├── Manager/       # Admin/Manager specific components
│   │   └── Store/         # Store front components
│   ├── containers/         # Smart components connected to Redux
│   │   ├── Account/       # User account management
│   │   ├── Dashboard/     # Admin dashboard
│   │   ├── Order/         # Order management
│   │   ├── Product/       # Product management
│   │   ├── Cart/          # Shopping cart
│   │   └── ...           # Other feature containers
│   ├── contexts/          # React Context (Socket)
│   ├── styles/            # SASS stylesheets
│   ├── utils/             # Utility functions
│   ├── actions.js         # Redux action creators
│   ├── reducers.js        # Redux reducers
│   ├── store.js           # Redux store configuration
│   └── index.js           # App entry point
├── public/                # Static assets
├── webpack/               # Webpack configurations
├── Dockerfile            # Client container definition
└── package.json          # Client dependencies
```

### Server Structure
```
server/
├── config/               # Configuration files
│   ├── keys.js          # Environment keys
│   ├── passport.js      # Passport strategies
│   └── template.js      # Email templates
├── models/              # Mongoose models
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── brand.js
│   ├── category.js
│   └── ...
├── routes/              # API routes
│   └── api/
│       ├── auth.js      # Authentication routes
│       ├── product.js   # Product CRUD
│       ├── order.js     # Order management
│       └── ...
├── middleware/          # Custom middleware
│   ├── auth.js         # JWT verification
│   └── role.js         # Role-based access
├── services/           # Third-party services
│   ├── mailgun.js     # Email service
│   └── mailchimp.js   # Newsletter service
├── socket/            # Socket.io configuration
│   └── support.js     # Real-time support
├── utils/             # Utility functions
│   ├── db.js         # Database connection
│   ├── storage.js    # AWS S3 integration
│   └── seed.js       # Database seeding
├── Dockerfile        # Server container definition
├── index.js          # Server entry point
└── package.json      # Server dependencies
```

---

## Luồng Dữ Liệu (Data Flow)

### 1. User Action Flow
```
User Interaction (Click, Input)
    ↓
React Component
    ↓
Dispatch Redux Action (Action Creator)
    ↓
Redux Thunk Middleware (Async logic)
    ↓
API Call (Axios) → Express Server
    ↓
Route Handler → Controller
    ↓
Mongoose Model → MongoDB
    ↓
Response → Redux Store (Reducer)
    ↓
Update Component (via mapStateToProps)
    ↓
Re-render UI
```

### 2. Authentication Flow
```
User Login/Register
    ↓
POST /api/auth/login
    ↓
Passport Middleware (JWT Strategy)
    ↓
Verify Credentials
    ↓
Generate JWT Token
    ↓
Send Token to Client
    ↓
Store Token (localStorage)
    ↓
Include Token in Headers (Authorization: Bearer <token>)
    ↓
Protected Routes (auth middleware)
```

### 3. Real-time Support Flow
```
Customer Connects
    ↓
Socket.io Connection
    ↓
Join Support Room
    ↓
Send Message
    ↓
Broadcast to Admin
    ↓
Admin Response
    ↓
Emit to Customer
    ↓
Update Chat UI
```

---

## Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (User, Merchant, Admin),
  merchant: ObjectId (ref: Merchant),
  provider: String (email, google, facebook),
  googleId: String,
  facebookId: String,
  avatar: String,
  created: Date
}
```

### Product Model
```javascript
{
  sku: String (unique),
  name: String (required),
  description: String,
  quantity: Number,
  price: Number,
  taxable: Boolean,
  isActive: Boolean,
  brand: ObjectId (ref: Brand),
  image: { url, key },
  created: Date,
  updated: Date
}
```

### Order Model
```javascript
{
  cart: ObjectId (ref: Cart),
  user: ObjectId (ref: User),
  total: Number,
  products: Array,
  status: String (Processed, Shipped, Delivered, Cancelled),
  created: Date,
  updated: Date
}
```

### Brand Model
```javascript
{
  name: String (required),
  slug: String (unique),
  description: String,
  isActive: Boolean,
  merchant: ObjectId (ref: Merchant),
  created: Date,
  updated: Date
}
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/profile         - Get current user profile
PUT    /api/auth/profile         - Update user profile
```

### Products
```
GET    /api/product              - Get all products (public)
GET    /api/product/:slug        - Get single product
POST   /api/product              - Create product (merchant)
PUT    /api/product/:id          - Update product (merchant)
DELETE /api/product/:id          - Delete product (merchant)
GET    /api/product/list         - Admin product list
```

### Orders
```
GET    /api/order                - Get user orders
POST   /api/order                - Create new order
GET    /api/order/:id            - Get order details
PUT    /api/order/:id/cancel     - Cancel order
GET    /api/order/customer       - Admin: customer orders
```

### Brands
```
GET    /api/brand                - Get all brands
POST   /api/brand                - Create brand (merchant)
PUT    /api/brand/:id            - Update brand (merchant)
DELETE /api/brand/:id            - Delete brand (admin)
```

### Categories
```
GET    /api/category             - Get all categories
POST   /api/category             - Create category (admin)
PUT    /api/category/:id         - Update category (admin)
DELETE /api/category/:id         - Delete category (admin)
```

### Cart
```
GET    /api/cart                 - Get user cart
POST   /api/cart                 - Add to cart
DELETE /api/cart/:id             - Remove from cart
```

### Wishlist
```
GET    /api/wishlist             - Get user wishlist
POST   /api/wishlist             - Add to wishlist
DELETE /api/wishlist/:id         - Remove from wishlist
```

---

## Redux State Structure

```javascript
{
  user: {
    authenticated: Boolean,
    user: Object,
    resetFormData: Object,
    signupFormData: Object
  },
  product: {
    products: Array,
    storeProducts: Array,
    product: Object,
    isLoading: Boolean,
    productFormData: Object,
    productShopData: Object,
    advancedFilters: Object
  },
  order: {
    orders: Array,
    order: Object,
    isLoading: Boolean
  },
  cart: {
    cartItems: Array,
    cartTotal: Number
  },
  brand: {
    brands: Array,
    brand: Object,
    isLoading: Boolean
  },
  category: {
    categories: Array,
    category: Object
  },
  merchant: {
    merchants: Array,
    merchant: Object
  },
  review: {
    reviews: Array,
    reviewsSummary: Object
  },
  wishlist: {
    wishlist: Array
  },
  dashboard: {
    isMenuOpen: Boolean
  },
  notifications: Array
}
```

---

## Component Hierarchy

### Admin Dashboard Flow
```
Dashboard Container (Route: /dashboard)
  ├── AdminSidebar (Navigation)
  │     ├── UserInfo
  │     └── NavLinks (Admin/Merchant/Customer)
  ├── Admin Component
  │     ├── Overview Tab
  │     │     └── AdminOverview (Stats, Charts)
  │     ├── Orders Tab
  │     │     ├── SubPage (Header with Actions)
  │     │     ├── OrderSearch
  │     │     ├── OrderList
  │     │     └── Pagination
  │     ├── Products Tab
  │     │     ├── SubPage
  │     │     ├── ProductList
  │     │     └── LoadingIndicator
  │     ├── Categories Tab
  │     ├── Brands Tab
  │     └── Users Tab
  └── Footer
```

### Store Front Flow
```
Homepage
  ├── Navigation (Header)
  ├── Slider (Banner)
  ├── ProductList (Featured)
  └── Newsletter Signup

ProductPage (/product/:slug)
  ├── ProductInfo
  ├── ProductReviews
  ├── AddToCart Button
  └── AddToWishlist Button

Cart (/cart)
  ├── CartItems List
  ├── CartSummary
  └── Checkout Button

Checkout (/checkout)
  ├── ShippingAddress
  ├── PaymentMethod
  └── PlaceOrder Button
```

---

## Performance Optimization

### Đã áp dụng:
1. **React.memo** - Memoize functional components
2. **useCallback** - Memoize function references
3. **PureComponent** - Shallow comparison cho class components
4. **Conditional API calls** - Tránh duplicate requests
5. **Code splitting** - Webpack dynamic imports
6. **Image optimization** - Lazy loading, AWS S3 CDN

### Best Practices:
- Tránh inline arrow functions trong JSX props
- Sử dụng stable function references
- Implement shouldComponentUpdate khi cần
- Redux selector optimization với reselect
- Debounce search inputs
- Pagination cho large datasets

---

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcryptjs
3. **CORS** - Cross-Origin Resource Sharing configured
4. **Helmet** - Secure HTTP headers
5. **Input Validation** - ValidatorJS
6. **XSS Protection** - DOMPurify sanitization
7. **Role-based Access Control** - Middleware protection
8. **HTTPS** - Production SSL/TLS
9. **Environment Variables** - Sensitive data protection

---

## Third-party Integrations

### AWS S3
- Product image storage
- Secure file uploads
- CDN delivery

### Mailgun
- Transactional emails
- Order confirmations
- Password reset emails

### Mailchimp
- Newsletter subscriptions
- Email marketing campaigns

### OAuth Providers
- Google OAuth 2.0
- Facebook Login

### Socket.io
- Real-time customer support
- Live notifications

---

## Docker Architecture

```yaml
services:
  mongodb:
    image: mongo:latest
    ports: 27017:27017
    volumes: mongo-data
    
  server:
    build: ./server
    ports: 3001:3000
    depends_on: mongodb
    environment:
      - MONGO_URI
      - JWT_SECRET
    
  client:
    build: ./client (multi-stage)
      Stage 1: node:16.20.2 (build)
      Stage 2: nginx:alpine (serve)
    ports: 8081:8080
    depends_on: server
```

### Multi-stage Build Benefits:
- Smaller production image size
- Separation of build and runtime
- Nginx for efficient static serving
- Fast rebuild with layer caching

---

## Deployment Strategy

### Development
```bash
npm run dev  # Runs both client and server in watch mode
```

### Production (Docker)
```bash
docker-compose build
docker-compose up -d
```

### Production (Vercel)
- Client deployed from `/client` directory
- Server deployed from `/server` directory
- Separate deployments with shared database

---

## Monitoring & Logging

### Server Logs
- Express morgan middleware
- Error logging
- API request tracking

### Client Logs
- Redux DevTools (development)
- Error boundaries
- Performance monitoring

### Database
- MongoDB Atlas monitoring (production)
- Query performance analysis

---

## Scalability Considerations

1. **Database Indexing** - Optimized queries
2. **Caching Strategy** - Redis potential integration
3. **Load Balancing** - Nginx reverse proxy
4. **Microservices** - Potential service separation
5. **CDN** - Static asset delivery
6. **Database Sharding** - Horizontal scaling

---

## Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Advanced analytics dashboard
- [ ] Product recommendation engine
- [ ] Mobile app (React Native)
- [ ] GraphQL API layer
- [ ] Elasticsearch for product search
- [ ] Redis caching layer
- [ ] Kubernetes orchestration
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] A/B testing framework

---

## Technology Versions

- Node.js: 16.20.2
- React: 16.8.6
- MongoDB: 5.x
- Express: 4.17.1
- Redux: 4.0.1
- Docker: Latest
- Nginx: Alpine

---

## Conclusion

Hệ thống MERN E-commerce là một ứng dụng full-stack hoàn chỉnh với kiến trúc modular, scalable và maintainable. Sử dụng các best practices hiện đại về performance, security và user experience.
