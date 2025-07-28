You're helping me develop a Nuxt 3 frontend app for MetroBNB. Please follow these frontend architecture guidelines consistently for all future prompts and code generation.

---

📁 1. FOLDER STRUCTURE
- Pages are grouped by feature/module (e.g., /accounting, /partners, /expenses)
- Reusable components go under `/components/{feature}/` (e.g., `/components/accounting/`)
- Composables go in `/composables/` and are reusable across modules
- Pinia stores are in `/stores/`, one store per domain (e.g., `usePartnerStore.ts`, `useBookingStore.ts`)

---

📦 2. COMPONENT RULES
- Use `<script setup lang="ts">`
- Always use TypeScript and define proper types/interfaces
- Break down complex forms or tables into smaller components
- Use Nuxt UI (Free version) for inputs, tables, and buttons
- Use TailwindCSS for layout and utility styling

---

🧠 3. STATE MANAGEMENT
- Use Pinia for managing state
- Avoid directly modifying computed() or readonly() values
- Always use `.value` for refs when necessary
- For mock data or simulated APIs, use composables (e.g., `useMockApi.ts`)

---

🎯 4. DATA FLOW / API SIMULATION
- When mocking data:
  - Define types/interfaces
  - Create composables that return simulated API responses (e.g., `getPartners()`, `getInvoices(partnerId, month)`)

---

📐 5. UI/UX CONVENTIONS
- Always show:
  - Loading state (spinner or skeleton)
  - Empty state (e.g., “No data yet”)
  - Error state (fallback message)
- Use currency formatting for all financial values
- Make forms responsive and mobile-friendly
- Use confirmation modals for destructive actions (like delete)

---

🧾 6. SPECIAL RULES FOR METROBNB ACCOUNTING
- Invoices must follow this formula:
  (Total earnings × MetroBNB Share %) + MetroBNB Expenses − Payments received by MetroBNB = Net Due
- All bookings should include: guest, unit, partner, base amount, add-ons, payment status, and payment receiver
- Expenses must be tagged to a unit + partner, and grouped per month

Please apply these rules moving forward in all frontend component and data-related code generation.
