import { _ as _sfc_main$1 } from './UnitForm-DwMzTrSq.mjs';
import { d as useRoute, b as useRouter, L as __nuxt_component_2, f as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
import './Input-CkIGuQjB.mjs';
import 'tailwind-merge';
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
import './useFormGroup-B3564yef.mjs';
import '@vueuse/core';
import './Select-C-fTWFr4.mjs';
import './Textarea-Bv7REKKo.mjs';
import './Checkbox-CvybKiXl.mjs';
import './useAuth-DSXahgcj.mjs';
import './cookie-CGcYVFcE.mjs';
import 'pinia';
import 'vue-router';
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
  __name: "add-unit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const partnerId = route.params.id;
    const { getPartners } = useApi();
    const partner = ref(null);
    const handleClose = () => {
      router.push(`/partners/${partnerId}`);
    };
    const handleSaved = () => {
      const { notifySuccess } = useNotify();
      notifySuccess("Unit added successfully");
      router.push(`/partners/${partnerId}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UnitForm = _sfc_main$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto" }, _attrs))}><div class="mb-6"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Unit</h1><p class="text-gray-600 dark:text-gray-400"> Add a new unit for <span class="font-medium">${ssrInterpolate((_a = unref(partner)) == null ? void 0 : _a.name)}</span></p></div>`);
      if (unref(partner)) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_UnitForm, {
          "preselected-partner": unref(partnerId),
          onClose: handleClose,
          onSaved: handleSaved
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(_component_UCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-center py-8"${_scopeId}><p class="text-gray-500 dark:text-gray-400"${_scopeId}>Partner not found</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/partners",
                class: "mt-4"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Back to Partners`);
                  } else {
                    return [
                      createTextVNode("Back to Partners")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "text-center py-8" }, [
                  createVNode("p", { class: "text-gray-500 dark:text-gray-400" }, "Partner not found"),
                  createVNode(_component_UButton, {
                    to: "/partners",
                    class: "mt-4"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Back to Partners")
                    ]),
                    _: 1
                  })
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners/[id]/add-unit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add-unit-CQc3ejUC.mjs.map
