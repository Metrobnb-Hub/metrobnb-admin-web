import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, g as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as _sfc_main$1 } from './UnitForm-DwMzTrSq.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { debounce } from 'lodash-es';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
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
import './Textarea-Bv7REKKo.mjs';
import './Checkbox-CvybKiXl.mjs';
import './useNotify-7E9w0JIv.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "units",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const { getUnits, getPartners } = useApi();
    const { extractData } = useApiResponse();
    const loading = ref(false);
    const showCreateModal = ref(false);
    const editingUnit = ref(null);
    const isViewMode = ref(false);
    const units = ref([]);
    const partners = ref([]);
    const summary = ref({
      total_units: 0,
      active_units: 0,
      occupancy_rate: 0,
      avg_revenue_per_unit: 0
    });
    const filters = ref({
      search: "",
      partner_id: "",
      status: ""
    });
    const canCreateUnits = computed(() => {
      var _a, _b;
      return ((_a = user.value) == null ? void 0 : _a.role) === "admin" || ((_b = user.value) == null ? void 0 : _b.role) === "manager";
    });
    const partnerOptions = computed(() => {
      return partners.value.map((partner) => ({
        label: partner.name,
        value: partner.id
      }));
    });
    const statusOptions = [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Maintenance", value: "maintenance" }
    ];
    const canEditUnit = (unit) => {
      var _a;
      if (!user.value) return false;
      if (["admin", "manager"].includes(user.value.role)) {
        return true;
      }
      return ((_a = user.value.accessible_partners) == null ? void 0 : _a.includes(unit.partner_id)) || false;
    };
    const getPartnerName = (partnerId) => {
      const partner = partners.value.find((p) => p.id === partnerId);
      return (partner == null ? void 0 : partner.name) || "Unknown Partner";
    };
    const getStatusClass = (status) => {
      const classes = {
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      };
      return classes[status] || classes.active;
    };
    const formatCurrency = (amount, currency = "PHP") => {
      const symbols = { PHP: "\u20B1", USD: "$", EUR: "\u20AC", SGD: "S$" };
      const symbol = symbols[currency] || "\u20B1";
      return `${symbol}${new Intl.NumberFormat("en-US").format(amount || 0)}`;
    };
    const applyFilters = () => {
      loadUnits();
    };
    const debouncedSearch = debounce(() => {
      applyFilters();
    }, 300);
    const loadUnits = async () => {
      loading.value = true;
      try {
        const response = await getUnits();
        units.value = extractData(response);
        summary.value = {
          total_units: units.value.length,
          active_units: units.value.filter((u) => u.status === "active" || !u.status).length,
          occupancy_rate: 75,
          // Mock data
          avg_revenue_per_unit: 1200
          // Mock data
        };
      } catch (error) {
        units.value = [];
      } finally {
        loading.value = false;
      }
    };
    const viewUnit = (unitId) => {
      const unit = units.value.find((u) => u.id === unitId);
      if (unit) {
        editingUnit.value = unit;
        isViewMode.value = true;
        showCreateModal.value = true;
      }
    };
    const editUnit = (unit) => {
      editingUnit.value = unit;
      isViewMode.value = false;
      showCreateModal.value = true;
    };
    const closeModal = () => {
      showCreateModal.value = false;
      editingUnit.value = null;
      isViewMode.value = false;
    };
    const handleUnitSaved = () => {
      closeModal();
      loadUnits();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_6;
      const _component_USelect = __nuxt_component_5;
      const _component_UModal = __nuxt_component_0;
      const _component_UnitForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 space-y-6" }, _attrs))}><div class="flex justify-between items-center"><h1 class="text-2xl font-bold">Unit Management</h1>`);
      if (unref(canCreateUnits)) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => showCreateModal.value = true,
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-plus",
                class: "mr-2"
              }, null, _parent2, _scopeId));
              _push2(` Add Unit `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-plus",
                  class: "mr-2"
                }),
                createTextVNode(" Add Unit ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(summary)) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Units</h3><p class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(summary).total_units)}</p></div><div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Units</h3><p class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(summary).active_units)}</p></div><div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Occupancy Rate</h3><p class="text-2xl font-bold text-blue-600">${ssrInterpolate(unref(summary).occupancy_rate)}%</p></div><div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Revenue/Unit</h3><p class="text-2xl font-bold text-purple-600">${ssrInterpolate(formatCurrency(unref(summary).avg_revenue_per_unit))}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"><div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).search,
        "onUpdate:modelValue": ($event) => unref(filters).search = $event,
        placeholder: "Search units...",
        onInput: unref(debouncedSearch)
      }, null, _parent));
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(filters).partner_id,
        "onUpdate:modelValue": ($event) => unref(filters).partner_id = $event,
        options: unref(partnerOptions),
        placeholder: "All Partners",
        onChange: applyFilters
      }, null, _parent));
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(filters).status,
        "onUpdate:modelValue": ($event) => unref(filters).status = $event,
        options: statusOptions,
        placeholder: "All Statuses",
        onChange: applyFilters
      }, null, _parent));
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-8">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "animate-spin h-6 w-6 mx-auto mb-2"
        }, null, _parent));
        _push(` Loading units... </div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(units), (unit) => {
          _push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-photo",
            class: "h-12 w-12 text-gray-400"
          }, null, _parent));
          _push(`</div><div class="p-4"><div class="flex justify-between items-start mb-2"><h3 class="text-lg font-semibold text-gray-900 dark:text-white">${ssrInterpolate(unit.name)}</h3><span class="${ssrRenderClass([getStatusClass(unit.status), "px-2 py-1 rounded-full text-xs font-medium capitalize"])}">${ssrInterpolate(unit.status || "active")}</span></div><p class="text-gray-600 dark:text-gray-400 text-sm mb-2">${ssrInterpolate(unit.city || unit.location)}</p><p class="text-gray-600 dark:text-gray-400 text-sm mb-3">${ssrInterpolate(unit.type || "Property")}</p><div class="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3"><div>\u{1F6CF}\uFE0F ${ssrInterpolate(unit.bedrooms || 0)} bed</div><div>\u{1F6BF} ${ssrInterpolate(unit.bathrooms || 0)} bath</div><div>\u{1F465} ${ssrInterpolate(unit.capacity || 2)} guests</div></div><div class="flex justify-between items-center mb-3"><span class="text-lg font-bold text-gray-900 dark:text-white">${ssrInterpolate(formatCurrency(unit.base_price || 0, unit.currency))}/night </span><span class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(getPartnerName(unit.partner_id))}</span></div><div class="flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            onClick: ($event) => viewUnit(unit.id),
            color: "primary",
            variant: "solid",
            size: "sm",
            class: "flex-1"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View Details `);
              } else {
                return [
                  createTextVNode(" View Details ")
                ];
              }
            }),
            _: 2
          }, _parent));
          if (canEditUnit(unit)) {
            _push(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => editUnit(unit),
              color: "gray",
              variant: "solid",
              size: "sm"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Edit `);
                } else {
                  return [
                    createTextVNode(" Edit ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (!unref(loading) && unref(units).length === 0) {
        _push(`<div class="text-center py-12">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-building-office-2",
          class: "h-12 w-12 text-gray-400 mx-auto mb-4"
        }, null, _parent));
        _push(`<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No units found</h3><p class="text-gray-500 dark:text-gray-400">Get started by creating your first unit.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showCreateModal),
        "onUpdate:modelValue": ($event) => isRef(showCreateModal) ? showCreateModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UnitForm, {
              unit: unref(editingUnit),
              readonly: unref(isViewMode),
              onClose: closeModal,
              onSaved: handleUnitSaved
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UnitForm, {
                unit: unref(editingUnit),
                readonly: unref(isViewMode),
                onClose: closeModal,
                onSaved: handleUnitSaved
              }, null, 8, ["unit", "readonly"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/units.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=units-BkOt2Q7E.mjs.map
