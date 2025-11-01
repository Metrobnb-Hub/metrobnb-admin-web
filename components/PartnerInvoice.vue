<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 print:p-6 print:bg-white">
    <!-- Header Section -->
    <div class="border-b-2 border-gray-200 pb-6 mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 print:text-gray-900">{{ orgName }} Partner Invoice</h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 print:text-gray-600">Partner: <span class="font-semibold">{{ invoice.partnerName }}</span></p>
          <p class="text-lg text-gray-600 dark:text-gray-300 print:text-gray-600">Period: <span class="font-semibold">{{ invoice.period }}</span></p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400 print:text-gray-500">Generated: {{ new Date().toLocaleDateString() }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 print:text-gray-500">{{ orgName }} Share: {{ invoice.orgSharePercentage }}%</p>
        </div>
      </div>
    </div>

    <!-- Booking Summary Tables -->
    <div class="mb-8 space-y-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">📊 Booking Summary</h2>
      
      <!-- No Bookings Message -->
      <div v-if="!partnerBookings.length && !orgBookings.length" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            No bookings found for this period. This invoice contains only expenses.
          </p>
        </div>
      </div>
      
      <!-- Payments Received by Partner -->
      <div v-if="partnerBookings.length">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 print:text-gray-900">💰 Payments Received by Partner</h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300">
            <thead>
              <tr class="bg-green-50 dark:bg-green-900 print:bg-green-50">
                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900 w-32">Dates</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Guest</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Source</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Base</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Add-ons</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in sortedPartnerBookings" :key="booking.date + booking.guestName">
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900 w-32">{{ formatDateRange(booking.date, booking.endDate) }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.guestName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.unitName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.source }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.baseAmount.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.addons.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.total.toLocaleString() }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-green-50 dark:bg-green-900 print:bg-green-50">
              <tr v-for="(breakdown, source) in partnerBreakdownBySource" :key="source">
                <td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">{{ source }} Base:</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">₱{{ breakdown.base.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">₱{{ breakdown.addons.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">₱{{ breakdown.total.toLocaleString() }}</td>
              </tr>
              <tr>
                <td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Partner Total:</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-green-700 dark:text-green-400 print:border-gray-300 print:text-green-700">₱{{ partnerBaseTotal.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-green-700 dark:text-green-400 print:border-gray-300 print:text-green-700">₱{{ partnerAddonsTotal.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-green-700 dark:text-green-400 print:border-gray-300 print:text-green-700">₱{{ partnerPaymentsTotal.toLocaleString() }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        

      </div>
      
      <!-- Payments Received by Organization -->
      <div v-if="orgBookings.length">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 print:text-gray-900">🏦 Payments Received by {{ orgName }} (To be deducted)</h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300">
            <thead>
              <tr class="bg-blue-50 dark:bg-blue-900 print:bg-blue-50">
                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900 w-32">Dates</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Guest</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Source</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Base</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Add-ons</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in sortedOrgBookings" :key="booking.date + booking.guestName">
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900 w-32">{{ formatDateRange(booking.date, booking.endDate) }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.guestName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.unitName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.source }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.baseAmount.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.addons.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.total.toLocaleString() }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-blue-50 dark:bg-blue-900 print:bg-blue-50">
              <tr v-for="(breakdown, source) in orgBreakdownBySource" :key="source">
                <td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">{{ source }} Base:</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">₱{{ breakdown.base.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">₱{{ breakdown.addons.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">₱{{ breakdown.total.toLocaleString() }}</td>
              </tr>
              <tr>
                <td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">{{ orgName }} Total:</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-blue-700 dark:text-blue-400 print:border-gray-300 print:text-blue-700">₱{{ orgBaseTotal.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-blue-700 dark:text-blue-400 print:border-gray-300 print:text-blue-700">₱{{ orgAddonsTotal.toLocaleString() }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-blue-700 dark:text-blue-400 print:border-gray-300 print:text-blue-700">₱{{ totalReceivedByOrg.toLocaleString() }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        

      </div>
      
      <!-- Canceled/Refunded Bookings -->
      <div v-if="canceledRefundedBookings.length">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 print:text-gray-900">❌ Canceled/Refunded Bookings (Not included in calculations)</h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300">
            <thead>
              <tr class="bg-red-50 dark:bg-red-900 print:bg-red-50">
                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900 w-32">Dates</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Guest</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Status</th>
                <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in canceledRefundedBookings" :key="booking.date + booking.guestName">
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900 w-32">{{ formatDateRange(booking.date, booking.endDate) }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.guestName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ booking.unitName }}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">
                  <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full" :class="booking.bookingStatus === 'canceled' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'">
                    {{ booking.bookingStatus === 'canceled' ? 'Canceled' : 'Refunded' }}
                  </span>
                </td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ booking.actualAmountReceived.toLocaleString() }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-red-50 dark:bg-red-900 print:bg-red-50">
              <tr>
                <td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total Refunds:</td>
                <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-red-700 dark:text-red-400 print:border-gray-300 print:text-red-700">₱{{ totalRefunds.toLocaleString() }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Adjustments Table -->
    <div v-if="invoice.journalEntries && invoice.journalEntries.length" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">⚖️ Adjustments</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300">
          <thead>
            <tr class="bg-yellow-50 dark:bg-yellow-900 print:bg-yellow-50">
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Date</th>
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Type</th>
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Description</th>
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Reference</th>
              <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in sortedJournalEntries" :key="entry.date + entry.description">
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ formatDate(entry.date) }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full" :class="entry.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ entry.type === 'credit' ? 'Credit' : 'Debit' }}
                </span>
              </td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ entry.description }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ entry.reference || '-' }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right font-medium print:border-gray-300" :class="entry.type === 'credit' ? 'text-green-600 dark:text-green-400 print:text-green-600' : 'text-red-600 dark:text-red-400 print:text-red-600'">
                {{ entry.type === 'credit' ? '+' : '-' }}₱{{ entry.amount.toLocaleString() }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-yellow-50 dark:bg-yellow-900 print:bg-yellow-50">
            <tr>
              <td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Net Adjustments:</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right print:border-gray-300" :class="netJournalEntries >= 0 ? 'text-green-600 dark:text-green-400 print:text-green-600' : 'text-red-600 dark:text-red-400 print:text-red-600'">
                {{ netJournalEntries >= 0 ? '+' : '' }}₱{{ netJournalEntries.toLocaleString() }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Expense Breakdown Table -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">💸 Expense Breakdown</h2>
      
      <!-- No Expenses Message -->
      <div v-if="!invoice?.expenses?.length" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
          No expenses recorded for this period.
        </p>
      </div>
      
      <div v-if="invoice?.expenses?.length" class="overflow-x-auto">
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
            <tr v-for="expense in sortedExpenses" :key="expense.date + expense.type">
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ formatDate(expense.date) }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ expense.unitName }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm capitalize text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ expense.type }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">{{ expense.notes || '-' }}</td>
              <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">₱{{ expense.amount.toLocaleString() }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 dark:bg-gray-800 print:bg-gray-50">
            <tr>
              <td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total {{ orgName }} Expenses:</td>
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
            <td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">{{ orgName }} Share ({{ invoice.orgSharePercentage }}%)</td>
            <td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">+₱{{ orgShare.toLocaleString() }}</td>
          </tr>
          <tr class="border-b border-gray-200 dark:border-gray-600">
            <td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">{{ orgName }} Expenses</td>
            <td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">+₱{{ totalExpenses.toLocaleString() }}</td>
          </tr>
          <tr v-if="invoice.journalEntries && invoice.journalEntries.length" class="border-b border-gray-200 dark:border-gray-600">
            <td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">Less: Adjustments (Net)</td>
            <td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">{{ netJournalEntries >= 0 ? '-' : '+' }}₱{{ Math.abs(netJournalEntries).toLocaleString() }}</td>
          </tr>
          <tr class="border-b border-gray-200 dark:border-gray-600">
            <td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">Less: Payments Received by {{ orgName }}</td>
            <td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">-₱{{ totalReceivedByOrg.toLocaleString() }}</td>
          </tr>
          <tr class="border-t-2 border-gray-400">
            <td class="py-3 text-lg font-bold text-gray-900 dark:text-white print:text-gray-900">
              Amount Due
            </td>
            <td class="py-3 text-lg font-bold text-right print:text-gray-900" :class="netDue < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
              ₱{{ netDue.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Partner Note when org owes money -->
      <div v-if="netDue < 0 && isPartner" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="flex items-start">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
          <p class="text-sm text-green-700 dark:text-green-300">
            <strong>Good news!</strong> {{ orgName }} owes you ₱{{ Math.abs(netDue).toLocaleString() }}. No payment is required from you.
          </p>
        </div>
      </div>
    </div>

    <!-- Print & Download Buttons -->
    <div class="mt-8 text-center print:hidden">
      <div class="space-y-2">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ (partnerBookings?.length || 0) + (orgBookings?.length || 0) }} bookings, {{ invoice?.expenses?.length || 0 }} expenses
        </p>
        <div class="flex justify-center">
          <UButton @click="printInvoice" color="primary" size="lg">
            <UIcon name="i-heroicons-printer" class="mr-2" />
            Print Invoice
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Booking {
  date: string
  endDate?: string
  guestName: string
  unitName: string
  source: string
  baseAmount: number
  addons: number
  total: number
  paymentReceivedBy: 'org' | 'partner'
  actualAmountReceived: number
  bookingStatus?: 'confirmed' | 'canceled' | 'refunded'
}

interface Expense {
  date: string
  unitName: string
  type: string
  notes?: string
  amount: number
}

interface JournalEntry {
  date: string
  type: 'credit' | 'debit'
  description: string
  reference?: string
  notes?: string
  amount: number
}

interface PartnerInvoice {
  partnerName: string
  period: string
  orgSharePercentage: number
  bookings: Booking[]
  expenses: Expense[]
  journalEntries?: JournalEntry[]
}

interface Props {
  invoice?: PartnerInvoice
  orgName?: string
}

const props = defineProps<Props>()
const { organization, user } = useAuth()

const orgName = computed(() => props.orgName || organization.value?.name || 'Organization')
const isPartner = computed(() => user.value?.role === 'partner')

// Use prop data - no fallback to mock data
const invoice: PartnerInvoice = props.invoice || {
  partnerName: 'No Data',
  period: 'No Data',
  orgSharePercentage: 0,
  bookings: [],
  expenses: [],
  journalEntries: []
}





// Computed values - separate by status and payment receiver
const confirmedBookings = computed(() => 
  invoice?.bookings?.filter(booking => booking.bookingStatus === 'confirmed') || []
)

const canceledRefundedBookings = computed(() => 
  invoice?.bookings?.filter(booking => ['canceled', 'refunded'].includes(booking.bookingStatus)) || []
)

const partnerBookings = computed(() => 
  confirmedBookings.value.filter(booking => booking.paymentReceivedBy === 'partner')
)

const orgBookings = computed(() => 
  confirmedBookings.value.filter(booking => booking.paymentReceivedBy === 'org')
)

const totalGrossEarnings = computed(() => {
  if (invoice?.summary?.total_gross_earnings !== undefined) {
    return parseFloat(invoice.summary.total_gross_earnings)
  }
  return confirmedBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
})

const totalRefunds = computed(() => 
  canceledRefundedBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
)

const partnerPaymentsTotal = computed(() => 
  partnerBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
)

const totalReceivedByOrg = computed(() => {
  if (invoice?.summary?.total_received_by_org !== undefined) {
    return parseFloat(invoice.summary.total_received_by_org)
  }
  return orgBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
})

const totalExpenses = computed(() => {
  if (invoice?.summary?.total_expenses !== undefined) {
    return parseFloat(invoice.summary.total_expenses)
  }
  return invoice?.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
})

const orgShare = computed(() => {
  if (invoice?.summary?.org_share !== undefined) {
    return parseFloat(invoice.summary.org_share)
  }
  return Math.round(totalGrossEarnings.value * (invoice.orgSharePercentage / 100))
})

const netDue = computed(() => {
  // Use backend's calculated net_due if available, otherwise calculate
  if (invoice?.summary?.net_due !== undefined) {
    return parseFloat(invoice.summary.net_due)
  }
  // Fallback calculation
  return orgShare.value + totalExpenses.value - netJournalEntries.value - totalReceivedByOrg.value
})

const { formatDate, formatDateShort } = useDateFormat()

const formatDateRange = (startDate: string, endDate?: string) => {
  const start = formatDateShort(startDate)
  if (!endDate) return start
  const end = formatDateShort(endDate)
  return start === end ? start : `${start} - ${end}`
}

// Sorted data for print-friendly display (ascending by date)
const sortedPartnerBookings = computed(() => 
  [...partnerBookings.value].sort((a, b) => new Date(a.date) - new Date(b.date))
)

const sortedOrgBookings = computed(() => 
  [...orgBookings.value].sort((a, b) => new Date(a.date) - new Date(b.date))
)

const sortedExpenses = computed(() => 
  [...(invoice?.expenses || [])].sort((a, b) => new Date(a.date) - new Date(b.date))
)

const sortedJournalEntries = computed(() => 
  [...(invoice?.journalEntries || [])].sort((a, b) => new Date(a.date) - new Date(b.date))
)

const netJournalEntries = computed(() => {
  if (invoice?.summary?.net_journal_entries !== undefined) {
    return parseFloat(invoice.summary.net_journal_entries)
  }
  if (!invoice?.journalEntries) return 0
  return invoice.journalEntries.reduce((sum, entry) => {
    return entry.type === 'credit' ? sum + entry.amount : sum - entry.amount
  }, 0)
})

// Breakdown by source with base/addons separation
const partnerBreakdownBySource = computed(() => {
  const breakdown: Record<string, {base: number, addons: number, total: number}> = {}
  partnerBookings.value.forEach(booking => {
    if (!breakdown[booking.source]) {
      breakdown[booking.source] = { base: 0, addons: 0, total: 0 }
    }
    breakdown[booking.source].base += booking.baseAmount
    breakdown[booking.source].addons += booking.addons
    breakdown[booking.source].total += booking.actualAmountReceived
  })
  return breakdown
})

const orgBreakdownBySource = computed(() => {
  const breakdown: Record<string, {base: number, addons: number, total: number}> = {}
  orgBookings.value.forEach(booking => {
    if (!breakdown[booking.source]) {
      breakdown[booking.source] = { base: 0, addons: 0, total: 0 }
    }
    breakdown[booking.source].base += booking.baseAmount
    breakdown[booking.source].addons += booking.addons
    breakdown[booking.source].total += booking.actualAmountReceived
  })
  return breakdown
})

// Overall totals for base and addons
const partnerBaseTotal = computed(() => 
  partnerBookings.value.reduce((sum, booking) => sum + booking.baseAmount, 0)
)

const partnerAddonsTotal = computed(() => 
  partnerBookings.value.reduce((sum, booking) => sum + booking.addons, 0)
)

const orgBaseTotal = computed(() => 
  orgBookings.value.reduce((sum, booking) => sum + booking.baseAmount, 0)
)

const orgAddonsTotal = computed(() => 
  orgBookings.value.reduce((sum, booking) => sum + booking.addons, 0)
)

const printInvoice = () => {
  window.print()
}

const downloadInvoice = () => {
  // Get unique unit names from bookings
  const allBookings = [...partnerBookings.value, ...orgBookings.value];
  const unitNames = [...new Set(allBookings.map(b => b.unitName))].filter(Boolean);
  
  // Create filename: partner_name-unit_name(s)-month
  const partnerName = invoice.partnerName.replace(/\s+/g, '_');
  const unitPart = unitNames.join('-').replace(/\s+/g, '_');
  const monthPart = invoice.period.replace(/\s+/g, '_');
  const filename = `${partnerName}-${unitPart}-${monthPart}.pdf`;
  
  // Use browser's print to PDF functionality
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            ${document.querySelector('style')?.innerHTML || ''}
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
            .print\\:hidden { display: none !important; }
            @media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
          </style>
        </head>
        <body>
          ${document.querySelector('.max-w-4xl')?.outerHTML || ''}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}
</script>

<style>
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  .print\\:hidden {
    display: none !important;
  }
  
  .print\\:bg-white {
    background-color: white !important;
  }
  
  .print\\:text-gray-900 {
    color: #111827 !important;
  }
  
  .print\\:border-gray-300 {
    border-color: #d1d5db !important;
  }
  
  .print\\:bg-green-50 {
    background-color: #f0fdf4 !important;
  }
  
  .print\\:bg-blue-50 {
    background-color: #eff6ff !important;
  }
  
  .print\\:bg-gray-50 {
    background-color: #f9fafb !important;
  }
  
  .print\\:text-green-700 {
    color: #15803d !important;
  }
  
  .print\\:text-blue-700 {
    color: #1d4ed8 !important;
  }
  
  /* Ensure tables print properly */
  table {
    page-break-inside: auto;
  }
  
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  
  /* Page margins and hide headers/footers */
  @page {
    margin: 0.5in;
    size: A4;
  }
  
  /* Hide browser headers and footers */
  html {
    -webkit-print-color-adjust: exact;
  }
  
  body {
    -webkit-print-color-adjust: exact;
  }
}
</style>