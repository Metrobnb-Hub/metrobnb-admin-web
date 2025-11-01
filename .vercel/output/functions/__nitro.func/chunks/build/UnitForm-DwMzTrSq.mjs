import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { _ as __nuxt_component_8 } from './Checkbox-CvybKiXl.mjs';
import { f as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, readonly, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UnitForm",
  __ssrInlineRender: true,
  props: {
    unit: {},
    preselectedPartner: {},
    readonly: { type: Boolean }
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    var _a, _b;
    const props = __props;
    const { user } = useAuth();
    useNotify();
    const { createUnit, updateUnit, getPartners } = useApi();
    const isEdit = computed(() => !!props.unit);
    const saving = ref(false);
    const partners = ref([]);
    const form = ref({
      name: "",
      partner_id: "",
      type: "",
      description: "",
      capacity: 2,
      city: "",
      building: "",
      landmarks: [],
      base_price: 0,
      currency: "PHP",
      extra_guest_fee: 0,
      cleaning_fee: 0,
      amenities: [],
      special_features: "",
      check_in_time: "15:00",
      check_out_time: "11:00",
      pets_allowed: false,
      smoking_allowed: false,
      parties_allowed: false,
      remarks: "",
      status: "active",
      airbnb_url: "",
      airbnb_rating: 0,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      location: "",
      notes: ""
    });
    const landmarksText = ref("");
    const amenitiesText = ref("");
    if (props.unit) {
      Object.assign(form.value, props.unit);
      landmarksText.value = ((_a = props.unit.landmarks) == null ? void 0 : _a.join(", ")) || "";
      amenitiesText.value = ((_b = props.unit.amenities) == null ? void 0 : _b.join(", ")) || "";
    }
    if (props.preselectedPartner) {
      form.value.partner_id = props.preselectedPartner;
    }
    const partnerOptions = computed(() => {
      if (!partners.value || !Array.isArray(partners.value)) return [];
      return partners.value.map((partner) => ({
        label: partner.name || partner.company_name || `Partner ${partner.id}`,
        value: partner.id
      }));
    });
    const typeOptions = [
      { label: "Apartment", value: "apartment" },
      { label: "House", value: "house" },
      { label: "Condo", value: "condo" },
      { label: "Studio", value: "studio" },
      { label: "Loft", value: "loft" }
    ];
    const statusOptions = [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Maintenance", value: "maintenance" }
    ];
    const currencyOptions = [
      { label: "PHP", value: "PHP" },
      { label: "USD", value: "USD" },
      { label: "EUR", value: "EUR" },
      { label: "SGD", value: "SGD" }
    ];
    const canChangePartner = computed(() => {
      var _a2, _b2;
      if (props.preselectedPartner && !isEdit.value) {
        return ["admin", "manager"].includes(((_a2 = user.value) == null ? void 0 : _a2.role) || "");
      }
      return !isEdit.value || ["admin", "manager"].includes(((_b2 = user.value) == null ? void 0 : _b2.role) || "");
    });
    watch(landmarksText, (value) => {
      form.value.landmarks = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
    });
    watch(amenitiesText, (value) => {
      form.value.amenities = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = __nuxt_component_6;
      const _component_USelect = __nuxt_component_5;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UCheckbox = __nuxt_component_8;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-4xl mx-auto" }, _attrs))}><h3 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">${ssrInterpolate(unref(isEdit) ? "Edit Unit" : "Create New Unit")}</h3><form class="space-y-6"><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h4><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"> Unit Name <span class="text-red-500">*</span></label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        type: "text",
        required: "",
        placeholder: "e.g., Downtown Loft A",
        disabled: "readonly" in _ctx ? _ctx.readonly : unref(readonly)
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"> Partner <span class="text-red-500">*</span></label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).partner_id,
        "onUpdate:modelValue": ($event) => unref(form).partner_id = $event,
        options: unref(partnerOptions),
        placeholder: "Select Partner",
        required: "",
        disabled: !unref(canChangePartner) || ("readonly" in _ctx ? _ctx.readonly : unref(readonly))
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-3 gap-4 mt-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).type,
        "onUpdate:modelValue": ($event) => unref(form).type = $event,
        options: typeOptions,
        placeholder: "Select Type (Optional)"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).status,
        "onUpdate:modelValue": ($event) => unref(form).status = $event,
        options: statusOptions,
        placeholder: "Select Status (Optional)"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Capacity</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).capacity,
        "onUpdate:modelValue": ($event) => unref(form).capacity = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "1",
        placeholder: "2"
      }, null, _parent));
      _push(`</div></div><div class="mt-4"><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(form).description,
        "onUpdate:modelValue": ($event) => unref(form).description = $event,
        rows: "3",
        placeholder: "Describe the unit's features and amenities..."
      }, null, _parent));
      _push(`</div></div><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Location</h4><div class="space-y-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).location,
        "onUpdate:modelValue": ($event) => unref(form).location = $event,
        type: "text",
        placeholder: "Street address"
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">City</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).city,
        "onUpdate:modelValue": ($event) => unref(form).city = $event,
        type: "text",
        placeholder: "City"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Building</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).building,
        "onUpdate:modelValue": ($event) => unref(form).building = $event,
        type: "text",
        placeholder: "Building name"
      }, null, _parent));
      _push(`</div></div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Landmarks</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(landmarksText),
        "onUpdate:modelValue": ($event) => isRef(landmarksText) ? landmarksText.value = $event : null,
        type: "text",
        placeholder: "Mall of Asia, Airport (comma separated)"
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Property Details</h4><div class="grid grid-cols-3 gap-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bedrooms</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).bedrooms,
        "onUpdate:modelValue": ($event) => unref(form).bedrooms = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "0",
        placeholder: "1"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Beds</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).beds,
        "onUpdate:modelValue": ($event) => unref(form).beds = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "0",
        placeholder: "1"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bathrooms</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).bathrooms,
        "onUpdate:modelValue": ($event) => unref(form).bathrooms = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "0",
        step: "0.5",
        placeholder: "1"
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Pricing</h4><div class="grid grid-cols-4 gap-4"><div class="col-span-2"><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Base Price (per night)</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).base_price,
        "onUpdate:modelValue": ($event) => unref(form).base_price = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "0",
        step: "0.01",
        placeholder: "100.00",
        disabled: "readonly" in _ctx ? _ctx.readonly : unref(readonly)
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Currency</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).currency,
        "onUpdate:modelValue": ($event) => unref(form).currency = $event,
        options: currencyOptions,
        placeholder: "PHP",
        disabled: "readonly" in _ctx ? _ctx.readonly : unref(readonly)
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Extra Guest Fee</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).extra_guest_fee,
        "onUpdate:modelValue": ($event) => unref(form).extra_guest_fee = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "0",
        step: "0.01",
        placeholder: "25.00"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cleaning Fee</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).cleaning_fee,
        "onUpdate:modelValue": ($event) => unref(form).cleaning_fee = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "0",
        step: "0.01",
        placeholder: "50.00"
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Amenities &amp; Features</h4><div class="space-y-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Amenities</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(amenitiesText),
        "onUpdate:modelValue": ($event) => isRef(amenitiesText) ? amenitiesText.value = $event : null,
        type: "text",
        placeholder: "wifi, parking, pool, gym (comma separated)"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Special Features</label>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(form).special_features,
        "onUpdate:modelValue": ($event) => unref(form).special_features = $event,
        rows: "2",
        placeholder: "Balcony with city view, Smart TV, etc."
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-3 gap-4"><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(form).pets_allowed,
        "onUpdate:modelValue": ($event) => unref(form).pets_allowed = $event
      }, null, _parent));
      _push(`<label class="text-sm text-gray-700 dark:text-gray-300">Pets Allowed</label></div><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(form).smoking_allowed,
        "onUpdate:modelValue": ($event) => unref(form).smoking_allowed = $event
      }, null, _parent));
      _push(`<label class="text-sm text-gray-700 dark:text-gray-300">Smoking Allowed</label></div><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(form).parties_allowed,
        "onUpdate:modelValue": ($event) => unref(form).parties_allowed = $event
      }, null, _parent));
      _push(`<label class="text-sm text-gray-700 dark:text-gray-300">Parties Allowed</label></div></div></div></div><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Check-in/Check-out</h4><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Check-in Time</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).check_in_time,
        "onUpdate:modelValue": ($event) => unref(form).check_in_time = $event,
        type: "time",
        placeholder: "15:00"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Check-out Time</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).check_out_time,
        "onUpdate:modelValue": ($event) => unref(form).check_out_time = $event,
        type: "time",
        placeholder: "11:00"
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Airbnb Integration</h4><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Airbnb URL</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).airbnb_url,
        "onUpdate:modelValue": ($event) => unref(form).airbnb_url = $event,
        type: "url",
        placeholder: "https://airbnb.com/rooms/..."
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Airbnb Rating</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).airbnb_rating,
        "onUpdate:modelValue": ($event) => unref(form).airbnb_rating = $event,
        modelModifiers: { number: true },
        type: "number",
        min: "0",
        max: "5",
        step: "0.1",
        placeholder: "4.8"
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Additional Notes</h4><div class="space-y-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Remarks</label>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(form).remarks,
        "onUpdate:modelValue": ($event) => unref(form).remarks = $event,
        rows: "3",
        placeholder: "Any additional notes or special instructions..."
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Legacy Notes</label>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(form).notes,
        "onUpdate:modelValue": ($event) => unref(form).notes = $event,
        rows: "2",
        placeholder: "Legacy notes field..."
      }, null, _parent));
      _push(`</div></div></div><div class="flex justify-end gap-4 pt-4">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "button",
        onClick: ($event) => _ctx.$emit("close"),
        variant: "ghost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(("readonly" in _ctx ? _ctx.readonly : unref(readonly)) ? "Close" : "Cancel")}`);
          } else {
            return [
              createTextVNode(toDisplayString(("readonly" in _ctx ? _ctx.readonly : unref(readonly)) ? "Close" : "Cancel"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (!("readonly" in _ctx ? _ctx.readonly : unref(readonly))) {
        _push(ssrRenderComponent(_component_UButton, {
          type: "submit",
          loading: unref(saving),
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(saving) ? "Saving..." : unref(isEdit) ? "Update Unit" : "Create Unit")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(saving) ? "Saving..." : unref(isEdit) ? "Update Unit" : "Create Unit"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UnitForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=UnitForm-DwMzTrSq.mjs.map
