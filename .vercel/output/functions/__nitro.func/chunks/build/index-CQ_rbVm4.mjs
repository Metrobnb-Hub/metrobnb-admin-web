import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, _ as _export_sfc, L as __nuxt_component_2$1, g as __nuxt_component_0, R as useNuxtApp, C as useUI, B as mergeConfig, I as s$4, i as i$5, j as o$1, A as A$2, p as f$1, N as N$3, O, T as T$1, G as appConfig, $ as t$4, r as o, a0 as T$2, m as u$5, q as u$3, h as i$3, a1 as P, V as N$4 } from './server.mjs';
import { defineComponent, computed, ref, watch, reactive, mergeProps, unref, withCtx, createVNode, isRef, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, nextTick, resolveComponent, renderSlot, toRef, useId, onMounted, onUnmounted, inject, h, provide, watchEffect, useSSRContext } from 'vue';
import { s } from './use-resolve-button-type-CgmJ7gVL.mjs';
import { useResizeObserver } from '@vueuse/core';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_6$1 } from './Dropdown-rKaqrBy2.mjs';
import { _ as __nuxt_component_5$1 } from './Badge-hg3kqqXA.mjs';
import { _ as __nuxt_component_6$2 } from './Table-BHqVm27V.mjs';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
import { u as useDateFormat } from './useDateFormat-COE5x7qz.mjs';
import { _ as _sfc_main$8 } from './StandardPagination-DZiiEeUr.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as _sfc_main$9 } from './DateInput-H5QDo9cM.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { _ as __nuxt_component_8 } from './Checkbox-CvybKiXl.mjs';
import { z } from 'zod';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { u as useDataManager } from './useDataManager-_ycBTlnZ.mjs';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useBookingForm } from './useBookingForm-DT7T7j8X.mjs';
import { defineStore } from 'pinia';
import { u as useApiResponse } from './useApiResponse-BHNeCLLh.mjs';
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
import 'vue-router';
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
import './usePopper-DZihrI_3.mjs';
import './Pagination-BuSSqpy3.mjs';
import './cookie-CGcYVFcE.mjs';

