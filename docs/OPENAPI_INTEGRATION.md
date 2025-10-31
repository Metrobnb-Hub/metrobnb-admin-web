# OpenAPI Integration Guide

This document explains how to use the OpenAPI-generated types and API client in your MetroBNB frontend.

## Overview

We've integrated your backend OpenAPI specification directly into the Nuxt 3 frontend, providing:

- **Full Type Safety**: All API requests and responses are typed
- **Auto-completion**: IDE support for all API methods and data structures
- **Error Handling**: Consistent error handling across all API calls
- **Real-time Sync**: Easy synchronization with backend API changes

## Files Structure

```
types/
  generated-api.ts          # Auto-generated TypeScript types from OpenAPI
composables/
  useApiClient.ts          # Typed API client class
  api-typed.ts             # Enhanced API composable with error handling
scripts/
  generate-api.js          # Script to regenerate types from OpenAPI spec
```

## Usage Examples

### 1. Basic API Calls with Type Safety

```typescript
<script setup lang="ts">
import type { PartnerResponse, PartnerCreate } from '~/types/generated-api'

const api = useTypedApi()

// Fully typed API calls
const partners = ref<PartnerResponse[]>([])

const loadPartners = async () => {
  const response = await api.getPartners()
  if (response.success) {
    partners.value = response.data || []
  }
}

const createPartner = async (data: PartnerCreate) => {
  const response = await api.createPartner(data)
  if (response.success) {
    partners.value.push(response.data!)
  }
}
</script>
```

### 2. Using the Enhanced API Composable

```typescript
<script setup lang="ts">
const { getPartners, createPartner } = useApi()

// Simplified calls with built-in error handling
const partners = await getPartners()
const newPartner = await createPartner({
  name: 'New Partner',
  share_percentage: 50
})
</script>
```

### 3. Handling Different Response Types

```typescript
// Handle paginated responses
const response = await api.getBookings({ page: 1, limit: 10 })
if (response.success) {
  if (Array.isArray(response.data)) {
    // Simple array response
    bookings.value = response.data
  } else if (response.data?.items) {
    // Paginated response
    bookings.value = response.data.items
    pagination.value = response.data.pagination
  }
}
```

### 4. Form Validation with Types

```typescript
<script setup lang="ts">
import type { BookingCreate } from '~/types/generated-api'

const form = ref<BookingCreate>({
  guest_name: '',
  booking_date: '',
  start_date: '',
  end_date: '',
  base_amount: 0,
  unit_id: '',
  partner_id: '',
  payment_status: 'unpaid',
  booking_status: 'confirmed',
  amount_paid: 0,
  payment_method_id: '',
  payment_received_by: 'partner',
  booking_source_id: ''
})

// TypeScript will validate all fields
const submitForm = async () => {
  const response = await api.createBooking(form.value)
  // Handle response...
}
</script>
```

## API Client Methods

### Authentication
- `login(credentials: LoginRequest)`
- `register(data: RegisterRequest)`
- `getCurrentUser()`
- `refreshToken(token: string)`
- `logout()`
- `changePassword(data: ChangePasswordRequest)`

### Partners
- `getPartners(params?)`
- `getPartner(partnerId: string)`
- `createPartner(data: PartnerCreate)`
- `updatePartner(partnerId: string, data: PartnerUpdate)`
- `deletePartner(partnerId: string)`
- `getPartnerUnits(partnerId: string)`

### Units
- `getUnits(params?)`
- `getUnit(unitId: string)`
- `createUnit(data: UnitCreate)`
- `updateUnit(unitId: string, data: UnitUpdate)`
- `deleteUnit(unitId: string)`

### Bookings
- `getBookings(params?)`
- `getBooking(bookingId: string)`
- `createBooking(data: BookingCreate)`
- `updateBooking(bookingId: string, data: BookingUpdate)`
- `deleteBooking(bookingId: string)`

### Expenses
- `getExpenses(params?)`
- `getExpense(expenseId: string)`
- `createExpense(data: ExpenseCreate)`
- `updateExpense(expenseId: string, data: ExpenseUpdate)`
- `deleteExpense(expenseId: string)`
- `getDraftExpenses()`
- `bulkUpdateExpenses(updates: any[])`

### Invoices
- `getInvoices(params?)`
- `getInvoice(invoiceId: string)`
- `createDraftInvoice(data: InvoiceGenerate)`
- `generateInvoice(data: InvoiceGenerate)`
- `approveInvoice(invoiceId: string)`
- `rejectInvoice(invoiceId: string, notes: string)`
- `settleInvoice(invoiceId: string, paidDate: string)`

### Analytics
- `getDashboardMetrics(params?)`
- `getPartnerInvoiceMetrics(partnerId: string, params?)`

## Synchronizing with Backend Changes

### Manual Sync
```bash
# Download latest OpenAPI spec
npm run api:sync

# Regenerate types (if using the generator script)
npm run generate-api
```

### Automatic Sync (Recommended)
Add this to your development workflow:

```bash
# In your backend terminal
# After making API changes, the OpenAPI spec updates automatically

# In your frontend terminal
curl -s http://localhost:8000/openapi.json > openapi.json
```

## Error Handling

The typed API client includes comprehensive error handling:

```typescript
try {
  const response = await api.createPartner(data)
  if (response.success) {
    // Handle success
  } else {
    // Handle API error
    console.error(response.error)
  }
} catch (error) {
  // Handle network/client error
  console.error('Network error:', error.message)
}
```

## Best Practices

1. **Always use types**: Import and use the generated types for all API interactions
2. **Handle both success and error cases**: Check `response.success` before using data
3. **Use the enhanced composable**: `useApi()` provides better error handling than direct client usage
4. **Keep types in sync**: Regularly update types when backend changes
5. **Validate forms**: Use TypeScript types for form validation

## Migration from Old API

To migrate existing code:

1. Replace `useApi()` calls with typed equivalents
2. Add proper TypeScript types to your components
3. Update error handling to use the new response format
4. Test all API interactions with the new client

## Example Component

See `components/examples/TypedApiExample.vue` for a complete working example.

## Troubleshooting

### Common Issues

1. **Type errors**: Make sure you've imported the correct types from `~/types/generated-api`
2. **API not responding**: Ensure your backend is running on `http://localhost:8000`
3. **Authentication errors**: Check that tokens are being set correctly in the client
4. **CORS issues**: Verify CORS settings in your backend configuration

### Debug Mode

Enable debug logging:

```typescript
const api = useTypedApi()
// Add logging to see requests/responses
console.log('API Response:', response)
```
