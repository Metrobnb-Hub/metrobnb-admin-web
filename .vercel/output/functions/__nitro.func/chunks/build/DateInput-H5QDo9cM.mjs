import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { e as __nuxt_component_1$1 } from './server.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DateInput",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    max: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const dateInput = ref();
    const showPicker = ref(false);
    const displayValue = computed(() => {
      if (!props.modelValue) return "";
      const date = /* @__PURE__ */ new Date(props.modelValue + "T00:00:00");
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      });
    });
    watch(showPicker, (show) => {
      var _a, _b;
      if (show && dateInput.value) {
        (_b = (_a = dateInput.value).showPicker) == null ? void 0 : _b.call(_a);
        showPicker.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = __nuxt_component_6;
      const _component_UIcon = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UInput, {
        "model-value": unref(displayValue),
        onClick: ($event) => showPicker.value = true,
        readonly: "",
        placeholder: "Select date",
        class: "cursor-pointer"
      }, {
        trailing: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-calendar",
              class: "text-gray-400"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-calendar",
                class: "text-gray-400"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<input type="date"${ssrRenderAttr("value", _ctx.modelValue)} class="absolute inset-0 opacity-0 cursor-pointer"${ssrRenderAttr("max", _ctx.max)}></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DateInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=DateInput-H5QDo9cM.mjs.map
