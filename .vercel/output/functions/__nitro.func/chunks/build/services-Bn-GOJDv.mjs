import { M as useToast, L as __nuxt_component_2, f as __nuxt_component_0$2 } from './server.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useApi } from './api-BDnKztVE.mjs';
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
  __name: "services",
  __ssrInlineRender: true,
  setup(__props) {
    const { getServices, createService, updateService, deleteService: apiDeleteService } = useApi();
    const toast = useToast();
    const services = ref([]);
    const loading = ref(false);
    const form = ref({
      name: "",
      description: ""
    });
    const handleSubmit = async () => {
      if (!form.value.name.trim()) return;
      loading.value = true;
      try {
        const newService = await createService({
          name: form.value.name,
          description: form.value.description
        });
        services.value.push(newService);
        form.value = { name: "", description: "" };
        toast.add({
          title: "Success",
          description: "Service added successfully"
        });
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to add service",
          color: "red"
        });
      } finally {
        loading.value = false;
      }
    };
    const editService = (service) => {
    };
    const deleteService = async (id) => {
      try {
        await apiDeleteService(id);
        services.value = services.value.filter((s) => s.id !== id);
        toast.add({
          title: "Success",
          description: "Service deleted successfully"
        });
      } catch (error) {
        toast.add({
          title: "Error",
          description: "Failed to delete service",
          color: "red"
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_6;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Add Service</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Add Service")
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
                    label: "Service Name",
                    name: "name"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          placeholder: "e.g., All In Host Hero"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event,
                            placeholder: "e.g., All In Host Hero"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Description",
                    name: "description"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "Service description"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).description,
                            "onUpdate:modelValue": ($event) => unref(form).description = $event,
                            placeholder: "Service description"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                        _push4(`Add Service`);
                      } else {
                        return [
                          createTextVNode("Add Service")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UFormGroup, {
                      label: "Service Name",
                      name: "name"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          placeholder: "e.g., All In Host Hero"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Description",
                      name: "description"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "Service description"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      loading: unref(loading)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add Service")
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
                    label: "Service Name",
                    name: "name"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).name,
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        placeholder: "e.g., All In Host Hero"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Description",
                    name: "description"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(form).description,
                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                        placeholder: "Service description"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    loading: unref(loading)
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add Service")
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
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Services</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Services")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(services), (service) => {
              _push2(`<div class="flex justify-between items-center p-4 border rounded-lg"${_scopeId}><div${_scopeId}><h4 class="font-medium"${_scopeId}>${ssrInterpolate(service.name)}</h4><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(service.description)}</p></div><div class="flex space-x-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "ghost",
                size: "sm",
                onClick: ($event) => editService()
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Edit`);
                  } else {
                    return [
                      createTextVNode("Edit")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "ghost",
                size: "sm",
                color: "red",
                onClick: ($event) => deleteService(service.id)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Delete`);
                  } else {
                    return [
                      createTextVNode("Delete")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(services).length) {
              _push2(`<div class="text-center py-8 text-gray-500"${_scopeId}> No services yet. Add your first service above. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(services), (service) => {
                  return openBlock(), createBlock("div", {
                    key: service.id,
                    class: "flex justify-between items-center p-4 border rounded-lg"
                  }, [
                    createVNode("div", null, [
                      createVNode("h4", { class: "font-medium" }, toDisplayString(service.name), 1),
                      createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(service.description), 1)
                    ]),
                    createVNode("div", { class: "flex space-x-2" }, [
                      createVNode(_component_UButton, {
                        variant: "ghost",
                        size: "sm",
                        onClick: ($event) => editService()
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Edit")
                        ]),
                        _: 2
                      }, 1032, ["onClick"]),
                      createVNode(_component_UButton, {
                        variant: "ghost",
                        size: "sm",
                        color: "red",
                        onClick: ($event) => deleteService(service.id)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Delete")
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ])
                  ]);
                }), 128)),
                !unref(services).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 text-gray-500"
                }, " No services yet. Add your first service above. ")) : createCommentVNode("", true)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/services.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=services-Bn-GOJDv.mjs.map
