import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2 } from './server.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "partners",
  __ssrInlineRender: true,
  setup(__props) {
    const { partners, units } = useDataManager();
    const { getDashboardMetrics } = useApi();
    const dashboardData = ref(null);
    const sortBy = ref("revenue_desc");
    const sortOptions = [
      { label: "Revenue High-Low", value: "revenue_desc" },
      { label: "Revenue Low-High", value: "revenue_asc" },
      { label: "Outstanding High-Low", value: "outstanding_desc" },
      { label: "Name A-Z", value: "name_asc" }
    ];
    const totalPartners = computed(() => Array.isArray(partners.value) ? partners.value.length : 0);
    const partnerUnitsCount = computed(() => {
      if (!Array.isArray(units.value)) return 0;
      return units.value.filter((unit) => unit.partner_id && unit.partner_id !== "metrobnb").length;
    });
    const revenueByPartner = computed(() => {
      var _a;
      return (((_a = dashboardData.value) == null ? void 0 : _a.revenue_by_partner) || []).map((partner) => ({
        id: partner.partner_id,
        name: partner.partner_name,
        revenue: parseFloat(partner.revenue),
        orgSharePercentage: partner.metrobnb_share_percentage,
        outstanding: parseFloat(partner.actual_invoice),
        unitCount: Math.floor(Math.random() * 5) + 1
        // Mock unit count
      }));
    });
    const totalCommission = computed(() => {
      var _a;
      return parseFloat(((_a = dashboardData.value) == null ? void 0 : _a.metrobnb_revenue) || "0");
    });
    const totalPartnerRevenue = computed(() => {
      var _a;
      return parseFloat(((_a = dashboardData.value) == null ? void 0 : _a.partner_revenue) || "0");
    });
    const totalOutstanding = computed(() => revenueByPartner.value.reduce((sum, partner) => sum + partner.outstanding, 0));
    const sortedPartners = computed(() => {
      const partners2 = [...revenueByPartner.value];
      const [field, order] = sortBy.value.split("_");
      partners2.sort((a, b) => {
        let aVal, bVal;
        switch (field) {
          case "revenue":
            aVal = a.revenue;
            bVal = b.revenue;
            break;
          case "outstanding":
            aVal = a.outstanding;
            bVal = b.outstanding;
            break;
          case "name":
            aVal = a.name;
            bVal = b.name;
            break;
          default:
            return 0;
        }
        if (field === "name") {
          return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return order === "asc" ? aVal - bVal : bVal - aVal;
      });
      return partners2;
    });
    const partnersWithOutstanding = computed(() => {
      return revenueByPartner.value.filter((partner) => partner.outstanding > 0);
    });
    const partnerBookings = computed(() => {
      var _a;
      const bookings = ((_a = dashboardData.value) == null ? void 0 : _a.recent_bookings) || [];
      return bookings.filter((booking) => booking.partner_name && booking.partner_name !== "MetroBNB");
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
      const _component_USelect = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Partner Analytics</h1><p class="text-gray-600 dark:text-gray-400">Performance analytics for partner-managed units and revenue sharing</p></div>`);
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
              name: "i-heroicons-users",
              class: "h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Active Partners</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(totalPartners))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-users",
                    class: "h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Active Partners"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(totalPartners)), 1)
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
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Commission Earned</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>\u20B1${ssrInterpolate(unref(totalCommission).toLocaleString())}</p></div></div>`);
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
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Commission Earned"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "\u20B1" + toDisplayString(unref(totalCommission).toLocaleString()), 1)
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
              name: "i-heroicons-home",
              class: "h-8 w-8 text-metrobnb-800 dark:text-metrobnb-200"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Partner Units</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(partnerUnitsCount))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-home",
                    class: "h-8 w-8 text-metrobnb-800 dark:text-metrobnb-200"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Partner Units"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(partnerUnitsCount)), 1)
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
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-exclamation-triangle",
              class: "h-8 w-8 text-red-600 dark:text-red-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><p class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Outstanding</p><p class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>\u20B1${ssrInterpolate(unref(totalOutstanding).toLocaleString())}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-red-100 dark:bg-red-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "h-8 w-8 text-red-600 dark:text-red-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Outstanding"),
                  createVNode("p", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "\u20B1" + toDisplayString(unref(totalOutstanding).toLocaleString()), 1)
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
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Partner Performance</h3>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(sortBy),
              "onUpdate:modelValue": ($event) => isRef(sortBy) ? sortBy.value = $event : null,
              options: sortOptions,
              class: "w-48"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h3", { class: "text-lg font-semibold" }, "Partner Performance"),
                createVNode(_component_USelect, {
                  modelValue: unref(sortBy),
                  "onUpdate:modelValue": ($event) => isRef(sortBy) ? sortBy.value = $event : null,
                  options: sortOptions,
                  class: "w-48"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(unref(sortedPartners), (partner) => {
              _push2(`<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}><div class="w-12 h-12 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mr-4"${_scopeId}><span class="text-metrobnb-600 dark:text-metrobnb-400 font-semibold"${_scopeId}>${ssrInterpolate(partner.name.charAt(0))}</span></div><div${_scopeId}><h4 class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(partner.name)}</h4><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(partner.org_share_percentage || partner.orgSharePercentage)}% share \u2022 ${ssrInterpolate(partner.unitCount)} units</p></div></div><div class="text-right"${_scopeId}><p class="text-lg font-semibold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(partner.revenue.toLocaleString())}</p><p class="${ssrRenderClass([partner.outstanding > 0 ? "text-red-500" : "text-gray-500", "text-sm"])}"${_scopeId}>${ssrInterpolate(partner.outstanding > 0 ? `\u20B1${partner.outstanding.toLocaleString()} due` : "Settled")}</p></div></div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(sortedPartners).length) {
              _push2(`<div class="text-center py-8 text-gray-500 dark:text-gray-400"${_scopeId}> No partner data available. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(sortedPartners), (partner) => {
                  return openBlock(), createBlock("div", {
                    key: partner.id,
                    class: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode("div", { class: "w-12 h-12 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mr-4" }, [
                        createVNode("span", { class: "text-metrobnb-600 dark:text-metrobnb-400 font-semibold" }, toDisplayString(partner.name.charAt(0)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("h4", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(partner.name), 1),
                        createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(partner.org_share_percentage || partner.orgSharePercentage) + "% share \u2022 " + toDisplayString(partner.unitCount) + " units", 1)
                      ])
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("p", { class: "text-lg font-semibold text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(partner.revenue.toLocaleString()), 1),
                      createVNode("p", {
                        class: ["text-sm", partner.outstanding > 0 ? "text-red-500" : "text-gray-500"]
                      }, toDisplayString(partner.outstanding > 0 ? `\u20B1${partner.outstanding.toLocaleString()} due` : "Settled"), 3)
                    ])
                  ]);
                }), 128)),
                !unref(sortedPartners).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 text-gray-500 dark:text-gray-400"
                }, " No partner data available. ")) : createCommentVNode("", true)
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
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Revenue Sharing</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Revenue Sharing")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="flex items-center justify-between p-4 bg-metrobnb-50 dark:bg-metrobnb-900/20 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-building-office-2",
              class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400 mr-3"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>MetroBNB Commission</p><p class="text-sm text-gray-500"${_scopeId}>From partner units</p></div></div><p class="text-xl font-bold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(unref(totalCommission).toLocaleString())}</p></div><div class="flex items-center justify-between p-4 bg-metrobnb-100 dark:bg-metrobnb-800/20 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-users",
              class: "h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300 mr-3"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>Partner Revenue</p><p class="text-sm text-gray-500"${_scopeId}>Total earned by partners</p></div></div><p class="text-xl font-bold text-metrobnb-700 dark:text-metrobnb-300"${_scopeId}>\u20B1${ssrInterpolate(unref(totalPartnerRevenue).toLocaleString())}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "flex items-center justify-between p-4 bg-metrobnb-50 dark:bg-metrobnb-900/20 rounded-lg" }, [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-building-office-2",
                      class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400 mr-3"
                    }),
                    createVNode("div", null, [
                      createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, "MetroBNB Commission"),
                      createVNode("p", { class: "text-sm text-gray-500" }, "From partner units")
                    ])
                  ]),
                  createVNode("p", { class: "text-xl font-bold text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(unref(totalCommission).toLocaleString()), 1)
                ]),
                createVNode("div", { class: "flex items-center justify-between p-4 bg-metrobnb-100 dark:bg-metrobnb-800/20 rounded-lg" }, [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-users",
                      class: "h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300 mr-3"
                    }),
                    createVNode("div", null, [
                      createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, "Partner Revenue"),
                      createVNode("p", { class: "text-sm text-gray-500" }, "Total earned by partners")
                    ])
                  ]),
                  createVNode("p", { class: "text-xl font-bold text-metrobnb-700 dark:text-metrobnb-300" }, "\u20B1" + toDisplayString(unref(totalPartnerRevenue).toLocaleString()), 1)
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
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Outstanding Invoices</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Outstanding Invoices")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(partnersWithOutstanding), (partner) => {
              _push2(`<div class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"${_scopeId}><div class="flex items-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-exclamation-triangle",
                class: "h-5 w-5 text-red-500 mr-3"
              }, null, _parent2, _scopeId));
              _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(partner.name)}</p><p class="text-sm text-gray-500"${_scopeId}>Overdue payment</p></div></div><div class="text-right"${_scopeId}><p class="font-semibold text-red-600 dark:text-red-400"${_scopeId}>\u20B1${ssrInterpolate(partner.outstanding.toLocaleString())}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/partners",
                size: "xs",
                color: "red",
                variant: "ghost"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Generate Invoice `);
                  } else {
                    return [
                      createTextVNode(" Generate Invoice ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(partnersWithOutstanding).length) {
              _push2(`<div class="text-center py-6"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-check-circle",
                class: "h-8 w-8 text-green-500 mx-auto mb-2"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-gray-600 dark:text-gray-400"${_scopeId}>All partners are up to date!</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(partnersWithOutstanding), (partner) => {
                  return openBlock(), createBlock("div", {
                    key: partner.id,
                    class: "flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                  }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-exclamation-triangle",
                        class: "h-5 w-5 text-red-500 mr-3"
                      }),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(partner.name), 1),
                        createVNode("p", { class: "text-sm text-gray-500" }, "Overdue payment")
                      ])
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("p", { class: "font-semibold text-red-600 dark:text-red-400" }, "\u20B1" + toDisplayString(partner.outstanding.toLocaleString()), 1),
                      createVNode(_component_UButton, {
                        to: "/partners",
                        size: "xs",
                        color: "red",
                        variant: "ghost"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Generate Invoice ")
                        ]),
                        _: 1
                      })
                    ])
                  ]);
                }), 128)),
                !unref(partnersWithOutstanding).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-6"
                }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-check-circle",
                    class: "h-8 w-8 text-green-500 mx-auto mb-2"
                  }),
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400" }, "All partners are up to date!")
                ])) : createCommentVNode("", true)
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
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Recent Partner Bookings</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Recent Partner Bookings")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(partnerBookings), (booking) => {
              _push2(`<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"${_scopeId}><div class="flex items-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-calendar-days",
                class: "h-5 w-5 text-metrobnb-500 mr-3"
              }, null, _parent2, _scopeId));
              _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(booking.guest_name)}</p><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(booking.unit_name)} \u2022 ${ssrInterpolate(booking.partner_name)}</p></div></div><div class="text-right"${_scopeId}><p class="font-semibold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}>\u20B1${ssrInterpolate(parseFloat(booking.total_amount).toLocaleString())}</p><p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(formatDate(booking.booking_date))}</p></div></div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(partnerBookings).length) {
              _push2(`<div class="text-center py-8 text-gray-500 dark:text-gray-400"${_scopeId}> No recent partner bookings. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(partnerBookings), (booking) => {
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
                        createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(booking.unit_name) + " \u2022 " + toDisplayString(booking.partner_name), 1)
                      ])
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("p", { class: "font-semibold text-metrobnb-600 dark:text-metrobnb-400" }, "\u20B1" + toDisplayString(parseFloat(booking.total_amount).toLocaleString()), 1),
                      createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(formatDate(booking.booking_date)), 1)
                    ])
                  ]);
                }), 128)),
                !unref(partnerBookings).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 text-gray-500 dark:text-gray-400"
                }, " No recent partner bookings. ")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analytics/partners.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=partners-Bcq6nx2r.mjs.map
