# MetroBNB API - Frontend Documentation

> **Complete frontend integration for the RBAC-secured MetroBNB API**

## 📖 Documentation

### **[Frontend Integration Guide](INTEGRATION_GUIDE.md)**
Complete guide for integrating with the MetroBNB API including:
- **Authentication**: JWT with Supabase tokens
- **RBAC System**: Role-based data access control
- **API Usage**: All endpoints with examples
- **Implementation**: Step-by-step Nuxt.js/Vue setup
- **Testing**: Different user roles and permissions

## 🔐 Security Features

### Role-Based Access Control (RBAC)
- **Admin**: Full access to all data (6 partners, 6 units, 154 bookings)
- **Manager**: Full access to all data
- **Staff**: Access to assigned partners only (2 partners)
- **Partner**: Access to own data only (1 partner)

### JWT Authentication
- All API requests require `Authorization: Bearer <token>` header
- Automatic token validation and user context extraction
- Role-based data filtering at the database level

## 🚀 Quick Start

### 1. Test API Access
```bash
# Test different user roles
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tonynini1998@gmail.com", "password": "TempPassword123!"}'
```

### 2. Frontend Setup
```bash
npm install @pinia/nuxt
```

### 3. Follow Integration Guide
See **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** for complete implementation details.

## 📊 Test Users

| Role | Email | Password | Access |
|------|-------|----------|---------|
| Admin | tonynini1998@gmail.com | TempPassword123! | 6 partners |
| Staff | staff@metrobnb.test | TestPass123! | 2 partners |
| Partner | hiroaki@partner.test | TestPass123! | 1 partner |

## 🔍 API Endpoints

All endpoints automatically filter data based on user role:

- `GET /api/partners` - Role-filtered partners
- `GET /api/units` - Units from accessible partners
- `GET /api/bookings` - Bookings from accessible partners
- `GET /api/expenses` - Expenses from accessible partners
- `GET /api/analytics/dashboard` - Analytics from accessible partners

## 🎯 Expected Results

### Admin User
- **Partners**: 6 (Hiroaki, Kate Pascual, Paul Halog, Eduardo, Angela, Jessa)
- **Units**: 6 (All units across all partners)
- **Bookings**: 154 (All bookings)

### Staff User  
- **Partners**: 2 (Assigned partners only)
- **Units**: Units from assigned partners
- **Bookings**: Bookings from assigned partners

### Partner User (Hiroaki)
- **Partners**: 1 (Own partner record)
- **Units**: 1 (Hiroaki Staycation)
- **Bookings**: Own bookings only

## 🔒 Security Status

**✅ FULLY SECURE** - RBAC system ensures users can only access their authorized data.

---

**📖 See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for complete implementation details.**