import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2 } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as _sfc_main$1 } from './InvoiceGeneratorModal-GOxm3hR7.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, isRef, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
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
import './Form-CoGrVFRC.mjs';
import './FormGroup-jqZJ_kV3.mjs';
import './Toggle-DLYZoy61.mjs';
import './form-DsUILy5F.mjs';
import './use-resolve-button-type-CgmJ7gVL.mjs';
import 'zod';
import './useDataManager-_ycBTlnZ.mjs';
import './api-BDnKztVE.mjs';
import './cookie-CGcYVFcE.mjs';
import './useNotify-7E9w0JIv.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const isPartner = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.role) === "partner";
    });
    const showInvoiceModal = ref(false);
    const searchQuery = ref("");
    const sortBy = ref("name_asc");
    const sortOptions = [
      { label: "Name A-Z", value: "name_asc" },
      { label: "Name Z-A", value: "name_desc" },
      { label: "Share % High-Low", value: "share_desc" },
      { label: "Share % Low-High", value: "share_asc" },
      { label: "Newest First", value: "created_desc" },
      { label: "Oldest First", value: "created_asc" }
    ];
    const getUnitCount = (partnerId) => {
      if (!partnerId) return 0;
      const units2 = getUnitsByPartnerSync(partnerId);
      return units2 ? units2.length : 0;
    };
    const formatPercentage = (value) => {
      if (value === null || value === void 0 || isNaN(Number(value))) {
        return "N/A";
      }
      return `${value}%`;
    };
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      } catch {
        return "Invalid Date";
      }
    };
    const filteredPartners = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      let filtered = partners.value.filter((partner) => {
        var _a, _b, _c;
        const searchLower = searchQuery.value.toLowerCase();
        const name = ((_a = partner.name) == null ? void 0 : _a.toLowerCase()) || "";
        const email = ((_b = partner.email) == null ? void 0 : _b.toLowerCase()) || "";
        const services = ((_c = partner.services) == null ? void 0 : _c.map((s) => {
          var _a2;
          return (_a2 = s.name) == null ? void 0 : _a2.toLowerCase();
        }).join(" ")) || "";
        return name.includes(searchLower) || email.includes(searchLower) || services.includes(searchLower);
      });
      const [field, order] = sortBy.value.split("_");
      filtered.sort((a, b) => {
        let aVal, bVal;
        switch (field) {
          case "name":
            aVal = a.name || "";
            bVal = b.name || "";
            break;
          case "share":
            aVal = a.org_share_percentage || a.orgSharePercentage || 0;
            bVal = b.org_share_percentage || b.orgSharePercentage || 0;
            break;
          case "created":
            aVal = new Date(a.created_at || a.createdAt || 0);
            bVal = new Date(b.created_at || b.createdAt || 0);
            break;
          default:
            return 0;
        }
        if (field === "share" || field === "created") {
          return order === "asc" ? aVal - bVal : bVal - aVal;
        }
        const comparison = aVal.localeCompare(bVal);
        return order === "asc" ? comparison : -comparison;
      });
      return filtered;
    });
    const getUnitsByPartnerSync = (partnerId) => {
      if (!Array.isArray(units.value)) return [];
      return units.value.filter((unit) => (unit.partnerId || unit.partner_id) === partnerId);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UInput = __nuxt_component_6;
      const _component_USelect = __nuxt_component_5;
      const _component_PartnersInvoiceGeneratorModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex justify-between items-center"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Partners</h1><p class="text-gray-600 dark:text-gray-400">Manage your business partners</p></div>`);
      if (!unref(isPartner)) {
        _push(`<div class="flex space-x-3">`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => showInvoiceModal.value = true,
          color: "gray",
          variant: "outline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-document-text",
                class: "mr-2"
              }, null, _parent2, _scopeId));
              _push2(` Generate Invoice `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-document-text",
                  class: "mr-2"
                }),
                createTextVNode(" Generate Invoice ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          to: "/partners/create",
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add Partner`);
            } else {
              return [
                createTextVNode("Add Partner")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(partners).length) {
        _push(ssrRenderComponent(_component_UCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex gap-4 mb-6"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(searchQuery),
                "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
                placeholder: "Search partners...",
                icon: "i-heroicons-magnifying-glass",
                class: "flex-1"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_USelect, {
                modelValue: unref(sortBy),
                "onUpdate:modelValue": ($event) => isRef(sortBy) ? sortBy.value = $event : null,
                options: sortOptions,
                class: "w-48"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex gap-4 mb-6" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(searchQuery),
                    "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
                    placeholder: "Search partners...",
                    icon: "i-heroicons-magnifying-glass",
                    class: "flex-1"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
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
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(filteredPartners).length) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(filteredPartners), (partner) => {
          _push(ssrRenderComponent(_component_UCard, {
            key: partner.id,
            class: "hover:shadow-lg transition-shadow cursor-pointer",
            onClick: ($event) => _ctx.$router.push(`/partners/${partner.id}`)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="space-y-3"${_scopeId}><div class="flex justify-between items-start"${_scopeId}><h3 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(partner.name)}</h3><span class="text-sm font-medium text-blue-600 dark:text-blue-400"${_scopeId}>${ssrInterpolate(formatPercentage(partner.org_share_percentage || partner.orgSharePercentage))}</span></div>`);
                if (partner.email) {
                  _push2(`<div class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(partner.email)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (partner.services && partner.services.length) {
                  _push2(`<div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
                  ssrRenderList(partner.services.slice(0, 2), (service) => {
                    _push2(`<span class="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"${_scopeId}>${ssrInterpolate(service.name)}</span>`);
                  });
                  _push2(`<!--]-->`);
                  if (partner.services.length > 2) {
                    _push2(`<span class="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"${_scopeId}> +${ssrInterpolate(partner.services.length - 2)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400"${_scopeId}><span${_scopeId}>${ssrInterpolate(getUnitCount(partner.id))} units</span><span${_scopeId}>${ssrInterpolate(formatDate(partner.created_at || partner.createdAt))}</span></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "space-y-3" }, [
                    createVNode("div", { class: "flex justify-between items-start" }, [
                      createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white" }, toDisplayString(partner.name), 1),
                      createVNode("span", { class: "text-sm font-medium text-blue-600 dark:text-blue-400" }, toDisplayString(formatPercentage(partner.org_share_percentage || partner.orgSharePercentage)), 1)
                    ]),
                    partner.email ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-sm text-gray-600 dark:text-gray-400"
                    }, toDisplayString(partner.email), 1)) : createCommentVNode("", true),
                    partner.services && partner.services.length ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex flex-wrap gap-1"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(partner.services.slice(0, 2), (service) => {
                        return openBlock(), createBlock("span", {
                          key: service.id,
                          class: "inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"
                        }, toDisplayString(service.name), 1);
                      }), 128)),
                      partner.services.length > 2 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"
                      }, " +" + toDisplayString(partner.services.length - 2), 1)) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "flex justify-between items-center text-sm text-gray-500 dark:text-gray-400" }, [
                      createVNode("span", null, toDisplayString(getUnitCount(partner.id)) + " units", 1),
                      createVNode("span", null, toDisplayString(formatDate(partner.created_at || partner.createdAt)), 1)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (!unref(partners).length) {
        _push(ssrRenderComponent(_component_UCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-center py-12"${_scopeId}><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId}>No partners yet</h3><p class="text-gray-600 dark:text-gray-400 mb-6"${_scopeId}>Get started by adding your first partner</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/partners/create",
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add Partner`);
                  } else {
                    return [
                      createTextVNode("Add Partner")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "text-center py-12" }, [
                  createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "No partners yet"),
                  createVNode("p", { class: "text-gray-600 dark:text-gray-400 mb-6" }, "Get started by adding your first partner"),
                  createVNode(_component_UButton, {
                    to: "/partners/create",
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add Partner")
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_PartnersInvoiceGeneratorModal, {
        modelValue: unref(showInvoiceModal),
        "onUpdate:modelValue": ($event) => isRef(showInvoiceModal) ? showInvoiceModal.value = $event : null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BnYrNnHl.mjs.map
