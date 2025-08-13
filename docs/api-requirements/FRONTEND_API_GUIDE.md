# MetroBNB API Frontend Integration Guide

**Version:** v1.6.0  
**Base URL:** `http://localhost:8000`  
**Documentation:** `http://localhost:8000/docs`  
**Last Updated:** August 7, 2025

---

## 🔧 **Base Response Format**

All API responses follow this structure:
```typescript
interface APIResponse<T> {
  success: boolean
  data: T
  message: string
}
```

---

## 👥 **Partners API**

### GET /api/partners
**Query Parameters:**
```typescript
interface PartnerQueryParams {
  page?: number        // Page number (≥1)
  limit?: number       // Items per page (1-100, default: 10)
  search?: string      // Search name or email
  sort_by?: 'created_at' | 'name' | 'email' | 'share_percentage'
  sort_order?: 'asc' | 'desc'  // Default: 'desc'
}
```

**Response:**
```typescript
// Without pagination
APIResponse<Partner[]>

// With pagination (?page=1&limit=10)
APIResponse<{
  items: Partner[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    per_page: number
    has_next: boolean
    has_prev: boolean
  }
}>

interface Partner {
  id: string
  name: string
  email: string
  share_percentage: number
  services: Service[]
  created_at: string
  updated_at: string
}
```

### POST /api/partners
**Payload:**
```typescript
interface PartnerCreate {
  name: string
  email: string
  share_percentage: number  // 0-100
  service_ids?: string[]    // Optional service UUIDs
}
```

**Response:** `APIResponse<Partner>`

### PUT /api/partners/{id}
**Payload:** `Partial<PartnerCreate>`  
**Response:** `APIResponse<Partner>`

---

## 🏠 **Units API**

### GET /api/units
**Query Parameters:**
```typescript
interface UnitQueryParams {
  page?: number
  limit?: number
  search?: string      // Search name, location, or partner name
  sort_by?: 'created_at' | 'name' | 'location'
  sort_order?: 'asc' | 'desc'
}
```

**Response:** Same pagination format as Partners

```typescript
interface Unit {
  id: string
  name: string
  partner_id: string
  location: string
  notes: string
  created_at: string
  updated_at: string
}
```

### POST /api/units
**Payload:**
```typescript
interface UnitCreate {
  name: string
  partner_id: string
  location: string
  notes?: string
}
```

---

## 🛏️ **Bookings API**

### GET /api/bookings
**Query Parameters:**
```typescript
interface BookingQueryParams {
  // Pagination
  page?: number
  limit?: number
  search?: string      // Search guest, unit, or partner name
  sort_by?: 'created_at' | 'guest_name' | 'base_amount' | 'booking_date'
  sort_order?: 'asc' | 'desc'
  
  // Filters
  partner_id?: string
  unit_id?: string
  month?: string       // Format: "2025-06"
  payment_status?: 'unpaid' | 'partial' | 'fully_paid'
}
```

**Response (Paginated):**
```typescript
interface BookingResponse {
  success: boolean
  data: {
    items: Booking[]           // Paginated booking items
    pagination: PaginationInfo // Page info
    summary: BookingSummary    // Summary stats (when paginated)
  }
}

interface BookingSummary {
  total_bookings: number
  total_amount: string
  by_source: Array<{
    source_name: string    // "MetroBNB", "Airbnb"
    count: number
    amount: string
  }>
  by_payment_receiver: {
    metrobnb: { count: number, amount: string }
    partner: { count: number, amount: string }
  }
}

interface Booking {
  id: string
  guest_name: string
  booking_date: string    // YYYY-MM-DD
  start_date: string      // YYYY-MM-DD
  end_date: string        // YYYY-MM-DD
  base_amount: string     // "1200.00"
  addons: Array<{type: string, amount: number}>
  unit_id: string
  partner_id: string
  payment_status: 'unpaid' | 'partial' | 'fully_paid'
  booking_status: 'confirmed' | 'canceled' | 'refunded'
  amount_paid: string     // "1500.00"
  payment_method_id: string
  payment_method: {
    id: string
    name: string
    is_active: boolean
    created_at: string
    updated_at: string
  }
  payment_received_by: 'partner' | 'metrobnb'
  booking_source_id: string
  notes: string
  created_at: string
  updated_at: string
}
```

### POST /api/bookings
**Payload:**
```typescript
interface BookingCreate {
  guest_name: string
  booking_date: string    // YYYY-MM-DD
  start_date: string      // YYYY-MM-DD
  end_date: string        // YYYY-MM-DD
  base_amount: number     // 1200.00
  addons?: Array<{type: string, amount: number}>
  unit_id: string
  partner_id: string
  payment_status: 'unpaid' | 'partial' | 'fully_paid'
  booking_status: 'confirmed' | 'canceled' | 'refunded'
  amount_paid: number     // 1500.00
  payment_method_id: string
  payment_received_by: 'partner' | 'metrobnb'
  booking_source_id: string
  notes?: string
}
```

---

## 💰 **Expenses API**

### GET /api/expenses
**Query Parameters:**
```typescript
interface ExpenseQueryParams {
  // Pagination
  page?: number
  limit?: number
  search?: string      // Search unit, partner name, or notes
  sort_by?: 'created_at' | 'date' | 'amount' | 'type'
  sort_order?: 'asc' | 'desc'
  
  // Filters
  partner_id?: string
  unit_id?: string
  month?: string       // Format: "2025-06"
  type?: 'cleaning' | 'laundry' | 'utilities' | 'repair' | 'misc'
}
```

