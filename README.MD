# 🍱 TiffinConnect — Full-Stack MVP

A platform connecting customers with home cooks for affordable, homemade tiffin delivery.

**Stack:** React 18 + Vite + Tailwind CSS | Node.js + Express.js | MongoDB + Mongoose | Google OAuth + bcrypt + JWT

---

## 📁 Project Structure

```
tiffin-connect/
├── backend/
│   ├── config/
│   │   └── passport.js        # Google OAuth strategy
│   ├── middleware/
│   │   └── auth.js            # JWT protect, cookOnly, customerOnly
│   ├── models/
│   │   ├── User.js            # User (local + Google OAuth)
│   │   ├── Meal.js            # Meal listings
│   │   └── Order.js           # Orders
│   ├── routes/
│   │   ├── auth.js            # Signup, Login, Google OAuth, /me
│   │   ├── meals.js           # CRUD meals
│   │   └── orders.js          # Place & manage orders
│   ├── server.js              # Express entry point
│   ├── .env.example           # Environment variables template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Responsive sticky navbar
    │   │   ├── MealCard.jsx        # Card + order modal
    │   │   └── GoogleButton.jsx    # Google OAuth button
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state + JWT
    │   ├── lib/
    │   │   └── api.js             # Axios instance with interceptors
    │   ├── pages/
    │   │   ├── Home.jsx           # Landing page with hero + stats
    │   │   ├── Browse.jsx         # Browse meals, search + filter
    │   │   ├── Login.jsx          # Login + Google OAuth
    │   │   ├── Signup.jsx         # Signup with role selection
    │   │   ├── CookDashboard.jsx  # Manage meals + incoming orders
    │   │   ├── MyOrders.jsx       # Customer order tracking with progress
    │   │   └── OAuthSuccess.jsx   # Handles Google OAuth redirect
    │   ├── App.jsx                # Router + protected routes
    │   ├── main.jsx
    │   └── index.css             # Tailwind + custom component classes
    ├── index.html
    ├── vite.config.js            # Vite + dev proxy to :5000
    ├── tailwind.config.js        # Custom spice/terra/cream theme
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google OAuth credentials (optional, for Google Sign-In)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tiffin-connect
JWT_SECRET=your_super_secret_32_char_key_here
JWT_EXPIRE=7d
SESSION_SECRET=another_secret_key

# Google OAuth (get from console.cloud.google.com)
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev   # starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to `localhost:5000` automatically.

---

## 🔑 Setting Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID & Client Secret into `.env`

---

## 🔌 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signup` | Register with email/password | Public |
| POST | `/login` | Login, returns JWT | Public |
| GET | `/me` | Get current user | JWT |
| PATCH | `/update-role` | Switch customer ↔ cook | JWT |
| GET | `/google` | Start Google OAuth flow | Public |
| GET | `/google/callback` | Google OAuth callback → redirect with token | Public |

### Meals — `/api/meals`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Browse available meals (supports `?category=lunch&search=dal`) | Public |
| GET | `/my` | Cook's own meals | Cook JWT |
| GET | `/:id` | Single meal detail | Public |
| POST | `/` | Add meal | Cook JWT |
| PUT | `/:id` | Edit meal | Cook JWT |
| DELETE | `/:id` | Delete meal | Cook JWT |

### Orders — `/api/orders`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Place order (reduces meal quantity) | Customer JWT |
| GET | `/my` | Customer's order history | Customer JWT |
| GET | `/cook` | Cook's incoming orders | Cook JWT |
| PATCH | `/:id/status` | Update order status | Cook JWT |

---

## 🗃️ MongoDB Schemas

### User
```js
{ name, email, password (bcrypt), role: 'customer'|'cook',
  avatar, phone, address, googleId, authProvider: 'local'|'google' }
```

### Meal
```js
{ mealName, description, price, quantity, category, isAvailable, tags[], cookId → User }
```

### Order
```js
{ customerId → User, cookId → User, mealId → Meal, quantity, totalPrice,
  status: 'Placed'|'Preparing'|'Out for Delivery'|'Delivered'|'Cancelled',
  deliveryAddress, note }
```

---

## 🎨 Design System

Custom Tailwind theme with:
- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Colors:** `spice-*` (amber/saffron), `terra-*` (terracotta), `cream-*` (warm white)
- **Components:** `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.input`, `.card`, `.badge`, `.error-box`
- **Animations:** `fadeUp`, `fadeIn`, `scaleIn`, `shimmer` (skeleton loading)

---

## ✨ Features

- **Dual auth:** Email/password (bcrypt) + Google OAuth (passport.js)
- **Role-based routing:** Cook vs Customer views, protected routes
- **Cook Dashboard:** Add/Edit/Delete meals, manage orders with status dropdown
- **Browse:** Server-side search + category filter, skeleton loading states
- **Order flow:** Quantity selector, address input, real-time total, success animation
- **Order tracking:** Visual step tracker (Placed → Preparing → Out for Delivery → Delivered)
- **Responsive:** Mobile-first design, hamburger menu
- **Security:** JWT auto-attach on all requests, 401 auto-logout

---

## 🛠️ Production Deployment

```bash
# Build frontend
cd frontend && npm run build

# Serve with Express (add to server.js)
app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist/index.html')))
```

Set `NODE_ENV=production` and update `GOOGLE_CALLBACK_URL` + `FRONTEND_URL` to your domain.
