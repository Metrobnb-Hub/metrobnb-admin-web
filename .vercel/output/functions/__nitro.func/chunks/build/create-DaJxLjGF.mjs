import { b as useRouter, L as __nuxt_component_2, f as __nuxt_component_0$2 } from './server.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as _sfc_main$1 } from './DateInput-H5QDo9cM.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { z } from 'zod';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
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
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const { partners, loadPartners } = useGlobalCache();
    const { createJournalEntry } = useApi();
    const { notifySuccess, notifyError } = useNotify();
    const router = useRouter();
    const loading = ref(false);
    const schema = z.object({
      partnerId: z.string().min(1, "Partner is required"),
      type: z.enum(["credit", "debit"]),
      date: z.string().min(1, "Date is required"),
      amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
      description: z.string().min(1, "Description is required"),
      reference: z.string().optional(),
      notes: z.string().optional()
    });
    const state = reactive({
      partnerId: "",
      type: "credit",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      amount: 0,
      description: "",
      reference: "",
      notes: ""
    });
    const partnerOptions = computed(
      () => partners.value.map((p) => ({ label: p.name, value: p.id }))
    );
    const typeOptions = [
      {
        label: "Credit (+) - Partner gets money",
        value: "credit"
      },
      {
        label: "Debit (-) - Partner owes money",
        value: "debit"
      }
    ];
    const getPartnerName = (partnerId) => {
      const partner = partners.value.find((p) => p.id === partnerId);
      return (partner == null ? void 0 : partner.name) || "";
    };
    const onSubmit = async () => {
      try {
        loading.value = true;
        const entryData = {
          partner_id: state.partnerId,
          type: state.type,
          date: state.date,
          amount: state.amount,
          description: state.description,
          reference: state.reference || void 0,
          notes: state.notes || void 0
        };
        await createJournalEntry(entryData);
        notifySuccess(`${state.type === "credit" ? "Credit" : "Debit"} entry created successfully`);
        router.push("/journal-entries");
      } catch (error) {
        notifyError("Failed to create journal entry");
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_DateInput = _sfc_main$1;
      const _component_UInput = __nuxt_component_6;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Journal Entry</h1><p class="text-gray-600 dark:text-gray-400">Add a credit or debit entry for a partner</p></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              schema: unref(schema),
              state: unref(state),
              onSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Partner",
                    name: "partnerId",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(state).partnerId,
                          "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                          options: unref(partnerOptions),
                          placeholder: "Select partner"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(state).partnerId,
                            "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                            options: unref(partnerOptions),
                            placeholder: "Select partner"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Entry Type",
                    name: "type",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(state).type,
                          "onUpdate:modelValue": ($event) => unref(state).type = $event,
                          options: typeOptions
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(state).type,
                            "onUpdate:modelValue": ($event) => unref(state).type = $event,
                            options: typeOptions
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Date",
                    name: "date",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_DateInput, {
                          modelValue: unref(state).date,
                          "onUpdate:modelValue": ($event) => unref(state).date = $event
                        }, null, _parent4, _scopeId3));
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Amount",
                    name: "amount",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).amount,
                          "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                          type: "number",
                          step: "0.01",
                          min: "0",
                          placeholder: "0.00"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).amount,
                            "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                            type: "number",
                            step: "0.01",
                            min: "0",
                            placeholder: "0.00"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Description",
                    name: "description",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).description,
                          "onUpdate:modelValue": ($event) => unref(state).description = $event,
                          placeholder: "Brief description of the entry"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).description,
                            "onUpdate:modelValue": ($event) => unref(state).description = $event,
                            placeholder: "Brief description of the entry"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Reference",
                    name: "reference"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).reference,
                          "onUpdate:modelValue": ($event) => unref(state).reference = $event,
                          placeholder: "Reference number or ID (optional)"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).reference,
                            "onUpdate:modelValue": ($event) => unref(state).reference = $event,
                            placeholder: "Reference number or ID (optional)"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Notes",
                    name: "notes"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(state).notes,
                          "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                          placeholder: "Additional notes (optional)",
                          rows: 3
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(state).notes,
                            "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                            placeholder: "Additional notes (optional)",
                            rows: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (unref(state).partnerId && unref(state).type && unref(state).amount) {
                    _push3(`<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"${_scopeId2}><h4 class="font-medium text-gray-900 dark:text-white mb-2"${_scopeId2}>Preview</h4><div class="text-sm space-y-1"${_scopeId2}><div class="flex justify-between"${_scopeId2}><span class="text-gray-600 dark:text-gray-400"${_scopeId2}>Partner:</span><span class="font-medium"${_scopeId2}>${ssrInterpolate(getPartnerName(unref(state).partnerId))}</span></div><div class="flex justify-between"${_scopeId2}><span class="text-gray-600 dark:text-gray-400"${_scopeId2}>Type:</span><span class="${ssrRenderClass([unref(state).type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400", "font-medium"])}"${_scopeId2}>${ssrInterpolate(unref(state).type === "credit" ? "Credit (+)" : "Debit (-)")}</span></div><div class="flex justify-between"${_scopeId2}><span class="text-gray-600 dark:text-gray-400"${_scopeId2}>Amount:</span><span class="${ssrRenderClass([unref(state).type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400", "font-bold text-lg"])}"${_scopeId2}>${ssrInterpolate(unref(state).type === "credit" ? "+" : "-")}\u20B1${ssrInterpolate(Number(unref(state).amount || 0).toLocaleString())}</span></div></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="flex justify-end space-x-3 mt-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    to: "/accounting/journal-entries"
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
                    type: "submit",
                    color: "primary",
                    loading: unref(loading)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Create Entry`);
                      } else {
                        return [
                          createTextVNode("Create Entry")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(_component_UFormGroup, {
                        label: "Partner",
                        name: "partnerId",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(state).partnerId,
                            "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                            options: unref(partnerOptions),
                            placeholder: "Select partner"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Entry Type",
                        name: "type",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(state).type,
                            "onUpdate:modelValue": ($event) => unref(state).type = $event,
                            options: typeOptions
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                            min: "0",
                            placeholder: "0.00"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Description",
                        name: "description",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).description,
                            "onUpdate:modelValue": ($event) => unref(state).description = $event,
                            placeholder: "Brief description of the entry"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Reference",
                        name: "reference"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).reference,
                            "onUpdate:modelValue": ($event) => unref(state).reference = $event,
                            placeholder: "Reference number or ID (optional)"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Notes",
                        name: "notes"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(state).notes,
                            "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                            placeholder: "Additional notes (optional)",
                            rows: 3
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    unref(state).partnerId && unref(state).type && unref(state).amount ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    }, [
                      createVNode("h4", { class: "font-medium text-gray-900 dark:text-white mb-2" }, "Preview"),
                      createVNode("div", { class: "text-sm space-y-1" }, [
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Partner:"),
                          createVNode("span", { class: "font-medium" }, toDisplayString(getPartnerName(unref(state).partnerId)), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Type:"),
                          createVNode("span", {
                            class: ["font-medium", unref(state).type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"]
                          }, toDisplayString(unref(state).type === "credit" ? "Credit (+)" : "Debit (-)"), 3)
                        ]),
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Amount:"),
                          createVNode("span", {
                            class: ["font-bold text-lg", unref(state).type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"]
                          }, toDisplayString(unref(state).type === "credit" ? "+" : "-") + "\u20B1" + toDisplayString(Number(unref(state).amount || 0).toLocaleString()), 3)
                        ])
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        to: "/accounting/journal-entries"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "primary",
                        loading: unref(loading)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Create Entry")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UForm, {
                schema: unref(schema),
                state: unref(state),
                onSubmit
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Partner",
                      name: "partnerId",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).partnerId,
                          "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                          options: unref(partnerOptions),
                          placeholder: "Select partner"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Entry Type",
                      name: "type",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).type,
                          "onUpdate:modelValue": ($event) => unref(state).type = $event,
                          options: typeOptions
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                          min: "0",
                          placeholder: "0.00"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Description",
                      name: "description",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).description,
                          "onUpdate:modelValue": ($event) => unref(state).description = $event,
                          placeholder: "Brief description of the entry"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Reference",
                      name: "reference"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).reference,
                          "onUpdate:modelValue": ($event) => unref(state).reference = $event,
                          placeholder: "Reference number or ID (optional)"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Notes",
                      name: "notes"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(state).notes,
                          "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                          placeholder: "Additional notes (optional)",
                          rows: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  unref(state).partnerId && unref(state).type && unref(state).amount ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  }, [
                    createVNode("h4", { class: "font-medium text-gray-900 dark:text-white mb-2" }, "Preview"),
                    createVNode("div", { class: "text-sm space-y-1" }, [
                      createVNode("div", { class: "flex justify-between" }, [
                        createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Partner:"),
                        createVNode("span", { class: "font-medium" }, toDisplayString(getPartnerName(unref(state).partnerId)), 1)
                      ]),
                      createVNode("div", { class: "flex justify-between" }, [
                        createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Type:"),
                        createVNode("span", {
                          class: ["font-medium", unref(state).type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"]
                        }, toDisplayString(unref(state).type === "credit" ? "Credit (+)" : "Debit (-)"), 3)
                      ]),
                      createVNode("div", { class: "flex justify-between" }, [
                        createVNode("span", { class: "text-gray-600 dark:text-gray-400" }, "Amount:"),
                        createVNode("span", {
                          class: ["font-bold text-lg", unref(state).type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"]
                        }, toDisplayString(unref(state).type === "credit" ? "+" : "-") + "\u20B1" + toDisplayString(Number(unref(state).amount || 0).toLocaleString()), 3)
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                    createVNode(_component_UButton, {
                      color: "gray",
                      variant: "ghost",
                      to: "/accounting/journal-entries"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Cancel")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      color: "primary",
                      loading: unref(loading)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Create Entry")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ]),
                _: 2
              }, 1032, ["schema", "state"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/journal-entries/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-DaJxLjGF.mjs.map
