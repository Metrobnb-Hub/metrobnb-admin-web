import { L as __nuxt_component_2, e as __nuxt_component_1$1, f as __nuxt_component_0$2, n as navigateTo } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
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
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "capture",
  __ssrInlineRender: true,
  setup(__props) {
    const { uploadFile, quickCaptureReceipt } = useApi();
    const { notifySuccess, notifyError } = useNotify();
    const uploading = ref(false);
    const receiptUrl = ref("");
    const receiptData = ref(null);
    const handleFileSelect = async (event) => {
      var _a;
      const target = event.target;
      const file = (_a = target.files) == null ? void 0 : _a[0];
      if (!file) return;
      uploading.value = true;
      try {
        const result = await uploadFile(file, "receipts");
        receiptUrl.value = result.public_url;
        receiptData.value = result;
        notifySuccess("Receipt uploaded successfully");
      } catch (error) {
        notifyError("Failed to upload receipt");
      } finally {
        uploading.value = false;
      }
    };
    const retakePhoto = () => {
      receiptUrl.value = "";
      receiptData.value = null;
    };
    const processReceipt = async () => {
      if (!receiptData.value) return;
      try {
        const result = await quickCaptureReceipt({
          receipt_url: receiptData.value.public_url,
          receipt_public_id: receiptData.value.file_id,
          notes: "Receipt captured via mobile"
        });
        if (result.id) {
          notifySuccess("Receipt processed! Complete the expense details.");
          await navigateTo(`/expenses/review/${result.id}`);
        }
      } catch (error) {
        notifyError("Failed to process receipt");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Capture Receipt</h1><p class="text-gray-600 dark:text-gray-400">Take a photo of your receipt to create an expense</p></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center py-8"${_scopeId}>`);
            if (!unref(uploading) && !unref(receiptUrl)) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-camera",
                class: "h-12 w-12 text-blue-600 dark:text-blue-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId}>Take Receipt Photo</h3><p class="text-sm text-gray-600 dark:text-gray-400 mb-4"${_scopeId}> Capture a clear photo of your receipt </p></div><div class="space-y-2"${_scopeId}><input type="file" accept="image/*" capture="environment" class="hidden"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: ($event) => _ctx.$refs.fileInput.click(),
                color: "primary",
                size: "lg"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-camera",
                      class: "mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` Take Photo `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-camera",
                        class: "mr-2"
                      }),
                      createTextVNode(" Take Photo ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<p class="text-xs text-gray-500"${_scopeId}>Or select from gallery</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(uploading)) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"${_scopeId}></div><p class="text-gray-600 dark:text-gray-400"${_scopeId}>Uploading receipt...</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(receiptUrl) && !unref(uploading)) {
              _push2(`<div class="space-y-4"${_scopeId}><img${ssrRenderAttr("src", unref(receiptUrl))} alt="Receipt" class="max-w-full h-64 object-contain mx-auto rounded-lg border"${_scopeId}><div class="flex justify-center space-x-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: retakePhoto,
                variant: "outline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-arrow-path",
                      class: "mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` Retake `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-arrow-path",
                        class: "mr-2"
                      }),
                      createTextVNode(" Retake ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: processReceipt,
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-check",
                      class: "mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` Continue `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-check",
                        class: "mr-2"
                      }),
                      createTextVNode(" Continue ")
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
          } else {
            return [
              createVNode("div", { class: "text-center py-8" }, [
                !unref(uploading) && !unref(receiptUrl) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-4"
                }, [
                  createVNode("div", { class: "w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-camera",
                      class: "h-12 w-12 text-blue-600 dark:text-blue-400"
                    })
                  ]),
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "Take Receipt Photo"),
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-4" }, " Capture a clear photo of your receipt ")
                  ]),
                  createVNode("div", { class: "space-y-2" }, [
                    createVNode("input", {
                      ref: "fileInput",
                      type: "file",
                      accept: "image/*",
                      capture: "environment",
                      class: "hidden",
                      onChange: handleFileSelect
                    }, null, 544),
                    createVNode(_component_UButton, {
                      onClick: ($event) => _ctx.$refs.fileInput.click(),
                      color: "primary",
                      size: "lg"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-camera",
                          class: "mr-2"
                        }),
                        createTextVNode(" Take Photo ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode("p", { class: "text-xs text-gray-500" }, "Or select from gallery")
                  ])
                ])) : createCommentVNode("", true),
                unref(uploading) ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "space-y-4"
                }, [
                  createVNode("div", { class: "w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" }),
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400" }, "Uploading receipt...")
                ])) : createCommentVNode("", true),
                unref(receiptUrl) && !unref(uploading) ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "space-y-4"
                }, [
                  createVNode("img", {
                    src: unref(receiptUrl),
                    alt: "Receipt",
                    class: "max-w-full h-64 object-contain mx-auto rounded-lg border"
                  }, null, 8, ["src"]),
                  createVNode("div", { class: "flex justify-center space-x-3" }, [
                    createVNode(_component_UButton, {
                      onClick: retakePhoto,
                      variant: "outline"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-arrow-path",
                          class: "mr-2"
                        }),
                        createTextVNode(" Retake ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      onClick: processReceipt,
                      color: "primary"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-check",
                          class: "mr-2"
                        }),
                        createTextVNode(" Continue ")
                      ]),
                      _: 1
                    })
                  ])
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>\u{1F4F8} Photo Tips</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "\u{1F4F8} Photo Tips")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400"${_scopeId}><li class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-check-circle",
              class: "h-4 w-4 text-green-500 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Ensure receipt is clearly visible and readable </li><li class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-check-circle",
              class: "h-4 w-4 text-green-500 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Use good lighting for best results </li><li class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-check-circle",
              class: "h-4 w-4 text-green-500 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Keep receipt flat and avoid shadows </li><li class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-check-circle",
              class: "h-4 w-4 text-green-500 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Include the entire receipt in the frame </li></ul>`);
          } else {
            return [
              createVNode("ul", { class: "space-y-2 text-sm text-gray-600 dark:text-gray-400" }, [
                createVNode("li", { class: "flex items-center" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-check-circle",
                    class: "h-4 w-4 text-green-500 mr-2"
                  }),
                  createTextVNode(" Ensure receipt is clearly visible and readable ")
                ]),
                createVNode("li", { class: "flex items-center" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-check-circle",
                    class: "h-4 w-4 text-green-500 mr-2"
                  }),
                  createTextVNode(" Use good lighting for best results ")
                ]),
                createVNode("li", { class: "flex items-center" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-check-circle",
                    class: "h-4 w-4 text-green-500 mr-2"
                  }),
                  createTextVNode(" Keep receipt flat and avoid shadows ")
                ]),
                createVNode("li", { class: "flex items-center" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-check-circle",
                    class: "h-4 w-4 text-green-500 mr-2"
                  }),
                  createTextVNode(" Include the entire receipt in the frame ")
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/expenses/capture.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=capture-BlMeD5_X.mjs.map
