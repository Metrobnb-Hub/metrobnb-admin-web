import { _ as _sfc_main$1 } from './PartnerInvoice-DdYfClyQ.mjs';
import { L as __nuxt_component_2, e as __nuxt_component_1$1, f as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, unref, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './useAuth-DSXahgcj.mjs';
import './cookie-CGcYVFcE.mjs';
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
import './useDateFormat-COE5x7qz.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "invoice",
  __ssrInlineRender: true,
  setup(__props) {
    const invoiceData = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PartnerInvoice = _sfc_main$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      if (unref(invoiceData)) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_component_PartnerInvoice, { invoice: unref(invoiceData) }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_UCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-center py-12"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-document-text",
                class: "mx-auto h-12 w-12 text-gray-400 mb-4"
              }, null, _parent2, _scopeId));
              _push2(`<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId}>No Invoice Data</h3><p class="text-gray-600 dark:text-gray-400 mb-6"${_scopeId}>Please generate an invoice from the partners page</p>`);
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
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "text-center py-12" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-document-text",
                    class: "mx-auto h-12 w-12 text-gray-400 mb-4"
                  }),
                  createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "No Invoice Data"),
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400 mb-6" }, "Please generate an invoice from the partners page"),
                  createVNode(_component_UButton, {
                    to: "/partners",
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Go to Partners")
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/invoice.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=invoice-CgggPKTV.mjs.map
