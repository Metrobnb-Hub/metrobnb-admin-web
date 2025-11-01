import { e as __nuxt_component_1$1, f as __nuxt_component_0$2, a as __nuxt_component_0$6, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
import './useFormGroup-B3564yef.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const { register, loading } = useAuth();
    const { notifySuccess, notifyError } = useNotify();
    const currentStep = ref(1);
    const formData = ref({
      email: "",
      password: "",
      name: "",
      organization_name: "",
      business_type: "",
      plan: "starter"
    });
    const error = ref("");
    const businessTypes = [
      {
        value: "property_manager",
        title: "Property Management Company",
        description: "I manage multiple properties for different owners",
        icon: "i-heroicons-building-office-2"
      },
      {
        value: "individual_owner",
        title: "Individual Property Owner",
        description: "I own and manage my own properties",
        icon: "i-heroicons-home-modern"
      },
      {
        value: "partner_network",
        title: "Partner Network",
        description: "I work with partners who manage units for me",
        icon: "i-heroicons-users"
      }
    ];
    const plans = [
      {
        value: "starter",
        title: "Starter",
        description: "Perfect for getting started",
        price: "Free",
        billing: "Forever",
        features: ["Up to 5 units", "Basic reporting", "Email support"]
      },
      {
        value: "pro",
        title: "Professional",
        description: "For growing businesses",
        price: "\u20B11,499",
        billing: "per month",
        features: ["Up to 25 units", "Advanced analytics", "Priority support", "Team collaboration"]
      },
      {
        value: "enterprise",
        title: "Enterprise",
        description: "For large operations",
        price: "\u20B14,999",
        billing: "per month",
        features: ["Unlimited units", "Custom integrations", "Dedicated support", "White-label options"]
      }
    ];
    const canProceedStep1 = computed(() => {
      return formData.value.name && formData.value.email && formData.value.password;
    });
    const canProceedStep2 = computed(() => {
      return formData.value.business_type && formData.value.organization_name;
    });
    const nextStep = () => {
      if (currentStep.value < 3) {
        currentStep.value++;
      }
    };
    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
      }
    };
    const handleRegister = async () => {
      error.value = "";
      try {
        await register(formData.value);
        notifySuccess("Account created successfully!");
        await navigateTo("/dashboard");
      } catch (err) {
        error.value = err.message;
        notifyError(err.message);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_6;
      const _component_UButton = __nuxt_component_0$2;
      const _component_NuxtLink = __nuxt_component_0$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" }, _attrs))}><div class="min-h-screen flex flex-col lg:flex-row"><div class="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden"><div class="lg:hidden p-4 text-white"><div class="flex items-center justify-between mb-4"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-home-modern",
        class: "h-5 w-5"
      }, null, _parent));
      _push(`</div><div><h1 class="text-xl font-bold">MetroBNB</h1><div class="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 inline-flex items-center space-x-1"><div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div><span class="text-xs font-semibold">BETA</span></div></div></div><div class="text-right"><div class="text-xs text-blue-100 mb-1">Step ${ssrInterpolate(unref(currentStep))} of 3</div><div class="flex space-x-1"><!--[-->`);
      ssrRenderList(3, (i) => {
        _push(`<div class="${ssrRenderClass([
          "w-6 h-1 rounded-full transition-all",
          unref(currentStep) >= i ? "bg-white" : "bg-white/30"
        ])}"></div>`);
      });
      _push(`<!--]--></div></div></div></div><div class="hidden lg:flex lg:h-full lg:flex-col lg:justify-between lg:p-12"><div class="absolute inset-0 bg-black/10"></div><div class="relative z-10 text-white"><div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-home-modern",
        class: "h-8 w-8"
      }, null, _parent));
      _push(`</div><h1 class="text-4xl font-bold mb-2">MetroBNB</h1><p class="text-blue-100">Join thousands of property managers</p></div><div class="relative z-10 text-white"><div class="space-y-4"><div class="flex items-center space-x-4"><div class="${ssrRenderClass([
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
        unref(currentStep) >= 1 ? "bg-white text-blue-600" : "bg-white/20 text-white"
      ])}">${ssrInterpolate(unref(currentStep) > 1 ? "\u2713" : "1")}</div><div><p class="font-semibold">Tell us about yourself</p><p class="text-blue-100 text-sm">Basic information</p></div></div><div class="flex items-center space-x-4"><div class="${ssrRenderClass([
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
        unref(currentStep) >= 2 ? "bg-white text-blue-600" : "bg-white/20 text-white"
      ])}">${ssrInterpolate(unref(currentStep) > 2 ? "\u2713" : "2")}</div><div><p class="font-semibold">Your business type</p><p class="text-blue-100 text-sm">How do you manage properties?</p></div></div><div class="flex items-center space-x-4"><div class="${ssrRenderClass([
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
        unref(currentStep) >= 3 ? "bg-white text-blue-600" : "bg-white/20 text-white"
      ])}">${ssrInterpolate(unref(currentStep) > 3 ? "\u2713" : "3")}</div><div><p class="font-semibold">Choose your plan</p><p class="text-blue-100 text-sm">Select what works for you</p></div></div></div></div><div class="relative z-10 text-white"><div class="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center space-x-2 mb-4"><div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span class="text-sm font-semibold">BETA TESTING</span></div><div class="text-white/80 text-sm"><p>&quot;MetroBNB helped us scale from 5 to 50 properties seamlessly.&quot;</p><p class="mt-2 font-semibold">- Maria Santos, Property Manager</p></div></div></div></div><div class="flex-1 flex items-center justify-center p-4 lg:p-8"><div class="w-full max-w-md"><div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">`);
      if (unref(currentStep) === 1) {
        _push(`<div><div class="text-center mb-6"><h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2"> Let&#39;s get started </h2><p class="text-gray-600 dark:text-gray-400 text-sm lg:text-base"> Tell us a bit about yourself </p></div><div class="space-y-4">`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(formData).name,
          "onUpdate:modelValue": ($event) => unref(formData).name = $event,
          placeholder: "Your full name",
          size: "lg",
          required: ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(formData).email,
          "onUpdate:modelValue": ($event) => unref(formData).email = $event,
          type: "email",
          placeholder: "Email address",
          size: "lg",
          required: ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(formData).password,
          "onUpdate:modelValue": ($event) => unref(formData).password = $event,
          type: "password",
          placeholder: "Create a password",
          size: "lg",
          required: ""
        }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: nextStep,
          disabled: !unref(canProceedStep1),
          color: "primary",
          size: "lg",
          block: "",
          class: "mt-6"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Continue `);
            } else {
              return [
                createTextVNode(" Continue ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 2) {
        _push(`<div><div class="text-center mb-6"><h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2"> How do you manage properties? </h2><p class="text-gray-600 dark:text-gray-400"> This helps us customize your experience </p></div><div class="space-y-3"><!--[-->`);
        ssrRenderList(businessTypes, (type) => {
          _push(`<div class="${ssrRenderClass([
            "p-4 border-2 rounded-xl cursor-pointer transition-all",
            unref(formData).business_type === type.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
          ])}"><div class="flex items-start space-x-3">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: type.icon,
            class: "h-6 w-6 text-blue-600 mt-1"
          }, null, _parent));
          _push(`<div><h3 class="font-semibold text-gray-900 dark:text-white">${ssrInterpolate(type.title)}</h3><p class="text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(type.description)}</p></div></div></div>`);
        });
        _push(`<!--]--></div>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(formData).organization_name,
          "onUpdate:modelValue": ($event) => unref(formData).organization_name = $event,
          placeholder: "Company/Organization name",
          size: "lg",
          class: "mt-4",
          required: ""
        }, null, _parent));
        _push(`<div class="flex space-x-3 mt-6">`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: prevStep,
          variant: "outline",
          size: "lg",
          class: "flex-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Back `);
            } else {
              return [
                createTextVNode(" Back ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          onClick: nextStep,
          disabled: !unref(canProceedStep2),
          color: "primary",
          size: "lg",
          class: "flex-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Continue `);
            } else {
              return [
                createTextVNode(" Continue ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 3) {
        _push(`<div><div class="text-center mb-6"><h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2"> Choose your plan </h2><p class="text-gray-600 dark:text-gray-400"> You can always upgrade later </p></div><div class="space-y-3"><!--[-->`);
        ssrRenderList(plans, (plan) => {
          _push(`<div class="${ssrRenderClass([
            "p-4 border-2 rounded-xl cursor-pointer transition-all",
            unref(formData).plan === plan.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
          ])}"><div class="flex justify-between items-start"><div><h3 class="font-semibold text-gray-900 dark:text-white">${ssrInterpolate(plan.title)}</h3><p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${ssrInterpolate(plan.description)}</p><div class="text-xs text-gray-500"><!--[-->`);
          ssrRenderList(plan.features, (feature) => {
            _push(`<span class="block">\u2022 ${ssrInterpolate(feature)}</span>`);
          });
          _push(`<!--]--></div></div><div class="text-right"><div class="text-lg font-bold text-gray-900 dark:text-white">${ssrInterpolate(plan.price)}</div><div class="text-xs text-gray-500">${ssrInterpolate(plan.billing)}</div></div></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (unref(error)) {
          _push(`<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-4"><p class="text-red-600 dark:text-red-400 text-sm">${ssrInterpolate(unref(error))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex space-x-3 mt-6">`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: prevStep,
          variant: "outline",
          size: "lg",
          class: "flex-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Back `);
            } else {
              return [
                createTextVNode(" Back ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          onClick: handleRegister,
          loading: unref(loading),
          color: "primary",
          size: "lg",
          class: "flex-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(loading) ? "Creating Account..." : "Create Account")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(loading) ? "Creating Account..." : "Create Account"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="text-center mt-6"><p class="text-gray-600 dark:text-gray-400"> Already have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "font-semibold text-blue-600 hover:text-blue-500 ml-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign in `);
          } else {
            return [
              createTextVNode(" Sign in ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-Cmhe-54o.mjs.map
