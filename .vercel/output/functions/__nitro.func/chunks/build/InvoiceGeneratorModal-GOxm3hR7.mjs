import { g as __nuxt_component_0, L as __nuxt_component_2, f as __nuxt_component_0$2, d as useRoute } from './server.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_6 } from './Toggle-DLYZoy61.mjs';
import { _ as __nuxt_component_6$1 } from './Input-CkIGuQjB.mjs';
import { defineComponent, computed, reactive, ref, watch, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, createTextVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { z } from 'zod';
import { u as useDataManager } from './useDataManager-_ycBTlnZ.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
import { r as refreshCookie } from './cookie-CGcYVFcE.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InvoiceGeneratorModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    preselectedPartnerId: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const schema = z.object({
      partnerId: z.string().min(1, "Partner is required"),
      unitId: z.string().optional(),
      year: z.string().min(1, "Year is required"),
      month: z.string().min(1, "Month is required"),
      useCustomDates: z.boolean(),
      startDate: z.string().optional(),
      endDate: z.string().optional()
    }).refine((data) => {
      if (data.useCustomDates) {
        return data.startDate && data.endDate && new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    }, {
      message: "End date must be after start date when using custom dates",
      path: ["endDate"]
    });
    const now = /* @__PURE__ */ new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString();
    const state = reactive({
      partnerId: "",
      unitId: "",
      year: currentYear,
      month: currentMonth,
      useCustomDates: false,
      startDate: "",
      endDate: ""
    });
    const isGenerating = ref(false);
    const { partners, units, loadPartners, loadUnits, isLoading: dataLoading } = useDataManager();
    const { generateInvoice } = useApi();
    ref([]);
    const isLoading = computed(() => dataLoading.partners || dataLoading.units);
    const partnerOptions = computed(() => {
      if (!Array.isArray(partners.value)) return [];
      return partners.value.map((p) => ({ label: p.name, value: p.id }));
    });
    const availableUnits = computed(() => {
      if (!state.partnerId || !Array.isArray(units.value)) return [];
      return units.value.filter((unit) => unit && unit.partner_id === state.partnerId).map((unit) => ({ label: unit.name, value: unit.id }));
    });
    const yearOptions = computed(() => {
      const years = [];
      const currentYear2 = (/* @__PURE__ */ new Date()).getFullYear();
      for (let i = currentYear2 - 5; i <= currentYear2 + 2; i++) {
        years.push({ label: i.toString(), value: i.toString() });
      }
      return years.reverse();
    });
    const monthOptions = computed(() => {
      const months = [
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
      ];
      return months;
    });
    watch(() => state.partnerId, () => {
      state.unitId = "";
    });
    watch(() => props.modelValue, async (isOpen2) => {
      if (isOpen2) {
        await Promise.all([
          loadPartners(),
          loadUnits()
        ]);
      }
    }, { immediate: true });
    watch(() => props.preselectedPartnerId, (partnerId) => {
      if (partnerId) {
        state.partnerId = partnerId;
      }
    }, { immediate: true });
    const onSubmit = async () => {
      try {
        isGenerating.value = true;
        let startDate, endDate;
        if (state.useCustomDates) {
          startDate = state.startDate;
          endDate = state.endDate;
        } else {
          const year = parseInt(state.year);
          const month = parseInt(state.month);
          startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
          const lastDay = new Date(year, month, 0).getDate();
          endDate = `${year}-${month.toString().padStart(2, "0")}-${lastDay.toString().padStart(2, "0")}`;
        }
        const invoice = await generateInvoice(state.partnerId, startDate, endDate);
        const invoiceData = {
          partnerName: invoice.partner_name,
          period: invoice.period,
          orgSharePercentage: invoice.org_share_percentage,
          bookings: invoice.bookings.map((booking) => ({
            date: booking.date,
            endDate: booking.end_date,
            guestName: booking.guest_name,
            unitName: booking.unit_name,
            source: booking.booking_source_name,
            baseAmount: parseFloat(booking.base_amount),
            addons: parseFloat(booking.addons_total),
            total: parseFloat(booking.total_amount),
            paymentReceivedBy: booking.payment_received_by,
            actualAmountReceived: parseFloat(booking.total_amount),
            bookingStatus: booking.booking_status
          })),
          expenses: invoice.expenses.map((expense) => ({
            date: expense.date,
            unitName: expense.unit_name,
            type: expense.type,
            notes: expense.notes,
            amount: parseFloat(expense.amount)
          })),
          journalEntries: invoice.journal_entries.map((entry) => ({
            date: entry.date,
            type: entry.type,
            description: entry.description,
            reference: entry.reference,
            amount: parseFloat(entry.amount)
          }))
        };
        isOpen.value = false;
        const route = useRoute();
        if (route.path === "/accounting/invoices") {
          await refreshCookie("invoices-refresh", Date.now().toString());
        }
        const { notifySuccess } = useNotify();
        notifySuccess(`Invoice generated: ${invoice.invoice_number}`);
      } catch (error) {
        const { notifyError } = useNotify();
        notifyError("Failed to generate invoice");
      } finally {
        isGenerating.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = __nuxt_component_0;
      const _component_UCard = __nuxt_component_2;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_USelect = __nuxt_component_5;
      const _component_UToggle = __nuxt_component_6;
      const _component_UInput = __nuxt_component_6$1;
      const _component_UButton = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        modelValue: unref(isOpen),
        "onUpdate:modelValue": ($event) => isRef(isOpen) ? isOpen.value = $event : null
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Generate Invoice</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Generate Invoice")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UForm, {
                    schema: unref(schema),
                    state: unref(state),
                    onSubmit
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="space-y-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Partner",
                          name: "partnerId",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).partnerId,
                                "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                                options: unref(partnerOptions),
                                loading: unref(isLoading),
                                placeholder: "Select partner"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).partnerId,
                                  "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                                  options: unref(partnerOptions),
                                  loading: unref(isLoading),
                                  placeholder: "Select partner"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "loading"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Unit",
                          name: "unitId"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).unitId,
                                "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                options: unref(availableUnits),
                                disabled: !unref(state).partnerId || unref(isLoading),
                                loading: unref(isLoading),
                                placeholder: "All units (optional)"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).unitId,
                                  "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                  options: unref(availableUnits),
                                  disabled: !unref(state).partnerId || unref(isLoading),
                                  loading: unref(isLoading),
                                  placeholder: "All units (optional)"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled", "loading"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div class="grid grid-cols-2 gap-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Year",
                          name: "year",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).year,
                                "onUpdate:modelValue": ($event) => unref(state).year = $event,
                                options: unref(yearOptions)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).year,
                                  "onUpdate:modelValue": ($event) => unref(state).year = $event,
                                  options: unref(yearOptions)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Month",
                          name: "month",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelect, {
                                modelValue: unref(state).month,
                                "onUpdate:modelValue": ($event) => unref(state).month = $event,
                                options: unref(monthOptions)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).month,
                                  "onUpdate:modelValue": ($event) => unref(state).month = $event,
                                  options: unref(monthOptions)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Custom Date Range",
                          name: "useCustomDates"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UToggle, {
                                modelValue: unref(state).useCustomDates,
                                "onUpdate:modelValue": ($event) => unref(state).useCustomDates = $event
                              }, null, _parent5, _scopeId4));
                              _push5(`<span class="ml-3 text-sm text-gray-600 dark:text-gray-400"${_scopeId4}>${ssrInterpolate(unref(state).useCustomDates ? "Using custom date range" : "Using month/year selection")}</span>`);
                            } else {
                              return [
                                createVNode(_component_UToggle, {
                                  modelValue: unref(state).useCustomDates,
                                  "onUpdate:modelValue": ($event) => unref(state).useCustomDates = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("span", { class: "ml-3 text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(unref(state).useCustomDates ? "Using custom date range" : "Using month/year selection"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (unref(state).useCustomDates) {
                          _push4(`<div class="grid grid-cols-2 gap-4"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_UFormGroup, {
                            label: "Start Date",
                            name: "startDate"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_UInput, {
                                  modelValue: unref(state).startDate,
                                  "onUpdate:modelValue": ($event) => unref(state).startDate = $event,
                                  type: "date"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_UInput, {
                                    modelValue: unref(state).startDate,
                                    "onUpdate:modelValue": ($event) => unref(state).startDate = $event,
                                    type: "date"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_UFormGroup, {
                            label: "End Date",
                            name: "endDate"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_UInput, {
                                  modelValue: unref(state).endDate,
                                  "onUpdate:modelValue": ($event) => unref(state).endDate = $event,
                                  type: "date"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_UInput, {
                                    modelValue: unref(state).endDate,
                                    "onUpdate:modelValue": ($event) => unref(state).endDate = $event,
                                    type: "date"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="flex justify-end space-x-3 mt-6"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cancel`);
                            } else {
                              return [
                                createTextVNode("Cancel")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isGenerating)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Generate Invoice `);
                            } else {
                              return [
                                createTextVNode(" Generate Invoice ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "space-y-4" }, [
                            createVNode(_component_UFormGroup, {
                              label: "Partner",
                              name: "partnerId",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).partnerId,
                                  "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                                  options: unref(partnerOptions),
                                  loading: unref(isLoading),
                                  placeholder: "Select partner"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "loading"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Unit",
                              name: "unitId"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).unitId,
                                  "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                  options: unref(availableUnits),
                                  disabled: !unref(state).partnerId || unref(isLoading),
                                  loading: unref(isLoading),
                                  placeholder: "All units (optional)"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled", "loading"])
                              ]),
                              _: 1
                            }),
                            createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                              createVNode(_component_UFormGroup, {
                                label: "Year",
                                name: "year",
                                required: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).year,
                                    "onUpdate:modelValue": ($event) => unref(state).year = $event,
                                    options: unref(yearOptions)
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "Month",
                                name: "month",
                                required: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_USelect, {
                                    modelValue: unref(state).month,
                                    "onUpdate:modelValue": ($event) => unref(state).month = $event,
                                    options: unref(monthOptions)
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_UFormGroup, {
                              label: "Custom Date Range",
                              name: "useCustomDates"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UToggle, {
                                  modelValue: unref(state).useCustomDates,
                                  "onUpdate:modelValue": ($event) => unref(state).useCustomDates = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("span", { class: "ml-3 text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(unref(state).useCustomDates ? "Using custom date range" : "Using month/year selection"), 1)
                              ]),
                              _: 1
                            }),
                            unref(state).useCustomDates ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "grid grid-cols-2 gap-4"
                            }, [
                              createVNode(_component_UFormGroup, {
                                label: "Start Date",
                                name: "startDate"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UInput, {
                                    modelValue: unref(state).startDate,
                                    "onUpdate:modelValue": ($event) => unref(state).startDate = $event,
                                    type: "date"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UFormGroup, {
                                label: "End Date",
                                name: "endDate"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UInput, {
                                    modelValue: unref(state).endDate,
                                    "onUpdate:modelValue": ($event) => unref(state).endDate = $event,
                                    type: "date"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              })
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                            createVNode(_component_UButton, {
                              color: "gray",
                              variant: "ghost",
                              onClick: ($event) => isOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_component_UButton, {
                              type: "submit",
                              color: "primary",
                              loading: unref(isGenerating)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Generate Invoice ")
                              ]),
                              _: 1
                            }, 8, ["loading"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UForm, {
                      schema: unref(schema),
                      state: unref(state),
                      onSubmit
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "space-y-4" }, [
                          createVNode(_component_UFormGroup, {
                            label: "Partner",
                            name: "partnerId",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).partnerId,
                                "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                                options: unref(partnerOptions),
                                loading: unref(isLoading),
                                placeholder: "Select partner"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "loading"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Unit",
                            name: "unitId"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).unitId,
                                "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                                options: unref(availableUnits),
                                disabled: !unref(state).partnerId || unref(isLoading),
                                loading: unref(isLoading),
                                placeholder: "All units (optional)"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled", "loading"])
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                            createVNode(_component_UFormGroup, {
                              label: "Year",
                              name: "year",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).year,
                                  "onUpdate:modelValue": ($event) => unref(state).year = $event,
                                  options: unref(yearOptions)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "Month",
                              name: "month",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_USelect, {
                                  modelValue: unref(state).month,
                                  "onUpdate:modelValue": ($event) => unref(state).month = $event,
                                  options: unref(monthOptions)
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_UFormGroup, {
                            label: "Custom Date Range",
                            name: "useCustomDates"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UToggle, {
                                modelValue: unref(state).useCustomDates,
                                "onUpdate:modelValue": ($event) => unref(state).useCustomDates = $event
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode("span", { class: "ml-3 text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(unref(state).useCustomDates ? "Using custom date range" : "Using month/year selection"), 1)
                            ]),
                            _: 1
                          }),
                          unref(state).useCustomDates ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "grid grid-cols-2 gap-4"
                          }, [
                            createVNode(_component_UFormGroup, {
                              label: "Start Date",
                              name: "startDate"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).startDate,
                                  "onUpdate:modelValue": ($event) => unref(state).startDate = $event,
                                  type: "date"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, {
                              label: "End Date",
                              name: "endDate"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(state).endDate,
                                  "onUpdate:modelValue": ($event) => unref(state).endDate = $event,
                                  type: "date"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            onClick: ($event) => isOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            type: "submit",
                            color: "primary",
                            loading: unref(isGenerating)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Generate Invoice ")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["schema", "state"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Generate Invoice")
                ]),
                default: withCtx(() => [
                  createVNode(_component_UForm, {
                    schema: unref(schema),
                    state: unref(state),
                    onSubmit
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode(_component_UFormGroup, {
                          label: "Partner",
                          name: "partnerId",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(state).partnerId,
                              "onUpdate:modelValue": ($event) => unref(state).partnerId = $event,
                              options: unref(partnerOptions),
                              loading: unref(isLoading),
                              placeholder: "Select partner"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "loading"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Unit",
                          name: "unitId"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_USelect, {
                              modelValue: unref(state).unitId,
                              "onUpdate:modelValue": ($event) => unref(state).unitId = $event,
                              options: unref(availableUnits),
                              disabled: !unref(state).partnerId || unref(isLoading),
                              loading: unref(isLoading),
                              placeholder: "All units (optional)"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled", "loading"])
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                          createVNode(_component_UFormGroup, {
                            label: "Year",
                            name: "year",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).year,
                                "onUpdate:modelValue": ($event) => unref(state).year = $event,
                                options: unref(yearOptions)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "Month",
                            name: "month",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(state).month,
                                "onUpdate:modelValue": ($event) => unref(state).month = $event,
                                options: unref(monthOptions)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode(_component_UFormGroup, {
                          label: "Custom Date Range",
                          name: "useCustomDates"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UToggle, {
                              modelValue: unref(state).useCustomDates,
                              "onUpdate:modelValue": ($event) => unref(state).useCustomDates = $event
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode("span", { class: "ml-3 text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(unref(state).useCustomDates ? "Using custom date range" : "Using month/year selection"), 1)
                          ]),
                          _: 1
                        }),
                        unref(state).useCustomDates ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid grid-cols-2 gap-4"
                        }, [
                          createVNode(_component_UFormGroup, {
                            label: "Start Date",
                            name: "startDate"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(state).startDate,
                                "onUpdate:modelValue": ($event) => unref(state).startDate = $event,
                                type: "date"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, {
                            label: "End Date",
                            name: "endDate"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(state).endDate,
                                "onUpdate:modelValue": ($event) => unref(state).endDate = $event,
                                type: "date"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => isOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isGenerating)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Generate Invoice ")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ])
                    ]),
                    _: 1
                  }, 8, ["schema", "state"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partners/InvoiceGeneratorModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=InvoiceGeneratorModal-GOxm3hR7.mjs.map
