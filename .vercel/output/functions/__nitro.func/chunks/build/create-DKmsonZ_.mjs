import { b as useRouter, L as __nuxt_component_2, f as __nuxt_component_0$2 } from './server.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_8 } from './Checkbox-CvybKiXl.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, isRef, createBlock, openBlock, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
    const { createPartner } = useApi();
    const { notifySuccess, notifyError } = useNotify();
    const router = useRouter();
    const services = ref([]);
    const loading = ref(false);
    const selectedServices = ref([]);
    const form = ref({
      name: "",
      email: "",
      orgSharePercentage: 0
    });
    const handleSubmit = async () => {
      if (!form.value.name || !form.value.orgSharePercentage) {
        notifyError("Please fill in all required fields");
        return;
      }
      loading.value = true;
      try {
        await createPartner({
          name: form.value.name,
          email: form.value.email,
          org_share_percentage: form.value.orgSharePercentage,
          serviceIds: selectedServices.value
        });
        await loadPartners();
        notifySuccess("Partner added successfully");
        router.push("/partners");
      } catch (error) {
        notifyError("Failed to add partner");
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_6;
      const _component_UCheckbox = __nuxt_component_8;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Add Partner</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Add Partner")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              state: unref(form),
              onSubmit: handleSubmit,
              class: "space-y-4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Partner Name",
                    name: "name"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          placeholder: "e.g., Casa Aurea Properties"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event,
                            placeholder: "e.g., Casa Aurea Properties"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Email",
                    name: "email"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).email,
                          "onUpdate:modelValue": ($event) => unref(form).email = $event,
                          type: "email",
                          placeholder: "contact@partner.com"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).email,
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            placeholder: "contact@partner.com"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Share Percentage",
                    name: "orgSharePercentage"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).orgSharePercentage,
                          "onUpdate:modelValue": ($event) => unref(form).orgSharePercentage = $event,
                          type: "number",
                          min: "0",
                          max: "100",
                          placeholder: "15"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).orgSharePercentage,
                            "onUpdate:modelValue": ($event) => unref(form).orgSharePercentage = $event,
                            type: "number",
                            min: "0",
                            max: "100",
                            placeholder: "15"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Services",
                    name: "services"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="space-y-2"${_scopeId3}><!--[-->`);
                        ssrRenderList(unref(services), (service) => {
                          _push4(`<div class="flex items-center"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_UCheckbox, {
                            id: service.id,
                            modelValue: unref(selectedServices),
                            "onUpdate:modelValue": ($event) => isRef(selectedServices) ? selectedServices.value = $event : null,
                            value: service.id,
                            label: service.name
                          }, null, _parent4, _scopeId3));
                          _push4(`<span class="ml-2 text-sm text-gray-600"${_scopeId3}>${ssrInterpolate(service.description)}</span></div>`);
                        });
                        _push4(`<!--]--></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "space-y-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(services), (service) => {
                              return openBlock(), createBlock("div", {
                                key: service.id,
                                class: "flex items-center"
                              }, [
                                createVNode(_component_UCheckbox, {
                                  id: service.id,
                                  modelValue: unref(selectedServices),
                                  "onUpdate:modelValue": ($event) => isRef(selectedServices) ? selectedServices.value = $event : null,
                                  value: service.id,
                                  label: service.name
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "value", "label"]),
                                createVNode("span", { class: "ml-2 text-sm text-gray-600" }, toDisplayString(service.description), 1)
                              ]);
                            }), 128))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    loading: unref(loading)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Add Partner`);
                      } else {
                        return [
                          createTextVNode("Add Partner")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UFormGroup, {
                      label: "Partner Name",
                      name: "name"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          placeholder: "e.g., Casa Aurea Properties"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Email",
                      name: "email"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).email,
                          "onUpdate:modelValue": ($event) => unref(form).email = $event,
                          type: "email",
                          placeholder: "contact@partner.com"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Share Percentage",
                      name: "orgSharePercentage"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).orgSharePercentage,
                          "onUpdate:modelValue": ($event) => unref(form).orgSharePercentage = $event,
                          type: "number",
                          min: "0",
                          max: "100",
                          placeholder: "15"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Services",
                      name: "services"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "space-y-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(services), (service) => {
                            return openBlock(), createBlock("div", {
                              key: service.id,
                              class: "flex items-center"
                            }, [
                              createVNode(_component_UCheckbox, {
                                id: service.id,
                                modelValue: unref(selectedServices),
                                "onUpdate:modelValue": ($event) => isRef(selectedServices) ? selectedServices.value = $event : null,
                                value: service.id,
                                label: service.name
                              }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "value", "label"]),
                              createVNode("span", { class: "ml-2 text-sm text-gray-600" }, toDisplayString(service.description), 1)
                            ]);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      loading: unref(loading)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add Partner")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UForm, {
                state: unref(form),
                onSubmit: handleSubmit,
                class: "space-y-4"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormGroup, {
                    label: "Partner Name",
                    name: "name"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).name,
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        placeholder: "e.g., Casa Aurea Properties"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Email",
                    name: "email"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).email,
                        "onUpdate:modelValue": ($event) => unref(form).email = $event,
                        type: "email",
                        placeholder: "contact@partner.com"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Share Percentage",
                    name: "orgSharePercentage"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).orgSharePercentage,
                        "onUpdate:modelValue": ($event) => unref(form).orgSharePercentage = $event,
                        type: "number",
                        min: "0",
                        max: "100",
                        placeholder: "15"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Services",
                    name: "services"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(services), (service) => {
                          return openBlock(), createBlock("div", {
                            key: service.id,
                            class: "flex items-center"
                          }, [
                            createVNode(_component_UCheckbox, {
                              id: service.id,
                              modelValue: unref(selectedServices),
                              "onUpdate:modelValue": ($event) => isRef(selectedServices) ? selectedServices.value = $event : null,
                              value: service.id,
                              label: service.name
                            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "value", "label"]),
                            createVNode("span", { class: "ml-2 text-sm text-gray-600" }, toDisplayString(service.description), 1)
                          ]);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    loading: unref(loading)
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add Partner")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }, 8, ["state"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-DKmsonZ_.mjs.map
