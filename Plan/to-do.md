# Project Tasks: Restaurant Order Management & QR System

## Phase 1: Foundation & Backend MVC
- [x] Initialize Node.js project `npm init -y`
- [x] Install dependencies (`express`, `mongoose`, `socket.io`, `firebase-admin`, `jsonwebtoken`, `dotenv`, `cors`)
- [x] Setup MVC directory structure (`models/`, `controllers/`, `routes/`, `middleware/`, `config/`)
- [x] Configure MongoDB connection via Mongoose
- [x] Initialize Firebase Admin SDK for Phone Auth verification
- [x] Setup basic error handling and logging middleware

## Phase 2: Database Models & Auth Logic
- [x] Create `MenuItem` schema (Categories, Pricing, Availability)
- [x] Create `Table` schema (Number, Status, Session mapping)
- [x] Create `Order` schema (Items, Status, Table link, Total)
- [x] Create `User` schema for Staff/Admin (Email, Pass, Role)
- [x] Implement `authMiddleware` for Firebase Token & Admin JWT verification

## Phase 3: Core API Modules
- [x] **Menu API**: CRUD for items and categories
- [x] **Table API**: Table status management (Occupied/Free)
- [x] **Order API**: Placement, history, and status tracking
- [x] **Auth API**: Verify Firebase ID tokens and generate sessions

## Phase 4: Real-time Engine (Socket.io)
- [x] Setup Socket.io server with room management
- [x] Implement `NEW_ORDER` broadcast to Kitchen room
- [x] Implement `STATUS_UPDATE` broadcast to specific Table rooms
- [x] Implement `CALL_WAITER` notification system

## Phase 5: Frontend Scaffolding (React + Vite)
- [x] Initialize React + Vite project with Tailwind CSS & Shadcn UI
- [x] Setup folder structure (`features/`, `components/`, `hooks/`, `store/`)
- [x] Configure Firebase Client SDK for Phone Auth
- [x] Setup Zustand for state management (Cart, Auth, UI)

## Phase 6: Core UI Development
- [x] **Customer**: Mobile-responsive menu, Cart, and Live Tracker
- [x] **Kitchen**: Real-time KDS grid with audio alerts
- [x] **Admin**: Dashboard, Menu Manager, and Table Map

## Phase 7: Billing, Reports & Polish
- [x] Implement GST calculation logic
- [x] Add PDF generation for bills/invoices
- [x] Implement Sales Analytics dashboard (Charts/Graphs)
- [x] UI Polish: Framer Motion animations & Glassmorphism themes
