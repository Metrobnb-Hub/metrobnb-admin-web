import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2, g as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as _sfc_main$3 } from './LoadingState-E-q5kgKv.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, createBlock, openBlock, Fragment, renderList, createCommentVNode, isRef, mergeModels, useModel, reactive, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { _ as __nuxt_component_6 } from './Dropdown-rKaqrBy2.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as _sfc_main$4 } from './DateInput-H5QDo9cM.mjs';
import { _ as __nuxt_component_6$1 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { z } from 'zod';
import { u as useDataManager } from './useDataManager-_ycBTlnZ.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
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
import './cookie-CGcYVFcE.mjs';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "EmptyState",
  __ssrInlineRender: true,
  props: {
    icon: { default: "i-heroicons-inbox" },
    title: {},
    message: {},
    actionText: {},
    actionTo: {},
    actionIcon: { default: "i-heroicons-plus" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center py-12" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: _ctx.icon,
        class: "mx-auto h-12 w-12 text-gray-400 mb-4"
      }, null, _parent));
      _push(`<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">${ssrInterpolate(_ctx.title)}</h3><p class="text-gray-500 dark:text-gray-400 mb-6">${ssrInterpolate(_ctx.message)}</p>`);
      if (_ctx.actionText && _ctx.actionTo) {
        _push(ssrRenderComponent(_component_UButton, {
          to: _ctx.actionTo,
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: _ctx.actionIcon,
                class: "mr-2"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(_ctx.actionText)}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: _ctx.actionIcon,
                  class: "mr-2"
                }, null, 8, ["name"]),
                createTextVNode(" " + toDisplayString(_ctx.actionText), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EmptyState.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EditModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    entry: {}
  }, {
    "modelValue": { type: Boolean },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["updated"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const { partners } = useDataManager();
    const { updateJournalEntry } = useApi();
    const { notifySuccess, notifyError } = useNotify();
    const isOpen = useModel(__props, "modelValue");
    const saving = ref(false);
    const props = __props;
    const emit = __emit;
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
    const populateForm = () => {
      if (props.entry) {
        state.partnerId = props.entry.partner_id;
        state.type = props.entry.type;
        state.date = props.entry.date;
        state.amount = parseFloat(props.entry.amount);
        state.description = props.entry.description;
        state.reference = props.entry.reference || "";
        state.notes = props.entry.notes || "";
      }
    };
    const onSubmit = async () => {
      if (!props.entry) return;
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
        await updateJournalEntry(props.entry.id, updateData);
        notifySuccess(`${state.type === "credit" ? "Credit" : "Debit"} entry updated successfully`);
        isOpen.value = false;
        emit("updated");
      } catch (error) {
        notifyError("Failed to update journal entry");
      } finally {
        saving.value = false;
      }
    };
    watch(() => props.entry, populateForm, { immediate: true });
    watch(isOpen, (newValue) => {
      if (newValue) populateForm();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = __nuxt_component_0;
      const _component_UCard = __nuxt_component_2;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_DateInput = _sfc_main$4;
      const _component_UInput = __nuxt_component_6$1;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UButton = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        modelValue: isOpen.value,
        "onUpdate:modelValue": ($event) => isOpen.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Edit Journal Entry</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Edit Journal Entry")
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
                        _push4(`<div class="space-y-4"${_scopeId3}>`);
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
                                options: unref(partnerOptions),
                                placeholder: "Select partner"
                              }, null, _parent5, _scopeId4));
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Entry Type",
                          name: "type",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).type,
                                "onUpdate:modelValue": ($event) => unref(state).type = $event,
                                options: typeOptions
                              }, null, _parent5, _scopeId4));
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
                                min: "0",
                                placeholder: "0.00"
                              }, null, _parent5, _scopeId4));
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Description",
                          name: "description",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(state).description,
                                "onUpdate:modelValue": ($event) => unref(state).description = $event,
                                placeholder: "Brief description of the entry"
                              }, null, _parent5, _scopeId4));
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Reference",
                          name: "reference"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(state).reference,
                                "onUpdate:modelValue": ($event) => unref(state).reference = $event,
                                placeholder: "Reference number or ID (optional)"
                              }, null, _parent5, _scopeId4));
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Notes",
                          name: "notes"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UTextarea, {
                                modelValue: unref(state).notes,
                                "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                                placeholder: "Additional notes (optional)",
                                rows: 3
                              }, null, _parent5, _scopeId4));
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
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="flex justify-end space-x-3 mt-6"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false,
                          disabled: unref(saving)
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
                          loading: unref(saving)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Update Entry`);
                            } else {
                              return [
                                createTextVNode("Update Entry")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
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
                          createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                            createVNode(_component_UButton, {
                              color: "gray",
                              variant: "ghost",
                              onClick: ($event) => isOpen.value = false,
                              disabled: unref(saving)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick", "disabled"]),
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
                  }, _parent3, _scopeId2));
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
                        createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            onClick: ($event) => isOpen.value = false,
                            disabled: unref(saving)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick", "disabled"]),
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Edit Journal Entry")
                ]),
                default: withCtx(() => [
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
                      createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false,
                          disabled: unref(saving)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick", "disabled"]),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/journal-entries/EditModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { partners, loadPartners } = useGlobalCache();
    const { getJournalEntries, deleteJournalEntry } = useApi();
    const { notifySuccess, notifyError } = useNotify();
    const { extractData } = useApiResponse();
    const loading = ref(true);
    const entries = ref([]);
    const selectedPartner = ref("");
    const selectedType = ref("");
    const showEditModal = ref(false);
    const editingEntry = ref(null);
    const partnerOptions = computed(() => [
      { label: "All Partners", value: "" },
      ...partners.value.map((p) => ({ label: p.name, value: p.id }))
    ]);
    const typeOptions = [
      { label: "All Types", value: "" },
      { label: "Credits", value: "credit" },
      { label: "Debits", value: "debit" }
    ];
    const filteredEntries = computed(() => {
      let filtered = entries.value;
      if (selectedPartner.value) {
        filtered = filtered.filter((e) => e.partner_id === selectedPartner.value);
      }
      if (selectedType.value) {
        filtered = filtered.filter((e) => e.type === selectedType.value);
      }
      return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    const totalCredits = computed(
      () => entries.value.filter((e) => e.type === "credit").reduce((sum, e) => sum + getAmountValue(e.amount), 0)
    );
    const totalDebits = computed(
      () => entries.value.filter((e) => e.type === "debit").reduce((sum, e) => sum + getAmountValue(e.amount), 0)
    );
    const netBalance = computed(() => totalDebits.value - totalCredits.value);
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
    const getPartnerName = (partnerId) => {
      if (!partnerId) return "No Partner";
      const partner = partners.value.find((p) => p.id === partnerId);
      return (partner == null ? void 0 : partner.name) || `Unknown Partner (${partnerId.slice(0, 8)}...)`;
    };
    const getAmountValue = (amount) => {
      return typeof amount === "string" ? parseFloat(amount) : amount;
    };
    const editEntry = (entry) => {
      editingEntry.value = entry;
      showEditModal.value = true;
    };
    const getActions = (entry) => [
      [{
        label: "Edit",
        icon: "i-heroicons-pencil-square",
        click: () => editEntry(entry)
      }],
      [{
        label: "Delete",
        icon: "i-heroicons-trash",
        click: () => deleteEntry(entry)
      }]
    ];
    const deleteEntry = async (entry) => {
      const { confirm } = useConfirm();
      if (await confirm(`Are you sure you want to delete this ${entry.type} entry?`, {
        title: "Delete Entry",
        confirmText: "Delete",
        confirmColor: "red"
      })) {
        try {
          await deleteJournalEntry(entry.id);
          await loadData();
          notifySuccess("Journal entry deleted successfully");
        } catch (error) {
          notifyError("Failed to delete journal entry");
        }
      }
    };
    const loadData = async () => {
      try {
        loading.value = true;
        await loadPartners();
        const entriesResponse = await getJournalEntries();
        entries.value = extractData(entriesResponse);
      } catch (error) {
        notifyError("Failed to load journal entries");
        entries.value = [];
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UCard = __nuxt_component_2;
      const _component_USelect = __nuxt_component_5;
      const _component_LoadingState = _sfc_main$3;
      const _component_EmptyState = _sfc_main$2;
      const _component_UDropdown = __nuxt_component_6;
      const _component_JournalEntriesEditModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex justify-between items-center"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Journal Entries</h1><p class="text-gray-600 dark:text-gray-400">MetroBNB perspective - Track money flow</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/accounting/journal-entries/create",
        color: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-plus",
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(` New Entry `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-plus",
                class: "mr-2"
              }),
              createTextVNode(" New Entry ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 sm:grid-cols-3 gap-4">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-minus-circle",
              class: "h-6 w-6 text-red-600 dark:text-red-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Credits (We Pay)</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>\u20B1${ssrInterpolate(unref(totalCredits).toLocaleString())}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-red-100 dark:bg-red-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-minus-circle",
                    class: "h-6 w-6 text-red-600 dark:text-red-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Credits (We Pay)"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "\u20B1" + toDisplayString(unref(totalCredits).toLocaleString()), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-plus-circle",
              class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Debits (They Pay)</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>\u20B1${ssrInterpolate(unref(totalDebits).toLocaleString())}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-plus-circle",
                    class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Debits (They Pay)"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "\u20B1" + toDisplayString(unref(totalDebits).toLocaleString()), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-scale",
              class: "h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Net Balance</p><p class="${ssrRenderClass([unref(netBalance) >= 0 ? "text-metrobnb-600 dark:text-metrobnb-400" : "text-red-600 dark:text-red-400", "text-2xl font-bold"])}"${_scopeId}> \u20B1${ssrInterpolate(Math.abs(unref(netBalance)).toLocaleString())}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-scale",
                    class: "h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Net Balance"),
                  createVNode("p", {
                    class: ["text-2xl font-bold", unref(netBalance) >= 0 ? "text-metrobnb-600 dark:text-metrobnb-400" : "text-red-600 dark:text-red-400"]
                  }, " \u20B1" + toDisplayString(Math.abs(unref(netBalance)).toLocaleString()), 3)
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
            _push2(`<div class="flex justify-between items-center"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Recent Journal Entries</h3><div class="flex space-x-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedPartner),
              "onUpdate:modelValue": ($event) => isRef(selectedPartner) ? selectedPartner.value = $event : null,
              options: unref(partnerOptions),
              placeholder: "All Partners"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedType),
              "onUpdate:modelValue": ($event) => isRef(selectedType) ? selectedType.value = $event : null,
              options: typeOptions,
              placeholder: "All Types"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center" }, [
                createVNode("h3", { class: "text-lg font-semibold" }, "Recent Journal Entries"),
                createVNode("div", { class: "flex space-x-2" }, [
                  createVNode(_component_USelect, {
                    modelValue: unref(selectedPartner),
                    "onUpdate:modelValue": ($event) => isRef(selectedPartner) ? selectedPartner.value = $event : null,
                    options: unref(partnerOptions),
                    placeholder: "All Partners"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                  createVNode(_component_USelect, {
                    modelValue: unref(selectedType),
                    "onUpdate:modelValue": ($event) => isRef(selectedType) ? selectedType.value = $event : null,
                    options: typeOptions,
                    placeholder: "All Types"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(loading)) {
              _push2(`<div class="text-center py-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_LoadingState, { message: "Loading journal entries..." }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (unref(filteredEntries).length === 0) {
              _push2(`<div class="text-center py-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_EmptyState, {
                title: "No journal entries found",
                message: "Create your first journal entry to track partner credits and debits.",
                "action-text": "Create Entry",
                "action-to": "/accounting/journal-entries/create"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><thead class="bg-gray-50 dark:bg-gray-800"${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"${_scopeId}>Date</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"${_scopeId}>Partner</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"${_scopeId}>Type</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"${_scopeId}>Description</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"${_scopeId}>Amount (MetroBNB View)</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"${_scopeId}>Actions</th></tr></thead><tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredEntries), (entry) => {
                _push2(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-700"${_scopeId}><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"${_scopeId}>${ssrInterpolate(formatDate(entry.date))}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"${_scopeId}>${ssrInterpolate(getPartnerName(entry.partner_id))}</td><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><span class="${ssrRenderClass([entry.type === "credit" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : "bg-metrobnb-100 text-metrobnb-800 dark:bg-metrobnb-900 dark:text-metrobnb-200", "inline-flex px-2 py-1 text-xs font-medium rounded-full"])}"${_scopeId}>${ssrInterpolate(entry.type === "credit" ? "Credit" : "Debit")}</span></td><td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"${_scopeId}><div${_scopeId}>${ssrInterpolate(entry.description)}</div>`);
                if (entry.reference) {
                  _push2(`<div class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}> Ref: ${ssrInterpolate(entry.reference)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</td><td class="${ssrRenderClass([entry.type === "debit" ? "text-metrobnb-600 dark:text-metrobnb-400" : "text-red-600 dark:text-red-400", "px-6 py-4 whitespace-nowrap text-sm text-right font-medium"])}"${_scopeId}>${ssrInterpolate(entry.type === "debit" ? "+" : "-")}\u20B1${ssrInterpolate(getAmountValue(entry.amount).toLocaleString())}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UDropdown, {
                  items: getActions(entry)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        icon: "i-heroicons-ellipsis-horizontal",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
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
                }, _parent2, _scopeId));
                _push2(`</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            }
          } else {
            return [
              unref(loading) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "text-center py-8"
              }, [
                createVNode(_component_LoadingState, { message: "Loading journal entries..." })
              ])) : unref(filteredEntries).length === 0 ? (openBlock(), createBlock("div", {
                key: 1,
                class: "text-center py-8"
              }, [
                createVNode(_component_EmptyState, {
                  title: "No journal entries found",
                  message: "Create your first journal entry to track partner credits and debits.",
                  "action-text": "Create Entry",
                  "action-to": "/accounting/journal-entries/create"
                })
              ])) : (openBlock(), createBlock("div", {
                key: 2,
                class: "overflow-x-auto"
              }, [
                createVNode("table", { class: "min-w-full divide-y divide-gray-200 dark:divide-gray-700" }, [
                  createVNode("thead", { class: "bg-gray-50 dark:bg-gray-800" }, [
                    createVNode("tr", null, [
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" }, "Date"),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" }, "Partner"),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" }, "Type"),
                      createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" }, "Description"),
                      createVNode("th", { class: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" }, "Amount (MetroBNB View)"),
                      createVNode("th", { class: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" }, "Actions")
                    ])
                  ]),
                  createVNode("tbody", { class: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredEntries), (entry) => {
                      return openBlock(), createBlock("tr", {
                        key: entry.id,
                        class: "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }, [
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" }, toDisplayString(formatDate(entry.date)), 1),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" }, toDisplayString(getPartnerName(entry.partner_id)), 1),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                          createVNode("span", {
                            class: ["inline-flex px-2 py-1 text-xs font-medium rounded-full", entry.type === "credit" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : "bg-metrobnb-100 text-metrobnb-800 dark:bg-metrobnb-900 dark:text-metrobnb-200"]
                          }, toDisplayString(entry.type === "credit" ? "Credit" : "Debit"), 3)
                        ]),
                        createVNode("td", { class: "px-6 py-4 text-sm text-gray-900 dark:text-gray-100" }, [
                          createVNode("div", null, toDisplayString(entry.description), 1),
                          entry.reference ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-xs text-gray-500 dark:text-gray-400"
                          }, " Ref: " + toDisplayString(entry.reference), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("td", {
                          class: ["px-6 py-4 whitespace-nowrap text-sm text-right font-medium", entry.type === "debit" ? "text-metrobnb-600 dark:text-metrobnb-400" : "text-red-600 dark:text-red-400"]
                        }, toDisplayString(entry.type === "debit" ? "+" : "-") + "\u20B1" + toDisplayString(getAmountValue(entry.amount).toLocaleString()), 3),
                        createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium" }, [
                          createVNode(_component_UDropdown, {
                            items: getActions(entry)
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
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_JournalEntriesEditModal, {
        modelValue: unref(showEditModal),
        "onUpdate:modelValue": ($event) => isRef(showEditModal) ? showEditModal.value = $event : null,
        entry: unref(editingEntry),
        onUpdated: loadData
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/journal-entries/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Fa6KuMlW.mjs.map
