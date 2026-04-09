# Phase 2 Summary: Database Models & Auth Logic

## Completed Tasks
- ✅ Created `MenuItem` schema for menu management.
- ✅ Created `Table` schema for restaurant layout and session tracking.
- ✅ Created `Order` schema for processing and tracking item-level status.
- ✅ Created `User` schema for staff/admin with secure password hashing.
- ✅ Implemented dual-layer `authMiddleware` supporting:
    - Firebase ID Token verification for customers.
    - JWT verification for staff and admins.
    - Role-based access control (Admin check).

## Models Defined
1. **MenuItem**: `name`, `price`, `category`, `description`, `imageUrl`, `isAvailable`, `enableTimer`, `preparationTime`.
2. **Table**: `tableNumber`, `status`, `currentSession`, `capacity`.
3. **Order**: `table`, `phoneNumber`, `items`, `totalAmount`, `status`, `isPaid`.
4. **User**: `name`, `email`, `password`, `role`.

## Next Steps (Phase 3)
- Implement Core API modules: Menu, Table, Order, and Auth endpoints.
