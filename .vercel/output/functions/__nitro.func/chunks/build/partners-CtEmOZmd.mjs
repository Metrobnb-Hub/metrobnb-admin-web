import { L as __nuxt_component_2, e as __nuxt_component_1$1 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
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
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "partners",
  __ssrInlineRender: true,
  setup(__props) {
    const { partners, loadPartners } = useGlobalCache();
    const { getBookings } = useApi();
    const bookings = ref([]);
    const totalEarnings = ref(0);
    const getBookingTotal = (booking) => {
      if (!booking) return 0;
      const baseAmount = parseFloat(booking.baseAmount || booking.base_amount || 0);
      const addonsTotal = (booking.addons || []).reduce((sum, addon) => {
        return sum + (parseFloat(addon.amount) || 0);
      }, 0);
      return baseAmount + addonsTotal;
    };
    const sortedPartners = computed(() => {
      if (!Array.isArray(partners.value) || partners.value.length === 0) return [];
      return [...partners.value].filter((partner) => partner && partner.id).map((partner) => {
        const partnerBookings = bookings.value.filter((b) => b && (b.partnerId || b.partner_id) === partner.id);
        const earnings = partnerBookings.reduce((sum, booking) => {
          return sum + getBookingTotal(booking);
        }, 0);
        return {
          ...partner,
          earnings: earnings || 0
        };
      }).sort((a, b) => (b.earnings || 0) - (a.earnings || 0));
    });
    const getPartnerBookingCount = (partnerId) => {
      if (!Array.isArray(bookings.value) || !partnerId) return 0;
      return bookings.value.filter((booking) => booking && (booking.partnerId || booking.partner_id) === partnerId).length;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-users",
              class: "h-6 w-6 text-blue-600 dark:text-blue-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Total Partners</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(((_a = unref(partners).value) == null ? void 0 : _a.length) || 0)}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-2 bg-blue-100 dark:bg-blue-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-users",
                    class: "h-6 w-6 text-blue-600 dark:text-blue-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Total Partners"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(((_b = unref(partners).value) == null ? void 0 : _b.length) || 0), 1)
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
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-currency-dollar",
              class: "h-6 w-6 text-green-600 dark:text-green-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Total Earnings</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>\u20B1${ssrInterpolate(unref(totalEarnings).toFixed(2))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-2 bg-green-100 dark:bg-green-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-currency-dollar",
                    class: "h-6 w-6 text-green-600 dark:text-green-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Total Earnings"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "\u20B1" + toDisplayString(unref(totalEarnings).toFixed(2)), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chart-bar",
              class: "h-6 w-6 text-purple-600 dark:text-purple-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Avg per Partner</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}> \u20B1${ssrInterpolate(((_a = unref(partners).value) == null ? void 0 : _a.length) ? (unref(totalEarnings).value / unref(partners).value.length).toFixed(2) : "0.00")}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-2 bg-purple-100 dark:bg-purple-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-chart-bar",
                    class: "h-6 w-6 text-purple-600 dark:text-purple-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Avg per Partner"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, " \u20B1" + toDisplayString(((_b = unref(partners).value) == null ? void 0 : _b.length) ? (unref(totalEarnings).value / unref(partners).value.length).toFixed(2) : "0.00"), 1)
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
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Partners &amp; Earnings</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Partners & Earnings")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(unref(sortedPartners), (partner) => {
              _push2(`<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}><div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"${_scopeId}><span class="text-blue-600 dark:text-blue-400 font-semibold"${_scopeId}>${ssrInterpolate(partner.name.charAt(0))}</span></div><div class="ml-4"${_scopeId}><h4 class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(partner.name)}</h4><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(getPartnerBookingCount(partner.id))} bookings </p></div></div><div class="text-right"${_scopeId}><p class="font-semibold text-gray-900 dark:text-white"${_scopeId}> \u20B1${ssrInterpolate(partner.earnings.toFixed(2))}</p><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate((partner.earnings / unref(totalEarnings).value * 100 || 0).toFixed(1))}% </p></div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(sortedPartners), (partner) => {
                  return openBlock(), createBlock("div", {
                    key: partner.id,
                    class: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode("div", { class: "w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center" }, [
                        createVNode("span", { class: "text-blue-600 dark:text-blue-400 font-semibold" }, toDisplayString(partner.name.charAt(0)), 1)
                      ]),
                      createVNode("div", { class: "ml-4" }, [
                        createVNode("h4", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(partner.name), 1),
                        createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(getPartnerBookingCount(partner.id)) + " bookings ", 1)
                      ])
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("p", { class: "font-semibold text-gray-900 dark:text-white" }, " \u20B1" + toDisplayString(partner.earnings.toFixed(2)), 1),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString((partner.earnings / unref(totalEarnings).value * 100 || 0).toFixed(1)) + "% ", 1)
                    ])
                  ]);
                }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/partners.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=partners-CtEmOZmd.mjs.map
