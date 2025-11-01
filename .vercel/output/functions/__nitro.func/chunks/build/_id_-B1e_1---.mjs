import { d as useRoute, L as __nuxt_component_2, e as __nuxt_component_1$1, f as __nuxt_component_0$2, g as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_5 } from './Badge-hg3kqqXA.mjs';
import { _ as _sfc_main$1 } from './PartnerInvoice-DdYfClyQ.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { defineComponent, computed, ref, unref, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
import { u as useConfirm } from './useConfirm-E6nJ9sX9.mjs';
import { u as useInvoiceWorkflow } from './useInvoiceWorkflow-CqbO3mO3.mjs';
import { u as useDateFormat } from './useDateFormat-COE5x7qz.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'pinia';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './useFormGroup-B3564yef.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { user, organization } = useAuth();
    const { getInvoiceById, refreshInvoice, approveInvoice, rejectInvoice, finalizeInvoice, sendInvoice: sendInvoiceAPI, settleInvoice } = useApi();
    const { notifyError, notifySuccess } = useNotify();
    const { confirm } = useConfirm();
    const { getInvoiceActions, getStatusText, getStatusColor, validateTransition } = useInvoiceWorkflow();
    const orgName = computed(() => {
      var _a;
      return ((_a = organization.value) == null ? void 0 : _a.name) || "Organization";
    });
    const invoiceData = ref(null);
    const isLoading = ref(true);
    const loading = ref(false);
    const error = ref("");
    const showSettleModal = ref(false);
    const showRejectModal = ref(false);
    const rejectNotes = ref("");
    const paidDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const isPartner = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.role) === "partner";
    });
    const availableActions = computed(() => {
      return invoiceData.value ? getInvoiceActions(invoiceData.value) : [];
    });
    const loadInvoice = async () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      try {
        isLoading.value = true;
        const response = await getInvoiceById(route.params.id);
        const invoice = response.data;
        invoiceData.value = {
          id: invoice.id,
          status: invoice.status || "draft",
          invoice_number: invoice.invoice_number || "Draft Invoice",
          partnerName: invoice.partner_name || "Unknown Partner",
          period: invoice.period || "Unknown Period",
          orgSharePercentage: parseFloat(invoice.org_share_percentage) || 0,
          rejection_notes: invoice.rejection_notes,
          rejected_at: invoice.rejected_at,
          summary: {
            total_gross_earnings: parseFloat(((_a = invoice.summary) == null ? void 0 : _a.total_gross_earnings) || 0),
            org_share: parseFloat(((_b = invoice.summary) == null ? void 0 : _b.org_share) || 0),
            total_expenses: parseFloat(((_c = invoice.summary) == null ? void 0 : _c.total_expenses) || 0),
            total_received_by_org: parseFloat(((_d = invoice.summary) == null ? void 0 : _d.total_received_by_org) || 0),
            net_journal_entries: parseFloat(((_e = invoice.summary) == null ? void 0 : _e.net_journal_entries) || 0),
            net_due: parseFloat(((_f = invoice.summary) == null ? void 0 : _f.net_due) || 0)
          },
          bookings: ((_g = invoice.bookings) == null ? void 0 : _g.length) ? invoice.bookings.map((booking) => ({
            date: booking.date || "",
            endDate: booking.end_date || "",
            guestName: booking.guest_name || "Unknown Guest",
            unitName: booking.unit_name || "Unknown Unit",
            source: booking.booking_source_name || "Unknown Source",
            baseAmount: parseFloat(booking.base_amount) || 0,
            addons: parseFloat(booking.addons_total) || 0,
            total: parseFloat(booking.total_amount) || 0,
            paymentReceivedBy: booking.payment_received_by || "partner",
            actualAmountReceived: parseFloat(booking.total_amount) || 0,
            bookingStatus: booking.booking_status || "confirmed"
          })) : [],
          expenses: ((_h = invoice.expenses) == null ? void 0 : _h.length) ? invoice.expenses.map((expense) => ({
            date: expense.date || "",
            unitName: expense.unit_name || "Unknown Unit",
            type: expense.type || "other",
            notes: expense.notes || "",
            amount: parseFloat(expense.amount) || 0
          })) : [],
          journalEntries: ((_i = invoice.journal_entries) == null ? void 0 : _i.map((entry) => ({
            date: entry.date || "",
            type: entry.type || "debit",
            description: entry.description || "",
            reference: entry.reference || "",
            notes: entry.notes || "",
            amount: parseFloat(entry.amount) || 0
          }))) || []
        };
      } catch (err) {
        error.value = "Failed to load invoice details";
        notifyError("Failed to load invoice");
      } finally {
        isLoading.value = false;
      }
    };
    const handleAction = async (action) => {
      const validation = validateTransition(invoiceData.value, action.action);
      if (!validation.valid) {
        notifyError(validation.error || "Invalid action");
        return;
      }
      if (action.requiresConfirmation) {
        const confirmed = await confirm(action.confirmationMessage || `Are you sure you want to ${action.label.toLowerCase()}?`);
        if (!confirmed) return;
      }
      if (action.action === "settle") {
        showSettleModal.value = true;
        return;
      }
      if (action.action === "reject") {
        showRejectModal.value = true;
        return;
      }
      loading.value = true;
      try {
        switch (action.action) {
          case "refresh":
            await refreshInvoice(route.params.id);
            notifySuccess("Invoice data refreshed successfully");
            break;
          case "approve":
            await approveInvoice(route.params.id);
            notifySuccess("Invoice approved successfully");
            break;
          case "finalize":
            await finalizeInvoice(route.params.id);
            notifySuccess("Invoice finalized successfully");
            break;
          case "send":
            await sendInvoiceAPI(route.params.id);
            notifySuccess("Invoice marked as sent");
            break;
          case "reject":
            await rejectInvoice(route.params.id, rejectNotes.value);
            notifySuccess("Invoice rejected successfully");
            break;
          default:
            notifyError("Unknown action");
            return;
        }
        await loadInvoice();
      } catch (err) {
        const errorMessage = err.message || `Failed to ${action.label.toLowerCase()}`;
        notifyError(errorMessage);
      } finally {
        loading.value = false;
      }
    };
    const { formatDateTime } = useDateFormat();
    const confirmSettle = async () => {
      loading.value = true;
      try {
        await settleInvoice(route.params.id, paidDate.value);
        await loadInvoice();
        showSettleModal.value = false;
        notifySuccess("Invoice marked as paid successfully");
      } catch (err) {
        notifyError("Failed to mark invoice as paid");
      } finally {
        loading.value = false;
      }
    };
    const confirmReject = async () => {
      if (!rejectNotes.value.trim()) {
        notifyError("Please provide a reason for rejection");
        return;
      }
      loading.value = true;
      try {
        await rejectInvoice(route.params.id, rejectNotes.value);
        await loadInvoice();
        showRejectModal.value = false;
        rejectNotes.value = "";
        notifySuccess("Invoice rejected successfully");
      } catch (err) {
        notifyError("Failed to reject invoice");
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      const _component_UBadge = __nuxt_component_5;
      const _component_PartnerInvoice = _sfc_main$1;
      const _component_UModal = __nuxt_component_0;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_6;
      const _component_UTextarea = __nuxt_component_7;
      if (unref(isLoading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center py-12" }, _attrs))}><div class="text-gray-500">Loading invoice...</div></div>`);
      } else if (unref(error)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_UCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-center py-12"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-exclamation-triangle",
                class: "mx-auto h-12 w-12 text-red-400 mb-4"
              }, null, _parent2, _scopeId));
              _push2(`<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId}>Invoice Not Found</h3><p class="text-gray-600 dark:text-gray-400 mb-6"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/dashboard",
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Back to Dashboard`);
                  } else {
                    return [
                      createTextVNode("Back to Dashboard")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "text-center py-12" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "mx-auto h-12 w-12 text-red-400 mb-4"
                  }),
                  createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "Invoice Not Found"),
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400 mb-6" }, toDisplayString(unref(error)), 1),
                  createVNode(_component_UButton, {
                    to: "/dashboard",
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Back to Dashboard")
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(invoiceData)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="max-w-4xl mx-auto mb-3 sm:mb-6 px-3 sm:px-0">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
            if (_push2) {
              _push2(`<div class="sm:hidden mb-4"${_scopeId}><div class="flex items-center justify-between mb-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/accounting/invoices",
                variant: "ghost",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-arrow-left",
                      class: "mr-1 text-gray-600 dark:text-gray-400"
                    }, null, _parent3, _scopeId2));
                    _push3(` Back `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-arrow-left",
                        class: "mr-1 text-gray-600 dark:text-gray-400"
                      }),
                      createTextVNode(" Back ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UBadge, {
                color: unref(getStatusColor)(unref(invoiceData).status),
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(getStatusText)(unref(invoiceData).status || "draft"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(getStatusText)(unref(invoiceData).status || "draft")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              if (unref(availableActions).length) {
                _push2(`<div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
                ssrRenderList(unref(availableActions), (action) => {
                  _push2(ssrRenderComponent(_component_UButton, {
                    key: action.action,
                    onClick: ($event) => handleAction(action),
                    loading: unref(loading),
                    color: action.color,
                    size: "xs",
                    class: "flex-1 min-w-0"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, {
                          name: action.icon,
                          class: "mr-1"
                        }, null, _parent3, _scopeId2));
                        _push3(`<span class="truncate"${_scopeId2}>${ssrInterpolate(action.label)}</span>`);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: action.icon,
                            class: "mr-1"
                          }, null, 8, ["name"]),
                          createVNode("span", { class: "truncate" }, toDisplayString(action.label), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="hidden sm:flex justify-between items-center mb-4"${_scopeId}><div class="flex items-center space-x-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/accounting/invoices",
                variant: "ghost",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-arrow-left",
                      class: "mr-1 text-gray-600 dark:text-gray-400"
                    }, null, _parent3, _scopeId2));
                    _push3(` Back to Invoices `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-arrow-left",
                        class: "mr-1 text-gray-600 dark:text-gray-400"
                      }),
                      createTextVNode(" Back to Invoices ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UBadge, {
                color: unref(getStatusColor)(unref(invoiceData).status),
                size: "lg"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(getStatusText)(unref(invoiceData).status || "draft"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(getStatusText)(unref(invoiceData).status || "draft")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="flex space-x-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(availableActions), (action) => {
                _push2(ssrRenderComponent(_component_UButton, {
                  key: action.action,
                  onClick: ($event) => handleAction(action),
                  loading: unref(loading),
                  color: action.color,
                  size: "sm"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: action.icon,
                        class: "mr-1"
                      }, null, _parent3, _scopeId2));
                      _push3(` ${ssrInterpolate(action.label)}`);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: action.icon,
                          class: "mr-1"
                        }, null, 8, ["name"]),
                        createTextVNode(" " + toDisplayString(action.label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div><div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4"${_scopeId}><h3 class="font-semibold mb-3 text-sm sm:text-base"${_scopeId}>Invoice Summary</h3>`);
              if (unref(invoiceData).status === "draft" && !unref(isPartner)) {
                _push2(`<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4"${_scopeId}><div class="flex items-start"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-exclamation-triangle",
                  class: "h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0"
                }, null, _parent2, _scopeId));
                _push2(`<p class="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300"${_scopeId}> This is a draft invoice. Use &quot;Refresh Data&quot; to calculate the latest amounts. </p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(invoiceData).status === "rejected") {
                _push2(`<div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4"${_scopeId}><div class="flex items-start"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-x-circle",
                  class: "h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400 mr-2 mt-0.5 flex-shrink-0"
                }, null, _parent2, _scopeId));
                _push2(`<div class="flex-1"${_scopeId}><p class="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300 mb-1"${_scopeId}> Invoice Rejected </p><p class="text-xs sm:text-sm text-orange-700 dark:text-orange-300"${_scopeId}><strong${_scopeId}>Reason:</strong> ${ssrInterpolate(unref(invoiceData).rejection_notes || "No reason provided")}</p>`);
                if (unref(invoiceData).rejected_at) {
                  _push2(`<p class="text-xs text-orange-600 dark:text-orange-400 mt-1"${_scopeId}> Rejected on ${ssrInterpolate(unref(formatDateTime)(unref(invoiceData).rejected_at))}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="sm:hidden space-y-3"${_scopeId}><div class="flex justify-between items-center"${_scopeId}><span class="text-xs text-gray-600 dark:text-gray-400"${_scopeId}>Invoice:</span><div class="font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(invoiceData).invoice_number)}</div></div><div class="flex justify-between items-center"${_scopeId}><span class="text-xs text-gray-600 dark:text-gray-400"${_scopeId}>Partner:</span><div class="font-medium text-sm truncate ml-2"${_scopeId}>${ssrInterpolate(unref(invoiceData).partnerName)}</div></div><div class="flex justify-between items-center"${_scopeId}><span class="text-xs text-gray-600 dark:text-gray-400"${_scopeId}>Period:</span><div class="font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(invoiceData).period)}</div></div><div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700"${_scopeId}><span class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}> Amount Due: </span><div class="${ssrRenderClass([((_b = (_a = unref(invoiceData).summary) == null ? void 0 : _a.net_due) == null ? void 0 : _b.toString().startsWith("-")) ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400", "font-bold text-lg"])}" style="${ssrRenderStyle(((_d = (_c = unref(invoiceData).summary) == null ? void 0 : _c.net_due) == null ? void 0 : _d.toString().startsWith("-")) ? "color: red !important;" : "color: green !important;")}"${_scopeId}> \u20B1${ssrInterpolate(parseFloat(((_e = unref(invoiceData).summary) == null ? void 0 : _e.net_due) || 0).toLocaleString())} <small class="text-xs block"${_scopeId}>${ssrInterpolate((_f = unref(invoiceData).summary) == null ? void 0 : _f.net_due)}</small></div></div></div><div class="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"${_scopeId}><div${_scopeId}><span class="text-gray-600 dark:text-gray-400"${_scopeId}>Invoice Number:</span><div class="font-medium"${_scopeId}>${ssrInterpolate(unref(invoiceData).invoice_number)}</div></div><div${_scopeId}><span class="text-gray-600 dark:text-gray-400"${_scopeId}>Partner:</span><div class="font-medium"${_scopeId}>${ssrInterpolate(unref(invoiceData).partnerName)}</div></div><div${_scopeId}><span class="text-gray-600 dark:text-gray-400"${_scopeId}>Period:</span><div class="font-medium"${_scopeId}>${ssrInterpolate(unref(invoiceData).period)}</div></div><div${_scopeId}><span class="text-gray-600 dark:text-gray-400"${_scopeId}> Amount Due: </span><div class="${ssrRenderClass([(((_g = unref(invoiceData).summary) == null ? void 0 : _g.net_due) || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400", "font-bold text-lg"])}" style="${ssrRenderStyle((((_h = unref(invoiceData).summary) == null ? void 0 : _h.net_due) || 0) < 0 ? "color: red !important;" : "color: green !important;")}"${_scopeId}> \u20B1${ssrInterpolate(parseFloat(((_i = unref(invoiceData).summary) == null ? void 0 : _i.net_due) || 0).toLocaleString())}</div></div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "sm:hidden mb-4" }, [
                  createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                    createVNode(_component_UButton, {
                      to: "/accounting/invoices",
                      variant: "ghost",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-arrow-left",
                          class: "mr-1 text-gray-600 dark:text-gray-400"
                        }),
                        createTextVNode(" Back ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UBadge, {
                      color: unref(getStatusColor)(unref(invoiceData).status),
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(getStatusText)(unref(invoiceData).status || "draft")), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ]),
                  unref(availableActions).length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-wrap gap-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(availableActions), (action) => {
                      return openBlock(), createBlock(_component_UButton, {
                        key: action.action,
                        onClick: ($event) => handleAction(action),
                        loading: unref(loading),
                        color: action.color,
                        size: "xs",
                        class: "flex-1 min-w-0"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: action.icon,
                            class: "mr-1"
                          }, null, 8, ["name"]),
                          createVNode("span", { class: "truncate" }, toDisplayString(action.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick", "loading", "color"]);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "hidden sm:flex justify-between items-center mb-4" }, [
                  createVNode("div", { class: "flex items-center space-x-3" }, [
                    createVNode(_component_UButton, {
                      to: "/accounting/invoices",
                      variant: "ghost",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-arrow-left",
                          class: "mr-1 text-gray-600 dark:text-gray-400"
                        }),
                        createTextVNode(" Back to Invoices ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UBadge, {
                      color: unref(getStatusColor)(unref(invoiceData).status),
                      size: "lg"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(getStatusText)(unref(invoiceData).status || "draft")), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ]),
                  createVNode("div", { class: "flex space-x-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(availableActions), (action) => {
                      return openBlock(), createBlock(_component_UButton, {
                        key: action.action,
                        onClick: ($event) => handleAction(action),
                        loading: unref(loading),
                        color: action.color,
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: action.icon,
                            class: "mr-1"
                          }, null, 8, ["name"]),
                          createTextVNode(" " + toDisplayString(action.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick", "loading", "color"]);
                    }), 128))
                  ])
                ]),
                createVNode("div", { class: "bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4" }, [
                  createVNode("h3", { class: "font-semibold mb-3 text-sm sm:text-base" }, "Invoice Summary"),
                  unref(invoiceData).status === "draft" && !unref(isPartner) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4"
                  }, [
                    createVNode("div", { class: "flex items-start" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-exclamation-triangle",
                        class: "h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0"
                      }),
                      createVNode("p", { class: "text-xs sm:text-sm text-yellow-700 dark:text-yellow-300" }, ' This is a draft invoice. Use "Refresh Data" to calculate the latest amounts. ')
                    ])
                  ])) : createCommentVNode("", true),
                  unref(invoiceData).status === "rejected" ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4"
                  }, [
                    createVNode("div", { class: "flex items-start" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-x-circle",
                        class: "h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400 mr-2 mt-0.5 flex-shrink-0"
                      }),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("p", { class: "text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300 mb-1" }, " Invoice Rejected "),
                        createVNode("p", { class: "text-xs sm:text-sm text-orange-700 dark:text-orange-300" }, [
                          createVNode("strong", null, "Reason:"),
                          createTextVNode(" " + toDisplayString(unref(invoiceData).rejection_notes || "No reason provided"), 1)
                        ]),
                        unref(invoiceData).rejected_at ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-xs text-orange-600 dark:text-orange-400 mt-1"
                        }, " Rejected on " + toDisplayString(unref(formatDateTime)(unref(invoiceData).rejected_at)), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "sm:hidden space-y-3" }, [
                    createVNode("div", { class: "flex justify-between items-center" }, [
                      createVNode("span", { class: "text-xs text-gray-600 dark:text-gray-400" }, "Invoice:"),
                      createVNode("div", { class: "font-medium text-sm" }, toDisplayString(unref(invoiceData).invoice_number), 1)
                    ]),
                    createVNode("div", { class: "flex justify-between items-center" }, [
                      createVNode("span", { class: "text-xs text-gray-600 dark:text-gray-400" }, "Partner:"),
                      createVNode("div", { class: "font-medium text-sm truncate ml-2" }, toDisplayString(unref(invoiceData).partnerName), 1)
                    ]),
                    createVNode("div", { class: "flex justify-between items-center" }, [
                      createVNode("span", { class: "text-xs text-gray-600 dark:text-gray-400" }, "Period:"),
                      createVNode("div", { class: "font-medium text-sm" }, toDisplayString(unref(invoiceData).period), 1)
                    ]),
                    createVNode("div", { class: "flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700" }, [
                      createVNode("span", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, " Amount Due: "),
                      createVNode("div", {
                        class: ["font-bold text-lg", ((_k = (_j = unref(invoiceData).summary) == null ? void 0 : _j.net_due) == null ? void 0 : _k.toString().startsWith("-")) ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"],
                        style: ((_m = (_l = unref(invoiceData).summary) == null ? void 0 : _l.net_due) == null ? void 0 : _m.toString().startsWith("-")) ? "color: red !important;" : "color: green !important;"
                      }, [
                        createTextVNode(" \u20B1" + toDisplayString(parseFloat(((_n = unref(invoiceData).summary) == null ? void 0 : _n.net_due) || 0).toLocaleString()) + " ", 1),
                        createVNode("small", { class: "text-xs block" }, toDisplayString((_o = unref(invoiceData).summary) == null ? void 0 : _o.net_due), 1)
                      ], 6)
                    ])
                  ]),
                  createVNode("div", { class: "hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Invoice Number:"),
                      createVNode("div", { class: "font-medium" }, toDisplayString(unref(invoiceData).invoice_number), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Partner:"),
                      createVNode("div", { class: "font-medium" }, toDisplayString(unref(invoiceData).partnerName), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Period:"),
                      createVNode("div", { class: "font-medium" }, toDisplayString(unref(invoiceData).period), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, " Amount Due: "),
                      createVNode("div", {
                        class: ["font-bold text-lg", (((_p = unref(invoiceData).summary) == null ? void 0 : _p.net_due) || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"],
                        style: (((_q = unref(invoiceData).summary) == null ? void 0 : _q.net_due) || 0) < 0 ? "color: red !important;" : "color: green !important;"
                      }, " \u20B1" + toDisplayString(parseFloat(((_r = unref(invoiceData).summary) == null ? void 0 : _r.net_due) || 0).toLocaleString()), 7)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_PartnerInvoice, {
          invoice: unref(invoiceData),
          "org-name": unref(orgName)
        }, null, _parent));
        _push(ssrRenderComponent(_component_UModal, {
          modelValue: unref(showSettleModal),
          "onUpdate:modelValue": ($event) => isRef(showSettleModal) ? showSettleModal.value = $event : null
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UCard, null, {
                header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Mark Invoice as Paid</h3>`);
                  } else {
                    return [
                      createVNode("h3", { class: "text-lg font-semibold" }, "Mark Invoice as Paid")
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-4"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UFormGroup, {
                      label: "Payment Date",
                      name: "paidDate"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(paidDate),
                            "onUpdate:modelValue": ($event) => isRef(paidDate) ? paidDate.value = $event : null,
                            type: "date",
                            max: unref(today),
                            required: ""
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(paidDate),
                              "onUpdate:modelValue": ($event) => isRef(paidDate) ? paidDate.value = $event : null,
                              type: "date",
                              max: unref(today),
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "max"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex justify-end gap-3"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UButton, {
                      variant: "ghost",
                      onClick: ($event) => showSettleModal.value = false
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Cancel`);
                        } else {
                          return [
                            createTextVNode("Cancel")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UButton, {
                      onClick: confirmSettle,
                      loading: unref(loading),
                      color: "primary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Confirm Payment `);
                        } else {
                          return [
                            createTextVNode(" Confirm Payment ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode(_component_UFormGroup, {
                          label: "Payment Date",
                          name: "paidDate"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(paidDate),
                              "onUpdate:modelValue": ($event) => isRef(paidDate) ? paidDate.value = $event : null,
                              type: "date",
                              max: unref(today),
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "max"])
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "flex justify-end gap-3" }, [
                          createVNode(_component_UButton, {
                            variant: "ghost",
                            onClick: ($event) => showSettleModal.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            onClick: confirmSettle,
                            loading: unref(loading),
                            color: "primary"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Confirm Payment ")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UCard, null, {
                  header: withCtx(() => [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Mark Invoice as Paid")
                  ]),
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(_component_UFormGroup, {
                        label: "Payment Date",
                        name: "paidDate"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(paidDate),
                            "onUpdate:modelValue": ($event) => isRef(paidDate) ? paidDate.value = $event : null,
                            type: "date",
                            max: unref(today),
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "max"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-3" }, [
                        createVNode(_component_UButton, {
                          variant: "ghost",
                          onClick: ($event) => showSettleModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          onClick: confirmSettle,
                          loading: unref(loading),
                          color: "primary"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Confirm Payment ")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ])
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UModal, {
          modelValue: unref(showRejectModal),
          "onUpdate:modelValue": ($event) => isRef(showRejectModal) ? showRejectModal.value = $event : null
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UCard, null, {
                header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Reject Invoice</h3>`);
                  } else {
                    return [
                      createVNode("h3", { class: "text-lg font-semibold" }, "Reject Invoice")
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-4"${_scopeId2}><p class="text-gray-600 dark:text-gray-400"${_scopeId2}> Please provide a reason for rejecting this invoice. This will help the admin understand your concerns. </p>`);
                    _push3(ssrRenderComponent(_component_UFormGroup, {
                      label: "Rejection Notes",
                      name: "rejectNotes"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UTextarea, {
                            modelValue: unref(rejectNotes),
                            "onUpdate:modelValue": ($event) => isRef(rejectNotes) ? rejectNotes.value = $event : null,
                            placeholder: "Please explain why you're rejecting this invoice...",
                            rows: 4,
                            required: ""
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(rejectNotes),
                              "onUpdate:modelValue": ($event) => isRef(rejectNotes) ? rejectNotes.value = $event : null,
                              placeholder: "Please explain why you're rejecting this invoice...",
                              rows: 4,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex justify-end gap-3"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UButton, {
                      variant: "ghost",
                      onClick: ($event) => showRejectModal.value = false
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Cancel`);
                        } else {
                          return [
                            createTextVNode("Cancel")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UButton, {
                      onClick: confirmReject,
                      loading: unref(loading),
                      color: "red"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Reject Invoice `);
                        } else {
                          return [
                            createTextVNode(" Reject Invoice ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode("p", { class: "text-gray-600 dark:text-gray-400" }, " Please provide a reason for rejecting this invoice. This will help the admin understand your concerns. "),
                        createVNode(_component_UFormGroup, {
                          label: "Rejection Notes",
                          name: "rejectNotes"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(rejectNotes),
                              "onUpdate:modelValue": ($event) => isRef(rejectNotes) ? rejectNotes.value = $event : null,
                              placeholder: "Please explain why you're rejecting this invoice...",
                              rows: 4,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "flex justify-end gap-3" }, [
                          createVNode(_component_UButton, {
                            variant: "ghost",
                            onClick: ($event) => showRejectModal.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            onClick: confirmReject,
                            loading: unref(loading),
                            color: "red"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Reject Invoice ")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UCard, null, {
                  header: withCtx(() => [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Reject Invoice")
                  ]),
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("p", { class: "text-gray-600 dark:text-gray-400" }, " Please provide a reason for rejecting this invoice. This will help the admin understand your concerns. "),
                      createVNode(_component_UFormGroup, {
                        label: "Rejection Notes",
                        name: "rejectNotes"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(rejectNotes),
                            "onUpdate:modelValue": ($event) => isRef(rejectNotes) ? rejectNotes.value = $event : null,
                            placeholder: "Please explain why you're rejecting this invoice...",
                            rows: 4,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex justify-end gap-3" }, [
                        createVNode(_component_UButton, {
                          variant: "ghost",
                          onClick: ($event) => showRejectModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          onClick: confirmReject,
                          loading: unref(loading),
                          color: "red"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Reject Invoice ")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ])
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/invoices/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-B1e_1---.mjs.map
