import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2, g as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_8 } from './Checkbox-CvybKiXl.mjs';
import { _ as __nuxt_component_6$1 } from './Dropdown-rKaqrBy2.mjs';
import { _ as __nuxt_component_5$1 } from './Badge-hg3kqqXA.mjs';
import { _ as __nuxt_component_6$2 } from './Table-BHqVm27V.mjs';
import { _ as _sfc_main$2 } from './StandardPagination-DZiiEeUr.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as _sfc_main$3 } from './DateInput-H5QDo9cM.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, isRef, toDisplayString, createTextVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { z } from 'zod';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useApiResponse } from './useApiResponse-BHNeCLLh.mjs';
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
import './Pagination-BuSSqpy3.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EditExpenseModal",
  __ssrInlineRender: true,
  props: {
    expense: {},
    modelValue: { type: Boolean }
  },
  emits: ["update:modelValue", "updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const schema = z.object({
      partnerId: z.string().min(1, "Partner is required"),
      unitId: z.string().min(1, "Unit is required"),
      date: z.string().min(1, "Date is required"),
      type: z.enum(["Cleaning", "Laundry", "Supplies", "Wifi", "Electricity", "Repair", "Repairs", "Miscellaneous"]),
      amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
      notes: z.string().optional()
    });
    const state = reactive({
      partnerId: "",
      unitId: "",
      date: "",
      type: "",
      amount: 0,
      billable: "true",
      paid: "false",
      paidDate: "",
      paidBy: "metrobnb",
      receiptUrl: "",
      receiptFullUrl: "",
      receiptPublicId: "",
      notes: ""
    });
    const uploading = ref(false);
    const expenseTypes = [
      { label: "Cleaning", value: "Cleaning" },
      { label: "Laundry", value: "Laundry" },
      { label: "Supplies", value: "Supplies" },
      { label: "Wifi", value: "Wifi" },
      { label: "Electricity", value: "Electricity" },
      { label: "Repair", value: "Repair" },
      { label: "Repairs", value: "Repairs" },
      { label: "Miscellaneous", value: "Miscellaneous" }
    ];
    const billableOptions = [
      { label: "Billable", value: "true" },
      { label: "Non-billable", value: "false" }
    ];
    const paidOptions = [
      { label: "Unpaid", value: "false" },
      { label: "Paid", value: "true" }
    ];
    const paidByOptions = [
      { label: "MetroBNB", value: "metrobnb" },
      { label: "Partner", value: "partner" },
      { label: "Employee", value: "employee" },
      { label: "Owner", value: "owner" }
    ];
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const loading = ref(false);
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return partners.value.map((p) => ({ label: p.name, value: p.id }));
    });
    const availableUnits = computed(() => {
      if (!state.partnerId || !Array.isArray(units.value)) {
        return [];
      }
      const filtered = units.value.filter((unit) => {
        const unitPartnerId = unit.partnerId || unit.partner_id;
        const matches = unitPartnerId === state.partnerId;
        return matches;
      });
      return filtered.map((unit) => ({ label: unit.name, value: unit.id }));
    });
    watch(() => state.partnerId, (newPartnerId, oldPartnerId) => {
      if (oldPartnerId && newPartnerId !== oldPartnerId) {
        state.unitId = "";
      }
    });
    const handleFileUpload = async (event) => {
      var _a;
      const { notifySuccess, notifyError } = useNotify();
      const target = event.target;
      const file = (_a = target.files) == null ? void 0 : _a[0];
      if (!file) return;
      uploading.value = true;
      try {
        const result = await uploadFile(file, "receipts");
        state.receiptUrl = result.public_url;
        state.receiptPublicId = result.file_id;
        notifySuccess("Receipt uploaded successfully");
      } catch (error) {
        notifyError("Failed to upload receipt");
      } finally {
        uploading.value = false;
      }
    };
    const removeReceipt = () => {
      state.receiptUrl = "";
      state.receiptFullUrl = "";
      state.receiptPublicId = "";
    };
    const onSubmit = async () => {
      const { notifySuccess, notifyError } = useNotify();
      const { updateExpense } = useApi();
      loading.value = true;
      try {
        const updateData = {
          partner_id: state.partnerId,
          unit_id: state.unitId,
          date: state.date,
          type: state.type,
          amount: state.amount,
          paid_by: state.paidBy,
          billable: state.billable === "true",
          paid: state.paid === "true",
          receipt_url: state.receiptUrl || void 0,
          receipt_public_id: state.receiptPublicId || void 0,
          notes: state.notes
        };
        if (state.paid === "true" && state.paidDate) {
          updateData.paid_date = state.paidDate;
        } else if (state.paid === "false") {
          updateData.paid_date = null;
        }
        await updateExpense(props.expense.id, updateData);
        notifySuccess("Expense updated successfully");
        emit("updated");
        isOpen.value = false;
      } catch (error) {
        notifyError("Failed to update expense");
      } finally {
        loading.value = false;
      }
    };
    watch(() => props.expense, (expense) => {
      if (expense) {
        const partnerId = expense.partnerId || expense.partner_id;
        const unitId = expense.unitId || expense.unit_id;
        Object.assign(state, {
          partnerId,
          unitId,
          date: expense.date,
          type: expense.type,
          amount: parseFloat(expense.amount) || 0,
          paidBy: expense.paid_by || "metrobnb",
          billable: expense.billable ? "true" : "false",
          paid: expense.paid ? "true" : "false",
          paidDate: expense.paidDate || "",
          receiptUrl: expense.receipt_url || "",
          receiptFullUrl: expense.receipt_full_url || "",
          receiptPublicId: expense.receipt_public_id || "",
          notes: expense.notes || expense.note || ""
        });
      }
    }, { immediate: true });
    watch(() => state.paid, (newValue) => {
      if (newValue === "true" && !state.paidDate) {
        state.paidDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      }
    });
    watch(() => props.modelValue, async (isOpen2) => {
      if (isOpen2) {
        await Promise.all([
          loadPartners(),
          loadUnits()
        ]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = __nuxt_component_0;
      const _component_UCard = __nuxt_component_2;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_DateInput = _sfc_main$3;
      const _component_UInput = __nuxt_component_6;
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UTextarea = __nuxt_component_7;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        modelValue: unref(isOpen),
        "onUpdate:modelValue": ($event) => isRef(isOpen) ? isOpen.value = $event : null
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Edit Expense</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Edit Expense")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UForm, {
                    schema: unref(schema),
                    state: unref(state),
                    onSubmit
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Partner",
                          name: "partnerId",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).partnerId,
                                "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                                options: unref(partnerOptions)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).partnerId,
                                  "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                                  options: unref(partnerOptions)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Unit",
                          name: "unitId",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).unitId,
                                "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                options: unref(availableUnits),
                                disabled: !unref(state).partnerId
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).unitId,
                                  "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                  options: unref(availableUnits),
                                  disabled: !unref(state).partnerId
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Date",
                          name: "date",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_DateInput, {
                                modelValue: unref(state).date,
                                "onUpdate:modelValue": ($event) => unref(state).date = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).date,
                                  "onUpdate:modelValue": ($event) => unref(state).date = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Expense Type",
                          name: "type",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).type,
                                "onUpdate:modelValue": ($event) => unref(state).type = $event,
                                options: expenseTypes
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).type,
                                  "onUpdate:modelValue": ($event) => unref(state).type = $event,
                                  options: expenseTypes
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Amount",
                          name: "amount",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(state).amount,
                                "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                type: "number",
                                step: "0.01",
                                min: "0"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).amount,
                                  "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                  type: "number",
                                  step: "0.01",
                                  min: "0"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Billable",
                          name: "billable"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).billable,
                                "onUpdate:modelValue": ($event) => unref(state).billable = $event,
                                options: billableOptions
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).billable,
                                  "onUpdate:modelValue": ($event) => unref(state).billable = $event,
                                  options: billableOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Payment Status",
                          name: "paid"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).paid,
                                "onUpdate:modelValue": ($event) => unref(state).paid = $event,
                                options: paidOptions
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paid,
                                  "onUpdate:modelValue": ($event) => unref(state).paid = $event,
                                  options: paidOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (unref(state).paid === "true") {
                          _push4(ssrRenderComponent(_component_UFormGroup, {
                            label: "Payment Date",
                            name: "paidDate"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_DateInput, {
                                  modelValue: unref(state).paidDate,
                                  "onUpdate:modelValue": ($event) => unref(state).paidDate = $event
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_DateInput, {
                                    modelValue: unref(state).paidDate,
                                    "onUpdate:modelValue": ($event) => unref(state).paidDate = $event
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Receipt",
                          name: "receipt",
                          class: "md:col-span-2"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (unref(state).receiptUrl || unref(state).receiptFullUrl) {
                                _push5(`<div class="space-y-3"${_scopeId4}><div class="relative inline-block"${_scopeId4}><img${ssrRenderAttr("src", unref(state).receiptFullUrl || unref(state).receiptUrl)} alt="Receipt" class="w-32 h-32 object-cover rounded-lg border"${_scopeId4}>`);
                                _push5(ssrRenderComponent(_component_UButton, {
                                  onClick: removeReceipt,
                                  color: "red",
                                  variant: "solid",
                                  size: "xs",
                                  class: "absolute -top-2 -right-2"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-x-mark" }, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(`</div>`);
                                _push5(ssrRenderComponent(_component_UButton, {
                                  onClick: ($event) => _ctx.$refs.fileInput.click(),
                                  variant: "outline",
                                  size: "sm",
                                  loading: unref(uploading)
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_UIcon, {
                                        name: "i-heroicons-arrow-path",
                                        class: "mr-2"
                                      }, null, _parent6, _scopeId5));
                                      _push6(` Replace Receipt `);
                                    } else {
                                      return [
                                        createVNode(_component_UIcon, {
                                          name: "i-heroicons-arrow-path",
                                          class: "mr-2"
                                        }),
                                        createTextVNode(" Replace Receipt ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(`</div>`);
                              } else {
                                _push5(`<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"${_scopeId4}><div class="text-center"${_scopeId4}>`);
                                _push5(ssrRenderComponent(_component_UIcon, {
                                  name: "i-heroicons-photo",
                                  class: "h-8 w-8 text-gray-400 mx-auto mb-2"
                                }, null, _parent5, _scopeId4));
                                _push5(`<input type="file" accept="image/*" class="hidden"${_scopeId4}>`);
                                _push5(ssrRenderComponent(_component_UButton, {
                                  onClick: ($event) => _ctx.$refs.fileInput.click(),
                                  variant: "outline",
                                  size: "sm",
                                  loading: unref(uploading)
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_UIcon, {
                                        name: "i-heroicons-camera",
                                        class: "mr-2"
                                      }, null, _parent6, _scopeId5));
                                      _push6(` Upload Receipt `);
                                    } else {
                                      return [
                                        createVNode(_component_UIcon, {
                                          name: "i-heroicons-camera",
                                          class: "mr-2"
                                        }),
                                        createTextVNode(" Upload Receipt ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(`<p class="text-xs text-gray-500 mt-1"${_scopeId4}>PNG, JPG up to 10MB</p></div></div>`);
                              }
                            } else {
                              return [
                                unref(state).receiptUrl || unref(state).receiptFullUrl ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "space-y-3"
                                }, [
                                  createVNode("div", { class: "relative inline-block" }, [
                                    createVNode("img", {
                                      src: unref(state).receiptFullUrl || unref(state).receiptUrl,
                                      alt: "Receipt",
                                      class: "w-32 h-32 object-cover rounded-lg border"
                                    }, null, 8, ["src"]),
                                    createVNode(_component_UButton, {
                                      onClick: removeReceipt,
                                      color: "red",
                                      variant: "solid",
                                      size: "xs",
                                      class: "absolute -top-2 -right-2"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_UButton, {
                                    onClick: ($event) => _ctx.$refs.fileInput.click(),
                                    variant: "outline",
                                    size: "sm",
                                    loading: unref(uploading)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_UIcon, {
                                        name: "i-heroicons-arrow-path",
                                        class: "mr-2"
                                      }),
                                      createTextVNode(" Replace Receipt ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick", "loading"])
                                ])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
                                }, [
                                  createVNode("div", { class: "text-center" }, [
                                    createVNode(_component_UIcon, {
                                      name: "i-heroicons-photo",
                                      class: "h-8 w-8 text-gray-400 mx-auto mb-2"
                                    }),
                                    createVNode("input", {
                                      ref: "fileInput",
                                      type: "file",
                                      accept: "image/*",
                                      class: "hidden",
                                      onChange: handleFileUpload
                                    }, null, 544),
                                    createVNode(_component_UButton, {
                                      onClick: ($event) => _ctx.$refs.fileInput.click(),
                                      variant: "outline",
                                      size: "sm",
                                      loading: unref(uploading)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_UIcon, {
                                          name: "i-heroicons-camera",
                                          class: "mr-2"
                                        }),
                                        createTextVNode(" Upload Receipt ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick", "loading"]),
                                    createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "PNG, JPG up to 10MB")
                                  ])
                                ]))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Paid By",
                          name: "paidBy",
                          class: "md:col-span-1"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).paidBy,
                                "onUpdate:modelValue": ($event) => unref(state).paidBy = $event,
                                options: paidByOptions
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paidBy,
                                  "onUpdate:modelValue": ($event) => unref(state).paidBy = $event,
                                  options: paidByOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Notes",
                          name: "notes",
                          class: "md:col-span-2"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UTextarea, {
                                modelValue: unref(state).notes,
                                "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                                placeholder: "Additional details (optional)"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(state).notes,
                                  "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                                  placeholder: "Additional details (optional)"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="flex justify-end space-x-3 mt-6"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false,
                          disabled: unref(loading)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cancel`);
                            } else {
                              return [
                                createTextVNode("Cancel")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(loading)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Update Expense`);
                            } else {
                              return [
                                createTextVNode("Update Expense")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                            createVNode(_component_UFormGroup, {
                              label: "Partner",
                              name: "partnerId",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).partnerId,
                                  "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                                  options: unref(partnerOptions)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Unit",
                              name: "unitId",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).unitId,
                                  "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                  options: unref(availableUnits),
                                  disabled: !unref(state).partnerId
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Date",
                              name: "date",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).date,
                                  "onUpdate:modelValue": ($event) => unref(state).date = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Expense Type",
                              name: "type",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).type,
                                  "onUpdate:modelValue": ($event) => unref(state).type = $event,
                                  options: expenseTypes
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Amount",
                              name: "amount",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).amount,
                                  "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                  type: "number",
                                  step: "0.01",
                                  min: "0"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Billable",
                              name: "billable"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).billable,
                                  "onUpdate:modelValue": ($event) => unref(state).billable = $event,
                                  options: billableOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Payment Status",
                              name: "paid"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paid,
                                  "onUpdate:modelValue": ($event) => unref(state).paid = $event,
                                  options: paidOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            unref(state).paid === "true" ? (openBlock(), createBlock(_component_UFormGroup, {
                              key: 0,
                              label: "Payment Date",
                              name: "paidDate"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).paidDate,
                                  "onUpdate:modelValue": ($event) => unref(state).paidDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            createVNode(_component_UFormGroup, {
                              label: "Receipt",
                              name: "receipt",
                              class: "md:col-span-2"
                            }, {
                              default: withCtx(() => [
                                unref(state).receiptUrl || unref(state).receiptFullUrl ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "space-y-3"
                                }, [
                                  createVNode("div", { class: "relative inline-block" }, [
                                    createVNode("img", {
                                      src: unref(state).receiptFullUrl || unref(state).receiptUrl,
                                      alt: "Receipt",
                                      class: "w-32 h-32 object-cover rounded-lg border"
                                    }, null, 8, ["src"]),
                                    createVNode(_component_UButton, {
                                      onClick: removeReceipt,
                                      color: "red",
                                      variant: "solid",
                                      size: "xs",
                                      class: "absolute -top-2 -right-2"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_UButton, {
                                    onClick: ($event) => _ctx.$refs.fileInput.click(),
                                    variant: "outline",
                                    size: "sm",
                                    loading: unref(uploading)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_UIcon, {
                                        name: "i-heroicons-arrow-path",
                                        class: "mr-2"
                                      }),
                                      createTextVNode(" Replace Receipt ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick", "loading"])
                                ])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
                                }, [
                                  createVNode("div", { class: "text-center" }, [
                                    createVNode(_component_UIcon, {
                                      name: "i-heroicons-photo",
                                      class: "h-8 w-8 text-gray-400 mx-auto mb-2"
                                    }),
                                    createVNode("input", {
                                      ref: "fileInput",
                                      type: "file",
                                      accept: "image/*",
                                      class: "hidden",
                                      onChange: handleFileUpload
                                    }, null, 544),
                                    createVNode(_component_UButton, {
                                      onClick: ($event) => _ctx.$refs.fileInput.click(),
                                      variant: "outline",
                                      size: "sm",
                                      loading: unref(uploading)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_UIcon, {
                                          name: "i-heroicons-camera",
                                          class: "mr-2"
                                        }),
                                        createTextVNode(" Upload Receipt ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick", "loading"]),
                                    createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "PNG, JPG up to 10MB")
                                  ])
                                ]))
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Paid By",
                              name: "paidBy",
                              class: "md:col-span-1"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paidBy,
                                  "onUpdate:modelValue": ($event) => unref(state).paidBy = $event,
                                  options: paidByOptions
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Notes",
                              name: "notes",
                              class: "md:col-span-2"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(state).notes,
                                  "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                                  placeholder: "Additional details (optional)"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                            createVNode(_component_UButton, {
                              color: "gray",
                              variant: "ghost",
                              onClick: ($event) => isOpen.value = false,
                              disabled: unref(loading)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick", "disabled"]),
                            createVNode(_component_UButton, {
                              type: "submit",
                              color: "primary",
                              loading: unref(loading)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Update Expense")
                              ]),
                              _: 1
                            }, 8, ["loading"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UForm, {
                      schema: unref(schema),
                      state: unref(state),
                      onSubmit
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                          createVNode(_component_UFormGroup, {
                            label: "Partner",
                            name: "partnerId",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).partnerId,
                                "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                                options: unref(partnerOptions)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Unit",
                            name: "unitId",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).unitId,
                                "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                options: unref(availableUnits),
                                disabled: !unref(state).partnerId
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Date",
                            name: "date",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_DateInput, {
                                modelValue: unref(state).date,
                                "onUpdate:modelValue": ($event) => unref(state).date = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Expense Type",
                            name: "type",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).type,
                                "onUpdate:modelValue": ($event) => unref(state).type = $event,
                                options: expenseTypes
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Amount",
                            name: "amount",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(state).amount,
                                "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                type: "number",
                                step: "0.01",
                                min: "0"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Billable",
                            name: "billable"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).billable,
                                "onUpdate:modelValue": ($event) => unref(state).billable = $event,
                                options: billableOptions
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Payment Status",
                            name: "paid"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).paid,
                                "onUpdate:modelValue": ($event) => unref(state).paid = $event,
                                options: paidOptions
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          unref(state).paid === "true" ? (openBlock(), createBlock(_component_UFormGroup, {
                            key: 0,
                            label: "Payment Date",
                            name: "paidDate"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_DateInput, {
                                modelValue: unref(state).paidDate,
                                "onUpdate:modelValue": ($event) => unref(state).paidDate = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_UFormGroup, {
                            label: "Receipt",
                            name: "receipt",
                            class: "md:col-span-2"
                          }, {
                            default: withCtx(() => [
                              unref(state).receiptUrl || unref(state).receiptFullUrl ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "space-y-3"
                              }, [
                                createVNode("div", { class: "relative inline-block" }, [
                                  createVNode("img", {
                                    src: unref(state).receiptFullUrl || unref(state).receiptUrl,
                                    alt: "Receipt",
                                    class: "w-32 h-32 object-cover rounded-lg border"
                                  }, null, 8, ["src"]),
                                  createVNode(_component_UButton, {
                                    onClick: removeReceipt,
                                    color: "red",
                                    variant: "solid",
                                    size: "xs",
                                    class: "absolute -top-2 -right-2"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_UButton, {
                                  onClick: ($event) => _ctx.$refs.fileInput.click(),
                                  variant: "outline",
                                  size: "sm",
                                  loading: unref(uploading)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_UIcon, {
                                      name: "i-heroicons-arrow-path",
                                      class: "mr-2"
                                    }),
                                    createTextVNode(" Replace Receipt ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick", "loading"])
                              ])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
                              }, [
                                createVNode("div", { class: "text-center" }, [
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-photo",
                                    class: "h-8 w-8 text-gray-400 mx-auto mb-2"
                                  }),
                                  createVNode("input", {
                                    ref: "fileInput",
                                    type: "file",
                                    accept: "image/*",
                                    class: "hidden",
                                    onChange: handleFileUpload
                                  }, null, 544),
                                  createVNode(_component_UButton, {
                                    onClick: ($event) => _ctx.$refs.fileInput.click(),
                                    variant: "outline",
                                    size: "sm",
                                    loading: unref(uploading)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_UIcon, {
                                        name: "i-heroicons-camera",
                                        class: "mr-2"
                                      }),
                                      createTextVNode(" Upload Receipt ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick", "loading"]),
                                  createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "PNG, JPG up to 10MB")
                                ])
                              ]))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Paid By",
                            name: "paidBy",
                            class: "md:col-span-1"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).paidBy,
                                "onUpdate:modelValue": ($event) => unref(state).paidBy = $event,
                                options: paidByOptions
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Notes",
                            name: "notes",
                            class: "md:col-span-2"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UTextarea, {
                                modelValue: unref(state).notes,
                                "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                                placeholder: "Additional details (optional)"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            onClick: ($event) => isOpen.value = false,
                            disabled: unref(loading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick", "disabled"]),
                          createVNode(_component_UButton, {
                            type: "submit",
                            color: "primary",
                            loading: unref(loading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Update Expense")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["schema", "state"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Edit Expense")
                ]),
                default: withCtx(() => [
                  createVNode(_component_UForm, {
                    schema: unref(schema),
                    state: unref(state),
                    onSubmit
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormGroup, {
                          label: "Partner",
                          name: "partnerId",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(state).partnerId,
                              "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                              options: unref(partnerOptions)
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Unit",
                          name: "unitId",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(state).unitId,
                              "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                              options: unref(availableUnits),
                              disabled: !unref(state).partnerId
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Date",
                          name: "date",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_DateInput, {
                              modelValue: unref(state).date,
                              "onUpdate:modelValue": ($event) => unref(state).date = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Expense Type",
                          name: "type",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(state).type,
                              "onUpdate:modelValue": ($event) => unref(state).type = $event,
                              options: expenseTypes
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Amount",
                          name: "amount",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(state).amount,
                              "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                              type: "number",
                              step: "0.01",
                              min: "0"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Billable",
                          name: "billable"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(state).billable,
                              "onUpdate:modelValue": ($event) => unref(state).billable = $event,
                              options: billableOptions
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Payment Status",
                          name: "paid"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(state).paid,
                              "onUpdate:modelValue": ($event) => unref(state).paid = $event,
                              options: paidOptions
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        unref(state).paid === "true" ? (openBlock(), createBlock(_component_UFormGroup, {
                          key: 0,
                          label: "Payment Date",
                          name: "paidDate"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_DateInput, {
                              modelValue: unref(state).paidDate,
                              "onUpdate:modelValue": ($event) => unref(state).paidDate = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        createVNode(_component_UFormGroup, {
                          label: "Receipt",
                          name: "receipt",
                          class: "md:col-span-2"
                        }, {
                          default: withCtx(() => [
                            unref(state).receiptUrl || unref(state).receiptFullUrl ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "space-y-3"
                            }, [
                              createVNode("div", { class: "relative inline-block" }, [
                                createVNode("img", {
                                  src: unref(state).receiptFullUrl || unref(state).receiptUrl,
                                  alt: "Receipt",
                                  class: "w-32 h-32 object-cover rounded-lg border"
                                }, null, 8, ["src"]),
                                createVNode(_component_UButton, {
                                  onClick: removeReceipt,
                                  color: "red",
                                  variant: "solid",
                                  size: "xs",
                                  class: "absolute -top-2 -right-2"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_UButton, {
                                onClick: ($event) => _ctx.$refs.fileInput.click(),
                                variant: "outline",
                                size: "sm",
                                loading: unref(uploading)
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-arrow-path",
                                    class: "mr-2"
                                  }),
                                  createTextVNode(" Replace Receipt ")
                                ]),
                                _: 1
                              }, 8, ["onClick", "loading"])
                            ])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
                            }, [
                              createVNode("div", { class: "text-center" }, [
                                createVNode(_component_UIcon, {
                                  name: "i-heroicons-photo",
                                  class: "h-8 w-8 text-gray-400 mx-auto mb-2"
                                }),
                                createVNode("input", {
                                  ref: "fileInput",
                                  type: "file",
                                  accept: "image/*",
                                  class: "hidden",
                                  onChange: handleFileUpload
                                }, null, 544),
                                createVNode(_component_UButton, {
                                  onClick: ($event) => _ctx.$refs.fileInput.click(),
                                  variant: "outline",
                                  size: "sm",
                                  loading: unref(uploading)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_UIcon, {
                                      name: "i-heroicons-camera",
                                      class: "mr-2"
                                    }),
                                    createTextVNode(" Upload Receipt ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick", "loading"]),
                                createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "PNG, JPG up to 10MB")
                              ])
                            ]))
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Paid By",
                          name: "paidBy",
                          class: "md:col-span-1"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(state).paidBy,
                              "onUpdate:modelValue": ($event) => unref(state).paidBy = $event,
                              options: paidByOptions
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Notes",
                          name: "notes",
                          class: "md:col-span-2"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(state).notes,
                              "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                              placeholder: "Additional details (optional)"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false,
                          disabled: unref(loading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick", "disabled"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(loading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Update Expense")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ])
                    ]),
                    _: 1
                  }, 8, ["schema", "state"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/expenses/EditExpenseModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const { getExpenses, deleteExpense } = useApi();
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const { extractData } = useApiResponse();
    const isPartner = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.role) === "partner";
    });
    const showEditModal = ref(false);
    const selectedExpense = ref(null);
    const selectedExpenses = ref([]);
    const showBulkActions = ref(false);
    const searchQuery = ref("");
    const sortBy = ref("date_desc");
    const showAdvancedFilters = ref(false);
    const filterType = ref("");
    const filterPaid = ref("");
    const filterBillable = ref("");
    const filterPartner = ref("");
    const filterUnit = ref("");
    const filterYear = ref("");
    const filterMonth = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const expenses = ref([]);
    const pagination = ref(null);
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const sortOptions = [
      { label: "Date Newest", value: "date_desc" },
      { label: "Date Oldest", value: "date_asc" },
      { label: "Amount High-Low", value: "amount_desc" },
      { label: "Amount Low-High", value: "amount_asc" },
      { label: "Type A-Z", value: "type_asc" },
      { label: "Type Z-A", value: "type_desc" }
    ];
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return [{ label: "All Partners", value: "" }, ...partners.value.map((p) => ({ label: p.name, value: p.id }))];
    });
    const unitOptions = computed(() => {
      if (!Array.isArray(units.value)) return [];
      const filteredUnits = filterPartner.value ? units.value.filter((u) => u.partner_id === filterPartner.value) : units.value;
      return [{ label: "All Units", value: "" }, ...filteredUnits.map((u) => ({ label: u.name, value: u.id }))];
    });
    const typeFilterOptions = [
      { label: "All Types", value: "" },
      { label: "Cleaning", value: "Cleaning" },
      { label: "Laundry", value: "Laundry" },
      { label: "Supplies", value: "Supplies" },
      { label: "Wifi", value: "Wifi" },
      { label: "Electricity", value: "Electricity" },
      { label: "Repair", value: "Repair" },
      { label: "Repairs", value: "Repairs" },
      { label: "Miscellaneous", value: "Miscellaneous" }
    ];
    const paidFilterOptions = [
      { label: "All Status", value: "" },
      { label: "Paid", value: "true" },
      { label: "Unpaid", value: "false" }
    ];
    const billableFilterOptions = [
      { label: "All", value: "" },
      { label: "Billable", value: "true" },
      { label: "Non-Billable", value: "false" }
    ];
    const expenseColumns = [
      { key: "select", label: "" },
      { key: "partner", label: "Partner / Unit" },
      { key: "type", label: "Type" },
      { key: "amount", label: "Amount" },
      { key: "billable", label: "Billable" },
      { key: "paid", label: "Status" },
      { key: "date", label: "Date" },
      { key: "actions", label: "" }
    ];
    const yearOptions = computed(() => {
      const years = [];
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      for (let i = currentYear - 5; i <= currentYear + 2; i++) {
        years.push({ label: i.toString(), value: i.toString() });
      }
      return [{ label: "All Years", value: "" }, ...years.reverse()];
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
      return [{ label: "All Months", value: "" }, ...months];
    });
    const loadExpensesData = async () => {
      var _a, _b;
      try {
        isLoading.value = true;
        const [field, order] = sortBy.value.split("_");
        const filters = {
          sort_by: field,
          sort_order: order,
          page: currentPage.value,
          limit: 20
        };
        if (searchQuery.value && searchQuery.value.trim()) {
          filters.search = searchQuery.value.trim();
        }
        if (filterPartner.value) {
          filters.partner_id = filterPartner.value;
        }
        if (filterUnit.value) {
          filters.unit_id = filterUnit.value;
        }
        if (filterType.value) {
          filters.type = filterType.value;
        }
        if (filterPaid.value) {
          filters.paid = filterPaid.value === "true";
        }
        if (filterBillable.value) {
          filters.billable = filterBillable.value === "true";
        }
        let actualStartDate = startDate.value;
        let actualEndDate = endDate.value;
        if (filterYear.value || filterMonth.value) {
          const year = filterYear.value || (/* @__PURE__ */ new Date()).getFullYear();
          const month = filterMonth.value || "";
          if (month) {
            const monthNum = parseInt(month);
            actualStartDate = `${year}-${monthNum.toString().padStart(2, "0")}-01`;
            const lastDay = new Date(year, monthNum, 0).getDate();
            actualEndDate = `${year}-${monthNum.toString().padStart(2, "0")}-${lastDay}`;
          } else {
            actualStartDate = `${year}-01-01`;
            actualEndDate = `${year}-12-31`;
          }
        }
        if (actualStartDate) {
          filters.start_date = actualStartDate;
        }
        if (actualEndDate) {
          filters.end_date = actualEndDate;
        }
        const result = await getExpenses(filters);
        expenses.value = extractData(result);
        pagination.value = ((_a = result == null ? void 0 : result.data) == null ? void 0 : _a.pagination) || null;
        totalItems.value = ((_b = pagination.value) == null ? void 0 : _b.total_items) || expenses.value.length;
        console.log("Expenses pagination:", pagination.value);
        console.log("Total items:", totalItems.value);
      } catch (error) {
        expenses.value = [];
        pagination.value = null;
        const { notifyError } = useNotify();
        notifyError("Failed to load expenses");
      } finally {
        isLoading.value = false;
      }
    };
    computed(() => {
      if (!Array.isArray(expenses.value) || expenses.value.length === 0) return 0;
      const now = /* @__PURE__ */ new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      return expenses.value.filter((expense) => {
        if (!expense || !expense.date) return false;
        try {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        } catch {
          return false;
        }
      }).reduce((sum, expense) => {
        const amount = parseFloat(expense.amount);
        return sum + amount;
      }, 0);
    });
    computed(() => {
      if (!Array.isArray(expenses.value) || expenses.value.length === 0) return 0;
      return expenses.value.reduce((sum, expense) => {
        const amount = parseFloat(expense.amount);
        return sum + amount;
      }, 0);
    });
    const getPartnerName = (expense) => {
      var _a;
      if ((_a = expense == null ? void 0 : expense.partner) == null ? void 0 : _a.name) {
        return expense.partner.name;
      }
      if ((expense == null ? void 0 : expense.partner_id) && Array.isArray(partners.value) && partners.value.length > 0) {
        const partner = partners.value.find((p) => p && p.id === expense.partner_id);
        if (partner == null ? void 0 : partner.name) {
          return partner.name;
        }
      }
      if (!Array.isArray(partners.value) || partners.value.length === 0) {
        return "Loading...";
      }
      return "Unknown Partner";
    };
    const getUnitName = (expense) => {
      var _a;
      if ((_a = expense == null ? void 0 : expense.unit) == null ? void 0 : _a.name) {
        return expense.unit.name;
      }
      if ((expense == null ? void 0 : expense.unit_id) && Array.isArray(units.value) && units.value.length > 0) {
        const unit = units.value.find((u) => u && u.id === expense.unit_id);
        if (unit == null ? void 0 : unit.name) {
          return unit.name;
        }
      }
      if (!Array.isArray(units.value) || units.value.length === 0) {
        return "Loading...";
      }
      return "No Unit";
    };
    const getExpenseTypeColor = (type) => {
      const colors = {
        "Cleaning": "blue",
        "Laundry": "purple",
        "Supplies": "green",
        "Wifi": "indigo",
        "Electricity": "yellow",
        "Repair": "red",
        "Repairs": "red",
        "Miscellaneous": "gray",
        "Misc": "gray"
      };
      return colors[type] || "gray";
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      });
    };
    const getExpenseActions = (expense) => {
      const actions = [];
      if (expense.receipt_url) {
        actions.push([{
          label: "View Receipt",
          icon: "i-heroicons-photo",
          click: () => viewReceipt(expense)
        }]);
      }
      if (!isPartner.value) {
        actions.push([{
          label: expense.paid ? "Mark Unpaid" : "Mark Paid",
          icon: expense.paid ? "i-heroicons-x-circle" : "i-heroicons-check-circle",
          click: () => togglePayment(expense)
        }]);
        actions.push([{
          label: "Edit",
          icon: "i-heroicons-pencil-square",
          click: () => handleEdit(expense)
        }]);
        actions.push([{
          label: "Delete",
          icon: "i-heroicons-trash",
          click: () => handleDelete(expense.id)
        }]);
      }
      return actions;
    };
    const handleEdit = (expense) => {
      selectedExpense.value = expense;
      showEditModal.value = true;
    };
    const showDeleteModal = ref(false);
    const expenseToDelete = ref(null);
    const deleteLoading = ref(false);
    const handleDelete = (id) => {
      expenseToDelete.value = id;
      showDeleteModal.value = true;
    };
    const confirmDelete = async () => {
      const { notifySuccess, notifyError } = useNotify();
      if (!expenseToDelete.value) return;
      deleteLoading.value = true;
      try {
        await deleteExpense(expenseToDelete.value);
        await loadExpensesData();
        notifySuccess("Expense deleted successfully");
      } catch (error) {
        notifyError("Failed to delete expense");
      } finally {
        deleteLoading.value = false;
        showDeleteModal.value = false;
        expenseToDelete.value = null;
      }
    };
    const togglePayment = async (expense) => {
      const { notifySuccess, notifyError } = useNotify();
      const { updateExpense } = useApi();
      try {
        const updateData = {
          paid: !expense.paid,
          paid_date: !expense.paid ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : null,
          billable: expense.billable,
          amount: expense.amount,
          type: expense.type,
          notes: expense.notes
        };
        await updateExpense(expense.id, updateData);
        await loadExpensesData();
        notifySuccess(`Expense marked as ${!expense.paid ? "paid" : "unpaid"}`);
      } catch (error) {
        notifyError("Failed to update payment status");
      }
    };
    const viewReceipt = (expense) => {
      if (expense.receipt_full_url) {
        (void 0).open(expense.receipt_full_url, "_blank");
      }
    };
    const handleUpdated = () => {
      selectedExpense.value = null;
      loadExpensesData();
    };
    const toggleExpenseSelection = (expenseId) => {
      const index = selectedExpenses.value.indexOf(expenseId);
      if (index > -1) {
        selectedExpenses.value.splice(index, 1);
      } else {
        selectedExpenses.value.push(expenseId);
      }
    };
    const clearSelection = () => {
      selectedExpenses.value = [];
      showBulkActions.value = false;
    };
    const bulkMarkPaid = async () => {
      const { notifySuccess, notifyError } = useNotify();
      const { updateExpense } = useApi();
      try {
        for (const expenseId of selectedExpenses.value) {
          const expense = expenses.value.find((e) => e.id === expenseId);
          if (expense && !expense.paid) {
            await updateExpense(expenseId, {
              paid: true,
              paid_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
              billable: expense.billable,
              amount: expense.amount,
              type: expense.type,
              notes: expense.notes
            });
          }
        }
        await loadExpensesData();
        clearSelection();
        notifySuccess(`Marked ${selectedExpenses.value.length} expenses as paid`);
      } catch (error) {
        notifyError("Failed to update expenses");
      }
    };
    const bulkMarkUnpaid = async () => {
      const { notifySuccess, notifyError } = useNotify();
      const { updateExpense } = useApi();
      try {
        for (const expenseId of selectedExpenses.value) {
          const expense = expenses.value.find((e) => e.id === expenseId);
          if (expense && expense.paid) {
            await updateExpense(expenseId, {
              paid: false,
              paid_date: null,
              billable: expense.billable,
              amount: expense.amount,
              type: expense.type,
              notes: expense.notes
            });
          }
        }
        await loadExpensesData();
        clearSelection();
        notifySuccess(`Marked ${selectedExpenses.value.length} expenses as unpaid`);
      } catch (error) {
        notifyError("Failed to update expenses");
      }
    };
    const bulkMarkBillable = async () => {
      const { notifySuccess, notifyError } = useNotify();
      const { updateExpense } = useApi();
      try {
        for (const expenseId of selectedExpenses.value) {
          const expense = expenses.value.find((e) => e.id === expenseId);
          if (expense && !expense.billable) {
            await updateExpense(expenseId, {
              billable: true,
              paid: expense.paid,
              amount: expense.amount,
              type: expense.type,
              notes: expense.notes
            });
          }
        }
        await loadExpensesData();
        clearSelection();
        notifySuccess(`Marked ${selectedExpenses.value.length} expenses as billable`);
      } catch (error) {
        notifyError("Failed to update expenses");
      }
    };
    const bulkMarkNonBillable = async () => {
      const { notifySuccess, notifyError } = useNotify();
      const { updateExpense } = useApi();
      try {
        for (const expenseId of selectedExpenses.value) {
          const expense = expenses.value.find((e) => e.id === expenseId);
          if (expense && expense.billable) {
            await updateExpense(expenseId, {
              billable: false,
              paid: expense.paid,
              amount: expense.amount,
              type: expense.type,
              notes: expense.notes
            });
          }
        }
        await loadExpensesData();
        clearSelection();
        notifySuccess(`Marked ${selectedExpenses.value.length} expenses as non-billable`);
      } catch (error) {
        notifyError("Failed to update expenses");
      }
    };
    const handlePageChange = (page) => {
      currentPage.value = page;
      loadExpensesData();
    };
    const clearFilters = () => {
      filterYear.value = "";
      filterMonth.value = "";
      filterPartner.value = "";
      filterUnit.value = "";
      filterType.value = "";
      filterPaid.value = "";
      filterBillable.value = "";
      startDate.value = "";
      endDate.value = "";
      searchQuery.value = "";
      currentPage.value = 1;
      loadExpensesData();
    };
    const applyFilters = () => {
      currentPage.value = 1;
      loadExpensesData();
    };
    const debouncedSearch = () => {
      currentPage.value = 1;
      loadExpensesData();
    };
    let searchTimeout;
    const handleSearchInput = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(debouncedSearch, 300);
    };
    watch(() => filterPartner.value, () => {
      filterUnit.value = "";
    });
    const bulkDelete = async () => {
      const { notifySuccess, notifyError } = useNotify();
      if (selectedExpenses.value.length === 0) return;
      const { confirm } = useConfirm();
      const confirmed = await confirm(`Are you sure you want to delete ${selectedExpenses.value.length} expenses? This action cannot be undone.`, {
        title: "Delete Expenses",
        confirmText: "Delete",
        confirmColor: "red"
      });
      if (!confirmed) return;
      try {
        for (const expenseId of selectedExpenses.value) {
          await deleteExpense(expenseId);
        }
        await loadExpensesData();
        clearSelection();
        notifySuccess(`Deleted ${selectedExpenses.value.length} expenses successfully`);
      } catch (error) {
        notifyError("Failed to delete expenses");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UInput = __nuxt_component_6;
      const _component_USelect = __nuxt_component_5;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UCheckbox = __nuxt_component_8;
      const _component_UDropdown = __nuxt_component_6$1;
      const _component_UBadge = __nuxt_component_5$1;
      const _component_UTable = __nuxt_component_6$2;
      const _component_StandardPagination = _sfc_main$2;
      const _component_ExpensesEditExpenseModal = _sfc_main$1;
      const _component_UModal = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3 sm:space-y-6" }, _attrs))}><div class="space-y-3"><div class="flex justify-between items-start gap-3"><div class="min-w-0 flex-1"><h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Expenses</h1><p class="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Manage partner expenses and charges</p></div>`);
      if (!unref(isPartner)) {
        _push(ssrRenderComponent(_component_UButton, {
          to: "/accounting/expenses/create",
          color: "primary",
          size: "xs",
          class: "sm:size-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-plus",
                class: "sm:mr-1"
              }, null, _parent2, _scopeId));
              _push2(`<span class="hidden sm:inline"${_scopeId}>Add Expense</span>`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-plus",
                  class: "sm:mr-1"
                }),
                createVNode("span", { class: "hidden sm:inline" }, "Add Expense")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}> All Expenses `);
            if (unref(pagination)) {
              _push2(`<span${_scopeId}>(${ssrInterpolate(unref(pagination).total_items)} total)</span>`);
            } else {
              _push2(`<span${_scopeId}>(${ssrInterpolate(unref(expenses).length)})</span>`);
            }
            _push2(`</h3></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center" }, [
                createVNode("h3", { class: "text-lg font-semibold" }, [
                  createTextVNode(" All Expenses "),
                  unref(pagination) ? (openBlock(), createBlock("span", { key: 0 }, "(" + toDisplayString(unref(pagination).total_items) + " total)", 1)) : (openBlock(), createBlock("span", { key: 1 }, "(" + toDisplayString(unref(expenses).length) + ")", 1))
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-4 space-y-3"${_scopeId}><div class="flex flex-col sm:flex-row gap-2 sm:gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(searchQuery),
              "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
              placeholder: "Search expenses...",
              icon: "i-heroicons-magnifying-glass",
              class: "w-full sm:flex-1",
              size: "sm",
              onInput: handleSearchInput
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(sortBy),
              "onUpdate:modelValue": ($event) => isRef(sortBy) ? sortBy.value = $event : null,
              options: sortOptions,
              class: "flex-1 sm:w-auto",
              size: "sm",
              onChange: loadExpensesData
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "outline",
              size: "sm",
              onClick: ($event) => showAdvancedFilters.value = !unref(showAdvancedFilters)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-funnel",
                    class: "sm:mr-1"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="hidden sm:inline"${_scopeId2}>Filters</span>`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-funnel",
                      class: "sm:mr-1"
                    }),
                    createVNode("span", { class: "hidden sm:inline" }, "Filters")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(selectedExpenses).length > 0) {
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "outline",
                size: "sm",
                onClick: ($event) => showBulkActions.value = !unref(showBulkActions)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-squares-plus",
                      class: "sm:mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="hidden sm:inline"${_scopeId2}>Bulk (${ssrInterpolate(unref(selectedExpenses).length)})</span>`);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-squares-plus",
                        class: "sm:mr-1"
                      }),
                      createVNode("span", { class: "hidden sm:inline" }, "Bulk (" + toDisplayString(unref(selectedExpenses).length) + ")", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            if (unref(showBulkActions) && unref(selectedExpenses).length > 0) {
              _push2(`<div class="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900"${_scopeId}><div class="flex flex-wrap gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                size: "sm",
                color: "green",
                onClick: bulkMarkPaid
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-check-circle",
                      class: "mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(` Mark Paid (${ssrInterpolate(unref(selectedExpenses).length)}) `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-check-circle",
                        class: "mr-1"
                      }),
                      createTextVNode(" Mark Paid (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                size: "sm",
                color: "red",
                onClick: bulkMarkUnpaid
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-x-circle",
                      class: "mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(` Mark Unpaid (${ssrInterpolate(unref(selectedExpenses).length)}) `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-x-circle",
                        class: "mr-1"
                      }),
                      createTextVNode(" Mark Unpaid (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                size: "sm",
                color: "blue",
                onClick: bulkMarkBillable
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-tag",
                      class: "mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(` Mark Billable (${ssrInterpolate(unref(selectedExpenses).length)}) `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-tag",
                        class: "mr-1"
                      }),
                      createTextVNode(" Mark Billable (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                size: "sm",
                color: "gray",
                onClick: bulkMarkNonBillable
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-minus",
                      class: "mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(` Mark Non-Billable (${ssrInterpolate(unref(selectedExpenses).length)}) `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-minus",
                        class: "mr-1"
                      }),
                      createTextVNode(" Mark Non-Billable (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                size: "sm",
                color: "red",
                onClick: bulkDelete
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-trash",
                      class: "mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(` Delete (${ssrInterpolate(unref(selectedExpenses).length)}) `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-trash",
                        class: "mr-1"
                      }),
                      createTextVNode(" Delete (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                size: "sm",
                color: "red",
                variant: "outline",
                onClick: clearSelection
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Clear Selection `);
                  } else {
                    return [
                      createTextVNode(" Clear Selection ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(showAdvancedFilters)) {
              _push2(`<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Year" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filterYear),
                      "onUpdate:modelValue": ($event) => isRef(filterYear) ? filterYear.value = $event : null,
                      options: unref(yearOptions),
                      placeholder: "All years"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filterYear),
                        "onUpdate:modelValue": ($event) => isRef(filterYear) ? filterYear.value = $event : null,
                        options: unref(yearOptions),
                        placeholder: "All years"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Month" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filterMonth),
                      "onUpdate:modelValue": ($event) => isRef(filterMonth) ? filterMonth.value = $event : null,
                      options: unref(monthOptions),
                      placeholder: "All months"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filterMonth),
                        "onUpdate:modelValue": ($event) => isRef(filterMonth) ? filterMonth.value = $event : null,
                        options: unref(monthOptions),
                        placeholder: "All months"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Partner" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filterPartner),
                      "onUpdate:modelValue": ($event) => isRef(filterPartner) ? filterPartner.value = $event : null,
                      options: unref(partnerOptions),
                      placeholder: "Select partner"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filterPartner),
                        "onUpdate:modelValue": ($event) => isRef(filterPartner) ? filterPartner.value = $event : null,
                        options: unref(partnerOptions),
                        placeholder: "Select partner"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Unit" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filterUnit),
                      "onUpdate:modelValue": ($event) => isRef(filterUnit) ? filterUnit.value = $event : null,
                      options: unref(unitOptions),
                      placeholder: "Select unit",
                      disabled: !unref(filterPartner)
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filterUnit),
                        "onUpdate:modelValue": ($event) => isRef(filterUnit) ? filterUnit.value = $event : null,
                        options: unref(unitOptions),
                        placeholder: "Select unit",
                        disabled: !unref(filterPartner)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Type" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filterType),
                      "onUpdate:modelValue": ($event) => isRef(filterType) ? filterType.value = $event : null,
                      options: typeFilterOptions,
                      placeholder: "Select type"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filterType),
                        "onUpdate:modelValue": ($event) => isRef(filterType) ? filterType.value = $event : null,
                        options: typeFilterOptions,
                        placeholder: "Select type"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Payment Status" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filterPaid),
                      "onUpdate:modelValue": ($event) => isRef(filterPaid) ? filterPaid.value = $event : null,
                      options: paidFilterOptions,
                      placeholder: "Select status"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filterPaid),
                        "onUpdate:modelValue": ($event) => isRef(filterPaid) ? filterPaid.value = $event : null,
                        options: paidFilterOptions,
                        placeholder: "Select status"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Billable" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filterBillable),
                      "onUpdate:modelValue": ($event) => isRef(filterBillable) ? filterBillable.value = $event : null,
                      options: billableFilterOptions,
                      placeholder: "Select billable"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filterBillable),
                        "onUpdate:modelValue": ($event) => isRef(filterBillable) ? filterBillable.value = $event : null,
                        options: billableFilterOptions,
                        placeholder: "Select billable"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Start Date" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(startDate),
                      "onUpdate:modelValue": ($event) => isRef(startDate) ? startDate.value = $event : null,
                      type: "date",
                      placeholder: "From date"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(startDate),
                        "onUpdate:modelValue": ($event) => isRef(startDate) ? startDate.value = $event : null,
                        type: "date",
                        placeholder: "From date"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "End Date" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(endDate),
                      "onUpdate:modelValue": ($event) => isRef(endDate) ? endDate.value = $event : null,
                      type: "date",
                      placeholder: "To date"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(endDate),
                        "onUpdate:modelValue": ($event) => isRef(endDate) ? endDate.value = $event : null,
                        type: "date",
                        placeholder: "To date"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="flex justify-end gap-2 mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "ghost",
                onClick: clearFilters
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Clear All `);
                  } else {
                    return [
                      createTextVNode(" Clear All ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                onClick: applyFilters
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Apply Filters `);
                  } else {
                    return [
                      createTextVNode(" Apply Filters ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(isLoading)) {
              _push2(`<div class="flex justify-center py-8"${_scopeId}><div class="text-gray-500"${_scopeId}>Loading expenses...</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!unref(isLoading)) {
              _push2(`<div${_scopeId}>`);
              if (unref(expenses).length) {
                _push2(`<div class="sm:hidden space-y-3"${_scopeId}><!--[-->`);
                ssrRenderList(unref(expenses), (expense) => {
                  _push2(ssrRenderComponent(_component_UCard, {
                    key: expense.id,
                    class: "p-4"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="space-y-3"${_scopeId2}><div class="flex justify-between items-start"${_scopeId2}><div class="flex items-start gap-3 min-w-0 flex-1"${_scopeId2}>`);
                        _push3(ssrRenderComponent(_component_UCheckbox, {
                          "model-value": unref(selectedExpenses).includes(expense.id),
                          "onUpdate:modelValue": ($event) => toggleExpenseSelection(expense.id),
                          class: "mt-1"
                        }, null, _parent3, _scopeId2));
                        _push3(`<div class="min-w-0 flex-1"${_scopeId2}><h3 class="font-medium text-gray-900 dark:text-white truncate"${_scopeId2}>${ssrInterpolate(getPartnerName(expense))}</h3><p class="text-sm text-gray-500 dark:text-gray-400 truncate"${_scopeId2}>${ssrInterpolate(getUnitName(expense))}</p></div></div>`);
                        _push3(ssrRenderComponent(_component_UDropdown, {
                          items: getExpenseActions(expense)
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
                        _push3(`</div><div class="grid grid-cols-2 gap-3 text-sm"${_scopeId2}><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Type:</span>`);
                        _push3(ssrRenderComponent(_component_UBadge, {
                          color: getExpenseTypeColor(expense.type),
                          size: "xs",
                          class: "ml-1"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(expense.type)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(expense.type), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Amount:</span><p class="font-medium text-metrobnb-600 dark:text-metrobnb-400"${_scopeId2}>\u20B1${ssrInterpolate(parseFloat(expense.amount).toLocaleString("en-US", { minimumFractionDigits: 0 }))}</p></div><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Status:</span>`);
                        _push3(ssrRenderComponent(_component_UBadge, {
                          color: expense.paid ? "green" : "red",
                          size: "xs",
                          class: "ml-1"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(expense.paid ? "Paid" : "Unpaid")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(expense.paid ? "Paid" : "Unpaid"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Billable:</span>`);
                        _push3(ssrRenderComponent(_component_UBadge, {
                          color: expense.billable ? "blue" : "gray",
                          size: "xs",
                          class: "ml-1"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(expense.billable ? "Yes" : "No")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(expense.billable ? "Yes" : "No"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div><div${_scopeId2}><span class="text-gray-500 dark:text-gray-400"${_scopeId2}>Date:</span><p class="font-medium"${_scopeId2}>${ssrInterpolate(formatDate(expense.date))}</p></div></div>`);
                        if (expense.notes) {
                          _push3(`<p class="text-sm text-gray-600 dark:text-gray-400 truncate"${_scopeId2}>${ssrInterpolate(expense.notes)}</p>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "space-y-3" }, [
                            createVNode("div", { class: "flex justify-between items-start" }, [
                              createVNode("div", { class: "flex items-start gap-3 min-w-0 flex-1" }, [
                                createVNode(_component_UCheckbox, {
                                  "model-value": unref(selectedExpenses).includes(expense.id),
                                  "onUpdate:modelValue": ($event) => toggleExpenseSelection(expense.id),
                                  class: "mt-1"
                                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                                createVNode("div", { class: "min-w-0 flex-1" }, [
                                  createVNode("h3", { class: "font-medium text-gray-900 dark:text-white truncate" }, toDisplayString(getPartnerName(expense)), 1),
                                  createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 truncate" }, toDisplayString(getUnitName(expense)), 1)
                                ])
                              ]),
                              createVNode(_component_UDropdown, {
                                items: getExpenseActions(expense)
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
                              }, 1032, ["items"])
                            ]),
                            createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Type:"),
                                createVNode(_component_UBadge, {
                                  color: getExpenseTypeColor(expense.type),
                                  size: "xs",
                                  class: "ml-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(expense.type), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"])
                              ]),
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Amount:"),
                                createVNode("p", { class: "font-medium text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(parseFloat(expense.amount).toLocaleString("en-US", { minimumFractionDigits: 0 })), 1)
                              ]),
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Status:"),
                                createVNode(_component_UBadge, {
                                  color: expense.paid ? "green" : "red",
                                  size: "xs",
                                  class: "ml-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(expense.paid ? "Paid" : "Unpaid"), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"])
                              ]),
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Billable:"),
                                createVNode(_component_UBadge, {
                                  color: expense.billable ? "blue" : "gray",
                                  size: "xs",
                                  class: "ml-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(expense.billable ? "Yes" : "No"), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"])
                              ]),
                              createVNode("div", null, [
                                createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Date:"),
                                createVNode("p", { class: "font-medium" }, toDisplayString(formatDate(expense.date)), 1)
                              ])
                            ]),
                            expense.notes ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-gray-600 dark:text-gray-400 truncate"
                            }, toDisplayString(expense.notes), 1)) : createCommentVNode("", true)
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
              if (unref(expenses).length) {
                _push2(`<div class="hidden sm:block"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UTable, {
                  rows: unref(expenses),
                  columns: expenseColumns
                }, {
                  "select-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UCheckbox, {
                        "model-value": unref(selectedExpenses).includes(row.id),
                        "onUpdate:modelValue": ($event) => toggleExpenseSelection(row.id)
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UCheckbox, {
                          "model-value": unref(selectedExpenses).includes(row.id),
                          "onUpdate:modelValue": ($event) => toggleExpenseSelection(row.id)
                        }, null, 8, ["model-value", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  "partner-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div${_scopeId2}><div class="font-medium text-gray-900 dark:text-white"${_scopeId2}>${ssrInterpolate(getPartnerName(row))}</div><div class="text-sm text-gray-500 dark:text-gray-400"${_scopeId2}>${ssrInterpolate(getUnitName(row))}</div></div>`);
                    } else {
                      return [
                        createVNode("div", null, [
                          createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(getPartnerName(row)), 1),
                          createVNode("div", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(getUnitName(row)), 1)
                        ])
                      ];
                    }
                  }),
                  "type-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UBadge, {
                        color: getExpenseTypeColor(row.type),
                        size: "xs"
                      }, {
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(row.type)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(row.type), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UBadge, {
                          color: getExpenseTypeColor(row.type),
                          size: "xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(row.type), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ];
                    }
                  }),
                  "amount-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-center space-x-2"${_scopeId2}><span class="font-semibold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId2}> \u20B1${ssrInterpolate(parseFloat(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 }))}</span>`);
                      if (row.receipt_url) {
                        _push3(ssrRenderComponent(_component_UIcon, {
                          name: "i-heroicons-photo",
                          class: "h-4 w-4 text-gray-400",
                          title: "Has receipt"
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex items-center space-x-2" }, [
                          createVNode("span", { class: "font-semibold text-metrobnb-600 dark:text-metrobnb-400" }, " \u20B1" + toDisplayString(parseFloat(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })), 1),
                          row.receipt_url ? (openBlock(), createBlock(_component_UIcon, {
                            key: 0,
                            name: "i-heroicons-photo",
                            class: "h-4 w-4 text-gray-400",
                            title: "Has receipt"
                          })) : createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  "billable-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UBadge, {
                        color: row.billable ? "blue" : "gray",
                        size: "xs"
                      }, {
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(row.billable ? "Yes" : "No")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(row.billable ? "Yes" : "No"), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UBadge, {
                          color: row.billable ? "blue" : "gray",
                          size: "xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(row.billable ? "Yes" : "No"), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ];
                    }
                  }),
                  "paid-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UBadge, {
                        color: row.paid ? "green" : "red",
                        size: "xs"
                      }, {
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(row.paid ? "Paid" : "Unpaid")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(row.paid ? "Paid" : "Unpaid"), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UBadge, {
                          color: row.paid ? "green" : "red",
                          size: "xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(row.paid ? "Paid" : "Unpaid"), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ];
                    }
                  }),
                  "date-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(formatDate(row.date))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(formatDate(row.date)), 1)
                      ];
                    }
                  }),
                  "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UDropdown, {
                        items: getExpenseActions(row)
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
                    } else {
                      return [
                        createVNode(_component_UDropdown, {
                          items: getExpenseActions(row)
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
                        }, 1032, ["items"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<div class="text-center py-12"${_scopeId}><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId}>No expenses yet</h3><p class="text-gray-600 dark:text-gray-400 mb-6"${_scopeId}>Start by recording your first expense</p><div class="flex space-x-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  to: "/accounting/expenses/capture",
                  color: "primary",
                  variant: "outline"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-heroicons-camera",
                        class: "mr-2"
                      }, null, _parent3, _scopeId2));
                      _push3(` Capture Receipt `);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-camera",
                          class: "mr-2"
                        }),
                        createTextVNode(" Capture Receipt ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  to: "/accounting/expenses/create",
                  color: "primary"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Add Expense`);
                    } else {
                      return [
                        createTextVNode("Add Expense")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_StandardPagination, {
              pagination: unref(pagination),
              onPageChange: handlePageChange
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "mb-4 space-y-3" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row gap-2 sm:gap-4" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(searchQuery),
                    "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
                    placeholder: "Search expenses...",
                    icon: "i-heroicons-magnifying-glass",
                    class: "w-full sm:flex-1",
                    size: "sm",
                    onInput: handleSearchInput
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_USelect, {
                      modelValue: unref(sortBy),
                      "onUpdate:modelValue": ($event) => isRef(sortBy) ? sortBy.value = $event : null,
                      options: sortOptions,
                      class: "flex-1 sm:w-auto",
                      size: "sm",
                      onChange: loadExpensesData
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UButton, {
                      variant: "outline",
                      size: "sm",
                      onClick: ($event) => showAdvancedFilters.value = !unref(showAdvancedFilters)
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-funnel",
                          class: "sm:mr-1"
                        }),
                        createVNode("span", { class: "hidden sm:inline" }, "Filters")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    unref(selectedExpenses).length > 0 ? (openBlock(), createBlock(_component_UButton, {
                      key: 0,
                      variant: "outline",
                      size: "sm",
                      onClick: ($event) => showBulkActions.value = !unref(showBulkActions)
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-squares-plus",
                          class: "sm:mr-1"
                        }),
                        createVNode("span", { class: "hidden sm:inline" }, "Bulk (" + toDisplayString(unref(selectedExpenses).length) + ")", 1)
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : createCommentVNode("", true)
                  ])
                ]),
                unref(showBulkActions) && unref(selectedExpenses).length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900"
                }, [
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "sm",
                      color: "green",
                      onClick: bulkMarkPaid
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-check-circle",
                          class: "mr-1"
                        }),
                        createTextVNode(" Mark Paid (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      size: "sm",
                      color: "red",
                      onClick: bulkMarkUnpaid
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-x-circle",
                          class: "mr-1"
                        }),
                        createTextVNode(" Mark Unpaid (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      size: "sm",
                      color: "blue",
                      onClick: bulkMarkBillable
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-tag",
                          class: "mr-1"
                        }),
                        createTextVNode(" Mark Billable (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      size: "sm",
                      color: "gray",
                      onClick: bulkMarkNonBillable
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-minus",
                          class: "mr-1"
                        }),
                        createTextVNode(" Mark Non-Billable (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      size: "sm",
                      color: "red",
                      onClick: bulkDelete
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-trash",
                          class: "mr-1"
                        }),
                        createTextVNode(" Delete (" + toDisplayString(unref(selectedExpenses).length) + ") ", 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      size: "sm",
                      color: "red",
                      variant: "outline",
                      onClick: clearSelection
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Clear Selection ")
                      ]),
                      _: 1
                    })
                  ])
                ])) : createCommentVNode("", true),
                unref(showAdvancedFilters) ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                }, [
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                    createVNode(_component_UFormGroup, { label: "Year" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(filterYear),
                          "onUpdate:modelValue": ($event) => isRef(filterYear) ? filterYear.value = $event : null,
                          options: unref(yearOptions),
                          placeholder: "All years"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Month" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(filterMonth),
                          "onUpdate:modelValue": ($event) => isRef(filterMonth) ? filterMonth.value = $event : null,
                          options: unref(monthOptions),
                          placeholder: "All months"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Partner" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(filterPartner),
                          "onUpdate:modelValue": ($event) => isRef(filterPartner) ? filterPartner.value = $event : null,
                          options: unref(partnerOptions),
                          placeholder: "Select partner"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Unit" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(filterUnit),
                          "onUpdate:modelValue": ($event) => isRef(filterUnit) ? filterUnit.value = $event : null,
                          options: unref(unitOptions),
                          placeholder: "Select unit",
                          disabled: !unref(filterPartner)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Type" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(filterType),
                          "onUpdate:modelValue": ($event) => isRef(filterType) ? filterType.value = $event : null,
                          options: typeFilterOptions,
                          placeholder: "Select type"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Payment Status" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(filterPaid),
                          "onUpdate:modelValue": ($event) => isRef(filterPaid) ? filterPaid.value = $event : null,
                          options: paidFilterOptions,
                          placeholder: "Select status"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Billable" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(filterBillable),
                          "onUpdate:modelValue": ($event) => isRef(filterBillable) ? filterBillable.value = $event : null,
                          options: billableFilterOptions,
                          placeholder: "Select billable"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Start Date" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(startDate),
                          "onUpdate:modelValue": ($event) => isRef(startDate) ? startDate.value = $event : null,
                          type: "date",
                          placeholder: "From date"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "End Date" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(endDate),
                          "onUpdate:modelValue": ($event) => isRef(endDate) ? endDate.value = $event : null,
                          type: "date",
                          placeholder: "To date"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "flex justify-end gap-2 mt-4" }, [
                    createVNode(_component_UButton, {
                      variant: "ghost",
                      onClick: clearFilters
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Clear All ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      color: "primary",
                      onClick: applyFilters
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Apply Filters ")
                      ]),
                      _: 1
                    })
                  ])
                ])) : createCommentVNode("", true)
              ]),
              unref(isLoading) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex justify-center py-8"
              }, [
                createVNode("div", { class: "text-gray-500" }, "Loading expenses...")
              ])) : createCommentVNode("", true),
              !unref(isLoading) ? (openBlock(), createBlock("div", { key: 1 }, [
                unref(expenses).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "sm:hidden space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(expenses), (expense) => {
                    return openBlock(), createBlock(_component_UCard, {
                      key: expense.id,
                      class: "p-4"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "space-y-3" }, [
                          createVNode("div", { class: "flex justify-between items-start" }, [
                            createVNode("div", { class: "flex items-start gap-3 min-w-0 flex-1" }, [
                              createVNode(_component_UCheckbox, {
                                "model-value": unref(selectedExpenses).includes(expense.id),
                                "onUpdate:modelValue": ($event) => toggleExpenseSelection(expense.id),
                                class: "mt-1"
                              }, null, 8, ["model-value", "onUpdate:modelValue"]),
                              createVNode("div", { class: "min-w-0 flex-1" }, [
                                createVNode("h3", { class: "font-medium text-gray-900 dark:text-white truncate" }, toDisplayString(getPartnerName(expense)), 1),
                                createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 truncate" }, toDisplayString(getUnitName(expense)), 1)
                              ])
                            ]),
                            createVNode(_component_UDropdown, {
                              items: getExpenseActions(expense)
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
                            }, 1032, ["items"])
                          ]),
                          createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Type:"),
                              createVNode(_component_UBadge, {
                                color: getExpenseTypeColor(expense.type),
                                size: "xs",
                                class: "ml-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(expense.type), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Amount:"),
                              createVNode("p", { class: "font-medium text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(parseFloat(expense.amount).toLocaleString("en-US", { minimumFractionDigits: 0 })), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Status:"),
                              createVNode(_component_UBadge, {
                                color: expense.paid ? "green" : "red",
                                size: "xs",
                                class: "ml-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(expense.paid ? "Paid" : "Unpaid"), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Billable:"),
                              createVNode(_component_UBadge, {
                                color: expense.billable ? "blue" : "gray",
                                size: "xs",
                                class: "ml-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(expense.billable ? "Yes" : "No"), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            createVNode("div", null, [
                              createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Date:"),
                              createVNode("p", { class: "font-medium" }, toDisplayString(formatDate(expense.date)), 1)
                            ])
                          ]),
                          expense.notes ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-gray-600 dark:text-gray-400 truncate"
                          }, toDisplayString(expense.notes), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ])) : createCommentVNode("", true),
                unref(expenses).length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "hidden sm:block"
                }, [
                  createVNode(_component_UTable, {
                    rows: unref(expenses),
                    columns: expenseColumns
                  }, {
                    "select-data": withCtx(({ row }) => [
                      createVNode(_component_UCheckbox, {
                        "model-value": unref(selectedExpenses).includes(row.id),
                        "onUpdate:modelValue": ($event) => toggleExpenseSelection(row.id)
                      }, null, 8, ["model-value", "onUpdate:modelValue"])
                    ]),
                    "partner-data": withCtx(({ row }) => [
                      createVNode("div", null, [
                        createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(getPartnerName(row)), 1),
                        createVNode("div", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(getUnitName(row)), 1)
                      ])
                    ]),
                    "type-data": withCtx(({ row }) => [
                      createVNode(_component_UBadge, {
                        color: getExpenseTypeColor(row.type),
                        size: "xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(row.type), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    "amount-data": withCtx(({ row }) => [
                      createVNode("div", { class: "flex items-center space-x-2" }, [
                        createVNode("span", { class: "font-semibold text-metrobnb-600 dark:text-metrobnb-400" }, " \u20B1" + toDisplayString(parseFloat(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })), 1),
                        row.receipt_url ? (openBlock(), createBlock(_component_UIcon, {
                          key: 0,
                          name: "i-heroicons-photo",
                          class: "h-4 w-4 text-gray-400",
                          title: "Has receipt"
                        })) : createCommentVNode("", true)
                      ])
                    ]),
                    "billable-data": withCtx(({ row }) => [
                      createVNode(_component_UBadge, {
                        color: row.billable ? "blue" : "gray",
                        size: "xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(row.billable ? "Yes" : "No"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    "paid-data": withCtx(({ row }) => [
                      createVNode(_component_UBadge, {
                        color: row.paid ? "green" : "red",
                        size: "xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(row.paid ? "Paid" : "Unpaid"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    "date-data": withCtx(({ row }) => [
                      createTextVNode(toDisplayString(formatDate(row.date)), 1)
                    ]),
                    "actions-data": withCtx(({ row }) => [
                      createVNode(_component_UDropdown, {
                        items: getExpenseActions(row)
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
                      }, 1032, ["items"])
                    ]),
                    _: 2
                  }, 1032, ["rows"])
                ])) : (openBlock(), createBlock("div", {
                  key: 2,
                  class: "text-center py-12"
                }, [
                  createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "No expenses yet"),
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400 mb-6" }, "Start by recording your first expense"),
                  createVNode("div", { class: "flex space-x-3" }, [
                    createVNode(_component_UButton, {
                      to: "/accounting/expenses/capture",
                      color: "primary",
                      variant: "outline"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-camera",
                          class: "mr-2"
                        }),
                        createTextVNode(" Capture Receipt ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      to: "/accounting/expenses/create",
                      color: "primary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add Expense")
                      ]),
                      _: 1
                    })
                  ])
                ]))
              ])) : createCommentVNode("", true),
              createVNode(_component_StandardPagination, {
                pagination: unref(pagination),
                onPageChange: handlePageChange
              }, null, 8, ["pagination"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_ExpensesEditExpenseModal, {
        modelValue: unref(showEditModal),
        "onUpdate:modelValue": ($event) => isRef(showEditModal) ? showEditModal.value = $event : null,
        expense: unref(selectedExpense),
        onUpdated: handleUpdated
      }, null, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showDeleteModal),
        "onUpdate:modelValue": ($event) => isRef(showDeleteModal) ? showDeleteModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Delete Expense</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Delete Expense")
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => showDeleteModal.value = false,
                    disabled: unref(deleteLoading)
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
                    color: "red",
                    onClick: confirmDelete,
                    loading: unref(deleteLoading)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Delete`);
                      } else {
                        return [
                          createTextVNode("Delete")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end gap-3" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        onClick: ($event) => showDeleteModal.value = false,
                        disabled: unref(deleteLoading)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }, 8, ["onClick", "disabled"]),
                      createVNode(_component_UButton, {
                        color: "red",
                        onClick: confirmDelete,
                        loading: unref(deleteLoading)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Delete")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-gray-600 dark:text-gray-400"${_scopeId2}> Are you sure you want to delete this expense? This action cannot be undone. </p>`);
                } else {
                  return [
                    createVNode("p", { class: "text-gray-600 dark:text-gray-400" }, " Are you sure you want to delete this expense? This action cannot be undone. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Delete Expense")
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-3" }, [
                    createVNode(_component_UButton, {
                      color: "gray",
                      variant: "ghost",
                      onClick: ($event) => showDeleteModal.value = false,
                      disabled: unref(deleteLoading)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Cancel")
                      ]),
                      _: 1
                    }, 8, ["onClick", "disabled"]),
                    createVNode(_component_UButton, {
                      color: "red",
                      onClick: confirmDelete,
                      loading: unref(deleteLoading)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Delete")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400" }, " Are you sure you want to delete this expense? This action cannot be undone. ")
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/expenses/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D144J0cE.mjs.map
