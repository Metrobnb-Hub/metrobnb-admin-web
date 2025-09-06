# Backend Request: UI Permissions for RBAC

## Overview
Currently, the frontend is using hardcoded role checks (`user.role === 'partner'`) to show/hide UI elements. This approach is not scalable and makes the frontend tightly coupled to specific roles.

**Request**: Add a `ui_permissions` object to the user authentication response to enable proper RBAC-based UI control.

## Current Implementation

### Current User Object (from `/api/auth/me` and login responses):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe", 
  "role": "partner",
  "organization_id": "uuid",
  "accessible_partners": ["uuid1", "uuid2"],
  "permissions": ["view_invoices", "view_bookings"]
}
```

### Current Frontend Code (problematic):
```javascript
// Hardcoded role checks everywhere
v-if="user.role !== 'partner'"
v-if="['owner', 'admin'].includes(user.role)"
```

## Requested Enhancement

### Add `ui_permissions` Object:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "partner",
  "organization_id": "uuid", 
  "accessible_partners": ["uuid1", "uuid2"],
  "permissions": ["view_invoices", "view_bookings"],
  "ui_permissions": {
    "invoices": {
      "can_create_draft": false,
      "can_view_archive": false,
      "can_finalize": false,
      "can_send": false,
      "can_mark_paid": false,
      "can_delete": false,
      "can_refresh_data": false
    },
    "expenses": {
      "can_create": false,
      "can_edit": false,
      "can_delete": false,
      "can_upload_receipt": false
    },
    "bookings": {
      "can_create": false,
      "can_edit": false,
      "can_delete": false,
      "can_import": false
    },
    "partners": {
      "can_create": false,
      "can_edit": false,
      "can_delete": false,
      "can_view_all": false
    },
    "units": {
      "can_create": false,
      "can_edit": false,
      "can_delete": false
    },
    "journal_entries": {
      "can_create": false,
      "can_edit": false,
      "can_delete": false
    },
    "analytics": {
      "can_view_dashboard": true,
      "can_view_all_partners": false,
      "can_export_data": false
    }
  }
}
```

## Role-Based Permission Examples

### Owner Role:
```json
"ui_permissions": {
  "invoices": {
    "can_create_draft": true,
    "can_view_archive": true,
    "can_finalize": true,
    "can_send": true,
    "can_mark_paid": true,
    "can_delete": true,
    "can_refresh_data": true
  },
  // ... all other permissions set to true
}
```

### Admin Role:
```json
"ui_permissions": {
  "invoices": {
    "can_create_draft": true,
    "can_view_archive": true,
    "can_finalize": true,
    "can_send": true,
    "can_mark_paid": true,
    "can_delete": true,
    "can_refresh_data": true
  },
  "partners": {
    "can_create": false,  // Only owner can create partners
    "can_edit": true,
    "can_delete": false,
    "can_view_all": true
  }
  // ... other permissions
}
```

### Partner Role:
```json
"ui_permissions": {
  "invoices": {
    "can_create_draft": false,
    "can_view_archive": false,
    "can_finalize": false,
    "can_send": false,
    "can_mark_paid": false,
    "can_delete": false,
    "can_refresh_data": false
  },
  "expenses": {
    "can_create": false,
    "can_edit": false,
    "can_delete": false,
    "can_upload_receipt": false
  },
  "analytics": {
    "can_view_dashboard": true,
    "can_view_all_partners": false,  // Only their own data
    "can_export_data": false
  }
  // ... most permissions set to false
}
```

## Frontend Benefits

### Before (Current):
```javascript
// Scattered role checks
v-if="user.role !== 'partner'"
v-if="['owner', 'admin'].includes(user.role)"
v-if="user.role === 'owner'"
```

### After (Requested):
```javascript
// Clean permission-based checks
v-if="user.ui_permissions.invoices.can_create_draft"
v-if="user.ui_permissions.invoices.can_view_archive" 
v-if="user.ui_permissions.expenses.can_create"
```

## Implementation Notes

1. **Backward Compatibility**: Keep existing `role` and `permissions` fields
2. **Caching**: `ui_permissions` should be cached with user session
3. **Updates**: When user permissions change, refresh the user object
4. **Validation**: Backend should validate actual API permissions match UI permissions

## API Endpoints to Update

- `POST /api/auth/login` - Include `ui_permissions` in response
- `GET /api/auth/me` - Include `ui_permissions` in response  
- `POST /api/auth/refresh` - Include `ui_permissions` in response
- `POST /api/auth/set-password` - Include `ui_permissions` in response

## Security Note

UI permissions are for **display purposes only**. All actual authorization must still be enforced on the backend API endpoints. The `ui_permissions` object should reflect what the user can actually do based on their backend permissions.

## Timeline

This enhancement will make the frontend much more maintainable and allow for flexible permission management without frontend code changes.