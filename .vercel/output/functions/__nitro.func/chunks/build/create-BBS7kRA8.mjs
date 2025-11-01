import { b as useRouter, f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2 } from './server.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as _sfc_main$2 } from './DateInput-H5QDo9cM.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_6$1 } from './Toggle-DLYZoy61.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { _ as __nuxt_component_8 } from './Checkbox-CvybKiXl.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, unref, reactive, computed, watch, isRef, toDisplayString, createBlock, openBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { z } from 'zod';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
import { u as useBookingForm } from './useBookingForm-DT7T7j8X.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
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
import './form-DsUILy5F.mjs';
import './use-resolve-button-type-CgmJ7gVL.mjs';
import './api-BDnKztVE.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BookingForm",
  __ssrInlineRender: true,
  props: {
    loading: { type: Boolean }
  },
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const availableAddons = [
      { type: "early_checkin", label: "Early Check-In", amount: 300 },
      { type: "late_checkout", label: "Late Check-Out", amount: 300 },
      { type: "parking", label: "Parking Fee", amount: 200 }
    ];
    const bookingStatusOptions = [
      { label: "Confirmed", value: "confirmed" },
      { label: "Canceled", value: "canceled" },
      { label: "Refunded", value: "refunded" }
    ];
    const paymentStatusOptions = [
      { label: "Unpaid", value: "unpaid" },
      { label: "Partial", value: "partial" },
      { label: "Fully Paid", value: "fully_paid" }
    ];
    const schema = z.object({
      guestName: z.string().min(1, "Guest name is required"),
      bookingDate: z.string().min(1, "Booking date is required"),
      startDate: z.string().min(1, "Check-in date is required"),
      endDate: z.string().min(1, "Check-out date is required"),
      amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
      paymentMethod: z.string().min(1, "Payment method is required"),
      partner: z.string().min(1, "Partner is required"),
      unitId: z.string().min(1, "Unit is required"),
      bookingStatus: z.string().min(1, "Booking status is required"),
      paymentStatus: z.string().min(1, "Payment status is required"),
      amountPaid: z.coerce.number().min(0, "Amount paid must be 0 or greater"),
      paymentReceivedBy: z.enum(["partner", "metrobnb"]),
      payoutDate: z.string().optional(),
      bookingSourceId: z.string().min(1, "Booking source is required"),
      notes: z.string().max(100, "Notes must be 100 characters or less").optional()
    });
    const state = reactive({
      guestName: "",
      bookingDate: "",
      startDate: "",
      endDate: "",
      amount: 0,
      paymentMethod: "",
      partner: "",
      unitId: "",
      addons: [],
      bookingStatus: "confirmed",
      paymentStatus: "unpaid",
      amountPaid: 0,
      paymentReceivedBy: "partner",
      payoutDate: "",
      bookingSourceId: "",
      notes: ""
    });
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const bookingSources = ref([]);
    const paymentMethods = ref([]);
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value) || partners.value.length === 0) return [];
      return partners.value.map((p) => ({ label: p.name, value: p.id }));
    });
    const availableUnits = computed(() => {
      if (!state.partner || !Array.isArray(units.value) || units.value.length === 0) return [];
      return units.value.filter((unit) => unit && (unit.partnerId || unit.partner_id) === state.partner).map((unit) => ({ label: unit.name, value: unit.id }));
    });
    const paymentMethodOptions = computed(() => {
      if (!Array.isArray(paymentMethods.value)) return [];
      return paymentMethods.value.filter((method) => method.is_active).map((method) => ({ label: method.name, value: method.id }));
    });
    const bookingSourceOptions = computed(() => {
      if (!Array.isArray(bookingSources.value)) return [];
      return bookingSources.value.filter((source) => source.is_active).map((source) => ({
        label: `${source.name}${source.commission_rate ? ` (${source.commission_rate}%)` : ""}`,
        value: source.id
      }));
    });
    const props = __props;
    const emit = __emit;
    const loading = computed(() => props.loading || false);
    const isAddonSelected = (type) => {
      return state.addons.some((addon) => addon.type === type);
    };
    const toggleAddon = (addonConfig) => {
      const index = state.addons.findIndex((addon) => addon.type === addonConfig.type);
      if (index >= 0) {
        state.addons.splice(index, 1);
      } else {
        state.addons.push({ type: addonConfig.type, amount: addonConfig.amount });
      }
    };
    const selectedAddonsTotal = computed(
      () => state.addons.reduce((sum, addon) => sum + addon.amount, 0)
    );
    const totalAmount = computed(
      () => Number(state.amount || 0) + selectedAddonsTotal.value
    );
    const remainingBalance = computed(
      () => totalAmount.value - Number(state.amountPaid || 0)
    );
    const isMetroBNBPayment = computed({
      get: () => state.paymentReceivedBy === "metrobnb",
      set: (value) => {
        state.paymentReceivedBy = value ? "metrobnb" : "partner";
      }
    });
    watch(() => state.partner, () => {
      state.unitId = "";
    });
    const onSubmit = () => {
      emit("submit", { ...state });
      Object.assign(state, {
        guestName: "",
        bookingDate: "",
        startDate: "",
        endDate: "",
        amount: 0,
        paymentMethod: "",
        partner: "",
        unitId: "",
        addons: [],
        bookingStatus: "confirmed",
        paymentStatus: "unpaid",
        amountPaid: 0,
        paymentReceivedBy: "partner",
        payoutDate: "",
        bookingSourceId: "",
        notes: ""
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UForm = __nuxt_component_3;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_6;
      const _component_DateInput = _sfc_main$2;
      const _component_USelect = __nuxt_component_5;
      const _component_UToggle = __nuxt_component_6$1;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UCheckbox = __nuxt_component_8;
      const _component_UButton = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_UForm, mergeProps({
        schema: unref(schema),
        state: unref(state),
        onSubmit
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="border-b border-gray-200 dark:border-gray-700 pb-4"${_scopeId}><h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-user",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Guest &amp; Booking Details </h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Guest Name",
              name: "guestName"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(state).guestName,
                    "onUpdate:modelValue": ($event) => unref(state).guestName = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(state).guestName,
                      "onUpdate:modelValue": ($event) => unref(state).guestName = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Booking Date",
              name: "bookingDate"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DateInput, {
                    modelValue: unref(state).bookingDate,
                    "onUpdate:modelValue": ($event) => unref(state).bookingDate = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DateInput, {
                      modelValue: unref(state).bookingDate,
                      "onUpdate:modelValue": ($event) => unref(state).bookingDate = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Check-in Date",
              name: "startDate"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DateInput, {
                    modelValue: unref(state).startDate,
                    "onUpdate:modelValue": ($event) => unref(state).startDate = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DateInput, {
                      modelValue: unref(state).startDate,
                      "onUpdate:modelValue": ($event) => unref(state).startDate = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Check-out Date",
              name: "endDate"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DateInput, {
                    modelValue: unref(state).endDate,
                    "onUpdate:modelValue": ($event) => unref(state).endDate = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DateInput, {
                      modelValue: unref(state).endDate,
                      "onUpdate:modelValue": ($event) => unref(state).endDate = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="border-b border-gray-200 dark:border-gray-700 pb-4"${_scopeId}><h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-building-office",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Property &amp; Source </h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Partner",
              name: "partner"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(state).partner,
                    "onUpdate:modelValue": ($event) => unref(state).partner = $event,
                    options: unref(partnerOptions)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(state).partner,
                      "onUpdate:modelValue": ($event) => unref(state).partner = $event,
                      options: unref(partnerOptions)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Unit",
              name: "unitId"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(state).unitId,
                    "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                    options: unref(availableUnits),
                    disabled: !unref(state).partner,
                    placeholder: "Select a partner first"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(state).unitId,
                      "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                      options: unref(availableUnits),
                      disabled: !unref(state).partner,
                      placeholder: "Select a partner first"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Booking Source",
              name: "bookingSourceId"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(state).bookingSourceId,
                    "onUpdate:modelValue": ($event) => unref(state).bookingSourceId = $event,
                    options: unref(bookingSourceOptions)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(state).bookingSourceId,
                      "onUpdate:modelValue": ($event) => unref(state).bookingSourceId = $event,
                      options: unref(bookingSourceOptions)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Booking Status",
              name: "bookingStatus"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(state).bookingStatus,
                    "onUpdate:modelValue": ($event) => unref(state).bookingStatus = $event,
                    options: bookingStatusOptions
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(state).bookingStatus,
                      "onUpdate:modelValue": ($event) => unref(state).bookingStatus = $event,
                      options: bookingStatusOptions
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="border-b border-gray-200 dark:border-gray-700 pb-4"${_scopeId}><h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-credit-card",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Payment Details </h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Base Amount",
              name: "amount"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(state).amount,
                    "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                    type: "number",
                    step: "0.01"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(state).amount,
                      "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                      type: "number",
                      step: "0.01"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Amount Paid",
              name: "amountPaid"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(state).amountPaid,
                    "onUpdate:modelValue": ($event) => unref(state).amountPaid = $event,
                    type: "number",
                    step: "0.01"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(state).amountPaid,
                      "onUpdate:modelValue": ($event) => unref(state).amountPaid = $event,
                      type: "number",
                      step: "0.01"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Payment Method",
              name: "paymentMethod"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(state).paymentMethod,
                    "onUpdate:modelValue": ($event) => unref(state).paymentMethod = $event,
                    options: unref(paymentMethodOptions)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(state).paymentMethod,
                      "onUpdate:modelValue": ($event) => unref(state).paymentMethod = $event,
                      options: unref(paymentMethodOptions)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Payment Status",
              name: "paymentStatus"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(state).paymentStatus,
                    "onUpdate:modelValue": ($event) => unref(state).paymentStatus = $event,
                    options: paymentStatusOptions
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(state).paymentStatus,
                      "onUpdate:modelValue": ($event) => unref(state).paymentStatus = $event,
                      options: paymentStatusOptions
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Payment Received By",
              name: "paymentReceivedBy"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UToggle, {
                    modelValue: unref(isMetroBNBPayment),
                    "onUpdate:modelValue": ($event) => isRef(isMetroBNBPayment) ? isMetroBNBPayment.value = $event : null,
                    ui: { active: "bg-blue-500 dark:bg-blue-400" }
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="ml-3 text-sm font-medium text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(unref(isMetroBNBPayment) ? "MetroBNB" : "Partner")}</span>`);
                } else {
                  return [
                    createVNode(_component_UToggle, {
                      modelValue: unref(isMetroBNBPayment),
                      "onUpdate:modelValue": ($event) => isRef(isMetroBNBPayment) ? isMetroBNBPayment.value = $event : null,
                      ui: { active: "bg-blue-500 dark:bg-blue-400" }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("span", { class: "ml-3 text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(isMetroBNBPayment) ? "MetroBNB" : "Partner"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Payout Date",
              name: "payoutDate"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DateInput, {
                    modelValue: unref(state).payoutDate,
                    "onUpdate:modelValue": ($event) => unref(state).payoutDate = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DateInput, {
                      modelValue: unref(state).payoutDate,
                      "onUpdate:modelValue": ($event) => unref(state).payoutDate = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div${_scopeId}><h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-document-text",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Administrative </h4><div class="grid grid-cols-1 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Notes",
              name: "notes"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UTextarea, {
                    modelValue: unref(state).notes,
                    "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                    placeholder: "Additional notes (max 100 characters)",
                    maxlength: 100,
                    rows: 2
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="text-xs text-gray-500 dark:text-gray-400 mt-1"${_scopeId2}>${ssrInterpolate(unref(state).notes.length)}/100 characters </div>`);
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(state).notes,
                      "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                      placeholder: "Additional notes (max 100 characters)",
                      maxlength: 100,
                      rows: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, toDisplayString(unref(state).notes.length) + "/100 characters ", 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="mt-6"${_scopeId}><h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3"${_scopeId}>Add-ons</h4><div class="grid grid-cols-1 sm:grid-cols-3 gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(availableAddons, (addon) => {
              _push2(`<div class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UCheckbox, {
                "model-value": isAddonSelected(addon.type),
                "onUpdate:modelValue": ($event) => toggleAddon(addon)
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex-1"${_scopeId}><p class="text-sm font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(addon.label)}</p><p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>\u20B1${ssrInterpolate(addon.amount)}</p></div></div>`);
            });
            _push2(`<!--]--></div></div><div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"${_scopeId}><div class="flex justify-between items-center"${_scopeId}><span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Base Amount:</span><span class="text-sm"${_scopeId}>\u20B1${ssrInterpolate(Number(unref(state).amount || 0).toFixed(2))}</span></div>`);
            if (unref(selectedAddonsTotal) > 0) {
              _push2(`<div class="flex justify-between items-center mt-1"${_scopeId}><span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Add-ons:</span><span class="text-sm"${_scopeId}>\u20B1${ssrInterpolate(unref(selectedAddonsTotal).toFixed(2))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-between items-center mt-2 pt-2 border-t border-blue-200 dark:border-blue-800"${_scopeId}><span class="font-medium text-gray-900 dark:text-white"${_scopeId}>Total Amount:</span><span class="font-bold text-lg text-blue-600 dark:text-blue-400"${_scopeId}>\u20B1${ssrInterpolate(unref(totalAmount).toFixed(2))}</span></div><div class="flex justify-between items-center mt-1"${_scopeId}><span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Amount Paid:</span><span class="text-sm"${_scopeId}>\u20B1${ssrInterpolate(Number(unref(state).amountPaid || 0).toFixed(2))}</span></div><div class="flex justify-between items-center mt-1 pt-1 border-t border-blue-200 dark:border-blue-800"${_scopeId}><span class="font-medium text-gray-900 dark:text-white"${_scopeId}>Remaining Balance:</span><span class="${ssrRenderClass([unref(remainingBalance) > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400", "font-bold"])}"${_scopeId}> \u20B1${ssrInterpolate(unref(remainingBalance).toFixed(2))}</span></div></div><div class="flex justify-end mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: unref(loading)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Save Booking`);
                } else {
                  return [
                    createTextVNode("Save Booking")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                  createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-user",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Guest & Booking Details ")
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Guest Name",
                      name: "guestName"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).guestName,
                          "onUpdate:modelValue": ($event) => unref(state).guestName = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Booking Date",
                      name: "bookingDate"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_DateInput, {
                          modelValue: unref(state).bookingDate,
                          "onUpdate:modelValue": ($event) => unref(state).bookingDate = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Check-in Date",
                      name: "startDate"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_DateInput, {
                          modelValue: unref(state).startDate,
                          "onUpdate:modelValue": ($event) => unref(state).startDate = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Check-out Date",
                      name: "endDate"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_DateInput, {
                          modelValue: unref(state).endDate,
                          "onUpdate:modelValue": ($event) => unref(state).endDate = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                  createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-building-office",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Property & Source ")
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Partner",
                      name: "partner"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).partner,
                          "onUpdate:modelValue": ($event) => unref(state).partner = $event,
                          options: unref(partnerOptions)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Unit",
                      name: "unitId"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).unitId,
                          "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                          options: unref(availableUnits),
                          disabled: !unref(state).partner,
                          placeholder: "Select a partner first"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Booking Source",
                      name: "bookingSourceId"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).bookingSourceId,
                          "onUpdate:modelValue": ($event) => unref(state).bookingSourceId = $event,
                          options: unref(bookingSourceOptions)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Booking Status",
                      name: "bookingStatus"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).bookingStatus,
                          "onUpdate:modelValue": ($event) => unref(state).bookingStatus = $event,
                          options: bookingStatusOptions
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                  createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-credit-card",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Payment Details ")
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Base Amount",
                      name: "amount"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).amount,
                          "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                          type: "number",
                          step: "0.01"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Amount Paid",
                      name: "amountPaid"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).amountPaid,
                          "onUpdate:modelValue": ($event) => unref(state).amountPaid = $event,
                          type: "number",
                          step: "0.01"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Payment Method",
                      name: "paymentMethod"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).paymentMethod,
                          "onUpdate:modelValue": ($event) => unref(state).paymentMethod = $event,
                          options: unref(paymentMethodOptions)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Payment Status",
                      name: "paymentStatus"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).paymentStatus,
                          "onUpdate:modelValue": ($event) => unref(state).paymentStatus = $event,
                          options: paymentStatusOptions
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Payment Received By",
                      name: "paymentReceivedBy"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UToggle, {
                          modelValue: unref(isMetroBNBPayment),
                          "onUpdate:modelValue": ($event) => isRef(isMetroBNBPayment) ? isMetroBNBPayment.value = $event : null,
                          ui: { active: "bg-blue-500 dark:bg-blue-400" }
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("span", { class: "ml-3 text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(isMetroBNBPayment) ? "MetroBNB" : "Partner"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Payout Date",
                      name: "payoutDate"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_DateInput, {
                          modelValue: unref(state).payoutDate,
                          "onUpdate:modelValue": ($event) => unref(state).payoutDate = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-document-text",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Administrative ")
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 gap-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Notes",
                      name: "notes"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(state).notes,
                          "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                          placeholder: "Additional notes (max 100 characters)",
                          maxlength: 100,
                          rows: 2
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, toDisplayString(unref(state).notes.length) + "/100 characters ", 1)
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "mt-6" }, [
                createVNode("h4", { class: "text-sm font-medium text-gray-900 dark:text-white mb-3" }, "Add-ons"),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(availableAddons, (addon) => {
                    return createVNode("div", {
                      key: addon.type,
                      class: "flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    }, [
                      createVNode(_component_UCheckbox, {
                        "model-value": isAddonSelected(addon.type),
                        "onUpdate:modelValue": ($event) => toggleAddon(addon)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(addon.label), 1),
                        createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "\u20B1" + toDisplayString(addon.amount), 1)
                      ])
                    ]);
                  }), 64))
                ])
              ]),
              createVNode("div", { class: "mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg" }, [
                createVNode("div", { class: "flex justify-between items-center" }, [
                  createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Base Amount:"),
                  createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(Number(unref(state).amount || 0).toFixed(2)), 1)
                ]),
                unref(selectedAddonsTotal) > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex justify-between items-center mt-1"
                }, [
                  createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Add-ons:"),
                  createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(unref(selectedAddonsTotal).toFixed(2)), 1)
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "flex justify-between items-center mt-2 pt-2 border-t border-blue-200 dark:border-blue-800" }, [
                  createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, "Total Amount:"),
                  createVNode("span", { class: "font-bold text-lg text-blue-600 dark:text-blue-400" }, "\u20B1" + toDisplayString(unref(totalAmount).toFixed(2)), 1)
                ]),
                createVNode("div", { class: "flex justify-between items-center mt-1" }, [
                  createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Amount Paid:"),
                  createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(Number(unref(state).amountPaid || 0).toFixed(2)), 1)
                ]),
                createVNode("div", { class: "flex justify-between items-center mt-1 pt-1 border-t border-blue-200 dark:border-blue-800" }, [
                  createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, "Remaining Balance:"),
                  createVNode("span", {
                    class: ["font-bold", unref(remainingBalance) > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"]
                  }, " \u20B1" + toDisplayString(unref(remainingBalance).toFixed(2)), 3)
                ])
              ]),
              createVNode("div", { class: "flex justify-end mt-6" }, [
                createVNode(_component_UButton, {
                  type: "submit",
                  color: "primary",
                  loading: unref(loading)
                }, {
                  default: withCtx(() => [
                    createTextVNode("Save Booking")
                  ]),
                  _: 1
                }, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/accounting/BookingForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const { handleSubmit } = useBookingForm();
    const { notifySuccess, notifyError } = useNotify();
    const router = useRouter();
    const loading = ref(false);
    const handleFormSubmit = async (data) => {
      loading.value = true;
      try {
        await handleSubmit(data);
        notifySuccess("Booking created successfully!", 5e3);
        setTimeout(() => {
          router.push("/accounting/bookings");
        }, 1500);
      } catch (error) {
        console.error("Create booking error:", error);
        notifyError("Failed to create booking. Please try again.");
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UCard = __nuxt_component_2;
      const _component_AccountingBookingForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex justify-between items-center"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Booking</h1><p class="text-gray-600 dark:text-gray-400">Create a new booking payment record</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/accounting/bookings",
        color: "gray",
        variant: "outline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-left",
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Back to Bookings `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-arrow-left",
                class: "mr-2"
              }),
              createTextVNode(" Back to Bookings ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Booking Details</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Booking Details")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AccountingBookingForm, {
              loading: unref(loading),
              onSubmit: handleFormSubmit
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AccountingBookingForm, {
                loading: unref(loading),
                onSubmit: handleFormSubmit
              }, null, 8, ["loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/bookings/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BBS7kRA8.mjs.map