const tabs = {
  wrapper: "relative space-y-2",
  container: "relative w-full",
  base: "focus:outline-none",
  list: {
    base: "relative",
    background: "bg-gray-100 dark:bg-gray-800",
    rounded: "rounded-lg",
    shadow: "",
    padding: "p-1",
    height: "h-10",
    width: "w-full",
    marker: {
      wrapper: "absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none",
      base: "w-full h-full",
      background: "bg-white dark:bg-gray-900",
      rounded: "rounded-md",
      shadow: "shadow-sm"
    },
    tab: {
      base: "relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out",
      background: "",
      active: "text-gray-900 dark:text-white",
      inactive: "text-gray-500 dark:text-gray-400",
      height: "h-8",
      padding: "px-3",
      size: "text-sm",
      font: "font-medium",
      rounded: "rounded-md",
      shadow: "",
      icon: "w-4 h-4 flex-shrink-0 me-2"
    }
  }
};
let d = defineComponent({ props: { onFocus: { type: Function, required: true } }, setup(t2) {
  let n = ref(true);
  return () => n.value ? h(f$1, { as: "button", type: "button", features: u$3.Focusable, onFocus(o2) {
    o2.preventDefault();
    let e, a = 50;
    function r() {
      var u2;
      if (a-- <= 0) {
        e && cancelAnimationFrame(e);
        return;
      }
      if ((u2 = t2.onFocus) != null && u2.call(t2)) {
        n.value = false, cancelAnimationFrame(e);
        return;
      }
      e = requestAnimationFrame(r);
    }
    e = requestAnimationFrame(r);
  } }) : null;
} });
var te = ((s2) => (s2[s2.Forwards = 0] = "Forwards", s2[s2.Backwards = 1] = "Backwards", s2))(te || {}), le = ((d2) => (d2[d2.Less = -1] = "Less", d2[d2.Equal = 0] = "Equal", d2[d2.Greater = 1] = "Greater", d2))(le || {});
let U = Symbol("TabsContext");
function C(a) {
  let b = inject(U, null);
  if (b === null) {
    let s2 = new Error(`<${a} /> is missing a parent <TabGroup /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(s2, C), s2;
  }
  return b;
}
let G = Symbol("TabsSSRContext"), me = defineComponent({ name: "TabGroup", emits: { change: (a) => true }, props: { as: { type: [Object, String], default: "template" }, selectedIndex: { type: [Number], default: null }, defaultIndex: { type: [Number], default: 0 }, vertical: { type: [Boolean], default: false }, manual: { type: [Boolean], default: false } }, inheritAttrs: false, setup(a, { slots: b, attrs: s2, emit: d$1 }) {
  var E;
  let i2 = ref((E = a.selectedIndex) != null ? E : a.defaultIndex), l = ref([]), r = ref([]), p = computed(() => a.selectedIndex !== null), R = computed(() => p.value ? a.selectedIndex : i2.value);
  function y(t2) {
    var c;
    let n = O(u2.tabs.value, o$1), o$12 = O(u2.panels.value, o$1), e = n.filter((I) => {
      var m;
      return !((m = o$1(I)) != null && m.hasAttribute("disabled"));
    });
    if (t2 < 0 || t2 > n.length - 1) {
      let I = u$5(i2.value === null ? 0 : Math.sign(t2 - i2.value), { [-1]: () => 1, [0]: () => u$5(Math.sign(t2), { [-1]: () => 0, [0]: () => 0, [1]: () => 1 }), [1]: () => 0 }), m = u$5(I, { [0]: () => n.indexOf(e[0]), [1]: () => n.indexOf(e[e.length - 1]) });
      m !== -1 && (i2.value = m), u2.tabs.value = n, u2.panels.value = o$12;
    } else {
      let I = n.slice(0, t2), h2 = [...n.slice(t2), ...I].find((W) => e.includes(W));
      if (!h2) return;
      let O2 = (c = n.indexOf(h2)) != null ? c : u2.selectedIndex.value;
      O2 === -1 && (O2 = u2.selectedIndex.value), i2.value = O2, u2.tabs.value = n, u2.panels.value = o$12;
    }
  }
  let u2 = { selectedIndex: computed(() => {
    var t2, n;
    return (n = (t2 = i2.value) != null ? t2 : a.defaultIndex) != null ? n : null;
  }), orientation: computed(() => a.vertical ? "vertical" : "horizontal"), activation: computed(() => a.manual ? "manual" : "auto"), tabs: l, panels: r, setSelectedIndex(t2) {
    R.value !== t2 && d$1("change", t2), p.value || y(t2);
  }, registerTab(t2) {
    var o$12;
    if (l.value.includes(t2)) return;
    let n = l.value[i2.value];
    if (l.value.push(t2), l.value = O(l.value, o$1), !p.value) {
      let e = (o$12 = l.value.indexOf(n)) != null ? o$12 : i2.value;
      e !== -1 && (i2.value = e);
    }
  }, unregisterTab(t2) {
    let n = l.value.indexOf(t2);
    n !== -1 && l.value.splice(n, 1);
  }, registerPanel(t2) {
    r.value.includes(t2) || (r.value.push(t2), r.value = O(r.value, o$1));
  }, unregisterPanel(t2) {
    let n = r.value.indexOf(t2);
    n !== -1 && r.value.splice(n, 1);
  } };
  provide(U, u2);
  let T$12 = ref({ tabs: [], panels: [] }), x = ref(false);
  onMounted(() => {
    x.value = true;
  }), provide(G, computed(() => x.value ? null : T$12.value));
  let w = computed(() => a.selectedIndex);
  return onMounted(() => {
    watch([w], () => {
      var t2;
      return y((t2 = a.selectedIndex) != null ? t2 : a.defaultIndex);
    }, { immediate: true });
  }), watchEffect(() => {
    if (!p.value || R.value == null || u2.tabs.value.length <= 0) return;
    let t2 = O(u2.tabs.value, o$1);
    t2.some((o$12, e) => o$1(u2.tabs.value[e]) !== o$1(o$12)) && u2.setSelectedIndex(t2.findIndex((o$12) => o$1(o$12) === o$1(u2.tabs.value[R.value])));
  }), () => {
    let t2 = { selectedIndex: i2.value };
    return h(Fragment, [l.value.length <= 0 && h(d, { onFocus: () => {
      for (let n of l.value) {
        let o$12 = o$1(n);
        if ((o$12 == null ? void 0 : o$12.tabIndex) === 0) return o$12.focus(), true;
      }
      return false;
    } }), A$2({ theirProps: { ...s2, ...T$1(a, ["selectedIndex", "defaultIndex", "manual", "vertical", "onChange"]) }, ourProps: {}, slot: t2, slots: b, attrs: s2, name: "TabGroup" })]);
  };
} }), pe = defineComponent({ name: "TabList", props: { as: { type: [Object, String], default: "div" } }, setup(a, { attrs: b, slots: s2 }) {
  let d2 = C("TabList");
  return () => {
    let i2 = { selectedIndex: d2.selectedIndex.value }, l = { role: "tablist", "aria-orientation": d2.orientation.value };
    return A$2({ ourProps: l, theirProps: a, slot: i2, attrs: b, slots: s2, name: "TabList" });
  };
} }), xe = defineComponent({ name: "Tab", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false }, id: { type: String, default: null } }, setup(a, { attrs: b, slots: s$12, expose: d2 }) {
  var o$2;
  let i$2 = (o$2 = a.id) != null ? o$2 : `headlessui-tabs-tab-${i$5()}`, l = C("Tab"), r = ref(null);
  d2({ el: r, $el: r }), onMounted(() => l.registerTab(r)), onUnmounted(() => l.unregisterTab(r));
  let p = inject(G), R = computed(() => {
    if (p.value) {
      let e = p.value.tabs.indexOf(i$2);
      return e === -1 ? p.value.tabs.push(i$2) - 1 : e;
    }
    return -1;
  }), y = computed(() => {
    let e = l.tabs.value.indexOf(r);
    return e === -1 ? R.value : e;
  }), u2 = computed(() => y.value === l.selectedIndex.value);
  function T2(e) {
    var I;
    let c = e();
    if (c === T$2.Success && l.activation.value === "auto") {
      let m = (I = i$3(r)) == null ? void 0 : I.activeElement, h2 = l.tabs.value.findIndex((O2) => o$1(O2) === m);
      h2 !== -1 && l.setSelectedIndex(h2);
    }
    return c;
  }
  function x(e) {
    let c = l.tabs.value.map((m) => o$1(m)).filter(Boolean);
    if (e.key === o.Space || e.key === o.Enter) {
      e.preventDefault(), e.stopPropagation(), l.setSelectedIndex(y.value);
      return;
    }
    switch (e.key) {
      case o.Home:
      case o.PageUp:
        return e.preventDefault(), e.stopPropagation(), T2(() => P(c, N$4.First));
      case o.End:
      case o.PageDown:
        return e.preventDefault(), e.stopPropagation(), T2(() => P(c, N$4.Last));
    }
    if (T2(() => u$5(l.orientation.value, { vertical() {
      return e.key === o.ArrowUp ? P(c, N$4.Previous | N$4.WrapAround) : e.key === o.ArrowDown ? P(c, N$4.Next | N$4.WrapAround) : T$2.Error;
    }, horizontal() {
      return e.key === o.ArrowLeft ? P(c, N$4.Previous | N$4.WrapAround) : e.key === o.ArrowRight ? P(c, N$4.Next | N$4.WrapAround) : T$2.Error;
    } })) === T$2.Success) return e.preventDefault();
  }
  let w = ref(false);
  function E() {
    var e;
    w.value || (w.value = true, !a.disabled && ((e = o$1(r)) == null || e.focus({ preventScroll: true }), l.setSelectedIndex(y.value), t$4(() => {
      w.value = false;
    })));
  }
  function t$1(e) {
    e.preventDefault();
  }
  let n = s(computed(() => ({ as: a.as, type: b.type })), r);
  return () => {
    var m, h2;
    let e = { selected: u2.value, disabled: (m = a.disabled) != null ? m : false }, { ...c } = a, I = { ref: r, onKeydown: x, onMousedown: t$1, onClick: E, id: i$2, role: "tab", type: n.value, "aria-controls": (h2 = o$1(l.panels.value[y.value])) == null ? void 0 : h2.id, "aria-selected": u2.value, tabIndex: u2.value ? 0 : -1, disabled: a.disabled ? true : void 0 };
    return A$2({ ourProps: I, theirProps: c, slot: e, attrs: b, slots: s$12, name: "Tab" });
  };
} }), Ie = defineComponent({ name: "TabPanels", props: { as: { type: [Object, String], default: "div" } }, setup(a, { slots: b, attrs: s2 }) {
  let d2 = C("TabPanels");
  return () => {
    let i2 = { selectedIndex: d2.selectedIndex.value };
    return A$2({ theirProps: a, ourProps: {}, slot: i2, attrs: s2, slots: b, name: "TabPanels" });
  };
} }), ye = defineComponent({ name: "TabPanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, id: { type: String, default: null }, tabIndex: { type: Number, default: 0 } }, setup(a, { attrs: b, slots: s2, expose: d2 }) {
  var T2;
  let i$12 = (T2 = a.id) != null ? T2 : `headlessui-tabs-panel-${i$5()}`, l = C("TabPanel"), r = ref(null);
  d2({ el: r, $el: r }), onMounted(() => l.registerPanel(r)), onUnmounted(() => l.unregisterPanel(r));
  let p = inject(G), R = computed(() => {
    if (p.value) {
      let x = p.value.panels.indexOf(i$12);
      return x === -1 ? p.value.panels.push(i$12) - 1 : x;
    }
    return -1;
  }), y = computed(() => {
    let x = l.panels.value.indexOf(r);
    return x === -1 ? R.value : x;
  }), u2 = computed(() => y.value === l.selectedIndex.value);
  return () => {
    var n;
    let x = { selected: u2.value }, { tabIndex: w, ...E } = a, t2 = { ref: r, id: i$12, role: "tabpanel", "aria-labelledby": (n = o$1(l.tabs.value[y.value])) == null ? void 0 : n.id, tabIndex: u2.value ? w : -1 };
    return !u2.value && a.unmount && !a.static ? h(f$1, { as: "span", "aria-hidden": true, ...t2 }) : A$2({ ourProps: t2, theirProps: E, slot: x, attrs: b, slots: s2, features: N$3.Static | N$3.RenderStrategy, visible: u2.value, name: "TabPanel" });
  };
} });
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.tabs, tabs);
const _sfc_main$7 = defineComponent({
  components: {
    UIcon: __nuxt_component_1$1,
    HTabGroup: me,
    HTabList: pe,
    HTab: xe,
    HTabPanels: Ie,
    HTabPanel: ye
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      default: void 0
    },
    orientation: {
      type: String,
      default: "horizontal",
      validator: (value) => ["horizontal", "vertical"].includes(value)
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    items: {
      type: Array,
      default: () => []
    },
    unmount: {
      type: Boolean,
      default: false
    },
    content: {
      type: Boolean,
      default: true
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("tabs", toRef(props, "ui"), config, toRef(props, "class"));
    const listRef = ref();
    const itemRefs = ref([]);
    const markerRef = ref();
    const selectedIndex = ref(props.modelValue || props.defaultIndex);
    function calcMarkerSize(index) {
      var _a;
      const tab = (_a = itemRefs.value[index]) == null ? void 0 : _a.$el;
      if (!tab) {
        return;
      }
      if (!markerRef.value) {
        return;
      }
      markerRef.value.style.top = `${tab.offsetTop}px`;
      markerRef.value.style.left = `${tab.offsetLeft}px`;
      markerRef.value.style.width = `${tab.offsetWidth}px`;
      markerRef.value.style.height = `${tab.offsetHeight}px`;
    }
    function onChange(index) {
      selectedIndex.value = index;
      emit("change", index);
      if (props.modelValue !== void 0) {
        emit("update:modelValue", selectedIndex.value);
      }
      calcMarkerSize(selectedIndex.value);
    }
    useResizeObserver(listRef, () => {
      calcMarkerSize(selectedIndex.value);
    });
    watch(() => props.modelValue, (value) => {
      selectedIndex.value = value;
      calcMarkerSize(selectedIndex.value);
    });
    watch(() => props.items, async () => {
      await nextTick();
      calcMarkerSize(selectedIndex.value);
    }, { deep: true });
    s$4(() => useId());
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      listRef,
      itemRefs,
      markerRef,
      selectedIndex,
      onChange
    };
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_HTabGroup = resolveComponent("HTabGroup");
  const _component_HTabList = resolveComponent("HTabList");
  const _component_HTab = resolveComponent("HTab");
  const _component_UIcon = __nuxt_component_1$1;
  const _component_HTabPanels = resolveComponent("HTabPanels");
  const _component_HTabPanel = resolveComponent("HTabPanel");
  _push(ssrRenderComponent(_component_HTabGroup, mergeProps({
    vertical: _ctx.orientation === "vertical",
    "selected-index": _ctx.selectedIndex,
    as: "div",
    class: _ctx.ui.wrapper
  }, _ctx.attrs, { onChange: _ctx.onChange }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_HTabList, {
          ref: "listRef",
          class: [_ctx.ui.list.base, _ctx.ui.list.background, _ctx.ui.list.rounded, _ctx.ui.list.shadow, _ctx.ui.list.padding, _ctx.ui.list.width, _ctx.orientation === "horizontal" && _ctx.ui.list.height, _ctx.orientation === "horizontal" && "inline-grid items-center"],
          style: [_ctx.orientation === "horizontal" && `grid-template-columns: repeat(${_ctx.items.length}, minmax(0, 1fr))`]
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="${ssrRenderClass(_ctx.ui.list.marker.wrapper)}"${_scopeId2}><div class="${ssrRenderClass([_ctx.ui.list.marker.base, _ctx.ui.list.marker.background, _ctx.ui.list.marker.rounded, _ctx.ui.list.marker.shadow])}"${_scopeId2}></div></div><!--[-->`);
              ssrRenderList(_ctx.items, (item, index) => {
                _push3(ssrRenderComponent(_component_HTab, {
                  key: index,
                  ref_for: true,
                  ref: "itemRefs",
                  disabled: item.disabled,
                  as: "template"
                }, {
                  default: withCtx(({ selected, disabled }, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(`<button${ssrRenderAttr("aria-label", item.ariaLabel)} class="${ssrRenderClass([_ctx.ui.list.tab.base, _ctx.ui.list.tab.background, _ctx.ui.list.tab.height, _ctx.ui.list.tab.padding, _ctx.ui.list.tab.size, _ctx.ui.list.tab.font, _ctx.ui.list.tab.rounded, _ctx.ui.list.tab.shadow, selected ? _ctx.ui.list.tab.active : _ctx.ui.list.tab.inactive])}"${_scopeId3}>`);
                      ssrRenderSlot(_ctx.$slots, "icon", {
                        item,
                        index,
                        selected,
                        disabled
                      }, () => {
                        if (item.icon) {
                          _push4(ssrRenderComponent(_component_UIcon, {
                            name: item.icon,
                            class: _ctx.ui.list.tab.icon
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      }, _push4, _parent4, _scopeId3);
                      ssrRenderSlot(_ctx.$slots, "default", {
                        item,
                        index,
                        selected,
                        disabled
                      }, () => {
                        _push4(`<span class="truncate"${_scopeId3}>${ssrInterpolate(item.label)}</span>`);
                      }, _push4, _parent4, _scopeId3);
                      _push4(`</button>`);
                    } else {
                      return [
                        createVNode("button", {
                          "aria-label": item.ariaLabel,
                          class: [_ctx.ui.list.tab.base, _ctx.ui.list.tab.background, _ctx.ui.list.tab.height, _ctx.ui.list.tab.padding, _ctx.ui.list.tab.size, _ctx.ui.list.tab.font, _ctx.ui.list.tab.rounded, _ctx.ui.list.tab.shadow, selected ? _ctx.ui.list.tab.active : _ctx.ui.list.tab.inactive]
                        }, [
                          renderSlot(_ctx.$slots, "icon", {
                            item,
                            index,
                            selected,
                            disabled
                          }, () => [
                            item.icon ? (openBlock(), createBlock(_component_UIcon, {
                              key: 0,
                              name: item.icon,
                              class: _ctx.ui.list.tab.icon
                            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                          ]),
                          renderSlot(_ctx.$slots, "default", {
                            item,
                            index,
                            selected,
                            disabled
                          }, () => [
                            createVNode("span", { class: "truncate" }, toDisplayString(item.label), 1)
                          ])
                        ], 10, ["aria-label"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent3, _scopeId2));
              });
              _push3(`<!--]-->`);
            } else {
              return [
                createVNode("div", {
                  ref: "markerRef",
                  class: _ctx.ui.list.marker.wrapper
                }, [
                  createVNode("div", {
                    class: [_ctx.ui.list.marker.base, _ctx.ui.list.marker.background, _ctx.ui.list.marker.rounded, _ctx.ui.list.marker.shadow]
                  }, null, 2)
                ], 2),
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
                  return openBlock(), createBlock(_component_HTab, {
                    key: index,
                    ref_for: true,
                    ref: "itemRefs",
                    disabled: item.disabled,
                    as: "template"
                  }, {
                    default: withCtx(({ selected, disabled }) => [
                      createVNode("button", {
                        "aria-label": item.ariaLabel,
                        class: [_ctx.ui.list.tab.base, _ctx.ui.list.tab.background, _ctx.ui.list.tab.height, _ctx.ui.list.tab.padding, _ctx.ui.list.tab.size, _ctx.ui.list.tab.font, _ctx.ui.list.tab.rounded, _ctx.ui.list.tab.shadow, selected ? _ctx.ui.list.tab.active : _ctx.ui.list.tab.inactive]
                      }, [
                        renderSlot(_ctx.$slots, "icon", {
                          item,
                          index,
                          selected,
                          disabled
                        }, () => [
                          item.icon ? (openBlock(), createBlock(_component_UIcon, {
                            key: 0,
                            name: item.icon,
                            class: _ctx.ui.list.tab.icon
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ]),
                        renderSlot(_ctx.$slots, "default", {
                          item,
                          index,
                          selected,
                          disabled
                        }, () => [
                          createVNode("span", { class: "truncate" }, toDisplayString(item.label), 1)
                        ])
                      ], 10, ["aria-label"])
                    ]),
                    _: 2
                  }, 1032, ["disabled"]);
                }), 128))
              ];
            }
          }),
          _: 3
        }, _parent2, _scopeId));
        if (_ctx.content) {
          _push2(ssrRenderComponent(_component_HTabPanels, {
            class: _ctx.ui.container
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<!--[-->`);
                ssrRenderList(_ctx.items, (item, index) => {
                  _push3(ssrRenderComponent(_component_HTabPanel, {
                    key: index,
                    class: _ctx.ui.base,
                    unmount: _ctx.unmount
                  }, {
                    default: withCtx(({ selected }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, item.slot || "item", {
                          item,
                          index,
                          selected
                        }, () => {
                          _push4(`${ssrInterpolate(item.content)}`);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, item.slot || "item", {
                            item,
                            index,
                            selected
                          }, () => [
                            createTextVNode(toDisplayString(item.content), 1)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                });
                _push3(`<!--]-->`);
              } else {
                return [
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
                    return openBlock(), createBlock(_component_HTabPanel, {
                      key: index,
                      class: _ctx.ui.base,
                      unmount: _ctx.unmount
                    }, {
                      default: withCtx(({ selected }) => [
                        renderSlot(_ctx.$slots, item.slot || "item", {
                          item,
                          index,
                          selected
                        }, () => [
                          createTextVNode(toDisplayString(item.content), 1)
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class", "unmount"]);
                  }), 128))
                ];
              }
            }),
            _: 3
          }, _parent2, _scopeId));
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          createVNode(_component_HTabList, {
            ref: "listRef",
            class: [_ctx.ui.list.base, _ctx.ui.list.background, _ctx.ui.list.rounded, _ctx.ui.list.shadow, _ctx.ui.list.padding, _ctx.ui.list.width, _ctx.orientation === "horizontal" && _ctx.ui.list.height, _ctx.orientation === "horizontal" && "inline-grid items-center"],
            style: [_ctx.orientation === "horizontal" && `grid-template-columns: repeat(${_ctx.items.length}, minmax(0, 1fr))`]
          }, {
            default: withCtx(() => [
              createVNode("div", {
                ref: "markerRef",
                class: _ctx.ui.list.marker.wrapper
              }, [
                createVNode("div", {
                  class: [_ctx.ui.list.marker.base, _ctx.ui.list.marker.background, _ctx.ui.list.marker.rounded, _ctx.ui.list.marker.shadow]
                }, null, 2)
              ], 2),
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
                return openBlock(), createBlock(_component_HTab, {
                  key: index,
                  ref_for: true,
                  ref: "itemRefs",
                  disabled: item.disabled,
                  as: "template"
                }, {
                  default: withCtx(({ selected, disabled }) => [
                    createVNode("button", {
                      "aria-label": item.ariaLabel,
                      class: [_ctx.ui.list.tab.base, _ctx.ui.list.tab.background, _ctx.ui.list.tab.height, _ctx.ui.list.tab.padding, _ctx.ui.list.tab.size, _ctx.ui.list.tab.font, _ctx.ui.list.tab.rounded, _ctx.ui.list.tab.shadow, selected ? _ctx.ui.list.tab.active : _ctx.ui.list.tab.inactive]
                    }, [
                      renderSlot(_ctx.$slots, "icon", {
                        item,
                        index,
                        selected,
                        disabled
                      }, () => [
                        item.icon ? (openBlock(), createBlock(_component_UIcon, {
                          key: 0,
                          name: item.icon,
                          class: _ctx.ui.list.tab.icon
                        }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                      ]),
                      renderSlot(_ctx.$slots, "default", {
                        item,
                        index,
                        selected,
                        disabled
                      }, () => [
                        createVNode("span", { class: "truncate" }, toDisplayString(item.label), 1)
                      ])
                    ], 10, ["aria-label"])
                  ]),
                  _: 2
                }, 1032, ["disabled"]);
              }), 128))
            ]),
            _: 3
          }, 8, ["class", "style"]),
          _ctx.content ? (openBlock(), createBlock(_component_HTabPanels, {
            key: 0,
            class: _ctx.ui.container
          }, {
            default: withCtx(() => [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
                return openBlock(), createBlock(_component_HTabPanel, {
                  key: index,
                  class: _ctx.ui.base,
                  unmount: _ctx.unmount
                }, {
                  default: withCtx(({ selected }) => [
                    renderSlot(_ctx.$slots, item.slot || "item", {
                      item,
                      index,
                      selected
                    }, () => [
                      createTextVNode(toDisplayString(item.content), 1)
                    ])
                  ]),
                  _: 2
                }, 1032, ["class", "unmount"]);
              }), 128))
            ]),
            _: 3
          }, 8, ["class"])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/navigation/Tabs.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "BookingStatsCard",
  __ssrInlineRender: true,
  props: {
    summary: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const stats = computed(() => props.summary);
    const thisMonthBookings = computed(() => {
      var _a;
      if (!((_a = stats.value) == null ? void 0 : _a.by_month)) return 0;
      const currentMonth = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
      return stats.value.by_month[currentMonth] || 0;
    });
    const thisYearBookings = computed(() => {
      var _a;
      if (!((_a = stats.value) == null ? void 0 : _a.by_year)) return 0;
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
      return stats.value.by_year[currentYear] || 0;
    });
    const mostActiveMonth = computed(() => {
      var _a;
      if (!((_a = stats.value) == null ? void 0 : _a.by_month)) return { count: 0, name: "No data" };
      const months = stats.value.by_month;
      const maxEntry = Object.entries(months).reduce(
        (max, [month, count]) => count > max[1] ? [month, count] : max,
        ["", 0]
      );
      if (maxEntry[1] === 0) return { count: 0, name: "No data" };
      const monthName = (/* @__PURE__ */ new Date(maxEntry[0] + "-01")).toLocaleDateString("en-US", { month: "short", year: "numeric" });
      return { count: maxEntry[1], name: monthName };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2$1;
      const _component_UIcon = __nuxt_component_1$1;
      if (props.loading) {
        _push(`<!--[-->`);
        ssrRenderList(4, (i2) => {
          _push(ssrRenderComponent(_component_UCard, {
            key: i2,
            class: "animate-pulse"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="h-12 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded"${_scopeId}></div>`);
              } else {
                return [
                  createVNode("div", { class: "h-12 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded" })
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
      } else if (unref(stats)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_UCard, { class: "p-3 sm:p-4" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 sm:p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-calendar-days",
                class: "h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-600 dark:text-metrobnb-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-2 sm:ml-4 min-w-0 flex-1"${_scopeId}><p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(unref(stats).total_bookings)}</p><p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Total Bookings</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "p-2 sm:p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-calendar-days",
                      class: "h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-600 dark:text-metrobnb-400"
                    })
                  ]),
                  createVNode("div", { class: "ml-2 sm:ml-4 min-w-0 flex-1" }, [
                    createVNode("p", { class: "text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate" }, toDisplayString(unref(stats).total_bookings), 1),
                    createVNode("p", { class: "text-xs sm:text-sm text-gray-600 dark:text-gray-400" }, "Total Bookings")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, { class: "p-3 sm:p-4" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 sm:p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-calendar",
                class: "h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-700 dark:text-metrobnb-300"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-2 sm:ml-4 min-w-0 flex-1"${_scopeId}><p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(unref(thisMonthBookings))}</p><p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400"${_scopeId}>This Month</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "p-2 sm:p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-calendar",
                      class: "h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-700 dark:text-metrobnb-300"
                    })
                  ]),
                  createVNode("div", { class: "ml-2 sm:ml-4 min-w-0 flex-1" }, [
                    createVNode("p", { class: "text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate" }, toDisplayString(unref(thisMonthBookings)), 1),
                    createVNode("p", { class: "text-xs sm:text-sm text-gray-600 dark:text-gray-400" }, "This Month")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, { class: "p-3 sm:p-4" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 sm:p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-chart-bar",
                class: "h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-800 dark:text-metrobnb-200"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-2 sm:ml-4 min-w-0 flex-1"${_scopeId}><p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(unref(thisYearBookings))}</p><p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400"${_scopeId}>This Year</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "p-2 sm:p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-chart-bar",
                      class: "h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-800 dark:text-metrobnb-200"
                    })
                  ]),
                  createVNode("div", { class: "ml-2 sm:ml-4 min-w-0 flex-1" }, [
                    createVNode("p", { class: "text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate" }, toDisplayString(unref(thisYearBookings)), 1),
                    createVNode("p", { class: "text-xs sm:text-sm text-gray-600 dark:text-gray-400" }, "This Year")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, { class: "p-3 sm:p-4" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 sm:p-3 bg-metrobnb-400 dark:bg-metrobnb-600 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-fire",
                class: "h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-900 dark:text-metrobnb-100"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-2 sm:ml-4 min-w-0 flex-1"${_scopeId}><p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(unref(mostActiveMonth).count)}</p><p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(unref(mostActiveMonth).name)}</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "p-2 sm:p-3 bg-metrobnb-400 dark:bg-metrobnb-600 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-fire",
                      class: "h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-900 dark:text-metrobnb-100"
                    })
                  ]),
                  createVNode("div", { class: "ml-2 sm:ml-4 min-w-0 flex-1" }, [
                    createVNode("p", { class: "text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate" }, toDisplayString(unref(mostActiveMonth).count), 1),
                    createVNode("p", { class: "text-xs sm:text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(unref(mostActiveMonth).name), 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "col-span-2 sm:col-span-4" }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-center py-4 text-gray-500"${_scopeId}> No statistics available </div>`);
            } else {
              return [
                createVNode("div", { class: "text-center py-4 text-gray-500" }, " No statistics available ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/accounting/BookingStatsCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "BookingTable",
  __ssrInlineRender: true,
  props: {
    bookings: {},
    partners: {},
    units: {},
    readOnly: { type: Boolean }
  },
  emits: ["edit", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { units: dataUnits, partners: dataPartners } = useGlobalCache();
    const units = computed(() => props.units || dataUnits.value || []);
    const partners = computed(() => props.partners || dataPartners.value || []);
    const emit = __emit;
    const columns = [
      { key: "guest", label: "Guest & Stay Dates" },
      { key: "location", label: "Partner & Unit" },
      { key: "amount", label: "Total Amount" },
      { key: "status", label: "Status" },
      { key: "payment", label: "Payment Info" },
      { key: "actions", label: "" }
    ];
    const getAddonsTotal = (booking) => {
      if (!booking || !Array.isArray(booking.addons)) return 0;
      return booking.addons.reduce((sum, addon) => {
        return sum + (typeof (addon == null ? void 0 : addon.amount) === "number" ? addon.amount : 0);
      }, 0);
    };
    const getBookingTotal = (booking) => {
      if (!booking) return 0;
      const baseAmount = parseFloat(booking.base_amount) || 0;
      const addonsTotal = getAddonsTotal(booking);
      return baseAmount + addonsTotal;
    };
    const getAddonLabel = (type) => {
      const labels = {
        early_checkin: "Early Check-In",
        late_checkout: "Late Check-Out",
        parking: "Parking"
      };
      return labels[type] || type;
    };
    const getBookingStatusLabel = (status) => {
      const labels = {
        confirmed: "Confirmed",
        canceled: "Canceled",
        refunded: "Refunded"
      };
      return labels[status] || "Confirmed";
    };
    const getPaymentStatusLabel = (status) => {
      const labels = {
        unpaid: "Unpaid",
        partial: "Partial",
        fully_paid: "Fully Paid"
      };
      return labels[status] || "Unpaid";
    };
    const getBookingStatusClass = (status) => {
      const classes = {
        confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        canceled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        refunded: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      };
      return classes[status] || classes.confirmed;
    };
    const getBookingStatusColor = (status) => {
      const colors = {
        confirmed: "green",
        canceled: "red",
        refunded: "orange"
      };
      return colors[status] || "green";
    };
    const getPaymentStatusClass = (status) => {
      const classes = {
        unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        fully_paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      };
      return classes[status] || classes.unpaid;
    };
    const getUnitName = (unitId) => {
      if (!unitId || !Array.isArray(units.value)) return "N/A";
      const unit = units.value.find((u2) => u2 && u2.id === unitId);
      return (unit == null ? void 0 : unit.name) || "Unknown Unit";
    };
    const getPartnerName = (partnerId) => {
      if (!partnerId || !Array.isArray(partners.value)) return "N/A";
      const partner = partners.value.find((p) => p && p.id === partnerId);
      return (partner == null ? void 0 : partner.name) || "Unknown Partner";
    };
    const { formatDate, formatDateShort } = useDateFormat();
    const formatDateRange = (startDate, endDate) => {
      if (!startDate || !endDate) return "N/A";
      const start = formatDateShort(startDate);
      const end = formatDate(endDate);
      return `${start} - ${end}`;
    };
    const getActions = (row) => {
      if (props.readOnly) return [];
      return [
        [{
          label: "Edit",
          icon: "i-heroicons-pencil-square",
          click: () => emit("edit", row)
        }],
        [{
          label: "Delete",
          icon: "i-heroicons-trash",
          click: () => emit("delete", row.id)
        }]
      ];
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2$1;
      const _component_UDropdown = __nuxt_component_6$1;
      const _component_UButton = __nuxt_component_0$2;
      const _component_UBadge = __nuxt_component_5$1;
      const _component_UTable = __nuxt_component_6$2;
      _push(`<!--[--><div class="sm:hidden space-y-3"><!--[-->`);
      ssrRenderList(_ctx.bookings, (booking) => {
        _push(ssrRenderComponent(_component_UCard, {
          key: booking.id,
          class: "p-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-3"${_scopeId}><div class="flex justify-between items-start"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><h3 class="font-medium text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(booking.guest_name)}</h3><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(formatDateRange(booking.start_date, booking.end_date))}</p></div>`);
              _push2(ssrRenderComponent(_component_UDropdown, {
                items: getActions(booking)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      color: "gray",
                      variant: "ghost",
                      icon: "i-heroicons-ellipsis-horizontal",
                      size: "xs"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        icon: "i-heroicons-ellipsis-horizontal",
                        size: "xs"
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div><div class="grid grid-cols-2 gap-3 text-sm"${_scopeId}><div${_scopeId}><span class="text-gray-500 dark:text-gray-400"${_scopeId}>Partner:</span><p class="font-medium truncate"${_scopeId}>${ssrInterpolate(getPartnerName(booking.partner_id))}</p></div><div${_scopeId}><span class="text-gray-500 dark:text-gray-400"${_scopeId}>Unit:</span><p class="font-medium truncate"${_scopeId}>${ssrInterpolate(getUnitName(booking.unit_id))}</p></div><div${_scopeId}><span class="text-gray-500 dark:text-gray-400"${_scopeId}>Amount:</span><p class="font-medium"${_scopeId}>\u20B1${ssrInterpolate((getBookingTotal(booking) || 0).toLocaleString("en-US", { minimumFractionDigits: 0 }))}</p></div><div${_scopeId}><span class="text-gray-500 dark:text-gray-400"${_scopeId}>Status:</span>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: getBookingStatusColor(booking.booking_status),
                size: "xs"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(getBookingStatusLabel(booking.booking_status))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(getBookingStatusLabel(booking.booking_status)), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-3" }, [
                  createVNode("div", { class: "flex justify-between items-start" }, [
                    createVNode("div", { class: "min-w-0 flex-1" }, [
                      createVNode("h3", { class: "font-medium text-gray-900 dark:text-white truncate" }, toDisplayString(booking.guest_name), 1),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(formatDateRange(booking.start_date, booking.end_date)), 1)
                    ]),
                    createVNode(_component_UDropdown, {
                      items: getActions(booking)
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          icon: "i-heroicons-ellipsis-horizontal",
                          size: "xs"
                        })
                      ]),
                      _: 2
                    }, 1032, ["items"])
                  ]),
                  createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Partner:"),
                      createVNode("p", { class: "font-medium truncate" }, toDisplayString(getPartnerName(booking.partner_id)), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Unit:"),
                      createVNode("p", { class: "font-medium truncate" }, toDisplayString(getUnitName(booking.unit_id)), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Amount:"),
                      createVNode("p", { class: "font-medium" }, "\u20B1" + toDisplayString((getBookingTotal(booking) || 0).toLocaleString("en-US", { minimumFractionDigits: 0 })), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("span", { class: "text-gray-500 dark:text-gray-400" }, "Status:"),
                      createVNode(_component_UBadge, {
                        color: getBookingStatusColor(booking.booking_status),
                        size: "xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(getBookingStatusLabel(booking.booking_status)), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="hidden sm:block overflow-x-auto">`);
      _push(ssrRenderComponent(_component_UTable, {
        rows: _ctx.bookings,
        columns,
        class: "min-w-full"
      }, {
        "actions-data": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDropdown, {
              items: getActions(row)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
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
          } else {
            return [
              createVNode(_component_UDropdown, {
                items: getActions(row)
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
            ];
          }
        }),
        "amount-data": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="font-medium"${_scopeId}>\u20B1${ssrInterpolate((getBookingTotal(row) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</div>`);
            if ((row.addons || []).length) {
              _push2(`<div class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}> Base: \u20B1${ssrInterpolate((parseFloat(row.base_amount) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} + Add-ons: \u20B1${ssrInterpolate((getAddonsTotal(row) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "font-medium" }, "\u20B1" + toDisplayString((getBookingTotal(row) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })), 1),
                (row.addons || []).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-xs text-gray-500 dark:text-gray-400"
                }, " Base: \u20B1" + toDisplayString((parseFloat(row.base_amount) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + " + Add-ons: \u20B1" + toDisplayString((getAddonsTotal(row) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })), 1)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        "addons-data": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            if ((_a = row.addons) == null ? void 0 : _a.length) {
              _push2(`<div class="space-y-1"${_scopeId}><!--[-->`);
              ssrRenderList(row.addons, (addon) => {
                _push2(`<div class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"${_scopeId}>${ssrInterpolate(getAddonLabel(addon.type))}</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<span class="text-gray-400 text-sm"${_scopeId}>None</span>`);
            }
          } else {
            return [
              ((_b = row.addons) == null ? void 0 : _b.length) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-1"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(row.addons, (addon) => {
                  return openBlock(), createBlock("div", {
                    key: addon.type,
                    class: "text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                  }, toDisplayString(getAddonLabel(addon.type)), 1);
                }), 128))
              ])) : (openBlock(), createBlock("span", {
                key: 1,
                class: "text-gray-400 text-sm"
              }, "None"))
            ];
          }
        }),
        "status-data": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-1"${_scopeId}><div${_scopeId}><span class="${ssrRenderClass([getBookingStatusClass(row.booking_status), "inline-flex px-2 py-1 text-xs font-medium rounded-full"])}"${_scopeId}>${ssrInterpolate(getBookingStatusLabel(row.booking_status))}</span></div><div${_scopeId}><span class="${ssrRenderClass([row.invoiced ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200", "inline-flex px-2 py-1 text-xs font-medium rounded-full"])}"${_scopeId}>${ssrInterpolate(row.invoiced ? "Invoiced" : "Not Invoiced")}</span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-1" }, [
                createVNode("div", null, [
                  createVNode("span", {
                    class: ["inline-flex px-2 py-1 text-xs font-medium rounded-full", getBookingStatusClass(row.booking_status)]
                  }, toDisplayString(getBookingStatusLabel(row.booking_status)), 3)
                ]),
                createVNode("div", null, [
                  createVNode("span", {
                    class: ["inline-flex px-2 py-1 text-xs font-medium rounded-full", row.invoiced ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"]
                  }, toDisplayString(row.invoiced ? "Invoiced" : "Not Invoiced"), 3)
                ])
              ])
            ];
          }
        }),
        "payment-data": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="space-y-1"${_scopeId}><div${_scopeId}><span class="${ssrRenderClass([getPaymentStatusClass(row.payment_status), "inline-flex px-2 py-1 text-xs font-medium rounded-full"])}"${_scopeId}>${ssrInterpolate(getPaymentStatusLabel(row.payment_status))}</span></div><div${_scopeId}><span class="${ssrRenderClass([row.payment_received_by === "metrobnb" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", "inline-flex px-2 py-1 text-xs font-medium rounded-full"])}"${_scopeId}>${ssrInterpolate(row.payment_received_by === "metrobnb" ? "MetroBNB" : "Partner")}</span></div><div class="text-xs text-gray-500 dark:text-gray-400 mt-1"${_scopeId}>${ssrInterpolate(((_a = row.payment_method) == null ? void 0 : _a.name) || "N/A")}</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-1" }, [
                createVNode("div", null, [
                  createVNode("span", {
                    class: ["inline-flex px-2 py-1 text-xs font-medium rounded-full", getPaymentStatusClass(row.payment_status)]
                  }, toDisplayString(getPaymentStatusLabel(row.payment_status)), 3)
                ]),
                createVNode("div", null, [
                  createVNode("span", {
                    class: ["inline-flex px-2 py-1 text-xs font-medium rounded-full", row.payment_received_by === "metrobnb" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"]
                  }, toDisplayString(row.payment_received_by === "metrobnb" ? "MetroBNB" : "Partner"), 3)
                ]),
                createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, toDisplayString(((_b = row.payment_method) == null ? void 0 : _b.name) || "N/A"), 1)
              ])
            ];
          }
        }),
        "guest-data": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(row.guest_name)}</div><div class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}><div${_scopeId}>Stay: ${ssrInterpolate(formatDateRange(row.start_date, row.end_date))}</div><div class="text-xs"${_scopeId}>Booked: ${ssrInterpolate(unref(formatDate)(row.booking_date))}</div></div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(row.guest_name), 1),
                createVNode("div", { class: "text-sm text-gray-500 dark:text-gray-400" }, [
                  createVNode("div", null, "Stay: " + toDisplayString(formatDateRange(row.start_date, row.end_date)), 1),
                  createVNode("div", { class: "text-xs" }, "Booked: " + toDisplayString(unref(formatDate)(row.booking_date)), 1)
                ])
              ])
            ];
          }
        }),
        "location-data": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(getPartnerName(row.partner_id))}</div><div class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(getUnitName(row.unit_id))}</div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(getPartnerName(row.partner_id)), 1),
                createVNode("div", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(getUnitName(row.unit_id)), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/accounting/BookingTable.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "EditBookingModal",
  __ssrInlineRender: true,
  props: {
    booking: {},
    modelValue: { type: Boolean }
  },
  emits: ["update:modelValue", "updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const updateBookingWithFallback = async (id, data) => {
      try {
        const typedApi = useTypedApi();
        return await typedApi.updateBooking(id, data);
      } catch (error) {
        console.error("Typed API failed, using fallback:", error);
        const { updateBooking: fallback } = useApi();
        return await fallback(id, data);
      }
    };
    const loading = ref(false);
    const paymentMethods = ref([]);
    const bookingSources = ref([]);
    watch(() => props.modelValue, async (isOpen2) => {
      if (isOpen2) {
        await Promise.all([
          loadPartners(),
          loadUnits(),
          loadBookingSources(),
          loadPaymentMethods()
        ]);
      }
    });
    const loadBookingSources = async () => {
      try {
        const { $api } = useNuxtApp();
        const result = await $api("/api/booking-sources");
        bookingSources.value = result.data || [];
      } catch (error) {
        bookingSources.value = [];
      }
    };
    const loadPaymentMethods = async () => {
      try {
        const { $api } = useNuxtApp();
        const result = await $api("/api/payment-methods");
        paymentMethods.value = result.data || [];
      } catch (error) {
        paymentMethods.value = [];
      }
    };
    const availableAddons = [
      { type: "early_checkin", label: "Early Check-In", amount: 300 },
      { type: "late_checkout", label: "Late Check-Out", amount: 300 },
      { type: "parking", label: "Parking Fee", amount: 200 }
    ];
    const schema = z.object({
      guestName: z.string().min(1, "Guest name is required"),
      bookingDate: z.string().min(1, "Booking date is required"),
      startDate: z.string().min(1, "Check-in date is required"),
      endDate: z.string().min(1, "Check-out date is required"),
      amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
      paymentMethod: z.string().min(1, "Payment method is required"),
      partner: z.string().min(1, "Partner is required"),
      unitId: z.string().min(1, "Unit is required"),
      bookingSource: z.string().min(1, "Booking source is required"),
      bookingStatus: z.string().min(1, "Booking status is required"),
      paymentStatus: z.string().min(1, "Payment status is required"),
      amountPaid: z.coerce.number().min(0, "Amount paid must be 0 or greater"),
      payoutDate: z.string().optional(),
      notes: z.string().max(100, "Notes must be 100 characters or less").optional()
    });
    const state = reactive({
      guestName: "",
      bookingDate: "",
      startDate: "",
      endDate: "",
      amount: 0,
      paymentMethod: "",
      partner: "",
      unitId: "",
      bookingSource: "",
      addons: [],
      bookingStatus: "confirmed",
      paymentStatus: "unpaid",
      amountPaid: 0,
      paymentReceivedBy: "partner",
      payoutDate: "",
      invoiced: "false",
      notes: ""
    });
    const bookingStatusOptions = [
      { label: "Confirmed", value: "confirmed" },
      { label: "Canceled", value: "canceled" },
      { label: "Refunded", value: "refunded" }
    ];
    const paymentStatusOptions = [
      { label: "Unpaid", value: "unpaid" },
      { label: "Partial", value: "partial" },
      { label: "Fully Paid", value: "fully_paid" }
    ];
    const paymentMethodOptions = computed(() => {
      if (!Array.isArray(paymentMethods.value)) return [];
      return paymentMethods.value.filter((method) => method.is_active).map((method) => ({ label: method.name, value: method.id }));
    });
    const bookingSourceOptions = computed(() => {
      if (!Array.isArray(bookingSources.value)) return [];
      return bookingSources.value.filter((source) => source.is_active).map((source) => ({ label: source.name, value: source.id }));
    });
    const paymentReceivedByOptions = [
      { label: "Partner", value: "partner" },
      { label: "MetroBNB", value: "metrobnb" }
    ];
    const invoiceStatusOptions = [
      { label: "Not Invoiced", value: "false" },
      { label: "Invoiced", value: "true" }
    ];
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return partners.value.map((p) => ({ label: p.name, value: p.id }));
    });
    const availableUnits = computed(() => {
      if (!state.partner || !Array.isArray(units.value)) return [];
      return units.value.filter((unit) => unit && (unit.partner_id || unit.partnerId) === state.partner).map((unit) => ({ label: unit.name, value: unit.id }));
    });
    const isAddonSelected = (type) => {
      return state.addons.some((addon) => addon.type === type);
    };
    const toggleAddon = (addonConfig) => {
      const index = state.addons.findIndex((addon) => addon.type === addonConfig.type);
      if (index >= 0) {
        state.addons.splice(index, 1);
      } else {
        state.addons.push({ type: addonConfig.type, amount: addonConfig.amount });
      }
    };
    const selectedAddonsTotal = computed(
      () => state.addons.reduce((sum, addon) => sum + addon.amount, 0)
    );
    const totalAmount = computed(
      () => Number(state.amount || 0) + selectedAddonsTotal.value
    );
    const onSubmit = async () => {
      const { notifySuccess, notifyError } = useNotify();
      loading.value = true;
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 800));
      try {
        const updatedData = {
          guest_name: state.guestName,
          booking_date: state.bookingDate,
          start_date: state.startDate,
          end_date: state.endDate,
          base_amount: state.amount,
          payment_method_id: state.paymentMethod,
          partner_id: state.partner,
          unit_id: state.unitId,
          booking_source_id: state.bookingSource,
          addons: state.addons,
          booking_status: state.bookingStatus,
          payment_status: state.paymentStatus,
          amount_paid: state.amountPaid,
          payment_received_by: state.paymentReceivedBy,
          payout_date: state.payoutDate || null,
          invoiced: state.invoiced === "true",
          notes: state.notes
        };
        const [response] = await Promise.all([
          updateBookingWithFallback(props.booking.id, updatedData),
          minLoadingTime
        ]);
        if ((response == null ? void 0 : response.success) !== false) {
          notifySuccess(`Booking for ${state.guestName} updated successfully!`);
          setTimeout(() => {
            emit("updated");
            isOpen.value = false;
          }, 500);
        } else {
          throw new Error((response == null ? void 0 : response.message) || "Update failed");
        }
      } catch (error) {
        console.error("Update booking error:", error);
        notifyError((error == null ? void 0 : error.message) || "Failed to update booking. Please try again.");
      } finally {
        loading.value = false;
      }
    };
    const isInitializing = ref(false);
    watch(() => state.partner, (newPartnerId, oldPartnerId) => {
      if (oldPartnerId && !isInitializing.value) {
        state.unitId = "";
      }
    });
    watch(() => props.booking, (booking) => {
      var _a;
      if (booking) {
        isInitializing.value = true;
        Object.assign(state, {
          guestName: booking.guest_name || "",
          bookingDate: booking.booking_date || "",
          startDate: booking.start_date || "",
          endDate: booking.end_date || "",
          amount: parseFloat(booking.base_amount) || 0,
          paymentMethod: booking.payment_method_id || ((_a = booking.payment_method) == null ? void 0 : _a.id) || "",
          partner: booking.partner_id || "",
          unitId: booking.unit_id || "",
          bookingSource: booking.booking_source_id || "",
          addons: Array.isArray(booking.addons) ? booking.addons : [],
          bookingStatus: booking.booking_status || "confirmed",
          paymentStatus: booking.payment_status || "unpaid",
          amountPaid: parseFloat(booking.amount_paid) || 0,
          paymentReceivedBy: booking.payment_received_by || "partner",
          payoutDate: booking.payout_date || "",
          invoiced: booking.invoiced ? "true" : "false",
          notes: booking.notes || ""
        });
        nextTick(() => {
          isInitializing.value = false;
        });
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = __nuxt_component_0;
      const _component_UCard = __nuxt_component_2$1;
      const _component_UForm = __nuxt_component_3;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_6;
      const _component_DateInput = _sfc_main$9;
      const _component_USelect = __nuxt_component_5;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UCheckbox = __nuxt_component_8;
      const _component_UButton = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        modelValue: unref(isOpen),
        "onUpdate:modelValue": ($event) => isRef(isOpen) ? isOpen.value = $event : null
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Edit Booking</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Edit Booking")
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
                        _push4(`<div class="space-y-6"${_scopeId3}><div class="border-b border-gray-200 dark:border-gray-700 pb-4"${_scopeId3}><h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UIcon, {
                          name: "i-heroicons-user",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` Guest &amp; Booking Details </h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Guest Name",
                          name: "guestName"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(state).guestName,
                                "onUpdate:modelValue": ($event) => unref(state).guestName = $event,
                                name: "guestName"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).guestName,
                                  "onUpdate:modelValue": ($event) => unref(state).guestName = $event,
                                  name: "guestName"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Booking Date",
                          name: "bookingDate"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_DateInput, {
                                modelValue: unref(state).bookingDate,
                                "onUpdate:modelValue": ($event) => unref(state).bookingDate = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).bookingDate,
                                  "onUpdate:modelValue": ($event) => unref(state).bookingDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Check-in Date",
                          name: "startDate"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_DateInput, {
                                modelValue: unref(state).startDate,
                                "onUpdate:modelValue": ($event) => unref(state).startDate = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).startDate,
                                  "onUpdate:modelValue": ($event) => unref(state).startDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Check-out Date",
                          name: "endDate"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_DateInput, {
                                modelValue: unref(state).endDate,
                                "onUpdate:modelValue": ($event) => unref(state).endDate = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).endDate,
                                  "onUpdate:modelValue": ($event) => unref(state).endDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div><div class="border-b border-gray-200 dark:border-gray-700 pb-4"${_scopeId3}><h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UIcon, {
                          name: "i-heroicons-building-office",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` Property &amp; Source </h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Partner",
                          name: "partner"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).partner,
                                "onUpdate:modelValue": ($event) => unref(state).partner = $event,
                                options: unref(partnerOptions),
                                name: "partner"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).partner,
                                  "onUpdate:modelValue": ($event) => unref(state).partner = $event,
                                  options: unref(partnerOptions),
                                  name: "partner"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Unit",
                          name: "unitId"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).unitId,
                                "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                options: unref(availableUnits),
                                disabled: !unref(state).partner,
                                placeholder: "Select a partner first",
                                name: "unitId"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).unitId,
                                  "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                  options: unref(availableUnits),
                                  disabled: !unref(state).partner,
                                  placeholder: "Select a partner first",
                                  name: "unitId"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Booking Source",
                          name: "bookingSource"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).bookingSource,
                                "onUpdate:modelValue": ($event) => unref(state).bookingSource = $event,
                                options: unref(bookingSourceOptions),
                                name: "bookingSource"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).bookingSource,
                                  "onUpdate:modelValue": ($event) => unref(state).bookingSource = $event,
                                  options: unref(bookingSourceOptions),
                                  name: "bookingSource"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Booking Status",
                          name: "bookingStatus"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).bookingStatus,
                                "onUpdate:modelValue": ($event) => unref(state).bookingStatus = $event,
                                options: bookingStatusOptions,
                                name: "bookingStatus"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).bookingStatus,
                                  "onUpdate:modelValue": ($event) => unref(state).bookingStatus = $event,
                                  options: bookingStatusOptions,
                                  name: "bookingStatus"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div><div class="border-b border-gray-200 dark:border-gray-700 pb-4"${_scopeId3}><h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UIcon, {
                          name: "i-heroicons-credit-card",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` Payment Details </h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Base Amount",
                          name: "amount"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(state).amount,
                                "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                type: "number",
                                step: "0.01",
                                name: "amount"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).amount,
                                  "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                  type: "number",
                                  step: "0.01",
                                  name: "amount"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Amount Paid",
                          name: "amountPaid"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(state).amountPaid,
                                "onUpdate:modelValue": ($event) => unref(state).amountPaid = $event,
                                type: "number",
                                step: "0.01",
                                name: "amountPaid"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).amountPaid,
                                  "onUpdate:modelValue": ($event) => unref(state).amountPaid = $event,
                                  type: "number",
                                  step: "0.01",
                                  name: "amountPaid"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Payment Method",
                          name: "paymentMethod"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).paymentMethod,
                                "onUpdate:modelValue": ($event) => unref(state).paymentMethod = $event,
                                options: unref(paymentMethodOptions),
                                name: "paymentMethod"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paymentMethod,
                                  "onUpdate:modelValue": ($event) => unref(state).paymentMethod = $event,
                                  options: unref(paymentMethodOptions),
                                  name: "paymentMethod"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Payment Status",
                          name: "paymentStatus"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).paymentStatus,
                                "onUpdate:modelValue": ($event) => unref(state).paymentStatus = $event,
                                options: paymentStatusOptions,
                                name: "paymentStatus"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paymentStatus,
                                  "onUpdate:modelValue": ($event) => unref(state).paymentStatus = $event,
                                  options: paymentStatusOptions,
                                  name: "paymentStatus"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Payment Received By",
                          name: "paymentReceivedBy"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).paymentReceivedBy,
                                "onUpdate:modelValue": ($event) => unref(state).paymentReceivedBy = $event,
                                options: paymentReceivedByOptions,
                                name: "paymentReceivedBy"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paymentReceivedBy,
                                  "onUpdate:modelValue": ($event) => unref(state).paymentReceivedBy = $event,
                                  options: paymentReceivedByOptions,
                                  name: "paymentReceivedBy"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Payout Date",
                          name: "payoutDate"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_DateInput, {
                                modelValue: unref(state).payoutDate,
                                "onUpdate:modelValue": ($event) => unref(state).payoutDate = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).payoutDate,
                                  "onUpdate:modelValue": ($event) => unref(state).payoutDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div><div${_scopeId3}><h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UIcon, {
                          name: "i-heroicons-document-text",
                          class: "mr-2 h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` Administrative </h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Invoice Status",
                          name: "invoiced"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).invoiced,
                                "onUpdate:modelValue": ($event) => unref(state).invoiced = $event,
                                options: invoiceStatusOptions,
                                name: "invoiced"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).invoiced,
                                  "onUpdate:modelValue": ($event) => unref(state).invoiced = $event,
                                  options: invoiceStatusOptions,
                                  name: "invoiced"
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
                                placeholder: "Additional notes (max 100 characters)",
                                maxlength: 100,
                                rows: 2,
                                name: "notes"
                              }, null, _parent5, _scopeId4));
                              _push5(`<div class="text-xs text-gray-500 dark:text-gray-400 mt-1"${_scopeId4}>${ssrInterpolate(unref(state).notes.length)}/100 characters </div>`);
                            } else {
                              return [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(state).notes,
                                  "onUpdate:modelValue": ($event) => unref(state).notes = $event,
                                  placeholder: "Additional notes (max 100 characters)",
                                  maxlength: 100,
                                  rows: 2,
                                  name: "notes"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, toDisplayString(unref(state).notes.length) + "/100 characters ", 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div></div><div class="mt-6"${_scopeId3}><h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3"${_scopeId3}>Add-ons</h4><div class="grid grid-cols-1 sm:grid-cols-3 gap-3"${_scopeId3}><!--[-->`);
                        ssrRenderList(availableAddons, (addon) => {
                          _push4(`<div class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_UCheckbox, {
                            "model-value": isAddonSelected(addon.type),
                            "onUpdate:modelValue": ($event) => toggleAddon(addon)
                          }, null, _parent4, _scopeId3));
                          _push4(`<div class="flex-1"${_scopeId3}><p class="text-sm font-medium text-gray-900 dark:text-white"${_scopeId3}>${ssrInterpolate(addon.label)}</p><p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId3}>\u20B1${ssrInterpolate(addon.amount)}</p></div></div>`);
                        });
                        _push4(`<!--]--></div></div><div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"${_scopeId3}><div class="flex justify-between items-center"${_scopeId3}><span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId3}>Base Amount:</span><span class="text-sm"${_scopeId3}>\u20B1${ssrInterpolate(Number(unref(state).amount || 0).toFixed(2))}</span></div>`);
                        if (unref(selectedAddonsTotal) > 0) {
                          _push4(`<div class="flex justify-between items-center mt-1"${_scopeId3}><span class="text-sm text-gray-600 dark:text-gray-400"${_scopeId3}>Add-ons:</span><span class="text-sm"${_scopeId3}>\u20B1${ssrInterpolate(unref(selectedAddonsTotal).toFixed(2))}</span></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="flex justify-between items-center mt-2 pt-2 border-t border-blue-200 dark:border-blue-800"${_scopeId3}><span class="font-medium text-gray-900 dark:text-white"${_scopeId3}>Total Amount:</span><span class="font-bold text-lg text-blue-600 dark:text-blue-400"${_scopeId3}>\u20B1${ssrInterpolate(unref(totalAmount).toFixed(2))}</span></div></div><div class="flex justify-end space-x-3 mt-6"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false,
                          disabled: unref(loading)
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
                          loading: unref(loading)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Update Booking`);
                            } else {
                              return [
                                createTextVNode("Update Booking")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "space-y-6" }, [
                            createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                              createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                                createVNode(_component_UIcon, {
                                  name: "i-heroicons-user",
                                  class: "mr-2 h-4 w-4"
                                }),
                                createTextVNode(" Guest & Booking Details ")
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                                createVNode(_component_UFormGroup, {
                                  label: "Guest Name",
                                  name: "guestName"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_UInput, {
                                      modelValue: unref(state).guestName,
                                      "onUpdate:modelValue": ($event) => unref(state).guestName = $event,
                                      name: "guestName"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Booking Date",
                                  name: "bookingDate"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_DateInput, {
                                      modelValue: unref(state).bookingDate,
                                      "onUpdate:modelValue": ($event) => unref(state).bookingDate = $event
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Check-in Date",
                                  name: "startDate"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_DateInput, {
                                      modelValue: unref(state).startDate,
                                      "onUpdate:modelValue": ($event) => unref(state).startDate = $event
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Check-out Date",
                                  name: "endDate"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_DateInput, {
                                      modelValue: unref(state).endDate,
                                      "onUpdate:modelValue": ($event) => unref(state).endDate = $event
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                              createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                                createVNode(_component_UIcon, {
                                  name: "i-heroicons-building-office",
                                  class: "mr-2 h-4 w-4"
                                }),
                                createTextVNode(" Property & Source ")
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                                createVNode(_component_UFormGroup, {
                                  label: "Partner",
                                  name: "partner"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_USelect, {
                                      modelValue: unref(state).partner,
                                      "onUpdate:modelValue": ($event) => unref(state).partner = $event,
                                      options: unref(partnerOptions),
                                      name: "partner"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Unit",
                                  name: "unitId"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_USelect, {
                                      modelValue: unref(state).unitId,
                                      "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                      options: unref(availableUnits),
                                      disabled: !unref(state).partner,
                                      placeholder: "Select a partner first",
                                      name: "unitId"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Booking Source",
                                  name: "bookingSource"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_USelect, {
                                      modelValue: unref(state).bookingSource,
                                      "onUpdate:modelValue": ($event) => unref(state).bookingSource = $event,
                                      options: unref(bookingSourceOptions),
                                      name: "bookingSource"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Booking Status",
                                  name: "bookingStatus"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_USelect, {
                                      modelValue: unref(state).bookingStatus,
                                      "onUpdate:modelValue": ($event) => unref(state).bookingStatus = $event,
                                      options: bookingStatusOptions,
                                      name: "bookingStatus"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                              createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                                createVNode(_component_UIcon, {
                                  name: "i-heroicons-credit-card",
                                  class: "mr-2 h-4 w-4"
                                }),
                                createTextVNode(" Payment Details ")
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                                createVNode(_component_UFormGroup, {
                                  label: "Base Amount",
                                  name: "amount"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_UInput, {
                                      modelValue: unref(state).amount,
                                      "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                      type: "number",
                                      step: "0.01",
                                      name: "amount"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Amount Paid",
                                  name: "amountPaid"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_UInput, {
                                      modelValue: unref(state).amountPaid,
                                      "onUpdate:modelValue": ($event) => unref(state).amountPaid = $event,
                                      type: "number",
                                      step: "0.01",
                                      name: "amountPaid"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Payment Method",
                                  name: "paymentMethod"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_USelect, {
                                      modelValue: unref(state).paymentMethod,
                                      "onUpdate:modelValue": ($event) => unref(state).paymentMethod = $event,
                                      options: unref(paymentMethodOptions),
                                      name: "paymentMethod"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Payment Status",
                                  name: "paymentStatus"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_USelect, {
                                      modelValue: unref(state).paymentStatus,
                                      "onUpdate:modelValue": ($event) => unref(state).paymentStatus = $event,
                                      options: paymentStatusOptions,
                                      name: "paymentStatus"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Payment Received By",
                                  name: "paymentReceivedBy"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_USelect, {
                                      modelValue: unref(state).paymentReceivedBy,
                                      "onUpdate:modelValue": ($event) => unref(state).paymentReceivedBy = $event,
                                      options: paymentReceivedByOptions,
                                      name: "paymentReceivedBy"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_UFormGroup, {
                                  label: "Payout Date",
                                  name: "payoutDate"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_DateInput, {
                                      modelValue: unref(state).payoutDate,
                                      "onUpdate:modelValue": ($event) => unref(state).payoutDate = $event
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            createVNode("div", null, [
                              createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                                createVNode(_component_UIcon, {
                                  name: "i-heroicons-document-text",
                                  class: "mr-2 h-4 w-4"
                                }),
                                createTextVNode(" Administrative ")
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                                createVNode(_component_UFormGroup, {
                                  label: "Invoice Status",
                                  name: "invoiced"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_USelect, {
                                      modelValue: unref(state).invoiced,
                                      "onUpdate:modelValue": ($event) => unref(state).invoiced = $event,
                                      options: invoiceStatusOptions,
                                      name: "invoiced"
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
                                      placeholder: "Additional notes (max 100 characters)",
                                      maxlength: 100,
                                      rows: 2,
                                      name: "notes"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, toDisplayString(unref(state).notes.length) + "/100 characters ", 1)
                                  ]),
                                  _: 1
                                })
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "mt-6" }, [
                            createVNode("h4", { class: "text-sm font-medium text-gray-900 dark:text-white mb-3" }, "Add-ons"),
                            createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(availableAddons, (addon) => {
                                return createVNode("div", {
                                  key: addon.type,
                                  class: "flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                }, [
                                  createVNode(_component_UCheckbox, {
                                    "model-value": isAddonSelected(addon.type),
                                    "onUpdate:modelValue": ($event) => toggleAddon(addon)
                                  }, null, 8, ["model-value", "onUpdate:modelValue"]),
                                  createVNode("div", { class: "flex-1" }, [
                                    createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(addon.label), 1),
                                    createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "\u20B1" + toDisplayString(addon.amount), 1)
                                  ])
                                ]);
                              }), 64))
                            ])
                          ]),
                          createVNode("div", { class: "mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg" }, [
                            createVNode("div", { class: "flex justify-between items-center" }, [
                              createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Base Amount:"),
                              createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(Number(unref(state).amount || 0).toFixed(2)), 1)
                            ]),
                            unref(selectedAddonsTotal) > 0 ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex justify-between items-center mt-1"
                            }, [
                              createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Add-ons:"),
                              createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(unref(selectedAddonsTotal).toFixed(2)), 1)
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "flex justify-between items-center mt-2 pt-2 border-t border-blue-200 dark:border-blue-800" }, [
                              createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, "Total Amount:"),
                              createVNode("span", { class: "font-bold text-lg text-blue-600 dark:text-blue-400" }, "\u20B1" + toDisplayString(unref(totalAmount).toFixed(2)), 1)
                            ])
                          ]),
                          createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                            createVNode(_component_UButton, {
                              color: "gray",
                              variant: "ghost",
                              onClick: ($event) => isOpen.value = false,
                              disabled: unref(loading)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick", "disabled"]),
                            createVNode(_component_UButton, {
                              type: "submit",
                              color: "primary",
                              loading: unref(loading)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Update Booking")
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
                        createVNode("div", { class: "space-y-6" }, [
                          createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                            createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-user",
                                class: "mr-2 h-4 w-4"
                              }),
                              createTextVNode(" Guest & Booking Details ")
                            ]),
                            createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                              createVNode(_component_UFormGroup, {
                                label: "Guest Name",
                                name: "guestName"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UInput, {
                                    modelValue: unref(state).guestName,
                                    "onUpdate:modelValue": ($event) => unref(state).guestName = $event,
                                    name: "guestName"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Booking Date",
                                name: "bookingDate"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_DateInput, {
                                    modelValue: unref(state).bookingDate,
                                    "onUpdate:modelValue": ($event) => unref(state).bookingDate = $event
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Check-in Date",
                                name: "startDate"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_DateInput, {
                                    modelValue: unref(state).startDate,
                                    "onUpdate:modelValue": ($event) => unref(state).startDate = $event
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Check-out Date",
                                name: "endDate"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_DateInput, {
                                    modelValue: unref(state).endDate,
                                    "onUpdate:modelValue": ($event) => unref(state).endDate = $event
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                            createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-building-office",
                                class: "mr-2 h-4 w-4"
                              }),
                              createTextVNode(" Property & Source ")
                            ]),
                            createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                              createVNode(_component_UFormGroup, {
                                label: "Partner",
                                name: "partner"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).partner,
                                    "onUpdate:modelValue": ($event) => unref(state).partner = $event,
                                    options: unref(partnerOptions),
                                    name: "partner"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Unit",
                                name: "unitId"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).unitId,
                                    "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                    options: unref(availableUnits),
                                    disabled: !unref(state).partner,
                                    placeholder: "Select a partner first",
                                    name: "unitId"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Booking Source",
                                name: "bookingSource"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).bookingSource,
                                    "onUpdate:modelValue": ($event) => unref(state).bookingSource = $event,
                                    options: unref(bookingSourceOptions),
                                    name: "bookingSource"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Booking Status",
                                name: "bookingStatus"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).bookingStatus,
                                    "onUpdate:modelValue": ($event) => unref(state).bookingStatus = $event,
                                    options: bookingStatusOptions,
                                    name: "bookingStatus"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                            createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-credit-card",
                                class: "mr-2 h-4 w-4"
                              }),
                              createTextVNode(" Payment Details ")
                            ]),
                            createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                              createVNode(_component_UFormGroup, {
                                label: "Base Amount",
                                name: "amount"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UInput, {
                                    modelValue: unref(state).amount,
                                    "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                    type: "number",
                                    step: "0.01",
                                    name: "amount"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Amount Paid",
                                name: "amountPaid"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UInput, {
                                    modelValue: unref(state).amountPaid,
                                    "onUpdate:modelValue": ($event) => unref(state).amountPaid = $event,
                                    type: "number",
                                    step: "0.01",
                                    name: "amountPaid"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Payment Method",
                                name: "paymentMethod"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).paymentMethod,
                                    "onUpdate:modelValue": ($event) => unref(state).paymentMethod = $event,
                                    options: unref(paymentMethodOptions),
                                    name: "paymentMethod"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Payment Status",
                                name: "paymentStatus"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).paymentStatus,
                                    "onUpdate:modelValue": ($event) => unref(state).paymentStatus = $event,
                                    options: paymentStatusOptions,
                                    name: "paymentStatus"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Payment Received By",
                                name: "paymentReceivedBy"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).paymentReceivedBy,
                                    "onUpdate:modelValue": ($event) => unref(state).paymentReceivedBy = $event,
                                    options: paymentReceivedByOptions,
                                    name: "paymentReceivedBy"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Payout Date",
                                name: "payoutDate"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_DateInput, {
                                    modelValue: unref(state).payoutDate,
                                    "onUpdate:modelValue": ($event) => unref(state).payoutDate = $event
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-document-text",
                                class: "mr-2 h-4 w-4"
                              }),
                              createTextVNode(" Administrative ")
                            ]),
                            createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                              createVNode(_component_UFormGroup, {
                                label: "Invoice Status",
                                name: "invoiced"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).invoiced,
                                    "onUpdate:modelValue": ($event) => unref(state).invoiced = $event,
                                    options: invoiceStatusOptions,
                                    name: "invoiced"
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
                                    placeholder: "Additional notes (max 100 characters)",
                                    maxlength: 100,
                                    rows: 2,
                                    name: "notes"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, toDisplayString(unref(state).notes.length) + "/100 characters ", 1)
                                ]),
                                _: 1
                              })
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "mt-6" }, [
                          createVNode("h4", { class: "text-sm font-medium text-gray-900 dark:text-white mb-3" }, "Add-ons"),
                          createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(availableAddons, (addon) => {
                              return createVNode("div", {
                                key: addon.type,
                                class: "flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                              }, [
                                createVNode(_component_UCheckbox, {
                                  "model-value": isAddonSelected(addon.type),
                                  "onUpdate:modelValue": ($event) => toggleAddon(addon)
                                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                                createVNode("div", { class: "flex-1" }, [
                                  createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(addon.label), 1),
                                  createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "\u20B1" + toDisplayString(addon.amount), 1)
                                ])
                              ]);
                            }), 64))
                          ])
                        ]),
                        createVNode("div", { class: "mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg" }, [
                          createVNode("div", { class: "flex justify-between items-center" }, [
                            createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Base Amount:"),
                            createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(Number(unref(state).amount || 0).toFixed(2)), 1)
                          ]),
                          unref(selectedAddonsTotal) > 0 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex justify-between items-center mt-1"
                          }, [
                            createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Add-ons:"),
                            createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(unref(selectedAddonsTotal).toFixed(2)), 1)
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex justify-between items-center mt-2 pt-2 border-t border-blue-200 dark:border-blue-800" }, [
                            createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, "Total Amount:"),
                            createVNode("span", { class: "font-bold text-lg text-blue-600 dark:text-blue-400" }, "\u20B1" + toDisplayString(unref(totalAmount).toFixed(2)), 1)
                          ])
                        ]),
                        createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            onClick: ($event) => isOpen.value = false,
                            disabled: unref(loading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick", "disabled"]),
                          createVNode(_component_UButton, {
                            type: "submit",
                            color: "primary",
                            loading: unref(loading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Update Booking")
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
                  createVNode("h3", { class: "text-lg font-semibold" }, "Edit Booking")
                ]),
                default: withCtx(() => [
                  createVNode(_component_UForm, {
                    schema: unref(schema),
                    state: unref(state),
                    onSubmit
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-6" }, [
                        createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                          createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-user",
                              class: "mr-2 h-4 w-4"
                            }),
                            createTextVNode(" Guest & Booking Details ")
                          ]),
                          createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                            createVNode(_component_UFormGroup, {
                              label: "Guest Name",
                              name: "guestName"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).guestName,
                                  "onUpdate:modelValue": ($event) => unref(state).guestName = $event,
                                  name: "guestName"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Booking Date",
                              name: "bookingDate"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).bookingDate,
                                  "onUpdate:modelValue": ($event) => unref(state).bookingDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Check-in Date",
                              name: "startDate"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).startDate,
                                  "onUpdate:modelValue": ($event) => unref(state).startDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Check-out Date",
                              name: "endDate"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).endDate,
                                  "onUpdate:modelValue": ($event) => unref(state).endDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                          createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-building-office",
                              class: "mr-2 h-4 w-4"
                            }),
                            createTextVNode(" Property & Source ")
                          ]),
                          createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                            createVNode(_component_UFormGroup, {
                              label: "Partner",
                              name: "partner"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).partner,
                                  "onUpdate:modelValue": ($event) => unref(state).partner = $event,
                                  options: unref(partnerOptions),
                                  name: "partner"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Unit",
                              name: "unitId"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).unitId,
                                  "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                  options: unref(availableUnits),
                                  disabled: !unref(state).partner,
                                  placeholder: "Select a partner first",
                                  name: "unitId"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Booking Source",
                              name: "bookingSource"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).bookingSource,
                                  "onUpdate:modelValue": ($event) => unref(state).bookingSource = $event,
                                  options: unref(bookingSourceOptions),
                                  name: "bookingSource"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Booking Status",
                              name: "bookingStatus"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).bookingStatus,
                                  "onUpdate:modelValue": ($event) => unref(state).bookingStatus = $event,
                                  options: bookingStatusOptions,
                                  name: "bookingStatus"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        createVNode("div", { class: "border-b border-gray-200 dark:border-gray-700 pb-4" }, [
                          createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-credit-card",
                              class: "mr-2 h-4 w-4"
                            }),
                            createTextVNode(" Payment Details ")
                          ]),
                          createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                            createVNode(_component_UFormGroup, {
                              label: "Base Amount",
                              name: "amount"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).amount,
                                  "onUpdate:modelValue": ($event) => unref(state).amount = $event,
                                  type: "number",
                                  step: "0.01",
                                  name: "amount"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Amount Paid",
                              name: "amountPaid"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).amountPaid,
                                  "onUpdate:modelValue": ($event) => unref(state).amountPaid = $event,
                                  type: "number",
                                  step: "0.01",
                                  name: "amountPaid"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Payment Method",
                              name: "paymentMethod"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paymentMethod,
                                  "onUpdate:modelValue": ($event) => unref(state).paymentMethod = $event,
                                  options: unref(paymentMethodOptions),
                                  name: "paymentMethod"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Payment Status",
                              name: "paymentStatus"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paymentStatus,
                                  "onUpdate:modelValue": ($event) => unref(state).paymentStatus = $event,
                                  options: paymentStatusOptions,
                                  name: "paymentStatus"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Payment Received By",
                              name: "paymentReceivedBy"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).paymentReceivedBy,
                                  "onUpdate:modelValue": ($event) => unref(state).paymentReceivedBy = $event,
                                  options: paymentReceivedByOptions,
                                  name: "paymentReceivedBy"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Payout Date",
                              name: "payoutDate"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_DateInput, {
                                  modelValue: unref(state).payoutDate,
                                  "onUpdate:modelValue": ($event) => unref(state).payoutDate = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-document-text",
                              class: "mr-2 h-4 w-4"
                            }),
                            createTextVNode(" Administrative ")
                          ]),
                          createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                            createVNode(_component_UFormGroup, {
                              label: "Invoice Status",
                              name: "invoiced"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).invoiced,
                                  "onUpdate:modelValue": ($event) => unref(state).invoiced = $event,
                                  options: invoiceStatusOptions,
                                  name: "invoiced"
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
                                  placeholder: "Additional notes (max 100 characters)",
                                  maxlength: 100,
                                  rows: 2,
                                  name: "notes"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400 mt-1" }, toDisplayString(unref(state).notes.length) + "/100 characters ", 1)
                              ]),
                              _: 1
                            })
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "mt-6" }, [
                        createVNode("h4", { class: "text-sm font-medium text-gray-900 dark:text-white mb-3" }, "Add-ons"),
                        createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(availableAddons, (addon) => {
                            return createVNode("div", {
                              key: addon.type,
                              class: "flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                            }, [
                              createVNode(_component_UCheckbox, {
                                "model-value": isAddonSelected(addon.type),
                                "onUpdate:modelValue": ($event) => toggleAddon(addon)
                              }, null, 8, ["model-value", "onUpdate:modelValue"]),
                              createVNode("div", { class: "flex-1" }, [
                                createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(addon.label), 1),
                                createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "\u20B1" + toDisplayString(addon.amount), 1)
                              ])
                            ]);
                          }), 64))
                        ])
                      ]),
                      createVNode("div", { class: "mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg" }, [
                        createVNode("div", { class: "flex justify-between items-center" }, [
                          createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Base Amount:"),
                          createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(Number(unref(state).amount || 0).toFixed(2)), 1)
                        ]),
                        unref(selectedAddonsTotal) > 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex justify-between items-center mt-1"
                        }, [
                          createVNode("span", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Add-ons:"),
                          createVNode("span", { class: "text-sm" }, "\u20B1" + toDisplayString(unref(selectedAddonsTotal).toFixed(2)), 1)
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "flex justify-between items-center mt-2 pt-2 border-t border-blue-200 dark:border-blue-800" }, [
                          createVNode("span", { class: "font-medium text-gray-900 dark:text-white" }, "Total Amount:"),
                          createVNode("span", { class: "font-bold text-lg text-blue-600 dark:text-blue-400" }, "\u20B1" + toDisplayString(unref(totalAmount).toFixed(2)), 1)
                        ])
                      ]),
                      createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false,
                          disabled: unref(loading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick", "disabled"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(loading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Update Booking")
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/accounting/EditBookingModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AirbnbImportModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean }
  },
  emits: ["update:modelValue", "imported"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const schema = z.object({
      partnerId: z.string().min(1, "Partner is required"),
      unitId: z.string().min(1, "Unit is required"),
      csvFile: z.any().optional()
    });
    const state = reactive({
      partnerId: "",
      unitId: "",
      csvFile: null
    });
    const csvData = ref("");
    const csvPreview = ref("");
    const isImporting = ref(false);
    const importResults = ref(null);
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return partners.value.map((p) => ({ label: p.name, value: p.id }));
    });
    const availableUnits = computed(() => {
      if (!state.partnerId || !Array.isArray(units.value)) return [];
      return units.value.filter((unit) => unit && unit.partner_id === state.partnerId).map((unit) => ({ label: unit.name, value: unit.id }));
    });
    const isButtonDisabled = computed(() => {
      return !state.partnerId || !state.unitId || !csvData.value;
    });
    const handleFileChange = (event) => {
      var _a;
      const input = event.target || event.currentTarget;
      const file = (_a = input == null ? void 0 : input.files) == null ? void 0 : _a[0];
      if (!file) {
        csvData.value = "";
        csvPreview.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        var _a2;
        const content = (_a2 = e.target) == null ? void 0 : _a2.result;
        csvData.value = content;
        const lines = content.split("\n").slice(0, 3);
        csvPreview.value = lines.join("\n");
      };
      reader.onerror = (e) => {
      };
      reader.readAsText(file);
    };
    const onSubmit = async () => {
      var _a, _b;
      if (!csvData.value) return;
      try {
        isImporting.value = true;
        importResults.value = null;
        const response = await importAirbnbBookings({
          partner_id: state.partnerId,
          unit_id: state.unitId,
          csv_data: csvData.value
        });
        console.log("CSV Import Response:", response);
        const result = response.data || response;
        importResults.value = result;
        console.log("Processed Result:", result);
        const { notifySuccess, notifyWarning } = useNotify();
        if (result.imported_count > 0) {
          notifySuccess(`Successfully imported ${result.imported_count} bookings`);
          emit("imported");
          setTimeout(() => {
            isOpen.value = false;
            state.partnerId = "";
            state.unitId = "";
            csvData.value = "";
            csvPreview.value = "";
            importResults.value = null;
          }, 2e3);
        } else {
          notifyWarning("No bookings were imported. Please check your CSV format.");
        }
      } catch (error) {
        console.error("CSV Import Error:", error);
        const { notifyError } = useNotify();
        let errorMessage = "Failed to import Airbnb bookings";
        if ((_b = (_a = error.data) == null ? void 0 : _a.error) == null ? void 0 : _b.message) {
          errorMessage = error.data.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }
        notifyError(errorMessage);
      } finally {
        isImporting.value = false;
      }
    };
    watch(() => state.partnerId, () => {
      state.unitId = "";
    });
    watch(() => props.modelValue, async (isOpen2) => {
      if (isOpen2) {
        await Promise.all([loadPartners(), loadUnits()]);
        state.partnerId = "";
        state.unitId = "";
        csvData.value = "";
        csvPreview.value = "";
        importResults.value = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = __nuxt_component_0;
      const _component_UCard = __nuxt_component_2$1;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_UButton = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        modelValue: unref(isOpen),
        "onUpdate:modelValue": ($event) => isRef(isOpen) ? isOpen.value = $event : null
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Import Airbnb Bookings</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Import Airbnb Bookings")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b;
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
                          label: "Unit",
                          name: "unitId",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).unitId,
                                "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                options: unref(availableUnits),
                                disabled: !unref(state).partnerId,
                                placeholder: "Select unit"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).unitId,
                                  "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                  options: unref(availableUnits),
                                  disabled: !unref(state).partnerId,
                                  placeholder: "Select unit"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Airbnb CSV File",
                          name: "csvFile",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<input type="file" accept=".csv" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"${_scopeId4}><p class="text-xs text-gray-500 mt-1"${_scopeId4}> Upload your Airbnb transaction history CSV file </p>`);
                            } else {
                              return [
                                createVNode("input", {
                                  type: "file",
                                  accept: ".csv",
                                  onChange: handleFileChange,
                                  class: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                }, null, 32),
                                createVNode("p", { class: "text-xs text-gray-500 mt-1" }, " Upload your Airbnb transaction history CSV file ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (unref(csvPreview)) {
                          _push4(`<div class="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs"${_scopeId3}><p class="font-medium mb-2"${_scopeId3}>CSV Preview:</p><pre class="whitespace-pre-wrap"${_scopeId3}>${ssrInterpolate(unref(csvPreview))}</pre></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="flex justify-end space-x-3 mt-6"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false
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
                          loading: unref(isImporting),
                          disabled: unref(isButtonDisabled)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Import Bookings `);
                            } else {
                              return [
                                createTextVNode(" Import Bookings ")
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
                              label: "Unit",
                              name: "unitId",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).unitId,
                                  "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                  options: unref(availableUnits),
                                  disabled: !unref(state).partnerId,
                                  placeholder: "Select unit"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Airbnb CSV File",
                              name: "csvFile",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode("input", {
                                  type: "file",
                                  accept: ".csv",
                                  onChange: handleFileChange,
                                  class: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                }, null, 32),
                                createVNode("p", { class: "text-xs text-gray-500 mt-1" }, " Upload your Airbnb transaction history CSV file ")
                              ]),
                              _: 1
                            }),
                            unref(csvPreview) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs"
                            }, [
                              createVNode("p", { class: "font-medium mb-2" }, "CSV Preview:"),
                              createVNode("pre", { class: "whitespace-pre-wrap" }, toDisplayString(unref(csvPreview)), 1)
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                            createVNode(_component_UButton, {
                              color: "gray",
                              variant: "ghost",
                              onClick: ($event) => isOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_component_UButton, {
                              type: "submit",
                              color: "primary",
                              loading: unref(isImporting),
                              disabled: unref(isButtonDisabled)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Import Bookings ")
                              ]),
                              _: 1
                            }, 8, ["loading", "disabled"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(importResults)) {
                    _push3(`<div class="mt-6 p-4 border-t"${_scopeId2}><h4 class="font-medium mb-3"${_scopeId2}>Import Results</h4><div class="space-y-2 text-sm"${_scopeId2}><div class="flex justify-between"${_scopeId2}><span${_scopeId2}>Imported:</span><span class="font-medium text-green-600"${_scopeId2}>${ssrInterpolate(unref(importResults).imported_count)} bookings</span></div><div class="flex justify-between"${_scopeId2}><span${_scopeId2}>Skipped:</span><span class="font-medium text-yellow-600"${_scopeId2}>${ssrInterpolate(unref(importResults).skipped_count)} rows</span></div>`);
                    if ((_a = unref(importResults).errors) == null ? void 0 : _a.length) {
                      _push3(`<div class="mt-3"${_scopeId2}><p class="font-medium text-red-600 mb-1"${_scopeId2}>Errors:</p><ul class="text-red-600 text-xs space-y-1"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(importResults).errors, (error) => {
                        _push3(`<li${_scopeId2}>\u2022 ${ssrInterpolate(error)}</li>`);
                      });
                      _push3(`<!--]--></ul></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
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
                            label: "Unit",
                            name: "unitId",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).unitId,
                                "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                options: unref(availableUnits),
                                disabled: !unref(state).partnerId,
                                placeholder: "Select unit"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Airbnb CSV File",
                            name: "csvFile",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode("input", {
                                type: "file",
                                accept: ".csv",
                                onChange: handleFileChange,
                                class: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              }, null, 32),
                              createVNode("p", { class: "text-xs text-gray-500 mt-1" }, " Upload your Airbnb transaction history CSV file ")
                            ]),
                            _: 1
                          }),
                          unref(csvPreview) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs"
                          }, [
                            createVNode("p", { class: "font-medium mb-2" }, "CSV Preview:"),
                            createVNode("pre", { class: "whitespace-pre-wrap" }, toDisplayString(unref(csvPreview)), 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            onClick: ($event) => isOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            type: "submit",
                            color: "primary",
                            loading: unref(isImporting),
                            disabled: unref(isButtonDisabled)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Import Bookings ")
                            ]),
                            _: 1
                          }, 8, ["loading", "disabled"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["schema", "state"]),
                    unref(importResults) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-6 p-4 border-t"
                    }, [
                      createVNode("h4", { class: "font-medium mb-3" }, "Import Results"),
                      createVNode("div", { class: "space-y-2 text-sm" }, [
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", null, "Imported:"),
                          createVNode("span", { class: "font-medium text-green-600" }, toDisplayString(unref(importResults).imported_count) + " bookings", 1)
                        ]),
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", null, "Skipped:"),
                          createVNode("span", { class: "font-medium text-yellow-600" }, toDisplayString(unref(importResults).skipped_count) + " rows", 1)
                        ]),
                        ((_b = unref(importResults).errors) == null ? void 0 : _b.length) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-3"
                        }, [
                          createVNode("p", { class: "font-medium text-red-600 mb-1" }, "Errors:"),
                          createVNode("ul", { class: "text-red-600 text-xs space-y-1" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(importResults).errors, (error) => {
                              return openBlock(), createBlock("li", { key: error }, "\u2022 " + toDisplayString(error), 1);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Import Airbnb Bookings")
                ]),
                default: withCtx(() => {
                  var _a;
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
                            label: "Unit",
                            name: "unitId",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).unitId,
                                "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                options: unref(availableUnits),
                                disabled: !unref(state).partnerId,
                                placeholder: "Select unit"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Airbnb CSV File",
                            name: "csvFile",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode("input", {
                                type: "file",
                                accept: ".csv",
                                onChange: handleFileChange,
                                class: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              }, null, 32),
                              createVNode("p", { class: "text-xs text-gray-500 mt-1" }, " Upload your Airbnb transaction history CSV file ")
                            ]),
                            _: 1
                          }),
                          unref(csvPreview) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs"
                          }, [
                            createVNode("p", { class: "font-medium mb-2" }, "CSV Preview:"),
                            createVNode("pre", { class: "whitespace-pre-wrap" }, toDisplayString(unref(csvPreview)), 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            onClick: ($event) => isOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            type: "submit",
                            color: "primary",
                            loading: unref(isImporting),
                            disabled: unref(isButtonDisabled)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Import Bookings ")
                            ]),
                            _: 1
                          }, 8, ["loading", "disabled"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["schema", "state"]),
                    unref(importResults) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-6 p-4 border-t"
                    }, [
                      createVNode("h4", { class: "font-medium mb-3" }, "Import Results"),
                      createVNode("div", { class: "space-y-2 text-sm" }, [
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", null, "Imported:"),
                          createVNode("span", { class: "font-medium text-green-600" }, toDisplayString(unref(importResults).imported_count) + " bookings", 1)
                        ]),
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", null, "Skipped:"),
                          createVNode("span", { class: "font-medium text-yellow-600" }, toDisplayString(unref(importResults).skipped_count) + " rows", 1)
                        ]),
                        ((_a = unref(importResults).errors) == null ? void 0 : _a.length) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-3"
                        }, [
                          createVNode("p", { class: "font-medium text-red-600 mb-1" }, "Errors:"),
                          createVNode("ul", { class: "text-red-600 text-xs space-y-1" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(importResults).errors, (error) => {
                              return openBlock(), createBlock("li", { key: error }, "\u2022 " + toDisplayString(error), 1);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ])) : createCommentVNode("", true)
                  ];
                }),
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/accounting/AirbnbImportModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const useCalendarEvents = () => {
  const { units, partners } = useDataManager();
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      // emerald-500
      case "canceled":
        return "#ef4444";
      // red-500
      case "refunded":
        return "#f59e0b";
      // amber-500
      default:
        return "#6b7280";
    }
  };
  const getPaymentBorderColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "fully_paid":
        return "#059669";
      // emerald-600
      case "partial":
        return "#d97706";
      // amber-600
      case "unpaid":
        return "#dc2626";
      // red-600
      default:
        return "#6b7280";
    }
  };
  const getTextColor = (status) => {
    return "#ffffff";
  };
  const transformBookingsToEvents = async (bookings) => {
    return bookings.map((booking) => {
      const unit = units.value.find((u2) => u2.id === booking.unit_id);
      const partner = partners.value.find((p) => p.id === booking.partner_id);
      return {
        id: booking.id,
        title: `${booking.guest_name} - ${(unit == null ? void 0 : unit.name) || "Unknown Unit"}`,
        start: booking.start_date || booking.startDate,
        end: booking.end_date || booking.endDate,
        backgroundColor: getStatusColor(booking.booking_status),
        borderColor: getPaymentBorderColor(booking.payment_status),
        textColor: getTextColor(booking.booking_status),
        classNames: [`booking-${booking.booking_status}`, `payment-${booking.payment_status}`],
        extendedProps: {
          booking,
          unitName: (unit == null ? void 0 : unit.name) || "Unknown Unit",
          partnerName: (partner == null ? void 0 : partner.name) || "Unknown Partner",
          amount: booking.base_amount,
          paymentStatus: booking.payment_status
        }
      };
    });
  };
  return {
    transformBookingsToEvents,
    getStatusColor,
    getPaymentBorderColor,
    getTextColor
  };
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "BookingCalendar",
  __ssrInlineRender: true,
  props: {
    partnerId: {},
    unitId: {}
  },
  emits: ["eventClick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { transformBookingsToEvents } = useCalendarEvents();
    const events = ref([]);
    const loading = ref(false);
    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth"
      },
      events: [],
      eventClick: (info) => {
        emit("eventClick", info.event.extendedProps.booking);
      },
      datesSet: (info) => {
        loadEvents(info.start, info.end);
      },
      height: "auto",
      eventDisplay: "block",
      dayMaxEvents: 3,
      moreLinkClick: "popover",
      aspectRatio: 1.8,
      firstDay: 1
    });
    watch(events, (newEvents) => {
      calendarOptions.value.events = newEvents;
    });
    const loadEvents = async (start, end) => {
      var _a;
      loading.value = true;
      try {
        const startDate = start.toISOString().split("T")[0];
        const endDate = end.toISOString().split("T")[0];
        const result = await getBookings({
          start_date: startDate,
          end_date: endDate,
          partner_id: props.partnerId,
          unit_id: props.unitId,
          limit: 100
        });
        const bookings = ((_a = result == null ? void 0 : result.data) == null ? void 0 : _a.items) || (result == null ? void 0 : result.items) || [];
        if (bookings.length > 0) {
          events.value = await transformBookingsToEvents(bookings);
        } else {
          events.value = [];
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };
    watch([() => props.partnerId, () => props.unitId], () => {
      var _a;
      const calendarApi = (_a = calendar.value) == null ? void 0 : _a.getApi();
      if (calendarApi) {
        const view = calendarApi.view;
        loadEvents(view.activeStart, view.activeEnd);
      }
    });
    const calendar = ref();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "booking-calendar" }, _attrs))} data-v-f4297fc7>`);
      _push(ssrRenderComponent(unref(FullCalendar), {
        ref_key: "calendar",
        ref: calendar,
        options: unref(calendarOptions)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calendar/BookingCalendar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const BookingCalendar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f4297fc7"]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "calendar-legend" }, _attrs))} data-v-2f7f2ac9><h3 class="text-sm font-medium text-gray-900 mb-3" data-v-2f7f2ac9>Legend</h3><div class="space-y-2" data-v-2f7f2ac9><div class="text-xs text-gray-600 font-medium mb-1" data-v-2f7f2ac9>Booking Status</div><div class="flex flex-wrap gap-3" data-v-2f7f2ac9><div class="flex items-center gap-1" data-v-2f7f2ac9><div class="w-3 h-3 rounded bg-green-500" data-v-2f7f2ac9></div><span class="text-xs text-gray-700" data-v-2f7f2ac9>Confirmed</span></div><div class="flex items-center gap-1" data-v-2f7f2ac9><div class="w-3 h-3 rounded bg-red-500" data-v-2f7f2ac9></div><span class="text-xs text-gray-700" data-v-2f7f2ac9>Canceled</span></div><div class="flex items-center gap-1" data-v-2f7f2ac9><div class="w-3 h-3 rounded bg-orange-500" data-v-2f7f2ac9></div><span class="text-xs text-gray-700" data-v-2f7f2ac9>Refunded</span></div></div></div><div class="space-y-2 mt-4" data-v-2f7f2ac9><div class="text-xs text-gray-600 font-medium mb-1" data-v-2f7f2ac9>Payment Status (Border)</div><div class="flex flex-wrap gap-3" data-v-2f7f2ac9><div class="flex items-center gap-1" data-v-2f7f2ac9><div class="w-3 h-3 rounded bg-gray-300 border-2 border-green-600" data-v-2f7f2ac9></div><span class="text-xs text-gray-700" data-v-2f7f2ac9>Paid</span></div><div class="flex items-center gap-1" data-v-2f7f2ac9><div class="w-3 h-3 rounded bg-gray-300 border-2 border-orange-600" data-v-2f7f2ac9></div><span class="text-xs text-gray-700" data-v-2f7f2ac9>Partial</span></div><div class="flex items-center gap-1" data-v-2f7f2ac9><div class="w-3 h-3 rounded bg-gray-300 border-2 border-red-600" data-v-2f7f2ac9></div><span class="text-xs text-gray-700" data-v-2f7f2ac9>Unpaid</span></div></div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calendar/CalendarLegend.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CalendarLegend = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-2f7f2ac9"]]);
const useAccountingStore = defineStore("accounting", () => {
  const bookings = ref([]);
  const { getBookings: getBookings2, createBooking, updateBooking: apiUpdateBooking, deleteBooking: apiDeleteBooking, getBookingTotal } = useApi();
  const partnerEarnings = ref({});
  const units = ref([]);
  const getBookingTotalLocal = (booking) => {
    if (!booking) return 0;
    const baseAmount = typeof booking.amount === "number" ? booking.amount : 0;
    const addonsTotal = Array.isArray(booking.addons) ? booking.addons.reduce((sum, addon) => sum + (typeof (addon == null ? void 0 : addon.amount) === "number" ? addon.amount : 0), 0) : 0;
    return baseAmount + addonsTotal;
  };
  const getRemainingBalance = (booking) => {
    if (!booking) return 0;
    const total = getBookingTotalLocal(booking);
    const paid = typeof booking.amountPaid === "number" ? booking.amountPaid : 0;
    return total - paid;
  };
  const addBooking = async (booking) => {
    const newBooking = await createBooking({
      guestName: booking.guestName,
      date: booking.date,
      baseAmount: booking.amount,
      addons: booking.addons,
      unitId: booking.unitId,
      partnerId: booking.partner,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      amountPaid: booking.amountPaid,
      paymentMethod: booking.paymentMethod,
      paymentReceivedBy: "partner",
      bookingSourceId: "1",
      notes: ""
    });
    const transformedBooking = {
      id: newBooking.id,
      guestName: newBooking.guestName,
      date: newBooking.date,
      amount: newBooking.baseAmount,
      paymentMethod: newBooking.paymentMethod,
      partner: newBooking.partnerId,
      unitId: newBooking.unitId,
      addons: newBooking.addons,
      bookingStatus: newBooking.bookingStatus,
      paymentStatus: newBooking.paymentStatus,
      amountPaid: newBooking.amountPaid,
      createdAt: newBooking.createdAt
    };
    bookings.value.push(transformedBooking);
    if (!partnerEarnings.value[transformedBooking.partner]) {
      partnerEarnings.value[transformedBooking.partner] = 0;
    }
    partnerEarnings.value[transformedBooking.partner] += getBookingTotalLocal(transformedBooking);
  };
  const updateBooking = async (id, updatedBooking) => {
    const index = bookings.value.findIndex((b) => b.id === id);
    if (index !== -1) {
      const oldBooking = bookings.value[index];
      await apiUpdateBooking(id, {
        guestName: updatedBooking.guestName,
        date: updatedBooking.date,
        baseAmount: updatedBooking.amount,
        addons: updatedBooking.addons,
        unitId: updatedBooking.unitId,
        partnerId: updatedBooking.partner,
        paymentStatus: updatedBooking.paymentStatus,
        bookingStatus: updatedBooking.bookingStatus,
        amountPaid: updatedBooking.amountPaid,
        paymentMethod: updatedBooking.paymentMethod,
        paymentReceivedBy: "partner",
        bookingSourceId: "1",
        notes: ""
      });
      if (partnerEarnings.value[oldBooking.partner]) {
        partnerEarnings.value[oldBooking.partner] -= getBookingTotalLocal(oldBooking);
      }
      if (!partnerEarnings.value[updatedBooking.partner]) {
        partnerEarnings.value[updatedBooking.partner] = 0;
      }
      partnerEarnings.value[updatedBooking.partner] += getBookingTotalLocal(updatedBooking);
      bookings.value[index] = updatedBooking;
    }
  };
  const deleteBooking = async (id) => {
    const booking = bookings.value.find((b) => b.id === id);
    if (booking) {
      await apiDeleteBooking(id);
      if (partnerEarnings.value[booking.partner]) {
        partnerEarnings.value[booking.partner] -= getBookingTotalLocal(booking);
      }
      bookings.value = bookings.value.filter((b) => b.id !== id);
    }
  };
  const loadFromStorage = async () => {
    try {
      const apiBookings = await getBookings2();
      bookings.value = apiBookings.map((booking) => ({
        id: booking.id,
        guestName: booking.guestName,
        date: booking.date,
        amount: booking.baseAmount,
        paymentMethod: booking.paymentMethod,
        partner: booking.partnerId,
        unitId: booking.unitId,
        addons: booking.addons,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        amountPaid: booking.amountPaid,
        createdAt: booking.createdAt
      }));
      const earnings = {};
      bookings.value.forEach((booking) => {
        if (!earnings[booking.partner]) earnings[booking.partner] = 0;
        earnings[booking.partner] += getBookingTotalLocal(booking);
      });
      partnerEarnings.value = earnings;
    } catch (error) {
      bookings.value = [];
      partnerEarnings.value = {};
    }
  };
  const totalEarnings = computed(() => {
    if (!Array.isArray(bookings.value)) return 0;
    return bookings.value.reduce((sum, booking) => {
      const total = getBookingTotalLocal(booking);
      return sum + (typeof total === "number" ? total : 0);
    }, 0);
  });
  const totalAddonRevenue = computed(() => {
    if (!Array.isArray(bookings.value)) return 0;
    return bookings.value.reduce((sum, booking) => {
      if (!booking || !Array.isArray(booking.addons)) return sum;
      const addonsTotal = booking.addons.reduce((addonSum, addon) => {
        return addonSum + (typeof (addon == null ? void 0 : addon.amount) === "number" ? addon.amount : 0);
      }, 0);
      return sum + addonsTotal;
    }, 0);
  });
  const getPartnerEarnings = (partnerId) => {
    return partnerEarnings.value[partnerId] || 0;
  };
  return {
    bookings,
    units,
    partnerEarnings,
    addBooking,
    updateBooking,
    deleteBooking,
    loadFromStorage,
    totalEarnings,
    totalAddonRevenue,
    getBookingTotal: getBookingTotalLocal,
    getRemainingBalance,
    getPartnerEarnings
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    useBookingForm();
    const { deleteBooking } = useAccountingStore();
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const { getBookings: getBookings2, getBookingSources } = useApi();
    const { extractData, extractSummary } = useApiResponse();
    const isPartner = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.role) === "partner";
    });
    const bookingSources = ref([]);
    const showEditModal = ref(false);
    const showImportModal = ref(false);
    const selectedBooking = ref(null);
    const activeView = ref(0);
    const viewTabs = [
      { label: "Table View" },
      { label: "Calendar View" }
    ];
    watch(activeView, (newView) => {
    });
    const bookings = ref([]);
    const bookingSummary = ref(null);
    const currentPage = ref(1);
    const searchQuery = ref("");
    const sortBy = ref("created_at_desc");
    const isLoading = ref(true);
    const showAdvancedFilters = ref(false);
    const filters = reactive({
      year: "",
      month: "",
      partnerId: "",
      unitId: "",
      startDate: "",
      endDate: "",
      paymentStatus: "",
      paymentReceivedBy: "",
      bookingSource: "",
      invoiced: ""
    });
    const pagination = ref({
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      per_page: 15,
      has_next: false,
      has_prev: false
    });
    const sortOptions = [
      { label: "Newest First", value: "created_at_desc" },
      { label: "Oldest First", value: "created_at_asc" },
      { label: "Guest Name A-Z", value: "guest_name_asc" },
      { label: "Guest Name Z-A", value: "guest_name_desc" },
      { label: "Amount High-Low", value: "base_amount_desc" },
      { label: "Amount Low-High", value: "base_amount_asc" },
      { label: "Booking Date Newest", value: "booking_date_desc" },
      { label: "Booking Date Oldest", value: "booking_date_asc" }
    ];
    const totalBookings = computed(() => {
      var _a;
      return ((_a = pagination.value) == null ? void 0 : _a.total_items) || 0;
    });
    computed(() => {
      let startDate = filters.startDate;
      let endDate = filters.endDate;
      if (filters.year || filters.month) {
        const year = filters.year || (/* @__PURE__ */ new Date()).getFullYear();
        const month = filters.month || "";
        if (month) {
          const monthNum = parseInt(month);
          startDate = `${year}-${monthNum.toString().padStart(2, "0")}-01`;
          const lastDay = new Date(year, monthNum, 0).getDate();
          endDate = `${year}-${monthNum.toString().padStart(2, "0")}-${lastDay}`;
        } else {
          startDate = `${year}-01-01`;
          endDate = `${year}-12-31`;
        }
      }
      return {
        ...filters.partnerId && { partner_id: filters.partnerId },
        ...filters.unitId && { unit_id: filters.unitId },
        ...startDate && { start_date: startDate },
        ...endDate && { end_date: endDate }
      };
    });
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return [{ label: "All Partners", value: "" }, ...partners.value.map((p) => ({ label: p.name, value: p.id }))];
    });
    const unitOptions = computed(() => {
      var _a, _b, _c;
      console.log("unitOptions computed:", {
        isPartner: isPartner.value,
        userId: (_a = user.value) == null ? void 0 : _a.id,
        unitsCount: (_b = units.value) == null ? void 0 : _b.length,
        units: units.value,
        filtersPartnerId: filters.partnerId
      });
      if (!Array.isArray(units.value)) return [];
      let filteredUnits = units.value;
      if (isPartner.value && ((_c = user.value) == null ? void 0 : _c.id)) {
        filteredUnits = units.value.filter((u2) => {
          const match = u2.partner_id === user.value.id || u2.partnerId === user.value.id;
          console.log("Unit filter check:", { unitName: u2.name, unitPartnerId: u2.partner_id, unitPartnerIdAlt: u2.partnerId, userId: user.value.id, match });
          return match;
        });
      } else if (filters.partnerId) {
        filteredUnits = units.value.filter(
          (u2) => u2.partner_id === filters.partnerId || u2.partnerId === filters.partnerId
        );
      }
      console.log("Filtered units:", filteredUnits);
      return [{ label: "All Units", value: "" }, ...filteredUnits.map((u2) => ({ label: u2.name, value: u2.id }))];
    });
    const paymentStatusOptions = [
      { label: "All Status", value: "" },
      { label: "Unpaid", value: "unpaid" },
      { label: "Partial", value: "partial" },
      { label: "Fully Paid", value: "fully_paid" }
    ];
    const paymentReceivedByOptions = [
      { label: "All Recipients", value: "" },
      { label: "Partner", value: "partner" },
      { label: "MetroBNB", value: "metrobnb" }
    ];
    const invoicedOptions = [
      { label: "All Status", value: "" },
      { label: "Invoiced", value: "true" },
      { label: "Not Invoiced", value: "false" }
    ];
    const yearOptions = computed(() => {
      const years = [];
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      for (let i2 = currentYear - 5; i2 <= currentYear + 2; i2++) {
        years.push({ label: i2.toString(), value: i2.toString() });
      }
      return [{ label: "All Years", value: "" }, ...years.reverse()];
    });
    const monthOptions = computed(() => {
      const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" }
      ];
      return [{ label: "All Months", value: "" }, ...months];
    });
    const bookingSourceOptions = computed(() => {
      if (!Array.isArray(bookingSources.value)) return [];
      return [{ label: "All Sources", value: "" }, ...bookingSources.value.map((s2) => ({ label: s2.name, value: s2.id }))];
    });
    const handleEdit = (booking) => {
      selectedBooking.value = booking;
      showEditModal.value = true;
    };
    const showDeleteModal = ref(false);
    const bookingToDelete = ref(null);
    const deleteLoading = ref(false);
    const handleDelete = (id) => {
      bookingToDelete.value = id;
      showDeleteModal.value = true;
    };
    const confirmDelete = async () => {
      const { notifySuccess, notifyError } = useNotify();
      if (!bookingToDelete.value) return;
      deleteLoading.value = true;
      try {
        const { deleteBooking: apiDeleteBooking } = useApi();
        await apiDeleteBooking(bookingToDelete.value);
        await loadBookings();
        notifySuccess("Booking deleted successfully");
      } catch (error) {
        console.error("Delete booking error:", error);
        notifyError((error == null ? void 0 : error.message) || "Failed to delete booking");
      } finally {
        deleteLoading.value = false;
        showDeleteModal.value = false;
        bookingToDelete.value = null;
      }
    };
    const handleUpdated = () => {
      selectedBooking.value = null;
      loadBookings();
    };
    const handleImported = () => {
      loadBookings();
    };
    const handleCalendarEventClick = (booking) => {
      selectedBooking.value = booking;
      showEditModal.value = true;
    };
    const loadBookings = async () => {
      var _a;
      const { notifyError, notifyInfo } = useNotify();
      try {
        const parts = sortBy.value.split("_");
        const sortOrder = parts[parts.length - 1];
        const sortFieldParts = parts.slice(0, -1);
        const sortField = sortFieldParts.join("_");
        let startDate = filters.startDate;
        let endDate = filters.endDate;
        if (filters.year || filters.month) {
          const year = filters.year || (/* @__PURE__ */ new Date()).getFullYear();
          const month = filters.month || "";
          if (month) {
            const monthNum = parseInt(month);
            startDate = `${year}-${monthNum.toString().padStart(2, "0")}-01`;
            const lastDay = new Date(year, monthNum, 0).getDate();
            endDate = `${year}-${monthNum.toString().padStart(2, "0")}-${lastDay}`;
          } else {
            startDate = `${year}-01-01`;
            endDate = `${year}-12-31`;
          }
        }
        const params = {
          page: currentPage.value,
          limit: 15,
          sort_by: sortField,
          sort_order: sortOrder
        };
        if (searchQuery.value) params.search = searchQuery.value;
        if (!isPartner.value && filters.partnerId) params.partner_id = filters.partnerId;
        if (filters.unitId) params.unit_id = filters.unitId;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (filters.paymentStatus) params.payment_status = filters.paymentStatus;
        if (filters.paymentReceivedBy) params.payment_received_by = filters.paymentReceivedBy;
        if (filters.bookingSource) params.booking_source_id = filters.bookingSource;
        if (filters.invoiced) params.invoiced = filters.invoiced === "true";
        console.log("API request params:", params);
        console.log("Current filters state:", filters);
        console.log("Payment Received By:", filters.paymentReceivedBy, "Type:", typeof filters.paymentReceivedBy);
        console.log("Booking Source:", filters.bookingSource, "Type:", typeof filters.bookingSource);
        const result = await getBookings2(params);
        bookings.value = extractData(result);
        pagination.value = ((_a = result == null ? void 0 : result.data) == null ? void 0 : _a.pagination) || {
          current_page: 1,
          total_pages: 1,
          total_items: 0,
          per_page: 15,
          has_next: false,
          has_prev: false
        };
        bookingSummary.value = extractSummary(result);
        if (bookings.value.length === 0 && currentPage.value === 1) {
          notifyInfo("No bookings found");
        }
      } catch (error) {
        bookings.value = [];
        notifyError("Failed to load bookings");
      }
    };
    const debouncedSearch = () => {
      currentPage.value = 1;
      loadBookings();
    };
    const clearFilters = () => {
      Object.keys(filters).forEach((key) => {
        filters[key] = "";
      });
      searchQuery.value = "";
      currentPage.value = 1;
      loadBookings();
    };
    const applyFilters = () => {
      currentPage.value = 1;
      console.log("Applying filters:", filters);
      loadBookings();
    };
    watch(() => filters.partnerId, () => {
      filters.unitId = "";
    });
    let searchTimeout;
    const handleSearchInput = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(debouncedSearch, 300);
    };
    const handlePageChange = (page) => {
      currentPage.value = page;
      loadBookings();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UTabs = __nuxt_component_2;
      const _component_AccountingBookingStatsCard = _sfc_main$6;
      const _component_UCard = __nuxt_component_2$1;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_UInput = __nuxt_component_6;
      const _component_AccountingBookingTable = _sfc_main$5;
      const _component_StandardPagination = _sfc_main$8;
      const _component_AccountingEditBookingModal = _sfc_main$4;
      const _component_AccountingAirbnbImportModal = _sfc_main$3;
      const _component_UModal = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3 sm:space-y-6" }, _attrs))}><div class="space-y-3"><div class="flex justify-between items-start gap-3"><div class="min-w-0 flex-1"><h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Bookings</h1><p class="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Manage booking payments and records</p></div><div class="flex gap-2">`);
      if (!unref(isPartner)) {
        _push(`<div class="flex gap-2">`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => showImportModal.value = true,
          color: "primary",
          variant: "outline",
          size: "xs",
          class: "sm:size-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-arrow-up-tray",
                class: "sm:mr-1"
              }, null, _parent2, _scopeId));
              _push2(`<span class="hidden sm:inline"${_scopeId}>Import</span>`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-arrow-up-tray",
                  class: "sm:mr-1"
                }),
                createVNode("span", { class: "hidden sm:inline" }, "Import")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          to: "/accounting/bookings/create",
          color: "primary",
          size: "xs",
          class: "sm:size-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-plus",
                class: "sm:mr-1"
              }, null, _parent2, _scopeId));
              _push2(`<span class="hidden sm:inline"${_scopeId}>Add</span>`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-plus",
                  class: "sm:mr-1"
                }),
                createVNode("span", { class: "hidden sm:inline" }, "Add")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="sm:hidden">`);
      _push(ssrRenderComponent(_component_UTabs, {
        modelValue: unref(activeView),
        "onUpdate:modelValue": ($event) => isRef(activeView) ? activeView.value = $event : null,
        items: viewTabs,
        size: "sm"
      }, null, _parent));
      _push(`</div><div class="hidden sm:block">`);
      _push(ssrRenderComponent(_component_UTabs, {
        modelValue: unref(activeView),
        "onUpdate:modelValue": ($event) => isRef(activeView) ? activeView.value = $event : null,
        items: viewTabs
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">`);
      _push(ssrRenderComponent(_component_AccountingBookingStatsCard, {
        summary: unref(bookingSummary),
        loading: unref(isLoading)
      }, null, _parent));
      _push(`</div>`);
      if (unref(activeView) === 1) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-3">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Booking Calendar</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-lg font-semibold" }, "Booking Calendar")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="p-4"${_scopeId}><p class="text-sm text-gray-600 mb-4"${_scopeId}>Calendar view is active. Loading calendar...</p>`);
              _push2(ssrRenderComponent(BookingCalendar, {
                "partner-id": unref(filters).partnerId || void 0,
                "unit-id": unref(filters).unitId || void 0,
                onEventClick: handleCalendarEventClick
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "p-4" }, [
                  createVNode("p", { class: "text-sm text-gray-600 mb-4" }, "Calendar view is active. Loading calendar..."),
                  createVNode(BookingCalendar, {
                    "partner-id": unref(filters).partnerId || void 0,
                    "unit-id": unref(filters).unitId || void 0,
                    onEventClick: handleCalendarEventClick
                  }, null, 8, ["partner-id", "unit-id"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="lg:col-span-1">`);
        _push(ssrRenderComponent(CalendarLegend, null, null, _parent));
        _push(ssrRenderComponent(_component_UCard, { class: "mt-4" }, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-sm font-semibold"${_scopeId}>Filters</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-sm font-semibold" }, "Filters")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              if (!unref(isPartner)) {
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Partner" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).partnerId,
                        "onUpdate:modelValue": ($event) => unref(filters).partnerId = $event,
                        options: unref(partnerOptions),
                        placeholder: "All partners"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).partnerId,
                          "onUpdate:modelValue": ($event) => unref(filters).partnerId = $event,
                          options: unref(partnerOptions),
                          placeholder: "All partners"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Unit" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filters).unitId,
                      "onUpdate:modelValue": ($event) => unref(filters).unitId = $event,
                      options: unref(unitOptions),
                      placeholder: "All units"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).unitId,
                        "onUpdate:modelValue": ($event) => unref(filters).unitId = $event,
                        options: unref(unitOptions),
                        placeholder: "All units"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-3" }, [
                  !unref(isPartner) ? (openBlock(), createBlock(_component_UFormGroup, {
                    key: 0,
                    label: "Partner"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).partnerId,
                        "onUpdate:modelValue": ($event) => unref(filters).partnerId = $event,
                        options: unref(partnerOptions),
                        placeholder: "All partners"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(_component_UFormGroup, { label: "Unit" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).unitId,
                        "onUpdate:modelValue": ($event) => unref(filters).unitId = $event,
                        options: unref(unitOptions),
                        placeholder: "All units"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeView) === 0) {
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex justify-between items-center"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>All Bookings (${ssrInterpolate(unref(totalBookings))})</h3></div>`);
            } else {
              return [
                createVNode("div", { class: "flex justify-between items-center" }, [
                  createVNode("h3", { class: "text-lg font-semibold" }, "All Bookings (" + toDisplayString(unref(totalBookings)) + ")", 1)
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="mb-4 space-y-3"${_scopeId}><div class="flex flex-col sm:flex-row gap-2 sm:gap-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(searchQuery),
                "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
                placeholder: "Search guests...",
                icon: "i-heroicons-magnifying-glass",
                class: "w-full sm:flex-1",
                size: "sm",
                onInput: handleSearchInput
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_USelect, {
                modelValue: unref(sortBy),
                "onUpdate:modelValue": ($event) => isRef(sortBy) ? sortBy.value = $event : null,
                options: sortOptions,
                class: "flex-1 sm:w-auto",
                size: "sm",
                onChange: loadBookings
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "outline",
                size: "sm",
                onClick: ($event) => showAdvancedFilters.value = !unref(showAdvancedFilters)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-funnel",
                      class: "sm:mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="hidden sm:inline"${_scopeId2}>Filters</span>`);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-funnel",
                        class: "sm:mr-1"
                      }),
                      createVNode("span", { class: "hidden sm:inline" }, "Filters")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
              if (unref(showAdvancedFilters)) {
                _push2(`<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Year" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).year,
                        "onUpdate:modelValue": ($event) => unref(filters).year = $event,
                        options: unref(yearOptions),
                        placeholder: "All years"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).year,
                          "onUpdate:modelValue": ($event) => unref(filters).year = $event,
                          options: unref(yearOptions),
                          placeholder: "All years"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Month" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).month,
                        "onUpdate:modelValue": ($event) => unref(filters).month = $event,
                        options: unref(monthOptions),
                        placeholder: "All months"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).month,
                          "onUpdate:modelValue": ($event) => unref(filters).month = $event,
                          options: unref(monthOptions),
                          placeholder: "All months"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Partner" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).partnerId,
                        "onUpdate:modelValue": ($event) => unref(filters).partnerId = $event,
                        options: unref(partnerOptions),
                        placeholder: "Select partner"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).partnerId,
                          "onUpdate:modelValue": ($event) => unref(filters).partnerId = $event,
                          options: unref(partnerOptions),
                          placeholder: "Select partner"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Unit" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).unitId,
                        "onUpdate:modelValue": ($event) => unref(filters).unitId = $event,
                        options: unref(unitOptions),
                        placeholder: "Select unit",
                        disabled: !unref(filters).partnerId
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).unitId,
                          "onUpdate:modelValue": ($event) => unref(filters).unitId = $event,
                          options: unref(unitOptions),
                          placeholder: "Select unit",
                          disabled: !unref(filters).partnerId
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Payment Status" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).paymentStatus,
                        "onUpdate:modelValue": ($event) => unref(filters).paymentStatus = $event,
                        options: paymentStatusOptions,
                        placeholder: "Select status"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).paymentStatus,
                          "onUpdate:modelValue": ($event) => unref(filters).paymentStatus = $event,
                          options: paymentStatusOptions,
                          placeholder: "Select status"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Payment Received By" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).paymentReceivedBy,
                        "onUpdate:modelValue": ($event) => unref(filters).paymentReceivedBy = $event,
                        options: paymentReceivedByOptions,
                        placeholder: "Select recipient"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).paymentReceivedBy,
                          "onUpdate:modelValue": ($event) => unref(filters).paymentReceivedBy = $event,
                          options: paymentReceivedByOptions,
                          placeholder: "Select recipient"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Start Date" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UInput, {
                        modelValue: unref(filters).startDate,
                        "onUpdate:modelValue": ($event) => unref(filters).startDate = $event,
                        type: "date",
                        placeholder: "From date"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UInput, {
                          modelValue: unref(filters).startDate,
                          "onUpdate:modelValue": ($event) => unref(filters).startDate = $event,
                          type: "date",
                          placeholder: "From date"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "End Date" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UInput, {
                        modelValue: unref(filters).endDate,
                        "onUpdate:modelValue": ($event) => unref(filters).endDate = $event,
                        type: "date",
                        placeholder: "To date"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UInput, {
                          modelValue: unref(filters).endDate,
                          "onUpdate:modelValue": ($event) => unref(filters).endDate = $event,
                          type: "date",
                          placeholder: "To date"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Booking Source" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).bookingSource,
                        "onUpdate:modelValue": ($event) => unref(filters).bookingSource = $event,
                        options: unref(bookingSourceOptions),
                        placeholder: "Select source"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).bookingSource,
                          "onUpdate:modelValue": ($event) => unref(filters).bookingSource = $event,
                          options: unref(bookingSourceOptions),
                          placeholder: "Select source"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Invoice Status" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(filters).invoiced,
                        "onUpdate:modelValue": ($event) => unref(filters).invoiced = $event,
                        options: invoicedOptions,
                        placeholder: "Select status"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(filters).invoiced,
                          "onUpdate:modelValue": ($event) => unref(filters).invoiced = $event,
                          options: invoicedOptions,
                          placeholder: "Select status"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div><div class="flex justify-end gap-2 mt-4"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "ghost",
                  onClick: clearFilters
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Clear All `);
                    } else {
                      return [
                        createTextVNode(" Clear All ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "primary",
                  onClick: applyFilters
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Apply Filters `);
                    } else {
                      return [
                        createTextVNode(" Apply Filters ")
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
              if (unref(isLoading)) {
                _push2(`<div class="flex justify-center py-8"${_scopeId}><div class="text-gray-500"${_scopeId}>Loading bookings...</div></div>`);
              } else {
                _push2(ssrRenderComponent(_component_AccountingBookingTable, {
                  bookings: unref(bookings),
                  partners: unref(partners),
                  units: unref(units),
                  "read-only": unref(isPartner),
                  onEdit: handleEdit,
                  onDelete: handleDelete
                }, null, _parent2, _scopeId));
              }
              _push2(ssrRenderComponent(_component_StandardPagination, {
                pagination: unref(pagination),
                onPageChange: handlePageChange
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { class: "mb-4 space-y-3" }, [
                  createVNode("div", { class: "flex flex-col sm:flex-row gap-2 sm:gap-4" }, [
                    createVNode(_component_UInput, {
                      modelValue: unref(searchQuery),
                      "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
                      placeholder: "Search guests...",
                      icon: "i-heroicons-magnifying-glass",
                      class: "w-full sm:flex-1",
                      size: "sm",
                      onInput: handleSearchInput
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(_component_USelect, {
                        modelValue: unref(sortBy),
                        "onUpdate:modelValue": ($event) => isRef(sortBy) ? sortBy.value = $event : null,
                        options: sortOptions,
                        class: "flex-1 sm:w-auto",
                        size: "sm",
                        onChange: loadBookings
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_UButton, {
                        variant: "outline",
                        size: "sm",
                        onClick: ($event) => showAdvancedFilters.value = !unref(showAdvancedFilters)
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-funnel",
                            class: "sm:mr-1"
                          }),
                          createVNode("span", { class: "hidden sm:inline" }, "Filters")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ])
                  ]),
                  unref(showAdvancedFilters) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                  }, [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                      createVNode(_component_UFormGroup, { label: "Year" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(filters).year,
                            "onUpdate:modelValue": ($event) => unref(filters).year = $event,
                            options: unref(yearOptions),
                            placeholder: "All years"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Month" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(filters).month,
                            "onUpdate:modelValue": ($event) => unref(filters).month = $event,
                            options: unref(monthOptions),
                            placeholder: "All months"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Partner" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(filters).partnerId,
                            "onUpdate:modelValue": ($event) => unref(filters).partnerId = $event,
                            options: unref(partnerOptions),
                            placeholder: "Select partner"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Unit" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(filters).unitId,
                            "onUpdate:modelValue": ($event) => unref(filters).unitId = $event,
                            options: unref(unitOptions),
                            placeholder: "Select unit",
                            disabled: !unref(filters).partnerId
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Payment Status" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(filters).paymentStatus,
                            "onUpdate:modelValue": ($event) => unref(filters).paymentStatus = $event,
                            options: paymentStatusOptions,
                            placeholder: "Select status"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Payment Received By" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(filters).paymentReceivedBy,
                            "onUpdate:modelValue": ($event) => unref(filters).paymentReceivedBy = $event,
                            options: paymentReceivedByOptions,
                            placeholder: "Select recipient"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Start Date" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(filters).startDate,
                            "onUpdate:modelValue": ($event) => unref(filters).startDate = $event,
                            type: "date",
                            placeholder: "From date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "End Date" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(filters).endDate,
                            "onUpdate:modelValue": ($event) => unref(filters).endDate = $event,
                            type: "date",
                            placeholder: "To date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Booking Source" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(filters).bookingSource,
                            "onUpdate:modelValue": ($event) => unref(filters).bookingSource = $event,
                            options: unref(bookingSourceOptions),
                            placeholder: "Select source"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Invoice Status" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(filters).invoiced,
                            "onUpdate:modelValue": ($event) => unref(filters).invoiced = $event,
                            options: invoicedOptions,
                            placeholder: "Select status"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "flex justify-end gap-2 mt-4" }, [
                      createVNode(_component_UButton, {
                        variant: "ghost",
                        onClick: clearFilters
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Clear All ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UButton, {
                        color: "primary",
                        onClick: applyFilters
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Apply Filters ")
                        ]),
                        _: 1
                      })
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                unref(isLoading) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex justify-center py-8"
                }, [
                  createVNode("div", { class: "text-gray-500" }, "Loading bookings...")
                ])) : (openBlock(), createBlock(_component_AccountingBookingTable, {
                  key: 1,
                  bookings: unref(bookings),
                  partners: unref(partners),
                  units: unref(units),
                  "read-only": unref(isPartner),
                  onEdit: handleEdit,
                  onDelete: handleDelete
                }, null, 8, ["bookings", "partners", "units", "read-only"])),
                createVNode(_component_StandardPagination, {
                  pagination: unref(pagination),
                  onPageChange: handlePageChange
                }, null, 8, ["pagination"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AccountingEditBookingModal, {
        modelValue: unref(showEditModal),
        "onUpdate:modelValue": ($event) => isRef(showEditModal) ? showEditModal.value = $event : null,
        booking: unref(selectedBooking),
        onUpdated: handleUpdated
      }, null, _parent));
      _push(ssrRenderComponent(_component_AccountingAirbnbImportModal, {
        modelValue: unref(showImportModal),
        "onUpdate:modelValue": ($event) => isRef(showImportModal) ? showImportModal.value = $event : null,
        onImported: handleImported
      }, null, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showDeleteModal),
        "onUpdate:modelValue": ($event) => isRef(showDeleteModal) ? showDeleteModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Delete Booking</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Delete Booking")
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => showDeleteModal.value = false,
                    disabled: unref(deleteLoading)
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
                    color: "red",
                    onClick: confirmDelete,
                    loading: unref(deleteLoading)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Delete`);
                      } else {
                        return [
                          createTextVNode("Delete")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end gap-3" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        onClick: ($event) => showDeleteModal.value = false,
                        disabled: unref(deleteLoading)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }, 8, ["onClick", "disabled"]),
                      createVNode(_component_UButton, {
                        color: "red",
                        onClick: confirmDelete,
                        loading: unref(deleteLoading)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Delete")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-gray-600 dark:text-gray-400"${_scopeId2}> Are you sure you want to delete this booking? This action cannot be undone. </p>`);
                } else {
                  return [
                    createVNode("p", { class: "text-gray-600 dark:text-gray-400" }, " Are you sure you want to delete this booking? This action cannot be undone. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Delete Booking")
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-3" }, [
                    createVNode(_component_UButton, {
                      color: "gray",
                      variant: "ghost",
                      onClick: ($event) => showDeleteModal.value = false,
                      disabled: unref(deleteLoading)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Cancel")
                      ]),
                      _: 1
                    }, 8, ["onClick", "disabled"]),
                    createVNode(_component_UButton, {
                      color: "red",
                      onClick: confirmDelete,
                      loading: unref(deleteLoading)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Delete")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400" }, " Are you sure you want to delete this booking? This action cannot be undone. ")
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/bookings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CQ_rbVm4.mjs.map
