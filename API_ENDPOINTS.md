# MetroBNB API Endpoints Reference

**Base URL**: `http://localhost:8000`

## Frontend Integration Status
✅ **IMPLEMENTED** - All API endpoints are properly integrated with automatic snake_case/camelCase conversion
✅ **SERVICES** - Services management page added at `/admin/services`
✅ **TYPE SAFETY** - Full TypeScript support with proper interfaces
✅ **ERROR HANDLING** - Standardized error handling across all API calls

## Response Format
All endpoints return standardized responses:

```json
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

## Partners API

### List Partners
```
GET /api/partners
Response: Array of partner objects
```

### Create Partner
```
POST /api/partners
Body: {
  "name": "Partner Name",
  "email": "email@example.com",
  "share_percentage": 15,
  "services": ["property_management", "cleaning"]
}
```

### Get Partner
```
GET /api/partners/{partner_id}
Response: Single partner object
```

### Update Partner
```
PUT /api/partners/{partner_id}
Body: {
  "name": "Updated Name",
  "share_percentage": 20
}
```

### Delete Partner
```
DELETE /api/partners/{partner_id}
```

### Get Partner Units
```
GET /api/partners/{partner_id}/units
Response: Array of units for the partner
```

## Units API

### List Units
```
GET /api/units
Response: Array of unit objects
```

### Create Unit
```
POST /api/units
Body: {
  "name": "Unit Name",
  "partner_id": "uuid",
  "location": "Location",
  "notes": "Optional notes"
}
```

### Get Unit
```
GET /api/units/{unit_id}
```

### Update Unit
```
PUT /api/units/{unit_id}
Body: {
  "name": "Updated Name",
  "location": "New Location"
}
```

### Delete Unit
```
DELETE /api/units/{unit_id}
```

## Booking Sources API

### List Booking Sources
```
GET /api/booking-sources
Response: Array of booking source objects
```

### Create Booking Source
```
POST /api/booking-sources
Body: {
  "name": "Source Name",
  "commission_rate": 0.15,
  "is_active": true
}
```

### Get Booking Source
```
GET /api/booking-sources/{source_id}
Response: Single booking source object
```

### Update Booking Source
```
PUT /api/booking-sources/{source_id}
Body: {
  "name": "Updated Name",
  "commission_rate": 0.20
}
```

### Delete Booking Source
```
DELETE /api/booking-sources/{source_id}
```

## Bookings API

### List Bookings (with filters)
```
GET /api/bookings
GET /api/bookings?partner_id=uuid
GET /api/bookings?unit_id=uuid
GET /api/bookings?month=2024-03
GET /api/bookings?payment_status=fully_paid

Query Parameters:
- partner_id: UUID
- unit_id: UUID  
- month: YYYY-MM format
- payment_status: unpaid|partial|fully_paid
```

### Create Booking
```
POST /api/bookings
Body: {
  "guest_name": "John Smith",
  "date": "2024-03-15",
  "base_amount": 1200.00,
  "addons": [{"type": "early_checkin", "amount": 300}],
  "unit_id": "uuid",
  "partner_id": "uuid",
  "payment_status": "fully_paid",
  "booking_status": "confirmed",
  "amount_paid": 1500.00,
  "payment_method": "Credit Card",
  "payment_received_by": "metrobnb",
  "booking_source_id": "uuid",
  "notes": "Optional notes"
}

Enums:
- payment_status: unpaid, partial, fully_paid
- booking_status: confirmed, canceled, refunded
- payment_received_by: partner, metrobnb
```

### Get Booking
```
GET /api/bookings/{booking_id}
```

### Update Booking
```
PUT /api/bookings/{booking_id}
Body: {
  "payment_status": "fully_paid",
  "amount_paid": 1500.00
}
```

### Delete Booking
```
DELETE /api/bookings/{booking_id}
```

## Expenses API

### List Expenses (with filters)
```
GET /api/expenses
GET /api/expenses?partner_id=uuid
GET /api/expenses?unit_id=uuid
GET /api/expenses?month=2024-03
GET /api/expenses?type=cleaning

Query Parameters:
- partner_id: UUID
- unit_id: UUID
- month: YYYY-MM format
- type: cleaning|laundry|utilities|repair|misc
```

### Create Expense
```
POST /api/expenses
Body: {
  "partner_id": "uuid",
  "unit_id": "uuid",
  "date": "2024-03-15",
  "type": "cleaning",
  "amount": 150.00,
  "notes": "Deep cleaning after checkout"
}

Types: cleaning, laundry, utilities, repair, misc
```

### Get Expense
```
GET /api/expenses/{expense_id}
```

### Update Expense
```
PUT /api/expenses/{expense_id}
Body: {
  "amount": 200.00,
  "notes": "Updated notes"
}
```

### Delete Expense
```
DELETE /api/expenses/{expense_id}
```

## Analytics API

### Partner Earnings
```
GET /api/analytics/partner-earnings/{partner_id}
Response: {
  "partner_id": "uuid",
  "total_earnings": 5000.00
}
```

### Partner Expenses
```
GET /api/analytics/partner-expenses/{partner_id}
Response: {
  "partner_id": "uuid", 
  "total_expenses": 800.00
}
```

### Dashboard Metrics
```
GET /api/analytics/dashboard
Response: {
  "total_partners": 3,
  "total_bookings": 25,
  "total_revenue": 15000.00,
  "total_expenses": 2500.00,
  "net_profit": 12500.00
}
```

### Generate Invoice
```
POST /api/analytics/invoices/generate?partner_id=uuid&start_date=2024-03-01&end_date=2024-03-31

Query Parameters:
- partner_id: UUID (required)
- start_date: YYYY-MM-DD (required)
- end_date: YYYY-MM-DD (required)

Response: {
  "partner_name": "Partner Name",
  "period": "2024-03-01 - 2024-03-31",
  "share_percentage": 15,
  "total_income": 5000.00,
  "metrobnb_share": 750.00,
  "total_expenses": 500.00,
  "metrobnb_payments": 200.00,
  "net_due": 1050.00,
  "bookings": {
    "metrobnb_received": [...],
    "partner_received": [...]
  },
  "expenses": [...]
}
```

## 🚀 Frontend Integration
- Frontend: `http://localhost:3000`
- API Base URL: `http://localhost:8000`
- All endpoints prefixed with `/api/`