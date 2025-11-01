import { _ as __nuxt_component_7 } from './Pagination-BuSSqpy3.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StandardPagination",
  __ssrInlineRender: true,
  props: {
    pagination: {}
  },
  emits: ["page-change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const startItem = computed(() => {
      if (!props.pagination) return 0;
      return (props.pagination.current_page - 1) * props.pagination.per_page + 1;
    });
    const endItem = computed(() => {
      if (!props.pagination) return 0;
      return Math.min(props.pagination.current_page * props.pagination.per_page, props.pagination.total_items);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UPagination = __nuxt_component_7;
      if (_ctx.pagination && _ctx.pagination.total_pages > 1) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700" }, _attrs))}><div class="text-sm text-gray-600 dark:text-gray-400"> Showing ${ssrInterpolate(unref(startItem))} to ${ssrInterpolate(unref(endItem))} of ${ssrInterpolate(_ctx.pagination.total_items)} results </div>`);
        _push(ssrRenderComponent(_component_UPagination, {
          "model-value": _ctx.pagination.current_page,
          "page-count": _ctx.pagination.total_pages,
          total: _ctx.pagination.total_items,
          "onUpdate:modelValue": ($event) => _ctx.$emit("page-change", $event)
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StandardPagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=StandardPagination-DZiiEeUr.mjs.map
