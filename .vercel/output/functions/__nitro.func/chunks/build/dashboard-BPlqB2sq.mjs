import { L as __nuxt_component_2, e as __nuxt_component_1$1, f as __nuxt_component_0$2 } from './server.mjs';
import { _ as __nuxt_component_5 } from './Badge-hg3kqqXA.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const { getBookings, getExpenses, getInvoices } = useApi();
    const isPartner = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.role) === "partner";
    });
    ref(0);
    ref(0);
    ref(0);
    ref([]);
    const latestInvoice = ref(null);
    const getInvoiceStatusColor = (status) => {
      const colors = {
        draft: "gray",
        finalized: "yellow",
        sent: "blue",
        paid: "primary"
      };
      return colors[status] || "gray";
    };
    const getInvoiceStatusText = (status) => {
      const texts = {
        draft: "Draft",
        finalized: "Finalized",
        sent: "Sent",
        paid: "Paid"
      };
      return texts[status] || status;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UBadge = __nuxt_component_5;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1><p class="text-gray-600 dark:text-gray-400">Welcome back, ${ssrInterpolate(((_a = unref(user)) == null ? void 0 : _a.name) || "Partner")}</p></div>`);
      if (unref(isPartner)) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_UCard, { class: "mb-6" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b;
            if (_push2) {
              _push2(`<div class="text-center py-8"${_scopeId}><div class="w-16 h-16 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mx-auto mb-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-heart",
                class: "h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2"${_scopeId}>Welcome, ${ssrInterpolate((_a2 = unref(user)) == null ? void 0 : _a2.name)}!</h2><p class="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto"${_scopeId}> Thank you for being a pioneering partner who believes in us. This web app is made for you and will have more features soon! </p><div class="inline-flex items-center px-3 py-1 bg-metrobnb-50 dark:bg-metrobnb-900/20 text-metrobnb-700 dark:text-metrobnb-300 rounded-full text-sm font-medium"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-star",
                class: "h-4 w-4 mr-1"
              }, null, _parent2, _scopeId));
              _push2(` Pioneering Partner </div></div>`);
            } else {
              return [
                createVNode("div", { class: "text-center py-8" }, [
                  createVNode("div", { class: "w-16 h-16 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mx-auto mb-4" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-heart",
                      class: "h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400"
                    })
                  ]),
                  createVNode("h2", { class: "text-2xl font-bold text-gray-900 dark:text-white mb-2" }, "Welcome, " + toDisplayString((_b = unref(user)) == null ? void 0 : _b.name) + "!", 1),
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto" }, " Thank you for being a pioneering partner who believes in us. This web app is made for you and will have more features soon! "),
                  createVNode("div", { class: "inline-flex items-center px-3 py-1 bg-metrobnb-50 dark:bg-metrobnb-900/20 text-metrobnb-700 dark:text-metrobnb-300 rounded-full text-sm font-medium" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-star",
                      class: "h-4 w-4 mr-1"
                    }),
                    createTextVNode(" Pioneering Partner ")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(latestInvoice)) {
          _push(ssrRenderComponent(_component_UCard, { class: "mb-6" }, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-document-text",
                  class: "h-5 w-5 text-metrobnb-600 dark:text-metrobnb-400 mr-2"
                }, null, _parent2, _scopeId));
                _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Your Latest Invoice</h3></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-document-text",
                      class: "h-5 w-5 text-metrobnb-600 dark:text-metrobnb-400 mr-2"
                    }),
                    createVNode("h3", { class: "text-lg font-semibold" }, "Your Latest Invoice")
                  ])
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="bg-gradient-to-r from-metrobnb-50 to-metrobnb-100 dark:from-metrobnb-900/20 dark:to-metrobnb-800/20 rounded-lg p-4"${_scopeId}><div class="flex justify-between items-start mb-4"${_scopeId}><div${_scopeId}><h4 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(latestInvoice).invoice_number)}</h4><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(unref(latestInvoice).period)}</p></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: getInvoiceStatusColor(unref(latestInvoice).status),
                  size: "sm"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(getInvoiceStatusText(unref(latestInvoice).status))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(getInvoiceStatusText(unref(latestInvoice).status)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div><div class="flex justify-between items-center"${_scopeId}>`);
                if (parseFloat(unref(latestInvoice).total_amount || 0) > 0) {
                  _push2(`<div${_scopeId}><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Amount</p><p class="text-xl font-bold text-metrobnb-600 dark:text-metrobnb-400"${_scopeId}> \u20B1${ssrInterpolate(parseFloat(unref(latestInvoice).total_amount).toLocaleString())}</p></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(_component_UButton, {
                  to: `/accounting/invoices/${unref(latestInvoice).id}`,
                  color: "primary",
                  class: parseFloat(unref(latestInvoice).total_amount || 0) === 0 ? "ml-auto" : ""
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-heroicons-eye",
                        class: "mr-2"
                      }, null, _parent3, _scopeId2));
                      _push3(` Check it out `);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-eye",
                          class: "mr-2"
                        }),
                        createTextVNode(" Check it out ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "bg-gradient-to-r from-metrobnb-50 to-metrobnb-100 dark:from-metrobnb-900/20 dark:to-metrobnb-800/20 rounded-lg p-4" }, [
                    createVNode("div", { class: "flex justify-between items-start mb-4" }, [
                      createVNode("div", null, [
                        createVNode("h4", { class: "font-semibold text-gray-900 dark:text-white" }, toDisplayString(unref(latestInvoice).invoice_number), 1),
                        createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(unref(latestInvoice).period), 1)
                      ]),
                      createVNode(_component_UBadge, {
                        color: getInvoiceStatusColor(unref(latestInvoice).status),
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(getInvoiceStatusText(unref(latestInvoice).status)), 1)
                        ]),
                        _: 1
                      }, 8, ["color"])
                    ]),
                    createVNode("div", { class: "flex justify-between items-center" }, [
                      parseFloat(unref(latestInvoice).total_amount || 0) > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Amount"),
                        createVNode("p", { class: "text-xl font-bold text-metrobnb-600 dark:text-metrobnb-400" }, " \u20B1" + toDisplayString(parseFloat(unref(latestInvoice).total_amount).toLocaleString()), 1)
                      ])) : createCommentVNode("", true),
                      createVNode(_component_UButton, {
                        to: `/accounting/invoices/${unref(latestInvoice).id}`,
                        color: "primary",
                        class: parseFloat(unref(latestInvoice).total_amount || 0) === 0 ? "ml-auto" : ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-eye",
                            class: "mr-2"
                          }),
                          createTextVNode(" Check it out ")
                        ]),
                        _: 1
                      }, 8, ["to", "class"])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(_component_UCard, { class: "mb-6" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-center py-8"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-document-plus",
                  class: "h-12 w-12 text-gray-400 mx-auto mb-4"
                }, null, _parent2, _scopeId));
                _push2(`<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId}>No invoices yet</h3><p class="text-gray-600 dark:text-gray-400 mb-4"${_scopeId}>Your invoices will appear here once they&#39;re generated</p>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  to: "/accounting/invoices",
                  color: "primary",
                  variant: "outline"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` View Invoices `);
                    } else {
                      return [
                        createTextVNode(" View Invoices ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "text-center py-8" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-document-plus",
                      class: "h-12 w-12 text-gray-400 mx-auto mb-4"
                    }),
                    createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "No invoices yet"),
                    createVNode("p", { class: "text-gray-600 dark:text-gray-400 mb-4" }, "Your invoices will appear here once they're generated"),
                    createVNode(_component_UButton, {
                      to: "/accounting/invoices",
                      color: "primary",
                      variant: "outline"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" View Invoices ")
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
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UCard, {
          class: "p-4 hover:shadow-md transition-shadow cursor-pointer",
          onClick: ($event) => _ctx.$router.push("/accounting/invoices")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-document-text",
                class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-4"${_scopeId}><h4 class="font-medium text-gray-900 dark:text-white"${_scopeId}>All Invoices</h4><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>View your invoice history</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-document-text",
                      class: "h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400"
                    })
                  ]),
                  createVNode("div", { class: "ml-4" }, [
                    createVNode("h4", { class: "font-medium text-gray-900 dark:text-white" }, "All Invoices"),
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "View your invoice history")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, {
          class: "p-4 hover:shadow-md transition-shadow cursor-pointer",
          onClick: ($event) => _ctx.$router.push("/expenses")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-receipt-percent",
                class: "h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="ml-4"${_scopeId}><h4 class="font-medium text-gray-900 dark:text-white"${_scopeId}>View Expenses</h4><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>See your expense history</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("div", { class: "p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-receipt-percent",
                      class: "h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300"
                    })
                  ]),
                  createVNode("div", { class: "ml-4" }, [
                    createVNode("h4", { class: "font-medium text-gray-900 dark:text-white" }, "View Expenses"),
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "See your expense history")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Admin Dashboard</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-lg font-semibold" }, "Admin Dashboard")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p${_scopeId}>Admin dashboard content coming soon...</p>`);
            } else {
              return [
                createVNode("p", null, "Admin dashboard content coming soon...")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-BPlqB2sq.mjs.map
