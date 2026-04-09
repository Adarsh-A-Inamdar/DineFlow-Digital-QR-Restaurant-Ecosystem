# Final Project Plan: Restaurant Order Management & QR System

This document serves as the official project plan and source of truth for the development phase.

## 1. Project Vision
A premium, real-time digital ecosystem for restaurants featuring secure, per-visit QR interactions and a high-efficiency Kitchen Display System (KDS).

## 2. Technical Stack
- **Frontend**: React.js (Vite) + JavaScript
- **Backend**: Node.js + Express.js (MVC Architecture)
- **Database**: **MongoDB** (with Mongoose ODM)
- **OTP Provider**: **Firebase Auth (Phone Number)**
- **Styling**: Shadcn UI + Tailwind CSS
- **Icons**: react-icons
- **State Management**: Zustand + TanStack Query (React Query)
- **Animations**: Framer Motion
- **Real-time**: Socket.IO

---

## 3. Core Architecture: Feature-Based Modules
The project will be structured into independent, feature-driven directories:

### 📱 Customer Module (The QR Experience)
- **Auth Model**: **Strict Single-Session OTP**. User must verify phone number on every scan for table security. No long-term persistence.
- **Components**: OTP Login, Category Bar, MenuItem Card, Customizable Cart, Live Order Tracker.
- **UX Flow**: Scan QR → Verify OTP → Browse Menu → Place Order → Track Status.

### 🍳 Kitchen Module (KDS)
- **Logic**: Real-time order grid with sound alerts.
- **Configurable Timer**: Preparation timers are optional. Admins can toggle the timer on/off for specific dishes.
- **Components**: KDS Grid, Status Toggles (Pending → Preparing → Served), Audio Alerts.

### 📊 Admin Module (Management)
- **Control**: Menu CRUD, Table Mapping, Sales Analytics.
- **Config**: Toggle Preparation Timer per dish, manage GST settings.
- **Components**: Analytics Dashboard, Interactive Table Map, Menu Manager.

### 🔐 Auth Module (Identity)
- **Type**: Stateless, table-bound session.
- **Logic**: **Firebase Phone Authentication**. Client sends `idToken` to backend; backend verifies via `firebase-admin` and establishes table session.
- **Roles**: Admin (JWT protected), Kitchen (JWT protected), Customer (Firebase session).

---

## 4. Folder Structure (MVC Architecture)

### 💻 Frontend (React)
```text
src/
├── components/shared/          # Buttons, Modals, Inputs, Cards
├── features/
│   ├── auth/                   # OTP logic, session state
│   ├── customer/               # Menu, Cart, Order tracking
│   ├── kitchen/                # KDS grid, status logic
│   └── admin/                  # Analytics, Menu CRUD, Tables
├── hooks/                      # useSocket, useAuth, useCart
├── store/                      # Zustand global stores
└── routes/                     # App routing (React Router)
```

### ⚙️ Backend (Node.js)
```text
server/
├── config/                     # DB & Firebase Initialization
├── models/                     # Mongoose Schemas (Data Layer)
├── controllers/                # Business Logic (Logic Layer)
├── routes/                     # Express Routes (Traffic Layer)
├── middleware/                 # Auth & Validation
├── services/                   # Socket.io & External APIs
└── utils/                      # Calculations & PDF Generators
```

---

## 5. Data Schema Models

### Menu Item
- `id`, `name`, `price`, `category`, `description`, `imageUrl`.
- `enableTimer`: Boolean (Admin toggle).
- `preparationTime`: Number (m).

### Order
- `id`, `tableId`, `phoneNumber`, `items[]`, `status`, `totalAmount`, `timestamps`.

---

## 6. API Points
- `POST /auth/verify-token` (Firebase ID Token verification)
- `GET /menu` | `POST /orders` | `GET /orders/table/:id` (Customer)
- `GET /kitchen/orders` | `PATCH /orders/:id/status` (KDS)
- `GET /admin/analytics` | `POST /admin/menu` (Admin)

---

## 7. UI/UX "Wow" Factors
- **Glassmorphism**: Translucent card designs for the Admin dashboard.
- **Smooth Transitions**: Items "slide" into the cart using Framer Motion.
- **Tactile Feedback**: Color-coded urgency and micro-animations for KDS statuses.
