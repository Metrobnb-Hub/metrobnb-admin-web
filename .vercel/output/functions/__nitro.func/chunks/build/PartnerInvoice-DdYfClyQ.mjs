import { e as __nuxt_component_1$1, f as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useDateFormat } from './useDateFormat-COE5x7qz.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PartnerInvoice",
  __ssrInlineRender: true,
  props: {
    invoice: {},
    orgName: {}
  },
  setup(__props) {
    const props = __props;
    const { organization, user } = useAuth();
    const orgName = computed(() => {
      var _a;
      return props.orgName || ((_a = organization.value) == null ? void 0 : _a.name) || "Organization";
    });
    const isPartner = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.role) === "partner";
    });
    const invoice = props.invoice || {
      partnerName: "No Data",
      period: "No Data",
      orgSharePercentage: 0,
      bookings: [],
      expenses: [],
      journalEntries: []
    };
    const confirmedBookings = computed(
      () => {
        var _a;
        return ((_a = invoice == null ? void 0 : invoice.bookings) == null ? void 0 : _a.filter((booking) => booking.bookingStatus === "confirmed")) || [];
      }
    );
    const canceledRefundedBookings = computed(
      () => {
        var _a;
        return ((_a = invoice == null ? void 0 : invoice.bookings) == null ? void 0 : _a.filter((booking) => ["canceled", "refunded"].includes(booking.bookingStatus))) || [];
      }
    );
    const partnerBookings = computed(
      () => confirmedBookings.value.filter((booking) => booking.paymentReceivedBy === "partner")
    );
    const orgBookings = computed(
      () => confirmedBookings.value.filter((booking) => booking.paymentReceivedBy === "org")
    );
    const totalGrossEarnings = computed(() => {
      var _a;
      if (((_a = invoice == null ? void 0 : invoice.summary) == null ? void 0 : _a.total_gross_earnings) !== void 0) {
        return parseFloat(invoice.summary.total_gross_earnings);
      }
      return confirmedBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0);
    });
    const totalRefunds = computed(
      () => canceledRefundedBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
    );
    const partnerPaymentsTotal = computed(
      () => partnerBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0)
    );
    const totalReceivedByOrg = computed(() => {
      var _a;
      if (((_a = invoice == null ? void 0 : invoice.summary) == null ? void 0 : _a.total_received_by_org) !== void 0) {
        return parseFloat(invoice.summary.total_received_by_org);
      }
      return orgBookings.value.reduce((sum, booking) => sum + booking.actualAmountReceived, 0);
    });
    const totalExpenses = computed(() => {
      var _a, _b;
      if (((_a = invoice == null ? void 0 : invoice.summary) == null ? void 0 : _a.total_expenses) !== void 0) {
        return parseFloat(invoice.summary.total_expenses);
      }
      return ((_b = invoice == null ? void 0 : invoice.expenses) == null ? void 0 : _b.reduce((sum, expense) => sum + expense.amount, 0)) || 0;
    });
    const orgShare = computed(() => {
      var _a;
      if (((_a = invoice == null ? void 0 : invoice.summary) == null ? void 0 : _a.org_share) !== void 0) {
        return parseFloat(invoice.summary.org_share);
      }
      return Math.round(totalGrossEarnings.value * (invoice.orgSharePercentage / 100));
    });
    const netDue = computed(() => {
      var _a;
      if (((_a = invoice == null ? void 0 : invoice.summary) == null ? void 0 : _a.net_due) !== void 0) {
        return parseFloat(invoice.summary.net_due);
      }
      return orgShare.value + totalExpenses.value - netJournalEntries.value - totalReceivedByOrg.value;
    });
    const { formatDate, formatDateShort } = useDateFormat();
    const formatDateRange = (startDate, endDate) => {
      const start = formatDateShort(startDate);
      if (!endDate) return start;
      const end = formatDateShort(endDate);
      return start === end ? start : `${start} - ${end}`;
    };
    const sortedPartnerBookings = computed(
      () => [...partnerBookings.value].sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    const sortedOrgBookings = computed(
      () => [...orgBookings.value].sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    const sortedExpenses = computed(
      () => [...(invoice == null ? void 0 : invoice.expenses) || []].sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    const sortedJournalEntries = computed(
      () => [...(invoice == null ? void 0 : invoice.journalEntries) || []].sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    const netJournalEntries = computed(() => {
      var _a;
      if (((_a = invoice == null ? void 0 : invoice.summary) == null ? void 0 : _a.net_journal_entries) !== void 0) {
        return parseFloat(invoice.summary.net_journal_entries);
      }
      if (!(invoice == null ? void 0 : invoice.journalEntries)) return 0;
      return invoice.journalEntries.reduce((sum, entry) => {
        return entry.type === "credit" ? sum + entry.amount : sum - entry.amount;
      }, 0);
    });
    const partnerBreakdownBySource = computed(() => {
      const breakdown = {};
      partnerBookings.value.forEach((booking) => {
        if (!breakdown[booking.source]) {
          breakdown[booking.source] = { base: 0, addons: 0, total: 0 };
        }
        breakdown[booking.source].base += booking.baseAmount;
        breakdown[booking.source].addons += booking.addons;
        breakdown[booking.source].total += booking.actualAmountReceived;
      });
      return breakdown;
    });
    const orgBreakdownBySource = computed(() => {
      const breakdown = {};
      orgBookings.value.forEach((booking) => {
        if (!breakdown[booking.source]) {
          breakdown[booking.source] = { base: 0, addons: 0, total: 0 };
        }
        breakdown[booking.source].base += booking.baseAmount;
        breakdown[booking.source].addons += booking.addons;
        breakdown[booking.source].total += booking.actualAmountReceived;
      });
      return breakdown;
    });
    const partnerBaseTotal = computed(
      () => partnerBookings.value.reduce((sum, booking) => sum + booking.baseAmount, 0)
    );
    const partnerAddonsTotal = computed(
      () => partnerBookings.value.reduce((sum, booking) => sum + booking.addons, 0)
    );
    const orgBaseTotal = computed(
      () => orgBookings.value.reduce((sum, booking) => sum + booking.baseAmount, 0)
    );
    const orgAddonsTotal = computed(
      () => orgBookings.value.reduce((sum, booking) => sum + booking.addons, 0)
    );
    const printInvoice = () => {
      (void 0).print();
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 print:p-6 print:bg-white" }, _attrs))}><div class="border-b-2 border-gray-200 pb-6 mb-8"><div class="flex justify-between items-start"><div><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 print:text-gray-900">${ssrInterpolate(unref(orgName))} Partner Invoice</h1><p class="text-lg text-gray-600 dark:text-gray-300 print:text-gray-600">Partner: <span class="font-semibold">${ssrInterpolate(unref(invoice).partnerName)}</span></p><p class="text-lg text-gray-600 dark:text-gray-300 print:text-gray-600">Period: <span class="font-semibold">${ssrInterpolate(unref(invoice).period)}</span></p></div><div class="text-right"><p class="text-sm text-gray-500 dark:text-gray-400 print:text-gray-500">Generated: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString())}</p><p class="text-sm text-gray-500 dark:text-gray-400 print:text-gray-500">${ssrInterpolate(unref(orgName))} Share: ${ssrInterpolate(unref(invoice).orgSharePercentage)}%</p></div></div></div><div class="mb-8 space-y-6"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">\u{1F4CA} Booking Summary</h2>`);
      if (!unref(partnerBookings).length && !unref(orgBookings).length) {
        _push(`<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6"><div class="flex items-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-information-circle",
          class: "h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2"
        }, null, _parent));
        _push(`<p class="text-sm text-yellow-700 dark:text-yellow-300"> No bookings found for this period. This invoice contains only expenses. </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(partnerBookings).length) {
        _push(`<div><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 print:text-gray-900">\u{1F4B0} Payments Received by Partner</h3><div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300"><thead><tr class="bg-green-50 dark:bg-green-900 print:bg-green-50"><th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900 w-32">Dates</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Guest</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Source</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Base</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Add-ons</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(sortedPartnerBookings), (booking) => {
          _push(`<tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900 w-32">${ssrInterpolate(formatDateRange(booking.date, booking.endDate))}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(booking.guestName)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(booking.unitName)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(booking.source)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(booking.baseAmount.toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(booking.addons.toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(booking.total.toLocaleString())}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot class="bg-green-50 dark:bg-green-900 print:bg-green-50"><!--[-->`);
        ssrRenderList(unref(partnerBreakdownBySource), (breakdown, source) => {
          _push(`<tr><td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">${ssrInterpolate(source)} Base:</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">\u20B1${ssrInterpolate(breakdown.base.toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">\u20B1${ssrInterpolate(breakdown.addons.toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">\u20B1${ssrInterpolate(breakdown.total.toLocaleString())}</td></tr>`);
        });
        _push(`<!--]--><tr><td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Partner Total:</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-green-700 dark:text-green-400 print:border-gray-300 print:text-green-700">\u20B1${ssrInterpolate(unref(partnerBaseTotal).toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-green-700 dark:text-green-400 print:border-gray-300 print:text-green-700">\u20B1${ssrInterpolate(unref(partnerAddonsTotal).toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-green-700 dark:text-green-400 print:border-gray-300 print:text-green-700">\u20B1${ssrInterpolate(unref(partnerPaymentsTotal).toLocaleString())}</td></tr></tfoot></table></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(orgBookings).length) {
        _push(`<div><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 print:text-gray-900">\u{1F3E6} Payments Received by ${ssrInterpolate(unref(orgName))} (To be deducted)</h3><div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300"><thead><tr class="bg-blue-50 dark:bg-blue-900 print:bg-blue-50"><th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900 w-32">Dates</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Guest</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Source</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Base</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Add-ons</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(sortedOrgBookings), (booking) => {
          _push(`<tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900 w-32">${ssrInterpolate(formatDateRange(booking.date, booking.endDate))}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(booking.guestName)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(booking.unitName)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(booking.source)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(booking.baseAmount.toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(booking.addons.toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(booking.total.toLocaleString())}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot class="bg-blue-50 dark:bg-blue-900 print:bg-blue-50"><!--[-->`);
        ssrRenderList(unref(orgBreakdownBySource), (breakdown, source) => {
          _push(`<tr><td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">${ssrInterpolate(source)} Base:</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">\u20B1${ssrInterpolate(breakdown.base.toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">\u20B1${ssrInterpolate(breakdown.addons.toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-right text-gray-700 dark:text-gray-300 print:border-gray-300 print:text-gray-700">\u20B1${ssrInterpolate(breakdown.total.toLocaleString())}</td></tr>`);
        });
        _push(`<!--]--><tr><td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">${ssrInterpolate(unref(orgName))} Total:</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-blue-700 dark:text-blue-400 print:border-gray-300 print:text-blue-700">\u20B1${ssrInterpolate(unref(orgBaseTotal).toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-blue-700 dark:text-blue-400 print:border-gray-300 print:text-blue-700">\u20B1${ssrInterpolate(unref(orgAddonsTotal).toLocaleString())}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-blue-700 dark:text-blue-400 print:border-gray-300 print:text-blue-700">\u20B1${ssrInterpolate(unref(totalReceivedByOrg).toLocaleString())}</td></tr></tfoot></table></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(canceledRefundedBookings).length) {
        _push(`<div><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 print:text-gray-900">\u274C Canceled/Refunded Bookings (Not included in calculations)</h3><div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300"><thead><tr class="bg-red-50 dark:bg-red-900 print:bg-red-50"><th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900 w-32">Dates</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Guest</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Status</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Amount</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(canceledRefundedBookings), (booking) => {
          _push(`<tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900 w-32">${ssrInterpolate(formatDateRange(booking.date, booking.endDate))}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(booking.guestName)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(booking.unitName)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900"><span class="${ssrRenderClass([booking.bookingStatus === "canceled" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800", "inline-flex px-2 py-1 text-xs font-medium rounded-full"])}">${ssrInterpolate(booking.bookingStatus === "canceled" ? "Canceled" : "Refunded")}</span></td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(booking.actualAmountReceived.toLocaleString())}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot class="bg-red-50 dark:bg-red-900 print:bg-red-50"><tr><td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total Refunds:</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-red-700 dark:text-red-400 print:border-gray-300 print:text-red-700">\u20B1${ssrInterpolate(unref(totalRefunds).toLocaleString())}</td></tr></tfoot></table></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(invoice).journalEntries && unref(invoice).journalEntries.length) {
        _push(`<div class="mb-8"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">\u2696\uFE0F Adjustments</h2><div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300"><thead><tr class="bg-yellow-50 dark:bg-yellow-900 print:bg-yellow-50"><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Date</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Type</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Description</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Reference</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Amount</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(sortedJournalEntries), (entry) => {
          _push(`<tr><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(unref(formatDate)(entry.date))}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900"><span class="${ssrRenderClass([entry.type === "credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800", "inline-flex px-2 py-1 text-xs font-medium rounded-full"])}">${ssrInterpolate(entry.type === "credit" ? "Credit" : "Debit")}</span></td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(entry.description)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(entry.reference || "-")}</td><td class="${ssrRenderClass([entry.type === "credit" ? "text-green-600 dark:text-green-400 print:text-green-600" : "text-red-600 dark:text-red-400 print:text-red-600", "border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right font-medium print:border-gray-300"])}">${ssrInterpolate(entry.type === "credit" ? "+" : "-")}\u20B1${ssrInterpolate(entry.amount.toLocaleString())}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot class="bg-yellow-50 dark:bg-yellow-900 print:bg-yellow-50"><tr><td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Net Adjustments:</td><td class="${ssrRenderClass([unref(netJournalEntries) >= 0 ? "text-green-600 dark:text-green-400 print:text-green-600" : "text-red-600 dark:text-red-400 print:text-red-600", "border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right print:border-gray-300"])}">${ssrInterpolate(unref(netJournalEntries) >= 0 ? "+" : "")}\u20B1${ssrInterpolate(unref(netJournalEntries).toLocaleString())}</td></tr></tfoot></table></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-8"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">\u{1F4B8} Expense Breakdown</h2>`);
      if (!((_b = (_a = unref(invoice)) == null ? void 0 : _a.expenses) == null ? void 0 : _b.length)) {
        _push(`<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4"><p class="text-sm text-gray-600 dark:text-gray-400 text-center"> No expenses recorded for this period. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      if ((_d = (_c = unref(invoice)) == null ? void 0 : _c.expenses) == null ? void 0 : _d.length) {
        _push(`<div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300 dark:border-gray-600 print:border-gray-300"><thead><tr class="bg-gray-50 dark:bg-gray-800 print:bg-gray-50"><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Date</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Unit</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Type</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Notes</th><th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Amount</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(sortedExpenses), (expense) => {
          _push(`<tr><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(unref(formatDate)(expense.date))}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(expense.unitName)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm capitalize text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(expense.type)}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">${ssrInterpolate(expense.notes || "-")}</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(expense.amount.toLocaleString())}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot class="bg-gray-50 dark:bg-gray-800 print:bg-gray-50"><tr><td colspan="4" class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">Total ${ssrInterpolate(unref(orgName))} Expenses:</td><td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-bold text-right text-gray-900 dark:text-white print:border-gray-300 print:text-gray-900">\u20B1${ssrInterpolate(unref(totalExpenses).toLocaleString())}</td></tr></tfoot></table></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg print:bg-gray-50"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 print:text-gray-900">\u{1F9EE} Computation Summary</h2><table class="w-full"><tbody><tr class="border-b border-gray-200 dark:border-gray-600"><td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">Total Income</td><td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">\u20B1${ssrInterpolate(unref(totalGrossEarnings).toLocaleString())}</td></tr><tr class="border-b border-gray-200 dark:border-gray-600"><td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">${ssrInterpolate(unref(orgName))} Share (${ssrInterpolate(unref(invoice).orgSharePercentage)}%)</td><td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">+\u20B1${ssrInterpolate(unref(orgShare).toLocaleString())}</td></tr><tr class="border-b border-gray-200 dark:border-gray-600"><td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">${ssrInterpolate(unref(orgName))} Expenses</td><td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">+\u20B1${ssrInterpolate(unref(totalExpenses).toLocaleString())}</td></tr>`);
      if (unref(invoice).journalEntries && unref(invoice).journalEntries.length) {
        _push(`<tr class="border-b border-gray-200 dark:border-gray-600"><td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">Less: Adjustments (Net)</td><td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">${ssrInterpolate(unref(netJournalEntries) >= 0 ? "-" : "+")}\u20B1${ssrInterpolate(Math.abs(unref(netJournalEntries)).toLocaleString())}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<tr class="border-b border-gray-200 dark:border-gray-600"><td class="py-2 text-sm font-medium text-gray-900 dark:text-gray-100 print:text-gray-900">Less: Payments Received by ${ssrInterpolate(unref(orgName))}</td><td class="py-2 text-sm text-right text-gray-900 dark:text-gray-100 print:text-gray-900">-\u20B1${ssrInterpolate(unref(totalReceivedByOrg).toLocaleString())}</td></tr><tr class="border-t-2 border-gray-400"><td class="py-3 text-lg font-bold text-gray-900 dark:text-white print:text-gray-900"> Amount Due </td><td class="${ssrRenderClass([unref(netDue) < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400", "py-3 text-lg font-bold text-right print:text-gray-900"])}"> \u20B1${ssrInterpolate(unref(netDue).toLocaleString())}</td></tr></tbody></table>`);
      if (unref(netDue) < 0 && unref(isPartner)) {
        _push(`<div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"><div class="flex items-start">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-check-circle",
          class: "h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0"
        }, null, _parent));
        _push(`<p class="text-sm text-green-700 dark:text-green-300"><strong>Good news!</strong> ${ssrInterpolate(unref(orgName))} owes you \u20B1${ssrInterpolate(Math.abs(unref(netDue)).toLocaleString())}. No payment is required from you. </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-8 text-center print:hidden"><div class="space-y-2"><p class="text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate((((_e = unref(partnerBookings)) == null ? void 0 : _e.length) || 0) + (((_f = unref(orgBookings)) == null ? void 0 : _f.length) || 0))} bookings, ${ssrInterpolate(((_h = (_g = unref(invoice)) == null ? void 0 : _g.expenses) == null ? void 0 : _h.length) || 0)} expenses </p><div class="flex justify-center">`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: printInvoice,
        color: "primary",
        size: "lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-printer",
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Print Invoice `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-printer",
                class: "mr-2"
              }),
              createTextVNode(" Print Invoice ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PartnerInvoice.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=PartnerInvoice-DdYfClyQ.mjs.map
