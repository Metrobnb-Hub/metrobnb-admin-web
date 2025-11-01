import { b as useRouter, M as useToast, L as __nuxt_component_2, e as __nuxt_component_1$1, f as __nuxt_component_0$2, R as useNuxtApp } from './server.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as _sfc_main$1 } from './DateInput-H5QDo9cM.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_6$1 } from './Toggle-DLYZoy61.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
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
import './form-DsUILy5F.mjs';
import './use-resolve-button-type-CgmJ7gVL.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const { createExpense, uploadFile } = useApi();
    const { organization } = useAuth();
    const router = useRouter();
    useToast();
    const orgName = computed(() => {
      var _a;
      return ((_a = organization.value) == null ? void 0 : _a.name) || "Organization";
    });
    const loading = ref(false);
    const selectedFile = ref(null);
    const previewUrl = ref("");
    const form = ref({
      partnerId: "",
      unitId: "",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      type: "",
      amount: 0,
      paidBy: "metrobnb",
      billable: true,
      notes: ""
    });
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return partners.value.map((p) => ({ label: p.name, value: p.id }));
    });
    const unitOptions = computed(() => {
      if (!form.value.partnerId || !Array.isArray(units.value)) return [];
      return units.value.filter((u) => u.partner_id === form.value.partnerId).map((u) => ({ label: u.name, value: u.id }));
    });
    const expenseTypes = [
      { label: "Cleaning", value: "Cleaning" },
      { label: "Laundry", value: "Laundry" },
      { label: "Supplies", value: "Supplies" },
      { label: "Wifi", value: "Wifi" },
      { label: "Electricity", value: "Electricity" },
      { label: "Repair", value: "Repair" },
      { label: "Repairs", value: "Repairs" },
      { label: "Miscellaneous", value: "Miscellaneous" }
    ];
    const paidByOptions = computed(() => [
      { label: orgName.value, value: "metrobnb" },
      { label: "Partner", value: "partner" },
      { label: "Employee", value: "employee" },
      { label: "Owner", value: "owner" }
    ]);
    const handleFileSelect = (event) => {
      var _a;
      const target = event.target;
      const file = (_a = target.files) == null ? void 0 : _a[0];
      if (!file) return;
      selectedFile.value = file;
      previewUrl.value = URL.createObjectURL(file);
    };
    const removeReceipt = () => {
      selectedFile.value = null;
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = "";
      }
      const fileInput = (void 0).querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    };
    const handleSubmit = async (event) => {
      event.preventDefault();
      const { notifySuccess, notifyError } = useNotify();
      if (!form.value.partnerId || !form.value.unitId || !form.value.type || !form.value.amount) {
        notifyError("Please fill in all required fields");
        return;
      }
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append("partner_id", form.value.partnerId);
        formData.append("unit_id", form.value.unitId);
        formData.append("amount", form.value.amount.toString());
        formData.append("type", form.value.type);
        formData.append("date", form.value.date);
        formData.append("paid_by", form.value.paidBy);
        formData.append("billable", form.value.billable.toString());
        formData.append("notes", form.value.notes || "");
        if (selectedFile.value) {
          formData.append("receipt_file", selectedFile.value);
        }
        const { $api } = useNuxtApp();
        const response = await $api("/api/expenses", {
          method: "POST",
          body: formData
        });
        console.log("Expense created successfully, showing toast...");
        const toast2 = useToast();
        toast2.add({
          title: "Success!",
          description: "Expense added successfully",
          color: "green",
          timeout: 5e3
        });
        notifySuccess("Expense added successfully", 5e3);
        console.log("Toast should be visible now");
        setTimeout(() => {
          console.log("Redirecting...");
          router.push("/accounting/expenses");
        }, 2e3);
      } catch (error) {
        console.error("Expense creation error:", error);
        let errorMessage = "Failed to add expense";
        if (error.data) {
          if (error.data.detail) {
            errorMessage = error.data.detail;
          } else if (error.data.message) {
            errorMessage = error.data.message;
          } else if (error.data.error) {
            errorMessage = typeof error.data.error === "string" ? error.data.error : error.data.error.message;
          } else if (typeof error.data === "string") {
            errorMessage = error.data;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        if (error.status) {
          errorMessage = `${errorMessage} (Status: ${error.status})`;
        }
        notifyError(errorMessage);
        console.error("Full error details:", {
          status: error.status,
          statusText: error.statusText,
          data: error.data,
          message: error.message
        });
      } finally {
        loading.value = false;
      }
    };
    watch(() => form.value.partnerId, (newPartnerId, oldPartnerId) => {
      if (oldPartnerId && newPartnerId !== oldPartnerId) {
        form.value.unitId = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_DateInput = _sfc_main$1;
      const _component_UInput = __nuxt_component_6;
      const _component_UToggle = __nuxt_component_6$1;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      const _component_UTextarea = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Add Expense</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Add Expense")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              state: unref(form),
              onSubmit: handleSubmit,
              class: "space-y-4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Partner",
                    name: "partnerId"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).partnerId,
                          "onUpdate:modelValue": ($event) => unref(form).partnerId = $event,
                          options: unref(partnerOptions),
                          placeholder: "Select partner"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).partnerId,
                            "onUpdate:modelValue": ($event) => unref(form).partnerId = $event,
                            options: unref(partnerOptions),
                            placeholder: "Select partner"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Unit",
                    name: "unitId"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).unitId,
                          "onUpdate:modelValue": ($event) => unref(form).unitId = $event,
                          options: unref(unitOptions),
                          placeholder: "Select unit",
                          disabled: !unref(form).partnerId
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).unitId,
                            "onUpdate:modelValue": ($event) => unref(form).unitId = $event,
                            options: unref(unitOptions),
                            placeholder: "Select unit",
                            disabled: !unref(form).partnerId
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Date",
                    name: "date"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_DateInput, {
                          modelValue: unref(form).date,
                          "onUpdate:modelValue": ($event) => unref(form).date = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_DateInput, {
                            modelValue: unref(form).date,
                            "onUpdate:modelValue": ($event) => unref(form).date = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Type",
                    name: "type"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).type,
                          "onUpdate:modelValue": ($event) => unref(form).type = $event,
                          options: expenseTypes,
                          placeholder: "Select type"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).type,
                            "onUpdate:modelValue": ($event) => unref(form).type = $event,
                            options: expenseTypes,
                            placeholder: "Select type"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Amount",
                    name: "amount"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).amount,
                          "onUpdate:modelValue": ($event) => unref(form).amount = $event,
                          type: "number",
                          step: "0.01",
                          placeholder: "0.00"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).amount,
                            "onUpdate:modelValue": ($event) => unref(form).amount = $event,
                            type: "number",
                            step: "0.01",
                            placeholder: "0.00"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Paid By",
                    name: "paidBy"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(form).paidBy,
                          "onUpdate:modelValue": ($event) => unref(form).paidBy = $event,
                          options: unref(paidByOptions),
                          placeholder: "Who paid?"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).paidBy,
                            "onUpdate:modelValue": ($event) => unref(form).paidBy = $event,
                            options: unref(paidByOptions),
                            placeholder: "Who paid?"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Billable",
                    name: "billable"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UToggle, {
                          modelValue: unref(form).billable,
                          "onUpdate:modelValue": ($event) => unref(form).billable = $event
                        }, null, _parent4, _scopeId3));
                        _push4(`<span class="ml-2 text-sm text-gray-600"${_scopeId3}>${ssrInterpolate(unref(form).billable ? "Bill to partner" : `${unref(orgName)} absorbs`)}</span>`);
                      } else {
                        return [
                          createVNode(_component_UToggle, {
                            modelValue: unref(form).billable,
                            "onUpdate:modelValue": ($event) => unref(form).billable = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode("span", { class: "ml-2 text-sm text-gray-600" }, toDisplayString(unref(form).billable ? "Bill to partner" : `${unref(orgName)} absorbs`), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Receipt",
                    name: "receipt"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!unref(selectedFile)) {
                          _push4(`<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6"${_scopeId3}><div class="text-center"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_UIcon, {
                            name: "i-heroicons-photo",
                            class: "h-12 w-12 text-gray-400 mx-auto mb-4"
                          }, null, _parent4, _scopeId3));
                          _push4(`<div class="space-y-2"${_scopeId3}><input type="file" accept="image/*" class="hidden"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_UButton, {
                            onClick: ($event) => _ctx.$refs.fileInput.click(),
                            variant: "outline"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_UIcon, {
                                  name: "i-heroicons-camera",
                                  class: "mr-2"
                                }, null, _parent5, _scopeId4));
                                _push5(` Select Receipt `);
                              } else {
                                return [
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-camera",
                                    class: "mr-2"
                                  }),
                                  createTextVNode(" Select Receipt ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<p class="text-sm text-gray-500"${_scopeId3}>PNG, JPG up to 10MB</p></div></div></div>`);
                        } else {
                          _push4(`<div class="relative"${_scopeId3}><img${ssrRenderAttr("src", unref(previewUrl))} alt="Receipt Preview" class="w-full h-48 object-cover rounded-lg"${_scopeId3}><div class="absolute top-2 right-2 flex gap-2"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_UButton, {
                            onClick: removeReceipt,
                            color: "red",
                            variant: "solid",
                            size: "sm"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-x-mark" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div><div class="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm"${_scopeId3}>${ssrInterpolate(unref(selectedFile).name)}</div></div>`);
                        }
                      } else {
                        return [
                          !unref(selectedFile) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6"
                          }, [
                            createVNode("div", { class: "text-center" }, [
                              createVNode(_component_UIcon, {
                                name: "i-heroicons-photo",
                                class: "h-12 w-12 text-gray-400 mx-auto mb-4"
                              }),
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode("input", {
                                  ref: "fileInput",
                                  type: "file",
                                  accept: "image/*",
                                  class: "hidden",
                                  onChange: handleFileSelect
                                }, null, 544),
                                createVNode(_component_UButton, {
                                  onClick: ($event) => _ctx.$refs.fileInput.click(),
                                  variant: "outline"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_UIcon, {
                                      name: "i-heroicons-camera",
                                      class: "mr-2"
                                    }),
                                    createTextVNode(" Select Receipt ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode("p", { class: "text-sm text-gray-500" }, "PNG, JPG up to 10MB")
                              ])
                            ])
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "relative"
                          }, [
                            createVNode("img", {
                              src: unref(previewUrl),
                              alt: "Receipt Preview",
                              class: "w-full h-48 object-cover rounded-lg"
                            }, null, 8, ["src"]),
                            createVNode("div", { class: "absolute top-2 right-2 flex gap-2" }, [
                              createVNode(_component_UButton, {
                                onClick: removeReceipt,
                                color: "red",
                                variant: "solid",
                                size: "sm"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode("div", { class: "absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm" }, toDisplayString(unref(selectedFile).name), 1)
                          ]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Notes",
                    name: "notes"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(form).notes,
                          "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                          placeholder: "Optional notes"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).notes,
                            "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                            placeholder: "Optional notes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    loading: unref(loading),
                    color: "primary"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Add Expense`);
                      } else {
                        return [
                          createTextVNode("Add Expense")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormGroup, {
                        label: "Partner",
                        name: "partnerId"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).partnerId,
                            "onUpdate:modelValue": ($event) => unref(form).partnerId = $event,
                            options: unref(partnerOptions),
                            placeholder: "Select partner"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Unit",
                        name: "unitId"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).unitId,
                            "onUpdate:modelValue": ($event) => unref(form).unitId = $event,
                            options: unref(unitOptions),
                            placeholder: "Select unit",
                            disabled: !unref(form).partnerId
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormGroup, {
                        label: "Date",
                        name: "date"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_DateInput, {
                            modelValue: unref(form).date,
                            "onUpdate:modelValue": ($event) => unref(form).date = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Type",
                        name: "type"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).type,
                            "onUpdate:modelValue": ($event) => unref(form).type = $event,
                            options: expenseTypes,
                            placeholder: "Select type"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormGroup, {
                        label: "Amount",
                        name: "amount"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).amount,
                            "onUpdate:modelValue": ($event) => unref(form).amount = $event,
                            type: "number",
                            step: "0.01",
                            placeholder: "0.00"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Paid By",
                        name: "paidBy"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(form).paidBy,
                            "onUpdate:modelValue": ($event) => unref(form).paidBy = $event,
                            options: unref(paidByOptions),
                            placeholder: "Who paid?"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormGroup, {
                      label: "Billable",
                      name: "billable"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UToggle, {
                          modelValue: unref(form).billable,
                          "onUpdate:modelValue": ($event) => unref(form).billable = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("span", { class: "ml-2 text-sm text-gray-600" }, toDisplayString(unref(form).billable ? "Bill to partner" : `${unref(orgName)} absorbs`), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Receipt",
                      name: "receipt"
                    }, {
                      default: withCtx(() => [
                        !unref(selectedFile) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6"
                        }, [
                          createVNode("div", { class: "text-center" }, [
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-photo",
                              class: "h-12 w-12 text-gray-400 mx-auto mb-4"
                            }),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode("input", {
                                ref: "fileInput",
                                type: "file",
                                accept: "image/*",
                                class: "hidden",
                                onChange: handleFileSelect
                              }, null, 544),
                              createVNode(_component_UButton, {
                                onClick: ($event) => _ctx.$refs.fileInput.click(),
                                variant: "outline"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UIcon, {
                                    name: "i-heroicons-camera",
                                    class: "mr-2"
                                  }),
                                  createTextVNode(" Select Receipt ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode("p", { class: "text-sm text-gray-500" }, "PNG, JPG up to 10MB")
                            ])
                          ])
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "relative"
                        }, [
                          createVNode("img", {
                            src: unref(previewUrl),
                            alt: "Receipt Preview",
                            class: "w-full h-48 object-cover rounded-lg"
                          }, null, 8, ["src"]),
                          createVNode("div", { class: "absolute top-2 right-2 flex gap-2" }, [
                            createVNode(_component_UButton, {
                              onClick: removeReceipt,
                              color: "red",
                              variant: "solid",
                              size: "sm"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm" }, toDisplayString(unref(selectedFile).name), 1)
                        ]))
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Notes",
                      name: "notes"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(form).notes,
                          "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                          placeholder: "Optional notes"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      loading: unref(loading),
                      color: "primary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add Expense")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UForm, {
                state: unref(form),
                onSubmit: handleSubmit,
                class: "space-y-4"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Partner",
                      name: "partnerId"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(form).partnerId,
                          "onUpdate:modelValue": ($event) => unref(form).partnerId = $event,
                          options: unref(partnerOptions),
                          placeholder: "Select partner"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Unit",
                      name: "unitId"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(form).unitId,
                          "onUpdate:modelValue": ($event) => unref(form).unitId = $event,
                          options: unref(unitOptions),
                          placeholder: "Select unit",
                          disabled: !unref(form).partnerId
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Date",
                      name: "date"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_DateInput, {
                          modelValue: unref(form).date,
                          "onUpdate:modelValue": ($event) => unref(form).date = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Type",
                      name: "type"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(form).type,
                          "onUpdate:modelValue": ($event) => unref(form).type = $event,
                          options: expenseTypes,
                          placeholder: "Select type"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Amount",
                      name: "amount"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).amount,
                          "onUpdate:modelValue": ($event) => unref(form).amount = $event,
                          type: "number",
                          step: "0.01",
                          placeholder: "0.00"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "Paid By",
                      name: "paidBy"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(form).paidBy,
                          "onUpdate:modelValue": ($event) => unref(form).paidBy = $event,
                          options: unref(paidByOptions),
                          placeholder: "Who paid?"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_UFormGroup, {
                    label: "Billable",
                    name: "billable"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UToggle, {
                        modelValue: unref(form).billable,
                        "onUpdate:modelValue": ($event) => unref(form).billable = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("span", { class: "ml-2 text-sm text-gray-600" }, toDisplayString(unref(form).billable ? "Bill to partner" : `${unref(orgName)} absorbs`), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Receipt",
                    name: "receipt"
                  }, {
                    default: withCtx(() => [
                      !unref(selectedFile) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6"
                      }, [
                        createVNode("div", { class: "text-center" }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-photo",
                            class: "h-12 w-12 text-gray-400 mx-auto mb-4"
                          }),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode("input", {
                              ref: "fileInput",
                              type: "file",
                              accept: "image/*",
                              class: "hidden",
                              onChange: handleFileSelect
                            }, null, 544),
                            createVNode(_component_UButton, {
                              onClick: ($event) => _ctx.$refs.fileInput.click(),
                              variant: "outline"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UIcon, {
                                  name: "i-heroicons-camera",
                                  class: "mr-2"
                                }),
                                createTextVNode(" Select Receipt ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode("p", { class: "text-sm text-gray-500" }, "PNG, JPG up to 10MB")
                          ])
                        ])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "relative"
                      }, [
                        createVNode("img", {
                          src: unref(previewUrl),
                          alt: "Receipt Preview",
                          class: "w-full h-48 object-cover rounded-lg"
                        }, null, 8, ["src"]),
                        createVNode("div", { class: "absolute top-2 right-2 flex gap-2" }, [
                          createVNode(_component_UButton, {
                            onClick: removeReceipt,
                            color: "red",
                            variant: "solid",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UIcon, { name: "i-heroicons-x-mark" })
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm" }, toDisplayString(unref(selectedFile).name), 1)
                      ]))
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "Notes",
                    name: "notes"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(form).notes,
                        "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                        placeholder: "Optional notes"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    loading: unref(loading),
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add Expense")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }, 8, ["state"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/expenses/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-DSzxVzbc.mjs.map