**Response:**
```typescript
interface Expense {
  id: string
  partner_id: string
  unit_id: string
  date: string          // YYYY-MM-DD
  type: 'cleaning' | 'laundry' | 'utilities' | 'repair' | 'misc'
  amount: string        // "150.00"
  billable: boolean
  notes: string
  created_at: string
  updated_at: string
}
```

### POST /api/expenses
**Payload:**
```typescript
interface ExpenseCreate {
  partner_id: string
  unit_id: string
  date: string          // YYYY-MM-DD
  type: 'cleaning' | 'laundry' | 'utilities' | 'repair' | 'misc'
  amount: number        // 150.00
  billable: boolean
  notes?: string
}
```

---

## 💳 **Payment Methods API**

### GET /api/payment-methods
**Response:**
```typescript
interface PaymentMethod {
  id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

---

## 📱 **Booking Sources API**

### GET /api/booking-sources
**Response:**
```typescript
interface BookingSource {
  id: string
  name: string
  commission_rate: number  // 15.00 (percentage)
  is_active: boolean
  created_at: string
  updated_at: string
}
```

---

## 🔧 **Services API**

### GET /api/services
**Response:**
```typescript
interface Service {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}
```

---

## 🚀 **Frontend Usage Examples**

### Universal Pagination Hook
```typescript
import { useState, useEffect } from 'react'

function usePaginatedAPI<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  })
  
  const fetchData = async () => {
    setLoading(true)
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString())
    })
    
    const response = await fetch(`${endpoint}?${queryParams}`)
    const result = await response.json()
    
    if (result.success) {
      if (result.data.pagination) {
        setData(result.data.items)
        setPagination(result.data.pagination)
      } else {
        setData(result.data)
        setPagination(null)
      }
    }
    setLoading(false)
  }
  
  useEffect(() => { fetchData() }, [params])
  
  return { data, pagination, loading, params, setParams }
}

// Usage
function BookingsPage() {
  const { data: bookings, pagination, params, setParams } = usePaginatedAPI<Booking>('/api/bookings')
  
  return (
    <div>
      <input 
        value={params.search}
        onChange={(e) => setParams({...params, search: e.target.value, page: 1})}
        placeholder="Search bookings..."
      />
      
      <select 
        value={params.sort_by}
        onChange={(e) => setParams({...params, sort_by: e.target.value})}
      >
        <option value="created_at">Date Created</option>
        <option value="guest_name">Guest Name</option>
        <option value="base_amount">Amount</option>
        <option value="booking_date">Booking Date</option>
      </select>
      
      {bookings.map(booking => (
        <div key={booking.id}>
          <h3>{booking.guest_name}</h3>
          <p>Amount: ${booking.base_amount}</p>
          <p>Dates: {booking.start_date} to {booking.end_date}</p>
        </div>
      ))}
      
      {pagination && (
        <div>
          <button 
            disabled={!pagination.has_prev}
            onClick={() => setParams({...params, page: params.page - 1})}
          >
            Previous
          </button>
          
          <span>Page {pagination.current_page} of {pagination.total_pages}</span>
          
          <button 
            disabled={!pagination.has_next}
            onClick={() => setParams({...params, page: params.page + 1})}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
```

### Create Booking
```typescript
async function createBooking(bookingData: BookingCreate) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  })
  
  const result = await response.json()
  
  if (result.success) {
    return result.data  // New booking object
  } else {
    throw new Error(result.message)
  }
}

// Usage
const newBooking = await createBooking({
  guest_name: "John Smith",
  booking_date: "2025-03-10",
  start_date: "2025-03-15", 
  end_date: "2025-03-18",
  base_amount: 1200.00,
  addons: [{ type: "early_checkin", amount: 300 }],
  unit_id: "unit-uuid",
  partner_id: "partner-uuid",
  payment_status: "fully_paid",
  booking_status: "confirmed",
  amount_paid: 1500.00,
  payment_method_id: "payment-method-uuid",
  payment_received_by: "metrobnb",
  booking_source_id: "booking-source-uuid",
  notes: "VIP guest"
})
```

### Filter Bookings with Summary
```typescript
// Get bookings with summary stats
const response = await fetch('/api/bookings?' + new URLSearchParams({
  partner_id: 'partner-uuid',
  page: '1',
  limit: '20',
  sort_by: 'booking_date',
  sort_order: 'desc'
}))
const { items, pagination, summary } = response.data

// Summary includes filtered statistics
console.log(`Total: ${summary.total_bookings} bookings`)
console.log(`Amount: ₱${summary.total_amount}`)

// Get bookings for specific month with stats
const monthlyResponse = await fetch('/api/bookings?' + new URLSearchParams({
  month: '2025-06',
  payment_status: 'fully_paid',
  page: '1',
  limit: '10'
}))
```

---

## ⚠️ **Important Notes**

### Data Types
- **Dates**: Always use `YYYY-MM-DD` format
- **Amounts**: Returned as strings (`"1200.00"`), send as numbers (`1200.00`)
- **UUIDs**: All IDs are UUID strings
- **Booleans**: Use `true`/`false` (not strings)

### Error Handling
```typescript
if (!response.success) {
  console.error('API Error:', response.message)
  // Show error to user
}
```

### Pagination Detection
```typescript
if (response.data.pagination) {
  // Paginated response
  const items = response.data.items
  const pagination = response.data.pagination
} else {
  // Non-paginated response (backward compatibility)
  const items = response.data
}
```

This guide covers all endpoints with exact payload formats and response structures for seamless frontend integration! 🚀