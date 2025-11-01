import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2 } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useDataManager } from './useDataManager-_ycBTlnZ.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
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
  __name: "own-units",
  __ssrInlineRender: true,
  setup(__props) {
    const { units } = useDataManager();
    const { getDashboardMetrics } = useApi();
    const { organization } = useAuth();
    const orgName = computed(() => {
      var _a;
      return ((_a = organization.value) == null ? void 0 : _a.name) || "Organization";
    });
    const dashboardData = ref(null);
    const ownUnits = computed(() => {
      if (!Array.isArray(units.value)) return [];
      return units.value.filter((unit) => !unit.partner_id || unit.partner_id === "org").map((unit) => ({
        ...unit,
        revenue: Math.floor(Math.random() * 5e4) + 2e4,
        // Mock revenue
        bookings: Math.floor(Math.random() * 15) + 5
        // Mock bookings
      }));
    });
    const ownUnitsCount = computed(() => ownUnits.value.length);
    const ownUnitsRevenue = computed(() => ownUnits.value.reduce((sum, unit) => sum + unit.revenue, 0));
    const ownUnitsBookings = computed(() => ownUnits.value.reduce((sum, unit) => sum + unit.bookings, 0));
    const avgRevenuePerUnit = computed(() => ownUnitsCount.value > 0 ? Math.floor(ownUnitsRevenue.value / ownUnitsCount.value) : 0);
    const ownUnitBookings = computed(() => {
      var _a;
      const bookings = ((_a = dashboardData.value) == null ? void 0 : _a.recent_bookings) || [];
      return bookings.filter((booking) => !booking.partner_name || booking.partner_name === orgName.value);
    });
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } catch {
        return "Invalid Date";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UCard = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Own Units Analytics</h1><p class="text-gray-600 dark:text-gray-400">Performance analytics for ${ssrInterpolate(unref(orgName))}&#39;s directly owned units</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/analytics",
        variant: "ghost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-left",
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Back to Analytics `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-arrow-left",
                class: "mr-2"
              }),
              createTextVNode(" Back to Analytics ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-4 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, { class: "p-6" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-home-modern",
              class: "h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Own Units</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(ownUnitsCount))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-home-modern",
                    class: "h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Own Units"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(ownUnitsCount)), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { class: "p-6" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-currency-dollar",
              class: "h-8 w-8 text-metrobnb-700 dark:text-metrobnb-300"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Total Revenue</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>\u20B1${ssrInterpolate(unref(ownUnitsRevenue).toLocaleString())}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-currency-dollar",
                    class: "h-8 w-8 text-metrobnb-700 dark:text-metrobnb-300"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Total Revenue"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "\u20B1" + toDisplayString(unref(ownUnitsRevenue).toLocaleString()), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { class: "p-6" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-calendar-days",
              class: "h-8 w-8 text-metrobnb-800 dark:text-metrobnb-200"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Total Bookings</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(ownUnitsBookings))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-calendar-days",
                    class: "h-8 w-8 text-metrobnb-800 dark:text-metrobnb-200"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Total Bookings"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(ownUnitsBookings)), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, { class: "p-6" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-metrobnb-400 dark:bg-metrobnb-600 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chart-bar",
              class: "h-8 w-8 text-metrobnb-900 dark:text-metrobnb-100"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Avg per Unit</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>\u20B1${ssrInterpolate(unref(avgRevenuePerUnit).toLocaleString())}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-metrobnb-400 dark:bg-metrobnb-600 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-chart-bar",
                    class: "h-8 w-8 text-metrobnb-900 dark:text-metrobnb-100"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Avg per Unit"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "\u20B1" + toDisplayString(unref(avgRevenuePerUnit).toLocaleString()), 1)
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
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Unit Performance</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Unit Performance")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(unref(ownUnits), (unit) => {
              _push2(`<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}><div class="w-12 h-12 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mr-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-home",
                class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><h4 class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unit.name)}</h4><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unit.location)}</p></div></div><div class="text-right"${_scopeId}><p class="text-lg font-semibold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(unit.revenue.toLocaleString())}</p><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unit.bookings)} bookings</p></div></div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(ownUnits).length) {
              _push2(`<div class="text-center py-8 text-gray-500 dark:text-gray-400"${_scopeId}> No own units found. All units are managed by partners. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(ownUnits), (unit) => {
                  return openBlock(), createBlock("div", {
                    key: unit.id,
                    class: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode("div", { class: "w-12 h-12 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mr-4" }, [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-home",
                          class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400"
                        })
                      ]),
                      createVNode("div", null, [
                        createVNode("h4", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unit.name), 1),
                        createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(unit.location), 1)
                      ])
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("p", { class: "text-lg font-semibold text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(unit.revenue.toLocaleString()), 1),
                      createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(unit.bookings) + " bookings", 1)
                    ])
                  ]);
                }), 128)),
                !unref(ownUnits).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 text-gray-500 dark:text-gray-400"
                }, " No own units found. All units are managed by partners. ")) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Recent Own Unit Bookings</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Recent Own Unit Bookings")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(ownUnitBookings), (booking) => {
              _push2(`<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-calendar-days",
                class: "h-5 w-5 text-metrobnb-500 mr-3"
              }, null, _parent2, _scopeId));
              _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(booking.guest_name)}</p><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(booking.unit_name)} \u2022 ${ssrInterpolate(formatDate(booking.booking_date))}</p></div></div><div class="text-right"${_scopeId}><p class="font-semibold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(parseFloat(booking.total_amount).toLocaleString())}</p><p class="text-xs text-gray-500"${_scopeId}>100% to ${ssrInterpolate(unref(orgName))}</p></div></div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(ownUnitBookings).length) {
              _push2(`<div class="text-center py-8 text-gray-500 dark:text-gray-400"${_scopeId}> No recent bookings for own units. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(ownUnitBookings), (booking) => {
                  return openBlock(), createBlock("div", {
                    key: booking.id,
                    class: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-calendar-days",
                        class: "h-5 w-5 text-metrobnb-500 mr-3"
                      }),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(booking.guest_name), 1),
                        createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(booking.unit_name) + " \u2022 " + toDisplayString(formatDate(booking.booking_date)), 1)
                      ])
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("p", { class: "font-semibold text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(parseFloat(booking.total_amount).toLocaleString()), 1),
                      createVNode("p", { class: "text-xs text-gray-500" }, "100% to " + toDisplayString(unref(orgName)), 1)
                    ])
                  ]);
                }), 128)),
                !unref(ownUnitBookings).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 text-gray-500 dark:text-gray-400"
                }, " No recent bookings for own units. ")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analytics/own-units.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=own-units-BjgNJZnJ.mjs.map
