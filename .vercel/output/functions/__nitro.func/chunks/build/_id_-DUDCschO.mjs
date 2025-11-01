import { d as useRoute, f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, createBlock, openBlock, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
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
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { getDraftExpenses, completeExpense: completeExpenseApi } = useApi();
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const { notifySuccess, notifyError } = useNotify();
    const expenseId = route.params.id;
    const loading = ref(true);
    const completing = ref(false);
    const expense = ref(null);
    const formData = reactive({
      partner_id: "",
      unit_id: "",
      amount: "",
      type: "Miscellaneous",
      paid_by: "metrobnb",
      notes: ""
    });
    const expenseTypeOptions = [
      { label: "Supplies", value: "Supplies" },
      { label: "Wifi", value: "Wifi" },
      { label: "Electricity", value: "Electricity" },
      { label: "Repair", value: "Repair" },
      { label: "Repairs", value: "Repairs" },
      { label: "Laundry", value: "Laundry" },
      { label: "Cleaning", value: "Cleaning" },
      { label: "Miscellaneous", value: "Miscellaneous" }
    ];
    const paidByOptions = [
      { label: "MetroBNB", value: "metrobnb" },
      { label: "Partner", value: "partner" },
      { label: "Employee", value: "employee" },
      { label: "Owner", value: "owner" }
    ];
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return partners.value.map((p) => ({ label: p.name, value: p.id }));
    });
    const unitOptions = computed(() => {
      if (!Array.isArray(units.value)) return [];
      return units.value.map((u) => ({ label: u.name, value: u.id }));
    });
    const completeExpense = async () => {
      if (!formData.partner_id || !formData.unit_id || !formData.amount || !formData.type) {
        notifyError("Please fill in all required fields");
        return;
      }
      try {
        completing.value = true;
        await completeExpenseApi(expenseId, {
          partner_id: formData.partner_id,
          unit_id: formData.unit_id,
          amount: formData.amount,
          type: formData.type,
          paid_by: formData.paid_by
        });
        notifySuccess("Expense completed successfully");
        await navigateTo("/expenses");
      } catch (error) {
        notifyError("Failed to complete expense");
      } finally {
        completing.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_UInput = __nuxt_component_6;
      const _component_UTextarea = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Review Expense</h1><p class="text-gray-600 dark:text-gray-400">Complete the expense details</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/accounting/expenses",
        variant: "ghost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-x-mark",
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Cancel `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-x-mark",
                class: "mr-2"
              }),
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-8"><div class="text-gray-500">Loading expense...</div></div>`);
      } else if (unref(expense)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Receipt</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-lg font-semibold" }, "Receipt")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(expense).receipt_url) {
                _push2(`<div class="text-center"${_scopeId}><img${ssrRenderAttr("src", unref(expense).receipt_url)} alt="Receipt" class="max-w-full h-96 object-contain mx-auto rounded-lg border"${_scopeId}></div>`);
              } else {
                _push2(`<div class="text-center py-8 text-gray-500"${_scopeId}> No receipt image available </div>`);
              }
            } else {
              return [
                unref(expense).receipt_url ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center"
                }, [
                  createVNode("img", {
                    src: unref(expense).receipt_url,
                    alt: "Receipt",
                    class: "max-w-full h-96 object-contain mx-auto rounded-lg border"
                  }, null, 8, ["src"])
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-8 text-gray-500"
                }, " No receipt image available "))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Expense Details</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-lg font-semibold" }, "Expense Details")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<form class="space-y-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UFormGroup, {
                label: "Partner",
                required: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(formData).partner_id,
                      "onUpdate:modelValue": ($event) => unref(formData).partner_id = $event,
                      options: unref(partnerOptions),
                      placeholder: "Select partner"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(formData).partner_id,
                        "onUpdate:modelValue": ($event) => unref(formData).partner_id = $event,
                        options: unref(partnerOptions),
                        placeholder: "Select partner"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, {
                label: "Unit",
                required: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(formData).unit_id,
                      "onUpdate:modelValue": ($event) => unref(formData).unit_id = $event,
                      options: unref(unitOptions),
                      placeholder: "Select unit"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(formData).unit_id,
                        "onUpdate:modelValue": ($event) => unref(formData).unit_id = $event,
                        options: unref(unitOptions),
                        placeholder: "Select unit"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, {
                label: "Amount",
                required: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(formData).amount,
                      "onUpdate:modelValue": ($event) => unref(formData).amount = $event,
                      type: "number",
                      step: "0.01",
                      placeholder: "0.00"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(formData).amount,
                        "onUpdate:modelValue": ($event) => unref(formData).amount = $event,
                        type: "number",
                        step: "0.01",
                        placeholder: "0.00"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, {
                label: "Expense Type",
                required: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(formData).type,
                      "onUpdate:modelValue": ($event) => unref(formData).type = $event,
                      options: expenseTypeOptions,
                      placeholder: "Select type"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(formData).type,
                        "onUpdate:modelValue": ($event) => unref(formData).type = $event,
                        options: expenseTypeOptions,
                        placeholder: "Select type"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Paid By" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(formData).paid_by,
                      "onUpdate:modelValue": ($event) => unref(formData).paid_by = $event,
                      options: paidByOptions
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(formData).paid_by,
                        "onUpdate:modelValue": ($event) => unref(formData).paid_by = $event,
                        options: paidByOptions
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Notes" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UTextarea, {
                      modelValue: unref(formData).notes,
                      "onUpdate:modelValue": ($event) => unref(formData).notes = $event,
                      placeholder: "Additional notes...",
                      rows: "3"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(formData).notes,
                        "onUpdate:modelValue": ($event) => unref(formData).notes = $event,
                        placeholder: "Additional notes...",
                        rows: "3"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex justify-end space-x-3 pt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/accounting/expenses",
                variant: "outline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Save as Draft `);
                  } else {
                    return [
                      createTextVNode(" Save as Draft ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                type: "submit",
                color: "primary",
                loading: unref(completing)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Complete Expense `);
                  } else {
                    return [
                      createTextVNode(" Complete Expense ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></form>`);
            } else {
              return [
                createVNode("form", {
                  onSubmit: withModifiers(completeExpense, ["prevent"]),
                  class: "space-y-4"
                }, [
                  createVNode(_component_UFormGroup, {
                    label: "Partner",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(formData).partner_id,
                        "onUpdate:modelValue": ($event) => unref(formData).partner_id = $event,
                        options: unref(partnerOptions),
                        placeholder: "Select partner"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Unit",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(formData).unit_id,
                        "onUpdate:modelValue": ($event) => unref(formData).unit_id = $event,
                        options: unref(unitOptions),
                        placeholder: "Select unit"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Amount",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(formData).amount,
                        "onUpdate:modelValue": ($event) => unref(formData).amount = $event,
                        type: "number",
                        step: "0.01",
                        placeholder: "0.00"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Expense Type",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(formData).type,
                        "onUpdate:modelValue": ($event) => unref(formData).type = $event,
                        options: expenseTypeOptions,
                        placeholder: "Select type"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "Paid By" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(formData).paid_by,
                        "onUpdate:modelValue": ($event) => unref(formData).paid_by = $event,
                        options: paidByOptions
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "Notes" }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(formData).notes,
                        "onUpdate:modelValue": ($event) => unref(formData).notes = $event,
                        placeholder: "Additional notes...",
                        rows: "3"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "flex justify-end space-x-3 pt-4" }, [
                    createVNode(_component_UButton, {
                      to: "/accounting/expenses",
                      variant: "outline"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Save as Draft ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      color: "primary",
                      loading: unref(completing)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Complete Expense ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ], 32)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/expenses/review/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DUDCschO.mjs.map
