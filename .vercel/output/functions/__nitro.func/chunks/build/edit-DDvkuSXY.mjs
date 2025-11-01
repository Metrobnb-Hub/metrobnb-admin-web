import { _ as _sfc_main$2 } from './LoadingState-E-q5kgKv.mjs';
import { b as useRouter, d as useRoute, L as __nuxt_component_2, f as __nuxt_component_0$2, e as __nuxt_component_1$1 } from './server.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ErrorState",
  __ssrInlineRender: true,
  props: {
    title: { default: "Something went wrong" },
    message: { default: "We encountered an error while loading this page." },
    showRetry: { type: Boolean, default: true },
    showHome: { type: Boolean, default: true }
  },
  emits: ["retry"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center py-12" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-exclamation-triangle",
        class: "mx-auto h-12 w-12 text-red-500 mb-4"
      }, null, _parent));
      _push(`<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">${ssrInterpolate(_ctx.title)}</h3><p class="text-gray-500 dark:text-gray-400 mb-6">${ssrInterpolate(_ctx.message)}</p><div class="space-x-3">`);
      if (_ctx.showRetry) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => _ctx.$emit("retry"),
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-arrow-path",
                class: "mr-2"
              }, null, _parent2, _scopeId));
              _push2(` Try Again `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-arrow-path",
                  class: "mr-2"
                }),
                createTextVNode(" Try Again ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.showHome) {
        _push(ssrRenderComponent(_component_UButton, {
          to: "/dashboard",
          color: "gray"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-home",
                class: "mr-2"
              }, null, _parent2, _scopeId));
              _push2(` Go Home `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-home",
                  class: "mr-2"
                }),
                createTextVNode(" Go Home ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ErrorState.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const { partners, loadPartners } = useGlobalCache();
    const { getJournalEntries, updateJournalEntry } = useApi();
    const { notifySuccess, notifyError } = useNotify();
    const router = useRouter();
    const route = useRoute();
    const entryId = route.params.id;
    const loading = ref(true);
    const saving = ref(false);
    const entry = ref(null);
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
      date: "",
      amount: 0,
      description: "",
      reference: "",
      notes: ""
    });
    const partnerOptions = computed(
      () => partners.value.map((p) => ({ label: p.name, value: p.id }))
    );
    const typeOptions = [
      { label: "Credit (+) - Money owed to partner", value: "credit" },
      { label: "Debit (-) - Money owed by partner", value: "debit" }
    ];
    const loadEntry = async () => {
      try {
        loading.value = true;
        await loadPartners();
        const entriesResponse = await getJournalEntries();
        let entries = [];
        if (entriesResponse && entriesResponse.data) {
          entries = Array.isArray(entriesResponse.data.items) ? entriesResponse.data.items : [];
        } else {
          entries = Array.isArray(entriesResponse) ? entriesResponse : [];
        }
        const foundEntry = entries.find((e) => e.id === entryId);
        if (!foundEntry) {
          notifyError("Journal entry not found");
          return;
        }
        entry.value = foundEntry;
        state.partnerId = foundEntry.partner_id;
        state.type = foundEntry.type;
        state.date = foundEntry.date;
        state.amount = parseFloat(foundEntry.amount);
        state.description = foundEntry.description;
        state.reference = foundEntry.reference || "";
        state.notes = foundEntry.notes || "";
      } catch (error) {
        notifyError("Failed to load journal entry");
      } finally {
        loading.value = false;
      }
    };
    const onSubmit = async () => {
      try {
        saving.value = true;
        const updateData = {
          partner_id: state.partnerId,
          type: state.type,
          date: state.date,
          amount: state.amount,
          description: state.description,
          reference: state.reference || void 0,
          notes: state.notes || void 0
        };
        await updateJournalEntry(entryId, updateData);
        notifySuccess(`${state.type === "credit" ? "Credit" : "Debit"} entry updated successfully`);
        router.push("/journal-entries");
      } catch (error) {
        notifyError("Failed to update journal entry");
      } finally {
        saving.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingState = _sfc_main$2;
      const _component_ErrorState = _sfc_main$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_UInput = __nuxt_component_6;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Journal Entry</h1><p class="text-gray-600 dark:text-gray-400">Update journal entry details</p></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-8">`);
        _push(ssrRenderComponent(_component_LoadingState, { message: "Loading journal entry..." }, null, _parent));
        _push(`</div>`);
      } else if (!unref(entry)) {
        _push(`<div class="text-center py-8">`);
        _push(ssrRenderComponent(_component_ErrorState, {
          title: "Entry not found",
          message: "The journal entry you're looking for doesn't exist.",
          "show-retry": false,
          onRetry: loadEntry
        }, null, _parent));
        _push(`</div>`);
      } else {
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
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(state).date,
                            "onUpdate:modelValue": ($event) => unref(state).date = $event,
                            type: "date"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(state).date,
                              "onUpdate:modelValue": ($event) => unref(state).date = $event,
                              type: "date"
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
                    _push3(`</div><div class="flex justify-end space-x-3 mt-6"${_scopeId2}>`);
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
                      loading: unref(saving)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Update Entry`);
                        } else {
                          return [
                            createTextVNode("Update Entry")
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
                            createVNode(_component_UInput, {
                              modelValue: unref(state).date,
                              "onUpdate:modelValue": ($event) => unref(state).date = $event,
                              type: "date"
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
                          loading: unref(saving)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Update Entry")
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
                          createVNode(_component_UInput, {
                            modelValue: unref(state).date,
                            "onUpdate:modelValue": ($event) => unref(state).date = $event,
                            type: "date"
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
                        loading: unref(saving)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Update Entry")
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
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/journal-entries/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-DDvkuSXY.mjs.map
