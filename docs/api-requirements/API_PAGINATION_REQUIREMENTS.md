# API Pagination & Search Requirements

## Overview
Pagination and search support for the `/api/bookings` endpoint to handle large datasets efficiently.

## Current Status
✅ **IMPLEMENTED**: Pagination, search, and sorting capabilities  
✅ **Existing**: Basic filtering by `partner_id`, `unit_id`, `month`, `payment_status`  
✅ **Response Format**: Uses `items` array with `pagination` object

## Required Changes

### 1. New Query Parameters

Add these optional parameters to `GET /api/bookings`:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (starts from 1) |
| `limit` | integer | 10 | Items per page (max: 100) |
| `search` | string | - | Search term for guest/unit/partner names |
| `sort_by` | string | `created_at` | Field to sort by |
| `sort_order` | string | `desc` | Sort direction (`asc` or `desc`) |

### 2. Sortable Fields

Support sorting by these fields:
- `created_at` - Creation timestamp
- `guest_name` - Guest name alphabetically  
- `base_amount` - Booking amount numerically
- `booking_date` - Booking date chronologically

### 3. Search Implementation

The `search` parameter should perform case-insensitive search across:
- `guest_name` field
- Unit name (via join with units table)
- Partner name (via join with partners table)

### 4. Response Format Changes

#### When pagination params provided:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "guest_name": "John Smith",
        "booking_date": "2024-12-19",
        "base_amount": "5000.00",
        "..."
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 146,
      "per_page": 15,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

#### When no pagination params (backward compatibility):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "guest_name": "John Smith",
      "..."
    }
  ]
}
```

## Example API Calls

```bash
# Get first page with 15 items, sorted by newest first
GET /api/bookings?page=1&limit=15&sort_by=created_at&sort_order=desc

# Search for "john" in guest/unit/partner names
GET /api/bookings?search=john&page=1&limit=10

# Sort by guest name A-Z with existing filters
GET /api/bookings?partner_id=uuid&sort_by=guest_name&sort_order=asc

# Combine all parameters
GET /api/bookings?page=2&limit=20&search=metro&sort_by=base_amount&sort_order=desc&partner_id=uuid
```

## Implementation Notes

### Backward Compatibility
- If `page` or `limit` not provided → return existing array format
- If `page` or `limit` provided → return new paginated format
- All existing query parameters continue to work

### Performance Considerations
- Add database indexes on sortable fields
- Limit maximum `limit` parameter to 100
- Use efficient search queries (consider full-text search for large datasets)

### Frontend Integration
- Frontend is already implemented and ready
- Gracefully handles both old and new response formats
- No breaking changes for existing functionality

## Status
🟢 **COMPLETED** - API pagination is implemented and working!

## Frontend Updates Needed
- Update API client to use `items` instead of `bookings` in response
- Test pagination with real data (146 bookings total)
- Verify search functionality across guest/unit/partner names