import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2 } from './server.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, createBlock, createCommentVNode, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { u as useDataManager } from './useDataManager-_ycBTlnZ.mjs';
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
  __name: "overview",
  __ssrInlineRender: true,
  setup(__props) {
    const { partners } = useDataManager();
    const { getDashboardMetrics } = useApi();
    const dashboardData = ref(null);
    const showFilters = ref(false);
    const now = /* @__PURE__ */ new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString();
    const filters = reactive({
      year: currentYear,
      month: currentMonth,
      partner_id: ""
    });
    const metroBNBRevenue = computed(() => {
      var _a;
      return parseFloat(((_a = dashboardData.value) == null ? void 0 : _a.metrobnb_revenue) || "0");
    });
    const partnerRevenue = computed(() => {
      var _a;
      return parseFloat(((_a = dashboardData.value) == null ? void 0 : _a.partner_revenue) || "0");
    });
    const metroBNBExpenses = computed(() => {
      var _a;
      return parseFloat(((_a = dashboardData.value) == null ? void 0 : _a.metrobnb_expenses) || "0");
    });
    const totalRevenue = computed(() => metroBNBRevenue.value + partnerRevenue.value);
    const netProfit = computed(() => metroBNBRevenue.value - metroBNBExpenses.value);
    const ownUnitsRevenue = computed(() => metroBNBRevenue.value * 0.6);
    const partnerCommission = computed(() => metroBNBRevenue.value * 0.4);
    const recentBookings = computed(() => {
      var _a;
      return ((_a = dashboardData.value) == null ? void 0 : _a.recent_bookings) || [];
    });
    const topUnits = ref([
      { id: 1, name: "Azure Tower Unit 1623", type: "Own Unit", revenue: 45e3, bookings: 12 },
      { id: 2, name: "Makati Condo 2A", type: "Partner Unit", revenue: 38e3, bookings: 10 },
      { id: 3, name: "BGC Loft Studio", type: "Own Unit", revenue: 32e3, bookings: 8 }
    ]);
    const getCurrentMonth = () => (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } catch {
        return "Invalid Date";
      }
    };
    const yearOptions = computed(() => {
      const years = [];
      const currentYear2 = (/* @__PURE__ */ new Date()).getFullYear();
      for (let i = currentYear2 - 2; i <= currentYear2 + 1; i++) {
        years.push({ label: i.toString(), value: i.toString() });
      }
      return [{ label: "All Years", value: "" }, ...years.reverse()];
    });
    const monthOptions = computed(() => [
      { label: "All Months", value: "" },
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
    ]);
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [{ label: "All Partners", value: "" }];
      return [
        { label: "All Partners", value: "" },
        ...partners.value.map((p) => ({ label: p.name, value: p.id }))
      ];
    });
    const loadData = async () => {
      try {
        let startDate = "";
        let endDate = "";
        if (filters.year && filters.month) {
          const year = parseInt(filters.year);
          const month = parseInt(filters.month);
          startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
          const lastDay = new Date(year, month, 0).getDate();
          endDate = `${year}-${month.toString().padStart(2, "0")}-${lastDay}`;
        }
        const filterParams = {
          ...filters.partner_id && { partner_id: filters.partner_id },
          ...startDate && { start_date: startDate },
          ...endDate && { end_date: endDate }
        };
        const response = await getDashboardMetrics(filterParams);
        dashboardData.value = response;
      } catch (error) {
        dashboardData.value = null;
      }
    };
    const applyFilters = () => {
      loadData();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Business Overview</h1><p class="text-gray-600 dark:text-gray-400">Complete financial overview of your entire MetroBNB business</p></div>`);
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
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Financial Overview - ${ssrInterpolate(getCurrentMonth())}</h3>`);
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => showFilters.value = !unref(showFilters),
              variant: "ghost",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-funnel",
                    class: "mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Filters `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-funnel",
                      class: "mr-2"
                    }),
                    createTextVNode(" Filters ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h3", { class: "text-lg font-semibold" }, "Financial Overview - " + toDisplayString(getCurrentMonth()), 1),
                createVNode(_component_UButton, {
                  onClick: ($event) => showFilters.value = !unref(showFilters),
                  variant: "ghost",
                  size: "sm"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-funnel",
                      class: "mr-2"
                    }),
                    createTextVNode(" Filters ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(showFilters)) {
              _push2(`<div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-3 gap-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Month" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filters).month,
                      "onUpdate:modelValue": ($event) => unref(filters).month = $event,
                      options: unref(monthOptions),
                      onChange: applyFilters
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).month,
                        "onUpdate:modelValue": ($event) => unref(filters).month = $event,
                        options: unref(monthOptions),
                        onChange: applyFilters
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "Year" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelect, {
                      modelValue: unref(filters).year,
                      "onUpdate:modelValue": ($event) => unref(filters).year = $event,
                      options: unref(yearOptions),
                      onChange: applyFilters
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).year,
                        "onUpdate:modelValue": ($event) => unref(filters).year = $event,
                        options: unref(yearOptions),
                        onChange: applyFilters
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
                      modelValue: unref(filters).partner_id,
                      "onUpdate:modelValue": ($event) => unref(filters).partner_id = $event,
                      options: unref(partnerOptions),
                      onChange: applyFilters
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).partner_id,
                        "onUpdate:modelValue": ($event) => unref(filters).partner_id = $event,
                        options: unref(partnerOptions),
                        onChange: applyFilters
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid grid-cols-1 md:grid-cols-4 gap-6"${_scopeId}><div class="text-center p-6 bg-metrobnb-50 dark:bg-metrobnb-900/20 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-trending-up",
              class: "h-10 w-10 text-metrobnb-600 dark:text-metrobnb-400 mx-auto mb-3"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId}>Total Revenue</p><p class="text-3xl font-bold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(unref(totalRevenue).toLocaleString())}</p><p class="text-xs text-gray-500 mt-1"${_scopeId}>Own + Partner Units</p></div><div class="text-center p-6 bg-metrobnb-100 dark:bg-metrobnb-800/20 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-building-office-2",
              class: "h-10 w-10 text-metrobnb-700 dark:text-metrobnb-300 mx-auto mb-3"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId}>MetroBNB Revenue</p><p class="text-3xl font-bold text-metrobnb-700 dark:text-metrobnb-300"${_scopeId}>\u20B1${ssrInterpolate(unref(metroBNBRevenue).toLocaleString())}</p><p class="text-xs text-gray-500 mt-1"${_scopeId}>Direct + Commission</p></div><div class="text-center p-6 bg-gray-50 dark:bg-gray-800/20 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-receipt-percent",
              class: "h-10 w-10 text-gray-600 dark:text-gray-400 mx-auto mb-3"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId}>Total Expenses</p><p class="text-3xl font-bold text-gray-700 dark:text-gray-300"${_scopeId}>\u20B1${ssrInterpolate(unref(metroBNBExpenses).toLocaleString())}</p><p class="text-xs text-gray-500 mt-1"${_scopeId}>Operating costs</p></div><div class="text-center p-6 bg-metrobnb-200 dark:bg-metrobnb-700/20 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-banknotes",
              class: "h-10 w-10 text-metrobnb-800 dark:text-metrobnb-200 mx-auto mb-3"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm text-gray-600 dark:text-gray-400 mb-1"${_scopeId}>Net Profit</p><p class="${ssrRenderClass([unref(netProfit) >= 0 ? "text-metrobnb-800 dark:text-metrobnb-200" : "text-red-600 dark:text-red-400", "text-3xl font-bold"])}"${_scopeId}> \u20B1${ssrInterpolate(unref(netProfit).toLocaleString())}</p><p class="text-xs text-gray-500 mt-1"${_scopeId}>After all expenses</p></div></div>`);
          } else {
            return [
              unref(showFilters) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              }, [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                  createVNode(_component_UFormGroup, { label: "Month" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).month,
                        "onUpdate:modelValue": ($event) => unref(filters).month = $event,
                        options: unref(monthOptions),
                        onChange: applyFilters
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "Year" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).year,
                        "onUpdate:modelValue": ($event) => unref(filters).year = $event,
                        options: unref(yearOptions),
                        onChange: applyFilters
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "Partner" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(filters).partner_id,
                        "onUpdate:modelValue": ($event) => unref(filters).partner_id = $event,
                        options: unref(partnerOptions),
                        onChange: applyFilters
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  })
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-6" }, [
                createVNode("div", { class: "text-center p-6 bg-metrobnb-50 dark:bg-metrobnb-900/20 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-arrow-trending-up",
                    class: "h-10 w-10 text-metrobnb-600 dark:text-metrobnb-400 mx-auto mb-3"
                  }),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Total Revenue"),
                  createVNode("p", { class: "text-3xl font-bold text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(unref(totalRevenue).toLocaleString()), 1),
                  createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "Own + Partner Units")
                ]),
                createVNode("div", { class: "text-center p-6 bg-metrobnb-100 dark:bg-metrobnb-800/20 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-building-office-2",
                    class: "h-10 w-10 text-metrobnb-700 dark:text-metrobnb-300 mx-auto mb-3"
                  }),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "MetroBNB Revenue"),
                  createVNode("p", { class: "text-3xl font-bold text-metrobnb-700 dark:text-metrobnb-300" }, "\u20B1" + toDisplayString(unref(metroBNBRevenue).toLocaleString()), 1),
                  createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "Direct + Commission")
                ]),
                createVNode("div", { class: "text-center p-6 bg-gray-50 dark:bg-gray-800/20 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-receipt-percent",
                    class: "h-10 w-10 text-gray-600 dark:text-gray-400 mx-auto mb-3"
                  }),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Total Expenses"),
                  createVNode("p", { class: "text-3xl font-bold text-gray-700 dark:text-gray-300" }, "\u20B1" + toDisplayString(unref(metroBNBExpenses).toLocaleString()), 1),
                  createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "Operating costs")
                ]),
                createVNode("div", { class: "text-center p-6 bg-metrobnb-200 dark:bg-metrobnb-700/20 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-banknotes",
                    class: "h-10 w-10 text-metrobnb-800 dark:text-metrobnb-200 mx-auto mb-3"
                  }),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-1" }, "Net Profit"),
                  createVNode("p", {
                    class: ["text-3xl font-bold", unref(netProfit) >= 0 ? "text-metrobnb-800 dark:text-metrobnb-200" : "text-red-600 dark:text-red-400"]
                  }, " \u20B1" + toDisplayString(unref(netProfit).toLocaleString()), 3),
                  createVNode("p", { class: "text-xs text-gray-500 mt-1" }, "After all expenses")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Revenue Breakdown</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Revenue Breakdown")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="flex items-center justify-between p-4 bg-metrobnb-50 dark:bg-metrobnb-900/20 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-home-modern",
              class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400 mr-3"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>Own Units Revenue</p><p class="text-sm text-gray-500"${_scopeId}>Direct bookings</p></div></div><p class="text-xl font-bold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(unref(ownUnitsRevenue).toLocaleString())}</p></div><div class="flex items-center justify-between p-4 bg-metrobnb-100 dark:bg-metrobnb-800/20 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-users",
              class: "h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300 mr-3"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>Partner Commission</p><p class="text-sm text-gray-500"${_scopeId}>Revenue sharing</p></div></div><p class="text-xl font-bold text-metrobnb-700 dark:text-metrobnb-300"${_scopeId}>\u20B1${ssrInterpolate(unref(partnerCommission).toLocaleString())}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "flex items-center justify-between p-4 bg-metrobnb-50 dark:bg-metrobnb-900/20 rounded-lg" }, [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-home-modern",
                      class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400 mr-3"
                    }),
                    createVNode("div", null, [
                      createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, "Own Units Revenue"),
                      createVNode("p", { class: "text-sm text-gray-500" }, "Direct bookings")
                    ])
                  ]),
                  createVNode("p", { class: "text-xl font-bold text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(unref(ownUnitsRevenue).toLocaleString()), 1)
                ]),
                createVNode("div", { class: "flex items-center justify-between p-4 bg-metrobnb-100 dark:bg-metrobnb-800/20 rounded-lg" }, [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-users",
                      class: "h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300 mr-3"
                    }),
                    createVNode("div", null, [
                      createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, "Partner Commission"),
                      createVNode("p", { class: "text-sm text-gray-500" }, "Revenue sharing")
                    ])
                  ]),
                  createVNode("p", { class: "text-xl font-bold text-metrobnb-700 dark:text-metrobnb-300" }, "\u20B1" + toDisplayString(unref(partnerCommission).toLocaleString()), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Top Performing Units</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Top Performing Units")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(topUnits), (unit) => {
              _push2(`<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}><div class="w-10 h-10 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mr-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-home",
                class: "h-5 w-5 text-metrobnb-600 dark:text-metrobnb-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unit.name)}</p><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unit.type)}</p></div></div><div class="text-right"${_scopeId}><p class="font-semibold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(unit.revenue.toLocaleString())}</p><p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(unit.bookings)} bookings</p></div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(topUnits), (unit) => {
                  return openBlock(), createBlock("div", {
                    key: unit.id,
                    class: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode("div", { class: "w-10 h-10 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mr-3" }, [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-home",
                          class: "h-5 w-5 text-metrobnb-600 dark:text-metrobnb-400"
                        })
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unit.name), 1),
                        createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(unit.type), 1)
                      ])
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("p", { class: "font-semibold text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(unit.revenue.toLocaleString()), 1),
                      createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(unit.bookings) + " bookings", 1)
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
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Recent Financial Activity</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Recent Financial Activity")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(recentBookings).slice(0, 8), (booking) => {
              _push2(`<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-calendar-days",
                class: "h-5 w-5 text-metrobnb-500 mr-3"
              }, null, _parent2, _scopeId));
              _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(booking.guest_name)}</p><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(booking.unit_name)} \u2022 ${ssrInterpolate(formatDate(booking.booking_date))}</p></div></div><div class="text-right"${_scopeId}><p class="font-semibold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(parseFloat(booking.total_amount).toLocaleString())}</p><p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(booking.partner_name || "Own Unit")}</p></div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(recentBookings).slice(0, 8), (booking) => {
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
                      createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(booking.partner_name || "Own Unit"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analytics/overview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=overview-BK5-Zy7z.mjs.map
