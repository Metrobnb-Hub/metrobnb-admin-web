import { d as useRoute, e as __nuxt_component_1$1, f as __nuxt_component_0$2, g as __nuxt_component_0 } from './server.mjs';
import { _ as _sfc_main$1 } from './UnitForm-DwMzTrSq.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
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
import './Input-CkIGuQjB.mjs';
import './useFormGroup-B3564yef.mjs';
import './Select-C-fTWFr4.mjs';
import './Textarea-Bv7REKKo.mjs';
import './Checkbox-CvybKiXl.mjs';
import './useNotify-7E9w0JIv.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { user } = useAuth();
    const { getUnits } = useApi();
    const loading = ref(true);
    const unit = ref(null);
    const showEditModal = ref(false);
    const canEdit = computed(() => {
      var _a;
      if (!user.value || !unit.value) return false;
      if (["admin", "manager"].includes(user.value.role)) {
        return true;
      }
      return ((_a = user.value.accessible_partners) == null ? void 0 : _a.includes(unit.value.partner_id)) || false;
    });
    const getStatusClass = (status) => {
      const classes = {
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      };
      return classes[status] || classes.active;
    };
    const loadUnit = async () => {
      loading.value = true;
      try {
        const units = await getUnits();
        const unitArray = Array.isArray(units) ? units : [];
        unit.value = unitArray.find((u) => u.id === route.params.id) || null;
      } catch (error) {
        unit.value = null;
      } finally {
        loading.value = false;
      }
    };
    const editUnit = () => {
      showEditModal.value = true;
    };
    const handleUnitSaved = () => {
      showEditModal.value = false;
      loadUnit();
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      const _component_UModal = __nuxt_component_0;
      const _component_UnitForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-6xl mx-auto space-y-6" }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-8">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "animate-spin h-6 w-6 mx-auto mb-2"
        }, null, _parent));
        _push(` Loading unit details... </div>`);
      } else if (unref(unit)) {
        _push(`<div><div class="flex justify-between items-start"><div><h1 class="text-3xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).name)}</h1><p class="text-gray-600 dark:text-gray-400 mt-1">${ssrInterpolate(unref(unit).city || unref(unit).location)}</p></div><div class="flex items-center gap-4"><span class="${ssrRenderClass([getStatusClass(unref(unit).status), "px-3 py-1 rounded-full text-sm font-medium capitalize"])}">${ssrInterpolate(unref(unit).status || "active")}</span>`);
        if (unref(canEdit)) {
          _push(ssrRenderComponent(_component_UButton, {
            onClick: editUnit,
            color: "primary"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-pencil",
                  class: "mr-2"
                }, null, _parent2, _scopeId));
                _push2(` Edit Unit `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-pencil",
                    class: "mr-2"
                  }),
                  createTextVNode(" Edit Unit ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"><div class="text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-photo",
          class: "h-16 w-16 text-gray-400 mx-auto mb-2"
        }, null, _parent));
        _push(`<p class="text-gray-500 dark:text-gray-400">Unit Photo</p></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 space-y-6"><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h2><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Type</label><p class="text-gray-900 dark:text-white capitalize">${ssrInterpolate(unref(unit).type || "Not specified")}</p></div><div><label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</label><p class="text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).capacity || 2)} guests</p></div><div><label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Partner</label><p class="text-gray-900 dark:text-white">${ssrInterpolate(((_a = unref(unit).partner) == null ? void 0 : _a.name) || "Unknown")}</p></div><div><label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Building</label><p class="text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).building || "Not specified")}</p></div></div>`);
        if (unref(unit).description) {
          _push(`<div class="mt-4"><label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label><p class="text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).description)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Property Details</h2><div class="grid grid-cols-3 gap-6"><div class="text-center"><div class="text-2xl mb-2">\u{1F6CF}\uFE0F</div><div class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).bedrooms || 0)}</div><div class="text-sm text-gray-500 dark:text-gray-400">Bedrooms</div></div><div class="text-center"><div class="text-2xl mb-2">\u{1F6CC}</div><div class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).beds || 0)}</div><div class="text-sm text-gray-500 dark:text-gray-400">Beds</div></div><div class="text-center"><div class="text-2xl mb-2">\u{1F6BF}</div><div class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).bathrooms || 0)}</div><div class="text-sm text-gray-500 dark:text-gray-400">Bathrooms</div></div></div></div>`);
        if ((_b = unref(unit).amenities) == null ? void 0 : _b.length) {
          _push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Amenities</h2><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(unref(unit).amenities, (amenity) => {
            _push(`<span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm capitalize">${ssrInterpolate(amenity)}</span>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">House Rules</h2><div class="grid grid-cols-3 gap-4"><div class="flex items-center space-x-2">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: unref(unit).pets_allowed ? "i-heroicons-check-circle" : "i-heroicons-x-circle",
          class: unref(unit).pets_allowed ? "text-green-500" : "text-red-500"
        }, null, _parent));
        _push(`<span class="text-gray-900 dark:text-white">Pets ${ssrInterpolate(unref(unit).pets_allowed ? "Allowed" : "Not Allowed")}</span></div><div class="flex items-center space-x-2">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: unref(unit).smoking_allowed ? "i-heroicons-check-circle" : "i-heroicons-x-circle",
          class: unref(unit).smoking_allowed ? "text-green-500" : "text-red-500"
        }, null, _parent));
        _push(`<span class="text-gray-900 dark:text-white">Smoking ${ssrInterpolate(unref(unit).smoking_allowed ? "Allowed" : "Not Allowed")}</span></div><div class="flex items-center space-x-2">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: unref(unit).parties_allowed ? "i-heroicons-check-circle" : "i-heroicons-x-circle",
          class: unref(unit).parties_allowed ? "text-green-500" : "text-red-500"
        }, null, _parent));
        _push(`<span class="text-gray-900 dark:text-white">Parties ${ssrInterpolate(unref(unit).parties_allowed ? "Allowed" : "Not Allowed")}</span></div></div></div></div><div class="space-y-6"><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pricing</h2><div class="space-y-3"><div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Base Price</span><span class="font-semibold text-gray-900 dark:text-white">$${ssrInterpolate(unref(unit).base_price || 0)}/night</span></div>`);
        if (unref(unit).extra_guest_fee) {
          _push(`<div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Extra Guest Fee</span><span class="font-semibold text-gray-900 dark:text-white">$${ssrInterpolate(unref(unit).extra_guest_fee)}/guest</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(unit).cleaning_fee) {
          _push(`<div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Cleaning Fee</span><span class="font-semibold text-gray-900 dark:text-white">$${ssrInterpolate(unref(unit).cleaning_fee)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Check-in/Check-out</h2><div class="space-y-3"><div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Check-in</span><span class="font-semibold text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).check_in_time || "15:00")}</span></div><div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Check-out</span><span class="font-semibold text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).check_out_time || "11:00")}</span></div></div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Location</h2><div class="space-y-2">`);
        if (unref(unit).location) {
          _push(`<div><label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Address</label><p class="text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).location)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(unit).city) {
          _push(`<div><label class="block text-sm font-medium text-gray-500 dark:text-gray-400">City</label><p class="text-gray-900 dark:text-white">${ssrInterpolate(unref(unit).city)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_c = unref(unit).landmarks) == null ? void 0 : _c.length) {
          _push(`<div><label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nearby Landmarks</label><div class="flex flex-wrap gap-1"><!--[-->`);
          ssrRenderList(unref(unit).landmarks, (landmark) => {
            _push(`<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">${ssrInterpolate(landmark)}</span>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(unit).airbnb_url || unref(unit).airbnb_rating) {
          _push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Airbnb</h2><div class="space-y-3">`);
          if (unref(unit).airbnb_rating) {
            _push(`<div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Rating</span><span class="font-semibold text-gray-900 dark:text-white">\u2B50 ${ssrInterpolate(unref(unit).airbnb_rating)}/5</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(unit).airbnb_url) {
            _push(`<div>`);
            _push(ssrRenderComponent(_component_UButton, {
              to: unref(unit).airbnb_url,
              external: "",
              target: "_blank",
              color: "red",
              variant: "outline",
              size: "sm",
              block: ""
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` View on Airbnb `);
                } else {
                  return [
                    createTextVNode(" View on Airbnb ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<div class="text-center py-12">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-exclamation-triangle",
          class: "h-12 w-12 text-gray-400 mx-auto mb-4"
        }, null, _parent));
        _push(`<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Unit not found</h3><p class="text-gray-500 dark:text-gray-400">The unit you&#39;re looking for doesn&#39;t exist or you don&#39;t have access to it.</p></div>`);
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showEditModal),
        "onUpdate:modelValue": ($event) => isRef(showEditModal) ? showEditModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UnitForm, {
              unit: unref(unit),
              onClose: ($event) => showEditModal.value = false,
              onSaved: handleUnitSaved
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UnitForm, {
                unit: unref(unit),
                onClose: ($event) => showEditModal.value = false,
                onSaved: handleUnitSaved
              }, null, 8, ["unit", "onClose"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/units/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-5UB3EbFr.mjs.map
