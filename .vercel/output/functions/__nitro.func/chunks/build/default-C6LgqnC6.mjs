import { d as useRoute, f as __nuxt_component_0$2, e as __nuxt_component_1$1, a as __nuxt_component_0$6, n as navigateTo } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppBreadcrumbs",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const breadcrumbs = computed(() => {
      const path = route.path;
      const crumbs = [];
      const pathMappings = {
        "/dashboard": [
          { name: "Dashboard", path: "/dashboard" }
        ],
        "/accounting/bookings": [
          { name: "Accounting", path: "/accounting" },
          { name: "Bookings", path: "/accounting/bookings" }
        ],
        "/accounting/partners": [
          { name: "Accounting", path: "/accounting" },
          { name: "Partners & Earnings", path: "/accounting/partners" }
        ],
        "/partners": [
          { name: "Partners", path: "/partners" }
        ],
        "/partners/create": [
          { name: "Partners", path: "/partners" },
          { name: "Create Partner", path: "/partners/create" }
        ],
        "/expenses": [
          { name: "Expenses", path: "/expenses" }
        ],
        "/expenses/create": [
          { name: "Expenses", path: "/expenses" },
          { name: "Add Expense", path: "/expenses/create" }
        ],
        "/admin/units": [
          { name: "Admin", path: "/admin" },
          { name: "Units", path: "/admin/units" }
        ],
        "/admin/services": [
          { name: "Admin", path: "/admin" },
          { name: "Services", path: "/admin/services" }
        ],
        "/admin/booking-sources": [
          { name: "Admin", path: "/admin" },
          { name: "Booking Sources", path: "/admin/booking-sources" }
        ]
      };
      if (pathMappings[path]) {
        return pathMappings[path];
      }
      if (path.startsWith("/partners/") && path !== "/partners/create") {
        return [
          { name: "Partners", path: "/partners" },
          { name: "Partner Details", path }
        ];
      }
      const segments = path.split("/").filter(Boolean);
      let currentPath = "";
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
        crumbs.push({ name, path: currentPath });
      });
      return crumbs.length > 0 ? crumbs : [{ name: "Home", path: "/" }];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$6;
      const _component_UIcon = __nuxt_component_1$1;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4",
        "aria-label": "Breadcrumb"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-home",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-home",
                class: "h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(breadcrumbs), (crumb, index) => {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-chevron-right",
          class: "h-4 w-4 text-gray-400"
        }, null, _parent));
        if (index < unref(breadcrumbs).length - 1) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: crumb.path,
            class: "hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(crumb.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(crumb.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<span class="font-medium text-gray-900 dark:text-white">${ssrInterpolate(crumb.name)}</span>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppBreadcrumbs.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const sidebarOpen = ref(false);
    const { user, logout } = useAuth();
    const { notifySuccess } = useNotify();
    const handleLogout = async () => {
      await logout();
      notifySuccess("Logged out successfully");
      await navigateTo("/login");
    };
    const allNavigationGroups = [
      {
        name: "Overview",
        roles: ["admin", "manager", "staff", "partner", "owner"],
        // Added 'owner'
        items: [
          { name: "Dashboard", href: "/dashboard", icon: "i-heroicons-home", roles: ["admin", "manager", "staff", "partner", "owner"] }
        ]
      },
      {
        name: "Analytics",
        roles: ["admin", "manager", "staff", "owner"],
        // Added 'owner'
        items: [
          { name: "Business Overview", href: "/analytics/overview", icon: "i-heroicons-chart-bar", roles: ["admin", "manager", "owner"] },
          { name: "Own Units", href: "/analytics/own-units", icon: "i-heroicons-home-modern", roles: ["admin", "manager", "staff", "owner"] },
          { name: "Partners", href: "/analytics/partners", icon: "i-heroicons-users", roles: ["admin", "manager", "owner"] }
        ]
      },
      {
        name: "Operations",
        roles: ["admin", "manager", "staff", "partner", "owner"],
        // Added 'owner'
        items: [
          { name: "Bookings", href: "/accounting/bookings", icon: "i-heroicons-calendar-days", roles: ["admin", "manager", "staff", "partner", "owner"] },
          { name: "Expenses", href: "/accounting/expenses", icon: "i-heroicons-receipt-percent", roles: ["admin", "manager", "staff", "partner", "owner"] },
          { name: "Journal Entries", href: "/accounting/journal-entries", icon: "i-heroicons-document-plus", roles: ["admin", "manager", "owner"] },
          { name: "Invoices", href: "/accounting/invoices", icon: "i-heroicons-document-text", roles: ["admin", "manager", "staff", "partner", "owner"] },
          { name: "Partners & Earnings", href: "/accounting/partners", icon: "i-heroicons-chart-bar-square", roles: ["admin", "manager", "owner"] }
        ]
      },
      {
        name: "Management",
        roles: ["admin", "manager", "owner"],
        // Added 'owner'
        items: [
          { name: "Partners", href: "/partners", icon: "i-heroicons-users", roles: ["admin", "manager", "owner"] },
          { name: "Units", href: "/admin/units", icon: "i-heroicons-building-office-2", roles: ["admin", "manager", "owner"] },
          { name: "Services", href: "/admin/services", icon: "i-heroicons-wrench-screwdriver", roles: ["admin", "owner"] },
          { name: "Booking Sources", href: "/admin/booking-sources", icon: "i-heroicons-globe-alt", roles: ["admin", "owner"] }
        ]
      },
      {
        name: "Account",
        roles: ["admin", "manager", "staff", "partner", "owner"],
        items: [
          { name: "Profile", href: "/profile", icon: "i-heroicons-user-circle", roles: ["admin", "manager", "staff", "partner", "owner"] },
          { name: "User Management", href: "/users", icon: "i-heroicons-users", roles: ["admin", "manager"] }
        ]
      },
      {
        name: "Development",
        roles: ["admin", "owner"],
        // Added 'owner'
        items: []
      }
    ];
    const navigationGroups = computed(() => {
      if (!user.value) {
        return [];
      }
      const filtered = allNavigationGroups.filter((group) => {
        const hasRole = group.roles.includes(user.value.role);
        return hasRole;
      }).map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const hasItemRole = item.roles.includes(user.value.role);
          return hasItemRole;
        })
      })).filter((group) => group.items.length > 0);
      return filtered;
    });
    const pageTitle = computed(() => {
      const path = route.path;
      for (const group of navigationGroups.value) {
        for (const item of group.items) {
          if (path === item.href || item.href !== "/" && path.startsWith(item.href)) {
            return item.name;
          }
        }
      }
      if (path.includes("/create")) return "Create New";
      if (path.includes("/edit")) return "Edit";
      if (path === "/") return "Welcome";
      return "MetroBNB";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_NuxtLink = __nuxt_component_0$6;
      const _component_AppBreadcrumbs = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 dark:bg-gray-900" }, _attrs))}>`);
      if (unref(sidebarOpen)) {
        _push(`<div class="fixed inset-0 z-40 lg:hidden"><div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col",
        unref(sidebarOpen) ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      ])}"><div class="flex h-16 items-center justify-between px-4"><h1 class="text-lg font-bold text-gray-900 dark:text-white">MetroBNB</h1><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: _ctx.$colorMode.value === "dark" ? "i-heroicons-sun" : "i-heroicons-moon",
        color: "gray",
        variant: "ghost",
        size: "sm",
        onClick: ($event) => _ctx.$colorMode.preference = _ctx.$colorMode.value === "dark" ? "light" : "dark"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-x-mark",
        color: "gray",
        variant: "ghost",
        size: "sm",
        class: "lg:hidden",
        onClick: ($event) => sidebarOpen.value = false
      }, null, _parent));
      _push(`</div></div><nav class="mt-6 px-3 space-y-6 flex-1 overflow-y-auto">`);
      if (unref(user)) {
        _push(`<div class="mx-3 mb-6"><div class="bg-gradient-to-r from-metrobnb-600 to-metrobnb-700 rounded-xl p-4 text-white"><div class="flex items-center space-x-3"><div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-user",
          class: "h-6 w-6"
        }, null, _parent));
        _push(`</div><div class="flex-1 min-w-0"><p class="font-semibold truncate">${ssrInterpolate(unref(user).name)}</p><p class="text-white/80 text-sm truncate">${ssrInterpolate(unref(user).email)}</p></div></div><div class="mt-3 flex items-center justify-between"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm capitalize">${ssrInterpolate(unref(user).role)}</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profile",
          class: "text-white/80 hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-cog-6-tooth",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-cog-6-tooth",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(navigationGroups), (group) => {
        _push(`<div><h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">${ssrInterpolate(group.name)}</h3><div class="space-y-1"><!--[-->`);
        ssrRenderList(group.items, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.name,
            to: item.href,
            class: "flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors duration-200",
            "active-class": "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-r-2 border-blue-500",
            onClick: ($event) => sidebarOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "mr-3 h-5 w-5 flex-shrink-0"
                }, null, _parent2, _scopeId));
                _push2(`<span class="truncate"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: item.icon,
                    class: "mr-3 h-5 w-5 flex-shrink-0"
                  }, null, 8, ["name"]),
                  createVNode("span", { class: "truncate" }, toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]-->`);
      if (unref(navigationGroups).length === 0 && unref(user)) {
        _push(`<div class="px-3 py-2 bg-red-100 rounded text-xs"><p>No navigation groups match role: ${ssrInterpolate(unref(user).role)}</p><p>Available roles in navigation: admin, manager, staff, partner, owner</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav><div class="p-4 border-t border-gray-200 dark:border-gray-700">`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: handleLogout,
        variant: "ghost",
        size: "sm",
        block: "",
        class: "mb-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-right-on-rectangle",
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Logout `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-arrow-right-on-rectangle",
                class: "mr-2"
              }),
              createTextVNode(" Logout ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="text-xs text-gray-500 dark:text-gray-400 text-center"> MetroBNB v1.0.0 </div></div></div><div class="lg:pl-64"><header class="bg-white dark:bg-gray-800 shadow-sm border-b h-16 flex items-center justify-between px-4"><div class="flex items-center">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-bars-3",
        color: "gray",
        variant: "ghost",
        size: "sm",
        class: "lg:hidden mr-3",
        onClick: ($event) => sidebarOpen.value = true
      }, null, _parent));
      _push(`<h2 class="text-lg font-semibold text-gray-900 dark:text-white">${ssrInterpolate(unref(pageTitle))}</h2></div></header><main class="p-4 lg:p-6">`);
      _push(ssrRenderComponent(_component_AppBreadcrumbs, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-C6LgqnC6.mjs.map
