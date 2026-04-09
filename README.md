# 🍽️ DineFlow: Digital QR Restaurant Ecosystem

DineFlow is a comprehensive, full-stack MERN application designed to modernize the dining experience. It replaces physical menus with smart, real-time QR-based ordering, provides kitchens with a digital display system, and gives admins full control over floor plans, menus, and billing.

---

## 🔗 Direct Access Links

| Portal | URL | Description |
| :--- | :--- | :--- |
| 🤳 **Customer Menu** | [http://localhost:5173/](http://localhost:5173/) | Digital menu for ordering (Use QR link for Table detection) |
| 📊 **Admin Dashboard** | [http://localhost:5173/admin](http://localhost:5173/admin) | Analytics, Menu Manager, and Table Maps |
| 👨‍🍳 **Kitchen Display** | [http://localhost:5173/kitchen](http://localhost:5173/kitchen) | Real-time order preparation feed |
| 🔑 **Admin Login** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | Initial entry point for restaurant staff |

---
- **QR Table Detection**: Automatically identifies table number via URL parameters from QR scans.
- **Smart Menu**: Real-time availability updates and beautiful, full-width glassmorphic UI.
- **Dynamic Cart**: Instant calorie/price updates and preparation time estimates.
- **Order Tracker**: Real-time status progress (Pending ➔ Preparing ➔ Ready ➔ Served).

### 👨‍🍳 Kitchen Display System (KDS)
- **Real-time Feed**: Orders appear instantly with audible alerts.
- **Status Control**: One-click toggles to move dishes through the preparation pipeline.
- **Table Priority**: Clearly marked table identifiers for waitstaff.

### 📊 Admin Dashboard
- **Floor Map Manager**: Manage table capacity and status (Free/Occupied) with visual indicators.
- **Menu Manager**: Create categories, dishes, and manage price/availability instantly.
- **Smart QR Generation**: Automatically generates and stores unique QR codes for every table.
- **Billing System**: Complete GST (SGST/CGST) breakdown, digitial bill preview, and payment confirmation.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, TanStack (React) Query, Framer Motion.
- **State Management**: Zustand (Client-side), Socket.io (Real-time).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Utilities**: Multer (Image uploads), QRCode (Dynamic generation), JWT (Security).

---

## 🔥 Firebase Setup Guide (Step-by-Step)

Follow these exact steps to enable **Phone Authentication** and **Security**:

### Phase 1: Create the Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"+ Add Project"**. Name it `DineFlow` (or your preferred name).
3. Follow the prompts (Google Analytics is optional) and click **"Create Project"**.

### Phase 2: Enable Phone Authentication
1. In the left sidebar, click **"Build"** ➔ **"Authentication"**.
2. Click the **"Get Started"** button.
3. Select the **"Sign-in method"** tab.
4. Click **"Add new provider"** and select **"Phone"**.
5. Toggle the switch to **"Enable"** and click **"Save"**.
6. **Important**: Under "Settings" ➔ **"Authorized Domains"**, ensuring `localhost` and your future production domain are added.

### Phase 3: Setup Backend (Admin SDK)
1. In the left sidebar, click the **Settings Gear (⚙️)** ➔ **"Project Settings"**.
2. Click the **"Service Accounts"** tab.
3. Click the **"Generate New Private Key"** button at the bottom.
4. A `.json` file will download. **Rename it** to `serviceAccountKey.json`.
5. Move this file to your `server/config/` folder.
6. Open your `server/.env` and add: `FIREBASE_SERVICE_ACCOUNT=./config/serviceAccountKey.json`.

### Phase 4: Setup Frontend (Client SDK)
1. Go back to **"Project Settings"** ➔ **"General"**.
2. Scroll down to **"Your apps"** and click the **Web (</>)** icon.
3. Register the app (e.g., `DineFlow-Web`).
4. Copy the `firebaseConfig` object provided on the screen.
5. Open `client/src/config/firebase.js` and paste your config there.

---

## 🏃‍♂️ Step-by-Step Execution Guide

### ⚡ Option A: One-Click Start (Recommended)
We've included a master script to run everything in one go:
```bash
./start.sh
```
*This will launch both Backend & Frontend. Press `Ctrl+C` to stop both.*

### 🛠️ Option B: Manual Start (Separate Terminals)
#### Step 1: Prepare the Backend (Terminal 1)
```bash
cd server
npm install                  # Install all dependencies
# Ensure your .env and serviceAccountKey.json are ready!
node seed.js                 # IMPORTANT: This creates your Admin, Tables, and Menu
npm start                    # Starts the server on port 5001
```
*You should see: "MongoDB Connected" and "Server running on port 5001"*

### Step 2: Launch the Frontend (Terminal 2)
```bash
cd client
npm install                  # Install all dependencies
npm run dev                  # Starts the Vite development server
```
*You should see a link: http://localhost:5173/*

### Step 3: Verification Check
1. Open [http://localhost:5173/admin/login](http://localhost:5173/admin/login).
2. Login with `admin@restaurant.com` / `password123`.
3. Go to **Table Map** ➔ Click **"Copy Link"** for any table.
4. Paste that link in a new tab to see the **Customer Menu** for that specific table.
5. Place a test order and watch it appear in the **Kitchen** (`/kitchen`).

---

## 📂 Core file-structure references

- `server/models/`: Database blueprints (Schema)
- `server/seed.js`: The "Reset Button" for your database
- `client/src/features/`: The heart of the UI (Admin, Kitchen, Customer)
- `client/src/store/`: Global state (Cart, Tables)

---

## 📂 Environment Variables (`server/.env`)

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/restaurant_db
JWT_SECRET=your_super_secret_key
FIREBASE_SERVICE_ACCOUNT=./config/serviceAccountKey.json
```

---

## 📸 Core Workflow

1. **Admin** seeds the restaurant and prints the generated QR codes.
2. **Customer** scans the QR (e.g., `/?tableId=642a...`).
3. **Customer** places an order for "Pizza".
4. **Kitchen** hears a "Bing" and marks it as **Preparing**.
5. **Customer** sees their live tracker update instantly.
6. **Admin** views the **Bill Preview (GST included)** and marks as **Paid**.
7. **Table** automatically resets back to **Free** status.

---

## 📄 License
MIT License - Developed for elite restaurant automation.
