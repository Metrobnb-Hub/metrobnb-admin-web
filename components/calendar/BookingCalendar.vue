<template>
  <div class="booking-calendar">
    <FullCalendar
      ref="calendar"
      :options="calendarOptions"
    />
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg, DatesSetArg } from '@fullcalendar/core'
import type { Booking } from '~/types/api'

interface Props {
  partnerId?: string
  unitId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  eventClick: [booking: Booking]
}>()

const { getBookings } = useApi()
const { transformBookingsToEvents } = useCalendarEvents()

const events = ref([])
const loading = ref(false)

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth'
  },
  events: [],
  eventClick: (info: EventClickArg) => {
    emit('eventClick', info.event.extendedProps.booking)
  },
  datesSet: (info: DatesSetArg) => {
    loadEvents(info.start, info.end)
  },
  height: 'auto',
  eventDisplay: 'block',
  dayMaxEvents: 3,
  moreLinkClick: 'popover',
  aspectRatio: 1.8,
  firstDay: 1
})

watch(events, (newEvents) => {
  calendarOptions.value.events = newEvents
})

const loadEvents = async (start: Date, end: Date) => {
  loading.value = true
  try {
    const startDate = start.toISOString().split('T')[0]
    const endDate = end.toISOString().split('T')[0]
    
    const result = await getBookings({
      start_date: startDate,
      end_date: endDate,
      partner_id: props.partnerId,
      unit_id: props.unitId,
      limit: 100
    })
    
    // Extract bookings from paginated response
    const bookings = result?.data?.items || result?.items || []
    
    if (bookings.length > 0) {
      events.value = await transformBookingsToEvents(bookings)
    } else {
      events.value = []
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Watch for filter changes
watch([() => props.partnerId, () => props.unitId], () => {
  const calendarApi = calendar.value?.getApi()
  if (calendarApi) {
    const view = calendarApi.view
    loadEvents(view.activeStart, view.activeEnd)
  }
})

const calendar = ref()
</script>

<style scoped>
.booking-calendar {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}

:deep(.fc) {
  @apply font-sans;
}

/* Header styling */
:deep(.fc-toolbar) {
  @apply bg-gray-50 dark:bg-gray-900 p-4 rounded-t-lg border-b border-gray-200 dark:border-gray-700;
}

:deep(.fc-toolbar-title) {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

/* Button styling */
:deep(.fc-button) {
  @apply bg-primary-600 border-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:border-primary-500 dark:hover:bg-primary-600 px-3 py-2 rounded-md font-medium transition-colors;
}

:deep(.fc-button-active) {
  @apply bg-primary-700 border-primary-700 dark:bg-primary-600 dark:border-primary-600;
}

:deep(.fc-button:disabled) {
  @apply bg-gray-300 border-gray-300 text-gray-500 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400;
}

/* Calendar grid */
:deep(.fc-scrollgrid) {
  @apply border-gray-200 dark:border-gray-700;
}

:deep(.fc-col-header) {
  @apply bg-gray-100 dark:bg-gray-800;
}

:deep(.fc-col-header-cell) {
  @apply border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium;
}

:deep(.fc-daygrid-day) {
  @apply bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700;
}

:deep(.fc-daygrid-day:hover) {
  @apply bg-gray-50 dark:bg-gray-700;
}

:deep(.fc-daygrid-day-number) {
  @apply text-gray-900 dark:text-gray-100 font-medium;
}

:deep(.fc-day-today) {
  @apply bg-primary-50 dark:bg-primary-900/20;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  @apply text-primary-600 dark:text-primary-400 font-bold;
}

/* Event styling */
:deep(.fc-event) {
  @apply cursor-pointer border-2 rounded-md shadow-sm transition-all duration-200;
}

:deep(.fc-event:hover) {
  @apply shadow-md transform scale-105;
}

:deep(.fc-event-title) {
  @apply font-medium text-xs px-1;
}

/* More link styling */
:deep(.fc-more-link) {
  @apply text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium;
}

/* Popover styling */
:deep(.fc-popover) {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg;
}

:deep(.fc-popover-header) {
  @apply bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium;
}

:deep(.fc-popover-body) {
  @apply text-gray-900 dark:text-gray-100;
}

/* Weekend styling */
:deep(.fc-day-sat),
:deep(.fc-day-sun) {
  @apply bg-gray-50 dark:bg-gray-800;
}

/* Loading state */
:deep(.fc-view-harness) {
  @apply min-h-[500px];
}
</style>