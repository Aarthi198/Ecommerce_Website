# Threads & Trinkets Backend

Node.js + Express backend for the Threads & Trinkets silk thread jewelry storefront.

## Features
- MongoDB Atlas with Mongoose
- JWT authentication
- Bcrypt password hashing
- Products API with admin CRUD
- Cart endpoints for authenticated users
- Orders API with order creation, user order history, and admin order management
- Contact form endpoint with optional email notification via Nodemailer
- Error handling middleware

## Setup
1. Copy `.env.example` to `.env`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token lifetime (e.g. `7d`)
- `PORT` - Server port
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` - SMTP credentials for sending emails

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (authenticated)

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Cart
- `GET /api/cart` (authenticated)
- `POST /api/cart` (authenticated)
- `PUT /api/cart/:productId` (authenticated)
- `DELETE /api/cart/:productId` (authenticated)
- `DELETE /api/cart` (authenticated)

### Orders
- `POST /api/orders` (authenticated)
- `GET /api/orders` (authenticated)
- `GET /api/orders/:id` (authenticated)
- `GET /api/orders/admin/all` (admin)
- `PUT /api/orders/:id/status` (admin)

### Contact
- `POST /api/contact`

## Notes
- The backend is compatible with the existing React frontend and can be extended with route protection and admin tooling.
- Use `Authorization: Bearer <token>` for authenticated requests.
