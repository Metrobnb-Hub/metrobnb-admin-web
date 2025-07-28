<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 print:p-6 print:bg-white">
    <!-- Header Section -->
    <div class="border-b-2 border-gray-200 pb-6 mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 print:text-gray-900">MetroBNB Partner Invoice</h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 print:text-gray-600">Partner: <span class="font-semibold">{{ invoice.partnerName }}</span></p>
          <p class="text-lg text-gray-600 dark:text-gray-300 print:text-gray-600">Period: <span class="font-semibold">{{ invoice.period }}</span></p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400 print:text-gray-500">Generated: {{ new Date().toLocaleDateString() }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 print:text-gray-500">MetroBNB Share: {{ invoice.sharePercentage }}%</p>
        </div>
      </div>
    </div>

    <!-- Booking Summary Tables -->
    <div class="mb-8 space-y-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">📊 Booking Summary</h2>
      
      <!-- Payments Received by Partner -->
      <div v-if="partnerBookings.length">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 print:text-gray-900">💰 Payments Received by Partner</h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300">
            <thead>
              <tr class="bg-green-50 dark:bg-green-900 print:bg-green-50">
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Date</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Guest</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Source</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Base</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Add-ons</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in partnerBookings" :key="booking.date + booking.guestName">
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ formatDate(booking.date) }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.guestName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.unitName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.source }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.baseAmount.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.addons.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.total.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.notes || '-' }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-green-50 dark:bg-green-900 print:bg-green-50">
              <tr>
                <td colspan="6" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Partner Payments Total:</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-green-700 dark:text-green-400 print:border-gray-300 print:text-green-700">₱{{ partnerPaymentsTotal.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm print:border-gray-300"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <!-- Payments Received by MetroBNB -->
      <div v-if="metrobnbBookings.length">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 print:text-gray-900">🏦 Payments Received by MetroBNB (To be deducted)</h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300">
            <thead>
              <tr class="bg-blue-50 dark:bg-blue-900 print:bg-blue-50">
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Date</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Guest</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Source</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Base</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Add-ons</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in metrobnbBookings" :key="booking.date + booking.guestName">
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ formatDate(booking.date) }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.guestName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.unitName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.source }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.baseAmount.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.addons.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.total.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.notes || '-' }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-blue-50 dark:bg-blue-900 print:bg-blue-50">
              <tr>
                <td colspan="6" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">MetroBNB Payments Total:</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-blue-700 dark:text-blue-400 print:border-gray-300 print:text-blue-700">₱{{ totalReceivedByMetroBNB.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm print:border-gray-300"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Expense Breakdown Table -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">💸 Expense Breakdown</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800 print:bg-gray-50">
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Date</th>
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th>
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Type</th>
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Notes</th>
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in invoice.expenses" :key="expense.date + expense.type">
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ formatDate(expense.date) }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ expense.unitName }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm capitalize text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ expense.type }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ expense.notes || '-' }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ expense.amount.toLocaleString() }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 dark:bg-gray-800 print:bg-gray-50">
            <tr>
              <td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total MetroBNB Expenses:</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">₱{{ totalExpenses.toLocaleString() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Computation Summary -->
    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg print:bg-gray-50">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">🧮 Computation Summary</h2>
      <table class="w-full">
        <tbody>
          <tr class="border-b border-gray-200 dark:border-gray-600">
            <td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">Total Income</td>
            <td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">₱{{ totalGrossEarnings.toLocaleString() }}</td>
          </tr>
          <tr class="border-b border-gray-200 dark:border-gray-600">
            <td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">MetroBNB Share ({{ invoice.sharePercentage }}%)</td>
            <td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">+₱{{ metroBNBShare.toLocaleString() }}</td>
          </tr>
          <tr class="border-b border-gray-200 dark:border-gray-600">
            <td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">MetroBNB Expenses</td>
            <td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">+₱{{ totalExpenses.toLocaleString() }}</td>
          </tr>
          <tr class="border-b border-gray-200 dark:border-gray-600">
            <td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">Less: Payments Received by MetroBNB</td>
            <td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">-₱{{ totalReceivedByMetroBNB.toLocaleString() }}</td>
          </tr>
          <tr class="border-t-2 border-gray-400">
            <td class="py-3 text-lg font-bold text-gray-900 dark:text-white print:text-gray-900">
              {{ netDue >= 0 ? 'Net Due to MetroBNB' : 'Net Due to Partner' }}
            </td>
            <td class="py-3 text-lg font-bold text-right print:text-gray-900" :class="netDue >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
              ₱{{ Math.abs(netDue).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Print Button -->
    <div class="mt-8 text-center print:hidden">
      <UButton @click="printInvoice" color="primary" size="lg">
        <UIcon name="i-heroicons-printer" class="mr-2" />
        Print Invoice
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Booking {
  date: string
  guestName: string
  unitName: string
  source: string
  baseAmount: number
  addons: number
  total: number
  paymentReceivedBy: 'metrobnb' | 'partner'
  actualAmountReceived: number
}

interface Expense {
  date: string
  unitName: string
  type: string
  notes?: string
  amount: number
}

interface PartnerInvoice {
  partnerName: string
  period: string
  sharePercentage: number
  bookings: Booking[]
  expenses: Expense[]
}

interface Props {
  invoice?: PartnerInvoice
}

const props = defineProps<Props>()

// Use prop data or fallback to mock data
const invoice: PartnerInvoice = props.invoice || {
  partnerName: 'Kate',
  period: 'July 2025',
  sharePercentage: 20,
  bookings: [
    {
      date: '2025-07-05',
      guestName: 'Juan Dela Cruz',
      unitName: 'Casa Aurea',
      source: 'Direct',
      baseAmount: 2199,
      addons: 300,
      total: 2499,
      paymentReceivedBy: 'metrobnb',
      actualAmountReceived: 1000
    },
    {
      date: '2025-07-12',
      guestName: 'Maria Santos',
      unitName: 'Casa Aurea',
      source: 'Airbnb',
      baseAmount: 3500,
      addons: 500,
      total: 4000,
      paymentReceivedBy: 'partner',
      actualAmountReceived: 4000
    },
    {
      date: '2025-07-20',
      guestName: 'Robert Johnson',
      unitName: 'Casa Aurea',
      source: 'Direct',
      baseAmount: 2800,
      addons: 200,
      total: 3000,
      paymentReceivedBy: 'metrobnb',
      actualAmountReceived: 3000
    }
  ],
  expenses: [
    {
      date: '2025-07-06',
      unitName: 'Casa Aurea',
      type: 'laundry',
      notes: 'towels & sheets',
      amount: 300
    },
    {
      date: '2025-07-15',
      unitName: 'Casa Aurea',
      type: 'cleaning',
      notes: 'deep cleaning after checkout',
      amount: 800
    },
    {
      date: '2025-07-25',
      unitName: 'Casa Aurea',
      type: 'repair',
      notes: 'fixed air conditioning',
      amount: 1500
    }
  ]
}

// Computed values
const partnerBookings = computed(() => 
  invoice.bookings.filter(booking => booking.paymentReceivedBy === 'partner')
)

const metrobnbBookings = computed(() => 
  invoice.bookings.filter(booking => booking.paymentReceivedBy === 'metrobnb')
)

const totalGrossEarnings = computed(() => 
  invoice.bookings.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
)

const partnerPaymentsTotal = computed(() => 
  partnerBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
)

const totalReceivedByMetroBNB = computed(() => 
  metrobnbBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
)

const totalExpenses = computed(() => 
  invoice.expenses.reduce((sum, expense) => sum + expense.amount, 0)
)

const metroBNBShare = computed(() => 
  Math.round(totalGrossEarnings.value * (invoice.sharePercentage / 100))
)

const netDue = computed(() => {
  // Total Income × Share % + Expenses - MetroBNB Payments
  return metroBNBShare.value + totalExpenses.value - totalReceivedByMetroBNB.value
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const printInvoice = () => {
  window.print()
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  
  .print\\:p-6, .print\\:p-6 * {
    visibility: visible;
  }
  
  .print\\:hidden {
    display: none !important;
  }
  
  .print\\:p-6 {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>