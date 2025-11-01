import { L as __nuxt_component_2, e as __nuxt_component_1$1, f as __nuxt_component_0$2, g as __nuxt_component_0, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_6 } from './Dropdown-rKaqrBy2.mjs';
import { _ as __nuxt_component_5$1 } from './Badge-hg3kqqXA.mjs';
import { _ as __nuxt_component_6$1 } from './Table-BHqVm27V.mjs';
import { _ as __nuxt_component_7 } from './Pagination-BuSSqpy3.mjs';
import { _ as __nuxt_component_8 } from './Checkbox-CvybKiXl.mjs';
import { _ as __nuxt_component_6$2 } from './Input-CkIGuQjB.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, unref, createVNode, toDisplayString, isRef, createTextVNode, createBlock, openBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
import { u as useInvoiceWorkflow } from './useInvoiceWorkflow-CqbO3mO3.mjs';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
import { u as useConfirm } from './useConfirm-E6nJ9sX9.mjs';
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
import './use-resolve-button-type-CgmJ7gVL.mjs';
import './usePopper-DZihrI_3.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "InvoiceDraftModal",
  __ssrInlineRender: true,
  emits: ["close", "created"],
  setup(__props, { emit: __emit }) {
    const { createDraftInvoice } = useApi();
    const { partners, loadPartners } = useGlobalCache();
    const creating = ref(false);
    const now = /* @__PURE__ */ new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString();
    const form = ref({
      partner_id: "",
      year: currentYear,
      month: currentMonth,
      useCustomDates: false,
      start_date: "",
      end_date: ""
    });
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return partners.value.map((partner) => ({
        label: partner.name,
        value: partner.id
      }));
    });
    const getPartnerName = (partnerId) => {
      if (!Array.isArray(partners.value)) return "Unknown";
      const partner = partners.value.find((p) => p.id === partnerId);
      return (partner == null ? void 0 : partner.name) || "Unknown";
    };
    const yearOptions = computed(() => {
      const years = [];
      const currentYear2 = (/* @__PURE__ */ new Date()).getFullYear();
      for (let i = currentYear2 - 5; i <= currentYear2 + 2; i++) {
        years.push({ label: i.toString(), value: i.toString() });
      }
      return years.reverse();
    });
    const monthOptions = computed(() => {
      const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" }
      ];
      return months;
    });
    const getDisplayPeriod = () => {
      var _a;
      if (form.value.useCustomDates && form.value.start_date && form.value.end_date) {
        const start = new Date(form.value.start_date).toLocaleDateString();
        const end = new Date(form.value.end_date).toLocaleDateString();
        return `${start} - ${end}`;
      } else if (form.value.year && form.value.month) {
        const monthName = ((_a = monthOptions.value.find((m) => m.value === form.value.month)) == null ? void 0 : _a.label) || "";
        return `${monthName} ${form.value.year}`;
      }
      return "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelect = __nuxt_component_5;
      const _component_UCheckbox = __nuxt_component_8;
      const _component_UInput = __nuxt_component_6$2;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-2xl mx-auto" }, _attrs))}><h3 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white"> Create Draft Invoice </h3><form class="space-y-6"><div><label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"> Partner </label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).partner_id,
        "onUpdate:modelValue": ($event) => unref(form).partner_id = $event,
        options: unref(partnerOptions),
        placeholder: "Select Partner",
        required: ""
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"> Year </label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).year,
        "onUpdate:modelValue": ($event) => unref(form).year = $event,
        options: unref(yearOptions),
        required: ""
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"> Month </label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).month,
        "onUpdate:modelValue": ($event) => unref(form).month = $event,
        options: unref(monthOptions),
        required: ""
      }, null, _parent));
      _push(`</div></div><div><div class="flex items-center space-x-3">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(form).useCustomDates,
        "onUpdate:modelValue": ($event) => unref(form).useCustomDates = $event
      }, null, _parent));
      _push(`<label class="text-sm text-gray-700 dark:text-gray-300"> Use custom date range instead </label></div></div>`);
      if (unref(form).useCustomDates) {
        _push(`<div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"> Start Date </label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).start_date,
          "onUpdate:modelValue": ($event) => unref(form).start_date = $event,
          type: "date",
          required: unref(form).useCustomDates
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"> End Date </label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).end_date,
          "onUpdate:modelValue": ($event) => unref(form).end_date = $event,
          type: "date",
          required: unref(form).useCustomDates
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).partner_id && (unref(form).year && unref(form).month || unref(form).useCustomDates && unref(form).start_date && unref(form).end_date)) {
        _push(`<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"><h4 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2"> Draft Invoice Preview </h4><div class="text-sm text-blue-700 dark:text-blue-300 space-y-1"><p><strong>Partner:</strong> ${ssrInterpolate(getPartnerName(unref(form).partner_id))}</p><p><strong>Period:</strong> ${ssrInterpolate(getDisplayPeriod())}</p><p class="text-xs text-blue-600 dark:text-blue-400 mt-2"> This will create a draft invoice that you can review and edit before finalizing. </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-end gap-4 pt-4">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "button",
        onClick: ($event) => _ctx.$emit("close"),
        variant: "ghost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        loading: unref(creating),
        color: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(creating) ? "Creating Draft..." : "Create Draft Invoice")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(creating) ? "Creating Draft..." : "Create Draft Invoice"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InvoiceDraftModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { getInvoices, getArchivedInvoices, settleInvoice, deleteInvoice, cancelInvoice, refreshInvoice, approveInvoice, finalizeInvoice, sendInvoice } = useApi();
    const { partners, loadPartners } = useGlobalCache();
    const { getInvoiceActions, getStatusText, getStatusColor, validateTransition } = useInvoiceWorkflow();
    const { user } = useAuth();
    const isPartnerUser = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.role) === "partner";
    });
    const invoices = ref([]);
    const isLoading = ref(false);
    const filterStatus = ref("all");
    const filterPartner = ref("all");
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const totalItems = ref(0);
    const showArchive = ref(false);
    const archivedCount = ref(0);
    const showDraftModal = ref(false);
    const statusOptions = computed(() => {
      if (showArchive.value) {
        return [
          { label: "All Cancelled", value: "all" }
        ];
      }
      return [
        { label: "All Status", value: "all" },
        { label: "Draft", value: "draft" },
        { label: "Finalized", value: "finalized" },
        { label: "Sent", value: "sent" },
        { label: "Paid", value: "paid" }
      ];
    });
    const partnerOptions = computed(() => {
      const options = [{ label: "All Partners", value: "all" }];
      if (Array.isArray(partners.value)) {
        options.push(...partners.value.map((p) => ({ label: p.name, value: p.id })));
      }
      return options;
    });
    const invoiceColumns = [
      { key: "invoice_number", label: "Invoice / Partner" },
      { key: "period", label: "Period" },
      { key: "amount", label: "Amount" },
      { key: "status", label: "Status" },
      { key: "generated_at", label: "Generated" },
      { key: "actions", label: "" }
    ];
    const filteredInvoices = computed(() => {
      return Array.isArray(invoices.value) ? invoices.value : [];
    });
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
    const pendingCount = computed(
      () => Array.isArray(invoices.value) ? invoices.value.filter((invoice) => invoice.status === "pending").length : 0
    );
    const paidCount = computed(
      () => Array.isArray(invoices.value) ? invoices.value.filter((invoice) => invoice.status === "paid").length : 0
    );
    const executeInvoiceAction = async (invoice, action) => {
      const { notifySuccess, notifyError } = useNotify();
      const validation = validateTransition(invoice, action);
      if (!validation.valid) {
        notifyError(validation.error || "Invalid action");
        return;
      }
      try {
        switch (action) {
          case "refresh":
            await refreshInvoice(invoice.id);
            notifySuccess("Invoice data refreshed successfully");
            break;
          case "approve":
            await approveInvoice(invoice.id);
            notifySuccess("Invoice approved successfully");
            break;
          case "finalize":
            const { confirm } = useConfirm();
            const confirmed = await confirm(`Finalize Invoice ${invoice.invoice_number}?

This will lock the invoice and prevent further edits.`, {
              title: "Finalize Invoice",
              confirmText: "Finalize",
              confirmColor: "primary"
            });
            if (!confirmed) return;
            await finalizeInvoice(invoice.id);
            notifySuccess("Invoice finalized successfully");
            break;
          case "send":
            await sendInvoice(invoice.id);
            notifySuccess("Invoice marked as sent");
            break;
          case "settle":
            await settleInvoice(invoice.id, (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
            notifySuccess("Invoice marked as paid successfully");
            break;
          default:
            notifyError("Unknown action");
            return;
        }
        await loadInvoices();
      } catch (error) {
        const errorMessage = error.message || `Failed to ${action} invoice`;
        notifyError(errorMessage);
      }
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
    const getInvoiceActionsForDropdown = (invoice) => {
      const amount = parseFloat(invoice.total_amount || 0);
      if (isPartnerUser.value && (amount === 0 || !invoice.total_amount)) {
        return [
          [{
            label: "View",
            icon: "i-heroicons-eye",
            click: () => viewInvoice(invoice)
          }]
        ];
      }
      const actions = [
        [{
          label: "View Invoice",
          icon: "i-heroicons-eye",
          click: () => viewInvoice(invoice)
        }]
      ];
      const workflowActions = getInvoiceActions(invoice);
      if (workflowActions.length > 0) {
        const actionItems = workflowActions.map((action) => ({
          label: action.label,
          icon: action.icon,
          click: () => executeInvoiceAction(invoice, action.action)
        }));
        actions.push(actionItems);
      }
      if (invoice.status === "draft" && !isPartnerUser.value) {
        actions.push([{
          label: "Delete Draft",
          icon: "i-heroicons-trash",
          click: () => deleteInvoiceAction(invoice)
        }]);
      }
      return actions;
    };
    const viewInvoice = (invoice) => {
      navigateTo(`/accounting/invoices/${invoice.id}`);
    };
    const deleteInvoiceAction = async (invoice) => {
      const { notifySuccess, notifyError } = useNotify();
      const { confirm } = useConfirm();
      const confirmed = await confirm(`Cancel Invoice ${invoice.invoice_number}?

This will:
\u2022 Mark the invoice as cancelled
\u2022 Move it to the archive
\u2022 Preserve audit trail

This action can be undone by regenerating the invoice.`, {
        title: "Cancel Invoice",
        confirmText: "Cancel Invoice",
        confirmColor: "red"
      });
      if (!confirmed) return;
      try {
        await deleteInvoice(invoice.id);
        if (showArchive.value) {
          await loadInvoices();
        } else {
          await Promise.all([
            loadInvoices(),
            loadArchivedCount()
          ]);
        }
        notifySuccess("Invoice cancelled and moved to archive");
      } catch (error) {
        notifyError("Failed to cancel invoice");
      }
    };
    const loadInvoices = async () => {
      var _a;
      try {
        isLoading.value = true;
        const filters = {
          ...filterStatus.value !== "all" && { status: filterStatus.value },
          ...filterPartner.value !== "all" && { partner_id: filterPartner.value },
          page: currentPage.value,
          limit: itemsPerPage.value
        };
        const result = showArchive.value ? await getArchivedInvoices(filters) : await getInvoices(filters);
        if (result && result.success && result.data) {
          if (result.data.items) {
            invoices.value = result.data.items;
            totalItems.value = ((_a = result.data.pagination) == null ? void 0 : _a.total) || result.data.items.length;
          } else if (Array.isArray(result.data)) {
            invoices.value = result.data;
            totalItems.value = result.data.length;
          } else {
            invoices.value = [];
            totalItems.value = 0;
          }
        } else {
          invoices.value = [];
          totalItems.value = 0;
        }
      } catch (error) {
        invoices.value = [];
        totalItems.value = 0;
        const { notifyError } = useNotify();
        notifyError("Failed to load invoices");
      } finally {
        isLoading.value = false;
      }
    };
    const loadArchivedCount = async () => {
      var _a;
      try {
        const result = await getArchivedInvoices();
        archivedCount.value = ((_a = result.items) == null ? void 0 : _a.length) || (Array.isArray(result) ? result.length : 0);
      } catch (error) {
        archivedCount.value = 0;
      }
    };
    const switchToActive = () => {
      showArchive.value = false;
      filterStatus.value = "all";
      currentPage.value = 1;
      loadInvoices();
    };
    const switchToArchive = () => {
      showArchive.value = true;
      filterStatus.value = "all";
      currentPage.value = 1;
      loadInvoices();
    };
    const onPageChange = (page) => {
      currentPage.value = page;
      loadInvoices();
    };
    const onFilterChange = () => {
      currentPage.value = 1;
      loadInvoices();
    };
    const handleDraftCreated = (invoice) => {
      var _a;
      showDraftModal.value = false;
      const { notifySuccess } = useNotify();
      if (invoice == null ? void 0 : invoice.id) {
        notifySuccess(`Draft invoice created: ${invoice.invoice_number || invoice.id}`);
        navigateTo(`/accounting/invoices/${invoice.id}`);
      } else if ((_a = invoice == null ? void 0 : invoice.data) == null ? void 0 : _a.id) {
        notifySuccess(`Draft invoice created: ${invoice.data.invoice_number || invoice.data.id}`);
        navigateTo(`/accounting/invoices/${invoice.data.id}`);
      } else {
        const { notifyError } = useNotify();
        notifyError("Draft created but could not navigate to invoice. Check the invoices list.");
        loadInvoices();
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      const _component_USelect = __nuxt_component_5;
      const _component_UDropdown = __nuxt_component_6;
      const _component_UBadge = __nuxt_component_5$1;
      const _component_UTable = __nuxt_component_6$1;
      const _component_UPagination = __nuxt_component_7;
      const _component_UModal = __nuxt_component_0;
      const _component_InvoiceDraftModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3 sm:space-y-6" }, _attrs))}><div class="space-y-3"><div class="flex justify-between items-start gap-3"><div class="min-w-0 flex-1"><h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Invoices</h1><p class="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Manage partner invoices and settlements</p></div></div></div><div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">`);
      _push(ssrRenderComponent(_component_UCard, { class: "p-3 sm:p-4" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-document-text",
              class: "h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-2 sm:ml-4 min-w-0 flex-1"${_scopeId}><p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Total</p><p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(((_a = unref(invoices)) == null ? void 0 : _a.length) || 0)}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-document-text",
                    class: "h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400"
                  })
                ]),
                createVNode("div", { class: "ml-2 sm:ml-4 min-w-0 flex-1" }, [
                  createVNode("p", { class: "text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400" }, "Total"),
                  createVNode("p", { class: "text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate" }, toDisplayString(((_b = unref(invoices)) == null ? void 0 : _b.length) || 0), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { class: "p-3 sm:p-4" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-clock",
              class: "h-4 w-4 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-2 sm:ml-4 min-w-0 flex-1"${_scopeId}><p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Pending</p><p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(unref(pendingCount))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-2 sm:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-clock",
                    class: "h-4 w-4 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400"
                  })
                ]),
                createVNode("div", { class: "ml-2 sm:ml-4 min-w-0 flex-1" }, [
                  createVNode("p", { class: "text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400" }, "Pending"),
                  createVNode("p", { class: "text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate" }, toDisplayString(unref(pendingCount)), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { class: "p-3 sm:p-4 col-span-2 sm:col-span-1" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-check-circle",
              class: "h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-2 sm:ml-4 min-w-0 flex-1"${_scopeId}><p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Paid</p><p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(unref(paidCount))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-check-circle",
                    class: "h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400"
                  })
                ]),
                createVNode("div", { class: "ml-2 sm:ml-4 min-w-0 flex-1" }, [
                  createVNode("p", { class: "text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400" }, "Paid"),
                  createVNode("p", { class: "text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate" }, toDisplayString(unref(paidCount)), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center"${_scopeId}><div class="flex items-center space-x-4"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Invoices</h3>`);
            if (!unref(isPartnerUser)) {
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: ($event) => showDraftModal.value = true,
                color: "primary",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-plus",
                      class: "mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(` Create Draft `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-plus",
                        class: "mr-1"
                      }),
                      createTextVNode(" Create Draft ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (!unref(isPartnerUser)) {
              _push2(`<div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1"${_scopeId}><button class="${ssrRenderClass([
                "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                !unref(showArchive) ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              ])}"${_scopeId}> Active </button><button class="${ssrRenderClass([
                "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                unref(showArchive) ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              ])}"${_scopeId}> Archive ${ssrInterpolate(unref(archivedCount) > 0 ? `(${unref(archivedCount)})` : "")}</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center" }, [
                createVNode("div", { class: "flex items-center space-x-4" }, [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Invoices"),
                  !unref(isPartnerUser) ? (openBlock(), createBlock(_component_UButton, {
                    key: 0,
                    onClick: ($event) => showDraftModal.value = true,
                    color: "primary",
                    size: "sm"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-plus",
                        class: "mr-1"
                      }),
                      createTextVNode(" Create Draft ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : createCommentVNode("", true),
                  !unref(isPartnerUser) ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
                  }, [
                    createVNode("button", {
                      onClick: switchToActive,
                      class: [
                        "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                        !unref(showArchive) ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      ]
                    }, " Active ", 2),
                    createVNode("button", {
                      onClick: switchToArchive,
                      class: [
                        "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                        unref(showArchive) ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      ]
                    }, " Archive " + toDisplayString(unref(archivedCount) > 0 ? `(${unref(archivedCount)})` : ""), 3)
                  ])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(filterStatus),
              "onUpdate:modelValue": ($event) => isRef(filterStatus) ? filterStatus.value = $event : null,
              options: unref(statusOptions),
              class: "flex-1 sm:w-40",
              size: "sm",
              onChange: onFilterChange
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(filterPartner),
              "onUpdate:modelValue": ($event) => isRef(filterPartner) ? filterPartner.value = $event : null,
              options: unref(partnerOptions),
              class: "flex-1 sm:w-48",
              size: "sm",
              onChange: onFilterChange
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(isLoading)) {
              _push2(`<div class="flex justify-center py-8"${_scopeId}><div class="text-gray-500"${_scopeId}>Loading invoices...</div></div>`);
            } else {
              _push2(`<div${_scopeId}>`);
              if (unref(filteredInvoices).length) {
                _push2(`<div class="sm:hidden space-y-3"${_scopeId}><!--[-->`);
                ssrRenderList(unref(filteredInvoices), (invoice) => {
                  _push2(ssrRenderComponent(_component_UCard, {
                    key: invoice.id,
                    class: "p-4"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="space-y-3"${_scopeId2}><div class="flex justify-between items-start"${_scopeId2}><div class="min-w-0 flex-1"${_scopeId2}><h3 class="font-medium text-gray-900 dark:text-white truncate"${_scopeId2}>${ssrInterpolate(invoice.invoice_number)}</h3><p class="text-sm text-gray-500 dark:text-gray-400 truncate"${_scopeId2}>${ssrInterpolate(invoice.partner_name)}</p></div>`);
                        if (unref(isPartnerUser)) {
                          _push3(`<div${_scopeId2}>`);
                          _push3(ssrRenderComponent(_component_UButton, {
                            onClick: ($event) => viewInvoice(invoice),
                            color: "primary",
                            variant: "soft",
                            size: "xs"
                          }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(ssrRenderComponent(_component_UIcon, {
                                  name: "i-heroicons-eye",
                                  class: "mr-1"
                                }, null, _parent4, _scopeId3));
                                _push4(` View `);
                              } else {
                                return [
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-eye",
                                    class: "mr-1"
                                  }),
                                  createTextVNode(" View ")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                          _push3(`</div>`);
                        } else {
                          _push3(ssrRenderComponent(_component_UDropdown, {
                            items: getInvoiceActionsForDropdown(invoice)
                          }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(ssrRenderComponent(_component_UButton, {
                                  color: "gray",
                                  variant: "ghost",
                                  icon: "i-heroicons-ellipsis-horizontal",
                                  size: "xs"
                                }, null, _parent4, _scopeId3));
                              } else {
                                return [
                                  createVNode(_component_UButton, {
                                    color: "gray",
                                    variant: "ghost",
                                    icon: "i-heroicons-ellipsis-horizontal",
                                    size: "xs"
                                  })
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                        }
                        _push3(`</div><div class="grid grid-cols-2 gap-3 text-sm"${_scopeId2}><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Period:</span><p class="font-medium"${_scopeId2}>${ssrInterpolate(invoice.period)}</p></div><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Amount:</span>`);
                        if (!invoice.total_amount || parseFloat(invoice.total_amount) === 0) {
                          _push3(`<p class="font-medium text-gray-400 dark:text-gray-500"${_scopeId2}>\u2014</p>`);
                        } else {
                          _push3(`<p class="font-medium text-red-600 dark:text-red-400"${_scopeId2}>\u20B1${ssrInterpolate(parseFloat(invoice.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 }))}</p>`);
                        }
                        _push3(`</div><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Status:</span>`);
                        _push3(ssrRenderComponent(_component_UBadge, {
                          color: unref(getStatusColor)(invoice.status),
                          size: "xs",
                          class: "ml-1"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(unref(getStatusText)(invoice.status))}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(getStatusText)(invoice.status)), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Generated:</span><p class="font-medium"${_scopeId2}>${ssrInterpolate(formatDate(invoice.generated_at))}</p></div></div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "space-y-3" }, [
                            createVNode("div", { class: "flex justify-between items-start" }, [
                              createVNode("div", { class: "min-w-0 flex-1" }, [
                                createVNode("h3", { class: "font-medium text-gray-900 dark:text-white truncate" }, toDisplayString(invoice.invoice_number), 1),
                                createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 truncate" }, toDisplayString(invoice.partner_name), 1)
                              ]),
                              unref(isPartnerUser) ? (openBlock(), createBlock("div", { key: 0 }, [
                                createVNode(_component_UButton, {
                                  onClick: ($event) => viewInvoice(invoice),
                                  color: "primary",
                                  variant: "soft",
                                  size: "xs"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_UIcon, {
                                      name: "i-heroicons-eye",
                                      class: "mr-1"
                                    }),
                                    createTextVNode(" View ")
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"])
                              ])) : (openBlock(), createBlock(_component_UDropdown, {
                                key: 1,
                                items: getInvoiceActionsForDropdown(invoice)
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UButton, {
                                    color: "gray",
                                    variant: "ghost",
                                    icon: "i-heroicons-ellipsis-horizontal",
                                    size: "xs"
                                  })
                                ]),
                                _: 2
                              }, 1032, ["items"]))
                            ]),
                            createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Period:"),
                                createVNode("p", { class: "font-medium" }, toDisplayString(invoice.period), 1)
                              ]),
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Amount:"),
                                !invoice.total_amount || parseFloat(invoice.total_amount) === 0 ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "font-medium text-gray-400 dark:text-gray-500"
                                }, "\u2014")) : (openBlock(), createBlock("p", {
                                  key: 1,
                                  class: "font-medium text-red-600 dark:text-red-400"
                                }, "\u20B1" + toDisplayString(parseFloat(invoice.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })), 1))
                              ]),
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Status:"),
                                createVNode(_component_UBadge, {
                                  color: unref(getStatusColor)(invoice.status),
                                  size: "xs",
                                  class: "ml-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(unref(getStatusText)(invoice.status)), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"])
                              ]),
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Generated:"),
                                createVNode("p", { class: "font-medium" }, toDisplayString(formatDate(invoice.generated_at)), 1)
                              ])
                            ])
                          ])
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
              if (unref(filteredInvoices).length) {
                _push2(`<div class="hidden sm:block"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UTable, {
                  rows: unref(filteredInvoices),
                  columns: invoiceColumns
                }, {
                  "invoice_number-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div${_scopeId2}><div class="font-medium text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(row.invoice_number)}</div><div class="text-sm text-gray-500 dark:text-gray-400"${_scopeId2}>${ssrInterpolate(row.partner_name)}</div></div>`);
                    } else {
                      return [
                        createVNode("div", null, [
                          createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(row.invoice_number), 1),
                          createVNode("div", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(row.partner_name), 1)
                        ])
                      ];
                    }
                  }),
                  "period-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(row.period)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(row.period), 1)
                      ];
                    }
                  }),
                  "amount-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (!row.total_amount || parseFloat(row.total_amount) === 0) {
                        _push3(`<span class="text-gray-400 dark:text-gray-500"${_scopeId2}> \u2014 </span>`);
                      } else {
                        _push3(`<span class="font-semibold text-red-600 dark:text-red-400"${_scopeId2}> \u20B1${ssrInterpolate(parseFloat(row.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 }))}</span>`);
                      }
                    } else {
                      return [
                        !row.total_amount || parseFloat(row.total_amount) === 0 ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-gray-400 dark:text-gray-500"
                        }, " \u2014 ")) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: "font-semibold text-red-600 dark:text-red-400"
                        }, " \u20B1" + toDisplayString(parseFloat(row.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })), 1))
                      ];
                    }
                  }),
                  "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UBadge, {
                        color: unref(getStatusColor)(row.status),
                        size: "xs"
                      }, {
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(unref(getStatusText)(row.status))}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(unref(getStatusText)(row.status)), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UBadge, {
                          color: unref(getStatusColor)(row.status),
                          size: "xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(getStatusText)(row.status)), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ];
                    }
                  }),
                  "generated_at-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(formatDate(row.generated_at))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(formatDate(row.generated_at)), 1)
                      ];
                    }
                  }),
                  "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (unref(isPartnerUser)) {
                        _push3(`<div${_scopeId2}>`);
                        _push3(ssrRenderComponent(_component_UButton, {
                          onClick: ($event) => viewInvoice(row),
                          color: "primary",
                          variant: "soft",
                          size: "sm"
                        }, {
                          default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(ssrRenderComponent(_component_UIcon, {
                                name: "i-heroicons-eye",
                                class: "mr-1"
                              }, null, _parent4, _scopeId3));
                              _push4(` View `);
                            } else {
                              return [
                                createVNode(_component_UIcon, {
                                  name: "i-heroicons-eye",
                                  class: "mr-1"
                                }),
                                createTextVNode(" View ")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        _push3(ssrRenderComponent(_component_UDropdown, {
                          items: getInvoiceActionsForDropdown(row)
                        }, {
                          default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(ssrRenderComponent(_component_UButton, {
                                color: "gray",
                                variant: "ghost",
                                icon: "i-heroicons-ellipsis-horizontal",
                                size: "sm"
                              }, null, _parent4, _scopeId3));
                            } else {
                              return [
                                createVNode(_component_UButton, {
                                  color: "gray",
                                  variant: "ghost",
                                  icon: "i-heroicons-ellipsis-horizontal",
                                  size: "sm"
                                })
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      }
                    } else {
                      return [
                        unref(isPartnerUser) ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode(_component_UButton, {
                            onClick: ($event) => viewInvoice(row),
                            color: "primary",
                            variant: "soft",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-eye",
                                class: "mr-1"
                              }),
                              createTextVNode(" View ")
                            ]),
                            _: 2
                          }, 1032, ["onClick"])
                        ])) : (openBlock(), createBlock(_component_UDropdown, {
                          key: 1,
                          items: getInvoiceActionsForDropdown(row)
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UButton, {
                              color: "gray",
                              variant: "ghost",
                              icon: "i-heroicons-ellipsis-horizontal",
                              size: "sm"
                            })
                          ]),
                          _: 2
                        }, 1032, ["items"]))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(filteredInvoices).length && unref(totalPages) > 1) {
                _push2(`<div class="flex justify-center mt-6"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UPagination, {
                  modelValue: unref(currentPage),
                  "onUpdate:modelValue": [($event) => isRef(currentPage) ? currentPage.value = $event : null, onPageChange],
                  "page-count": unref(totalPages),
                  total: unref(totalItems),
                  "per-page": unref(itemsPerPage)
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else if (!unref(filteredInvoices).length && !unref(isLoading)) {
                _push2(`<div class="text-center py-12"${_scopeId}><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId}>No invoices yet</h3>`);
                if (((_a = unref(user)) == null ? void 0 : _a.role) === "partner") {
                  _push2(`<p class="text-gray-600 dark:text-gray-400 mb-6"${_scopeId}>No invoices have been generated for your properties yet. Please follow up with your property manager if you have any questions.</p>`);
                } else {
                  _push2(`<!--[--><p class="text-gray-600 dark:text-gray-400 mb-6"${_scopeId}>Generate your first invoice from the partners page</p>`);
                  _push2(ssrRenderComponent(_component_UButton, {
                    to: "/partners",
                    color: "primary"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Go to Partners`);
                      } else {
                        return [
                          createTextVNode("Go to Partners")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`<!--]-->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
          } else {
            return [
              createVNode("div", { class: "mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4" }, [
                createVNode(_component_USelect, {
                  modelValue: unref(filterStatus),
                  "onUpdate:modelValue": ($event) => isRef(filterStatus) ? filterStatus.value = $event : null,
                  options: unref(statusOptions),
                  class: "flex-1 sm:w-40",
                  size: "sm",
                  onChange: onFilterChange
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                createVNode(_component_USelect, {
                  modelValue: unref(filterPartner),
                  "onUpdate:modelValue": ($event) => isRef(filterPartner) ? filterPartner.value = $event : null,
                  options: unref(partnerOptions),
                  class: "flex-1 sm:w-48",
                  size: "sm",
                  onChange: onFilterChange
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              unref(isLoading) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex justify-center py-8"
              }, [
                createVNode("div", { class: "text-gray-500" }, "Loading invoices...")
              ])) : (openBlock(), createBlock("div", { key: 1 }, [
                unref(filteredInvoices).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "sm:hidden space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredInvoices), (invoice) => {
                    return openBlock(), createBlock(_component_UCard, {
                      key: invoice.id,
                      class: "p-4"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "space-y-3" }, [
                          createVNode("div", { class: "flex justify-between items-start" }, [
                            createVNode("div", { class: "min-w-0 flex-1" }, [
                              createVNode("h3", { class: "font-medium text-gray-900 dark:text-white truncate" }, toDisplayString(invoice.invoice_number), 1),
                              createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 truncate" }, toDisplayString(invoice.partner_name), 1)
                            ]),
                            unref(isPartnerUser) ? (openBlock(), createBlock("div", { key: 0 }, [
                              createVNode(_component_UButton, {
                                onClick: ($event) => viewInvoice(invoice),
                                color: "primary",
                                variant: "soft",
                                size: "xs"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-eye",
                                    class: "mr-1"
                                  }),
                                  createTextVNode(" View ")
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
                            ])) : (openBlock(), createBlock(_component_UDropdown, {
                              key: 1,
                              items: getInvoiceActionsForDropdown(invoice)
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UButton, {
                                  color: "gray",
                                  variant: "ghost",
                                  icon: "i-heroicons-ellipsis-horizontal",
                                  size: "xs"
                                })
                              ]),
                              _: 2
                            }, 1032, ["items"]))
                          ]),
                          createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Period:"),
                              createVNode("p", { class: "font-medium" }, toDisplayString(invoice.period), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Amount:"),
                              !invoice.total_amount || parseFloat(invoice.total_amount) === 0 ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "font-medium text-gray-400 dark:text-gray-500"
                              }, "\u2014")) : (openBlock(), createBlock("p", {
                                key: 1,
                                class: "font-medium text-red-600 dark:text-red-400"
                              }, "\u20B1" + toDisplayString(parseFloat(invoice.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })), 1))
                            ]),
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Status:"),
                              createVNode(_component_UBadge, {
                                color: unref(getStatusColor)(invoice.status),
                                size: "xs",
                                class: "ml-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(getStatusText)(invoice.status)), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Generated:"),
                              createVNode("p", { class: "font-medium" }, toDisplayString(formatDate(invoice.generated_at)), 1)
                            ])
                          ])
                        ])
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ])) : createCommentVNode("", true),
                unref(filteredInvoices).length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "hidden sm:block"
                }, [
                  createVNode(_component_UTable, {
                    rows: unref(filteredInvoices),
                    columns: invoiceColumns
                  }, {
                    "invoice_number-data": withCtx(({ row }) => [
                      createVNode("div", null, [
                        createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(row.invoice_number), 1),
                        createVNode("div", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(row.partner_name), 1)
                      ])
                    ]),
                    "period-data": withCtx(({ row }) => [
                      createTextVNode(toDisplayString(row.period), 1)
                    ]),
                    "amount-data": withCtx(({ row }) => [
                      !row.total_amount || parseFloat(row.total_amount) === 0 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-gray-400 dark:text-gray-500"
                      }, " \u2014 ")) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "font-semibold text-red-600 dark:text-red-400"
                      }, " \u20B1" + toDisplayString(parseFloat(row.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })), 1))
                    ]),
                    "status-data": withCtx(({ row }) => [
                      createVNode(_component_UBadge, {
                        color: unref(getStatusColor)(row.status),
                        size: "xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(getStatusText)(row.status)), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    "generated_at-data": withCtx(({ row }) => [
                      createTextVNode(toDisplayString(formatDate(row.generated_at)), 1)
                    ]),
                    "actions-data": withCtx(({ row }) => [
                      unref(isPartnerUser) ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode(_component_UButton, {
                          onClick: ($event) => viewInvoice(row),
                          color: "primary",
                          variant: "soft",
                          size: "sm"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-eye",
                              class: "mr-1"
                            }),
                            createTextVNode(" View ")
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ])) : (openBlock(), createBlock(_component_UDropdown, {
                        key: 1,
                        items: getInvoiceActionsForDropdown(row)
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            icon: "i-heroicons-ellipsis-horizontal",
                            size: "sm"
                          })
                        ]),
                        _: 2
                      }, 1032, ["items"]))
                    ]),
                    _: 2
                  }, 1032, ["rows"])
                ])) : createCommentVNode("", true),
                unref(filteredInvoices).length && unref(totalPages) > 1 ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "flex justify-center mt-6"
                }, [
                  createVNode(_component_UPagination, {
                    modelValue: unref(currentPage),
                    "onUpdate:modelValue": [($event) => isRef(currentPage) ? currentPage.value = $event : null, onPageChange],
                    "page-count": unref(totalPages),
                    total: unref(totalItems),
                    "per-page": unref(itemsPerPage)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "page-count", "total", "per-page"])
                ])) : !unref(filteredInvoices).length && !unref(isLoading) ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "text-center py-12"
                }, [
                  createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "No invoices yet"),
                  ((_b = unref(user)) == null ? void 0 : _b.role) === "partner" ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-gray-600 dark:text-gray-400 mb-6"
                  }, "No invoices have been generated for your properties yet. Please follow up with your property manager if you have any questions.")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("p", { class: "text-gray-600 dark:text-gray-400 mb-6" }, "Generate your first invoice from the partners page"),
                    createVNode(_component_UButton, {
                      to: "/partners",
                      color: "primary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Go to Partners")
                      ]),
                      _: 1
                    })
                  ], 64))
                ])) : createCommentVNode("", true)
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showDraftModal),
        "onUpdate:modelValue": ($event) => isRef(showDraftModal) ? showDraftModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_InvoiceDraftModal, {
              onClose: ($event) => showDraftModal.value = false,
              onCreated: handleDraftCreated
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_InvoiceDraftModal, {
                onClose: ($event) => showDraftModal.value = false,
                onCreated: handleDraftCreated
              }, null, 8, ["onClose"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/invoices/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-qPCTVcen.mjs.map
