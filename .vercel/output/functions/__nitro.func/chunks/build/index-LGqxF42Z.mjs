import { d as useRoute, f as __nuxt_component_0$2, e as __nuxt_component_1$1, L as __nuxt_component_2, g as __nuxt_component_0, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_5 } from './Badge-hg3kqqXA.mjs';
import { _ as _sfc_main$1 } from './InvoiceGeneratorModal-GOxm3hR7.mjs';
import { _ as __nuxt_component_3 } from './Form-CoGrVFRC.mjs';
import { _ as __nuxt_component_4 } from './FormGroup-jqZJ_kV3.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_7 } from './Textarea-Bv7REKKo.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useGlobalCache } from './useGlobalCache-zS6YtHq1.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
import { u as useConfirm } from './useConfirm-E6nJ9sX9.mjs';
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
import './Select-C-fTWFr4.mjs';
import './useFormGroup-B3564yef.mjs';
import './Toggle-DLYZoy61.mjs';
import './form-DsUILy5F.mjs';
import './use-resolve-button-type-CgmJ7gVL.mjs';
import 'zod';
import './useDataManager-_ycBTlnZ.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const partnerId = route.params.id;
    const { partners, units, loadPartners, loadUnits } = useGlobalCache();
    const { updateUnit: apiUpdateUnit, deleteUnit: apiDeleteUnit, getInvoices } = useApi();
    const partnerInvoices = ref([]);
    const { notifySuccess, notifyError } = useNotify();
    const isLoading = ref(true);
    const showInvoiceModal = ref(false);
    const showEditModal = ref(false);
    const isUpdating = ref(false);
    const editingUnit = ref(null);
    const editForm = reactive({
      name: "",
      location: "",
      notes: ""
    });
    const partner = computed(() => {
      if (isLoading.value || !partnerId || !Array.isArray(partners.value)) return null;
      const found = partners.value.find((p) => p.id === partnerId) || null;
      return found;
    });
    const partnerUnits = computed(() => {
      if (isLoading.value || !partnerId || !Array.isArray(units.value)) return [];
      return units.value.filter((u) => (u.partnerId || u.partner_id) === partnerId) || [];
    });
    const getPartnerStatusText = (status) => {
      const statusMap = {
        "draft": "Being Prepared",
        "finalized": "Almost Ready",
        "sent": "For Your Review",
        "paid": "All Done \u2713"
      };
      return statusMap[status] || status;
    };
    const getPartnerStatusColor = (status) => {
      const colorMap = {
        "draft": "gray",
        "finalized": "blue",
        "sent": "orange",
        "paid": "green"
      };
      return colorMap[status] || "gray";
    };
    const getPartnerStatusDescription = (status) => {
      const descriptionMap = {
        "draft": "We're working on your invoice - sit tight!",
        "finalized": "Your invoice is ready and being finalized",
        "sent": "Please review your invoice and let us know if everything looks good",
        "paid": "Thank you! This invoice is complete"
      };
      return descriptionMap[status] || "Status unknown";
    };
    const viewInvoice = (invoice) => {
      navigateTo(`/accounting/invoices/${invoice.id}`);
    };
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).toLocaleDateString();
      } catch {
        return "Invalid Date";
      }
    };
    const editUnit = (unit) => {
      editingUnit.value = unit;
      editForm.name = unit.name;
      editForm.location = unit.location || "";
      editForm.notes = unit.notes || "";
      showEditModal.value = true;
    };
    const updateUnit = async () => {
      if (!editingUnit.value) return;
      try {
        isUpdating.value = true;
        await apiUpdateUnit(editingUnit.value.id, editForm);
        await loadUnits();
        showEditModal.value = false;
        notifySuccess(`${editForm.name} has been updated successfully`);
      } catch (error) {
        notifyError("Failed to update unit");
      } finally {
        isUpdating.value = false;
      }
    };
    const deleteUnitConfirm = async (unit) => {
      const { confirm } = useConfirm();
      if (await confirm(`Are you sure you want to delete "${unit.name}"?`, {
        title: "Delete Unit",
        confirmText: "Delete",
        confirmColor: "red"
      })) {
        try {
          await apiDeleteUnit(unit.id);
          await loadUnits();
          notifySuccess(`${unit.name} has been deleted`);
        } catch (error) {
          notifyError("Failed to delete unit");
        }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UBadge = __nuxt_component_5;
      const _component_PartnersInvoiceGeneratorModal = _sfc_main$1;
      const _component_UModal = __nuxt_component_0;
      const _component_UForm = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_4;
      const _component_UInput = __nuxt_component_6;
      const _component_UTextarea = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs))}>`);
      if (unref(isLoading)) {
        _push(`<div class="flex justify-center py-12"><div class="text-gray-500 dark:text-gray-400">Loading...</div></div>`);
      } else if (unref(partner)) {
        _push(`<div class="space-y-6"><div class="flex justify-between items-start"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(partner).name)}</h1><p class="text-gray-600 dark:text-gray-400">Partner Profile</p></div><div class="flex space-x-3">`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "gray",
          variant: "ghost",
          to: "/partners"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Back to Partners`);
            } else {
              return [
                createTextVNode("Back to Partners")
              ];
            }
          }),
          _: 1
        }, _parent));
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
          to: `/partners/${unref(partnerId)}/add-unit`,
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add Unit`);
            } else {
              return [
                createTextVNode("Add Unit")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Partner Information</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-lg font-semibold" }, "Partner Information")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Name</label><p class="text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(partner).name)}</p></div>`);
              if (unref(partner).email) {
                _push2(`<div${_scopeId}><label class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Email</label><p class="text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(partner).email)}</p></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div${_scopeId}><label class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Share Percentage</label><p class="text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(partner).org_share_percentage)}%</p></div>`);
              if (unref(partner).services && unref(partner).services.length) {
                _push2(`<div${_scopeId}><label class="text-sm font-medium text-gray-600 dark:text-gray-400"${_scopeId}>Services</label><div class="flex flex-wrap gap-2 mt-1"${_scopeId}><!--[-->`);
                ssrRenderList(unref(partner).services, (service) => {
                  _push2(`<span class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"${_scopeId}>${ssrInterpolate(typeof service === "string" ? service : service.name)}</span>`);
                });
                _push2(`<!--]--></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Name"),
                    createVNode("p", { class: "text-gray-900 dark:text-white" }, toDisplayString(unref(partner).name), 1)
                  ]),
                  unref(partner).email ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("label", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Email"),
                    createVNode("p", { class: "text-gray-900 dark:text-white" }, toDisplayString(unref(partner).email), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", null, [
                    createVNode("label", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Share Percentage"),
                    createVNode("p", { class: "text-gray-900 dark:text-white" }, toDisplayString(unref(partner).org_share_percentage) + "%", 1)
                  ]),
                  unref(partner).services && unref(partner).services.length ? (openBlock(), createBlock("div", { key: 1 }, [
                    createVNode("label", { class: "text-sm font-medium text-gray-600 dark:text-gray-400" }, "Services"),
                    createVNode("div", { class: "flex flex-wrap gap-2 mt-1" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(partner).services, (service) => {
                        return openBlock(), createBlock("span", {
                          key: service.id || service,
                          class: "inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
                        }, toDisplayString(typeof service === "string" ? service : service.name), 1);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex justify-between items-center"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Recent Invoices</h3>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/accounting/invoices",
                size: "sm",
                color: "gray",
                variant: "outline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`View All`);
                  } else {
                    return [
                      createTextVNode("View All")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex justify-between items-center" }, [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Recent Invoices"),
                  createVNode(_component_UButton, {
                    to: "/accounting/invoices",
                    size: "sm",
                    color: "gray",
                    variant: "outline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("View All")
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(partnerInvoices).length) {
                _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
                ssrRenderList(unref(partnerInvoices).slice(0, 3), (invoice) => {
                  _push2(`<div class="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"${_scopeId}><div class="flex justify-between items-start"${_scopeId}><div class="flex-1"${_scopeId}><div class="flex items-center space-x-3"${_scopeId}><h4 class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(invoice.invoice_number)}</h4>`);
                  _push2(ssrRenderComponent(_component_UBadge, {
                    color: getPartnerStatusColor(invoice.status),
                    size: "xs"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(getPartnerStatusText(invoice.status))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(getPartnerStatusText(invoice.status)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div><p class="text-sm text-gray-600 dark:text-gray-400 mt-1"${_scopeId}>${ssrInterpolate(invoice.period)} \u2022 \u20B1${ssrInterpolate(parseFloat(invoice.total_amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 }))}</p><p class="text-sm text-gray-500 dark:text-gray-500 mt-1"${_scopeId}>${ssrInterpolate(getPartnerStatusDescription(invoice.status))}</p></div><div class="flex space-x-2"${_scopeId}>`);
                  if (invoice.status === "sent") {
                    _push2(ssrRenderComponent(_component_UButton, {
                      onClick: ($event) => viewInvoice(invoice),
                      size: "sm",
                      color: "primary"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(` Review Now `);
                        } else {
                          return [
                            createTextVNode(" Review Now ")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else {
                    _push2(ssrRenderComponent(_component_UButton, {
                      onClick: ($event) => viewInvoice(invoice),
                      size: "sm",
                      color: "gray",
                      variant: "outline"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(` View `);
                        } else {
                          return [
                            createTextVNode(" View ")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  }
                  _push2(`</div></div></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<div class="text-center py-8"${_scopeId}><p class="text-gray-500 dark:text-gray-400 mb-4"${_scopeId}>No invoices generated yet</p><p class="text-sm text-gray-400 dark:text-gray-500"${_scopeId}>Invoices will appear here once MetroBNB generates them</p></div>`);
              }
            } else {
              return [
                unref(partnerInvoices).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-4"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(partnerInvoices).slice(0, 3), (invoice) => {
                    return openBlock(), createBlock("div", {
                      key: invoice.id,
                      class: "p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    }, [
                      createVNode("div", { class: "flex justify-between items-start" }, [
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("div", { class: "flex items-center space-x-3" }, [
                            createVNode("h4", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(invoice.invoice_number), 1),
                            createVNode(_component_UBadge, {
                              color: getPartnerStatusColor(invoice.status),
                              size: "xs"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(getPartnerStatusText(invoice.status)), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"])
                          ]),
                          createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mt-1" }, toDisplayString(invoice.period) + " \u2022 \u20B1" + toDisplayString(parseFloat(invoice.total_amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })), 1),
                          createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-500 mt-1" }, toDisplayString(getPartnerStatusDescription(invoice.status)), 1)
                        ]),
                        createVNode("div", { class: "flex space-x-2" }, [
                          invoice.status === "sent" ? (openBlock(), createBlock(_component_UButton, {
                            key: 0,
                            onClick: ($event) => viewInvoice(invoice),
                            size: "sm",
                            color: "primary"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Review Now ")
                            ]),
                            _: 2
                          }, 1032, ["onClick"])) : (openBlock(), createBlock(_component_UButton, {
                            key: 1,
                            onClick: ($event) => viewInvoice(invoice),
                            size: "sm",
                            color: "gray",
                            variant: "outline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" View ")
                            ]),
                            _: 2
                          }, 1032, ["onClick"]))
                        ])
                      ])
                    ]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-8"
                }, [
                  createVNode("p", { class: "text-gray-500 dark:text-gray-400 mb-4" }, "No invoices generated yet"),
                  createVNode("p", { class: "text-sm text-gray-400 dark:text-gray-500" }, "Invoices will appear here once MetroBNB generates them")
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex justify-between items-center"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Units (${ssrInterpolate(unref(partnerUnits).length)})</h3>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/partners/${unref(partnerId)}/add-unit`,
                size: "sm",
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add Unit`);
                  } else {
                    return [
                      createTextVNode("Add Unit")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex justify-between items-center" }, [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Units (" + toDisplayString(unref(partnerUnits).length) + ")", 1),
                  createVNode(_component_UButton, {
                    to: `/partners/${unref(partnerId)}/add-unit`,
                    size: "sm",
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add Unit")
                    ]),
                    _: 1
                  }, 8, ["to"])
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(partnerUnits).length) {
                _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
                ssrRenderList(unref(partnerUnits), (unit) => {
                  _push2(`<div class="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"${_scopeId}><div class="flex justify-between items-start"${_scopeId}><div class="flex-1"${_scopeId}><h4 class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unit.name)}</h4>`);
                  if (unit.location) {
                    _push2(`<p class="text-sm text-gray-600 dark:text-gray-400 mt-1"${_scopeId}> \u{1F4CD} ${ssrInterpolate(unit.location)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unit.notes) {
                    _push2(`<p class="text-sm text-gray-600 dark:text-gray-400 mt-1"${_scopeId}>${ssrInterpolate(unit.notes)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<p class="text-xs text-gray-500 dark:text-gray-500 mt-2"${_scopeId}> Added ${ssrInterpolate(formatDate(unit.createdAt))}</p></div><div class="flex space-x-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UButton, {
                    onClick: ($event) => editUnit(unit),
                    size: "sm",
                    color: "gray",
                    variant: "ghost"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-pencil-square" }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(_component_UIcon, { name: "i-heroicons-pencil-square" })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(ssrRenderComponent(_component_UButton, {
                    onClick: ($event) => deleteUnitConfirm(unit),
                    size: "sm",
                    color: "red",
                    variant: "ghost"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-trash" }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(_component_UIcon, { name: "i-heroicons-trash" })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div></div></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<div class="text-center py-8"${_scopeId}><p class="text-gray-500 dark:text-gray-400 mb-4"${_scopeId}>No units added yet</p>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  to: `/partners/${unref(partnerId)}/add-unit`,
                  color: "primary"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Add First Unit`);
                    } else {
                      return [
                        createTextVNode("Add First Unit")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              }
            } else {
              return [
                unref(partnerUnits).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-4"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(partnerUnits), (unit) => {
                    return openBlock(), createBlock("div", {
                      key: unit.id,
                      class: "p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    }, [
                      createVNode("div", { class: "flex justify-between items-start" }, [
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("h4", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unit.name), 1),
                          unit.location ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-gray-600 dark:text-gray-400 mt-1"
                          }, " \u{1F4CD} " + toDisplayString(unit.location), 1)) : createCommentVNode("", true),
                          unit.notes ? (openBlock(), createBlock("p", {
                            key: 1,
                            class: "text-sm text-gray-600 dark:text-gray-400 mt-1"
                          }, toDisplayString(unit.notes), 1)) : createCommentVNode("", true),
                          createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-500 mt-2" }, " Added " + toDisplayString(formatDate(unit.createdAt)), 1)
                        ]),
                        createVNode("div", { class: "flex space-x-2" }, [
                          createVNode(_component_UButton, {
                            onClick: ($event) => editUnit(unit),
                            size: "sm",
                            color: "gray",
                            variant: "ghost"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UIcon, { name: "i-heroicons-pencil-square" })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          createVNode(_component_UButton, {
                            onClick: ($event) => deleteUnitConfirm(unit),
                            size: "sm",
                            color: "red",
                            variant: "ghost"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UIcon, { name: "i-heroicons-trash" })
                            ]),
                            _: 2
                          }, 1032, ["onClick"])
                        ])
                      ])
                    ]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-8"
                }, [
                  createVNode("p", { class: "text-gray-500 dark:text-gray-400 mb-4" }, "No units added yet"),
                  createVNode(_component_UButton, {
                    to: `/partners/${unref(partnerId)}/add-unit`,
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add First Unit")
                    ]),
                    _: 1
                  }, 8, ["to"])
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (!unref(isLoading)) {
        _push(ssrRenderComponent(_component_UCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-center py-8"${_scopeId}><p class="text-gray-500 dark:text-gray-400"${_scopeId}>Partner not found</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/partners",
                class: "mt-4"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Back to Partners`);
                  } else {
                    return [
                      createTextVNode("Back to Partners")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "text-center py-8" }, [
                  createVNode("p", { class: "text-gray-500 dark:text-gray-400" }, "Partner not found"),
                  createVNode(_component_UButton, {
                    to: "/partners",
                    class: "mt-4"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Back to Partners")
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
        "onUpdate:modelValue": ($event) => isRef(showInvoiceModal) ? showInvoiceModal.value = $event : null,
        "preselected-partner-id": unref(partnerId)
      }, null, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showEditModal),
        "onUpdate:modelValue": ($event) => isRef(showEditModal) ? showEditModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="text-lg font-semibold"${_scopeId2}>Edit Unit</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg font-semibold" }, "Edit Unit")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UForm, {
                    state: unref(editForm),
                    onSubmit: updateUnit
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="space-y-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, {
                          label: "Unit Name",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(editForm).name,
                                "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                                placeholder: "Enter unit name"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(editForm).name,
                                  "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                                  placeholder: "Enter unit name"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, { label: "Location" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UTextarea, {
                                modelValue: unref(editForm).location,
                                "onUpdate:modelValue": ($event) => unref(editForm).location = $event,
                                placeholder: "Enter unit location"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(editForm).location,
                                  "onUpdate:modelValue": ($event) => unref(editForm).location = $event,
                                  placeholder: "Enter unit location"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, { label: "Notes" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UTextarea, {
                                modelValue: unref(editForm).notes,
                                "onUpdate:modelValue": ($event) => unref(editForm).notes = $event,
                                placeholder: "Additional notes"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(editForm).notes,
                                  "onUpdate:modelValue": ($event) => unref(editForm).notes = $event,
                                  placeholder: "Additional notes"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="flex justify-end space-x-3 mt-6"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => showEditModal.value = false
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
                          loading: unref(isUpdating)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Update Unit`);
                            } else {
                              return [
                                createTextVNode("Update Unit")
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
                              label: "Unit Name",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UInput, {
                                  modelValue: unref(editForm).name,
                                  "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                                  placeholder: "Enter unit name"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, { label: "Location" }, {
                              default: withCtx(() => [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(editForm).location,
                                  "onUpdate:modelValue": ($event) => unref(editForm).location = $event,
                                  placeholder: "Enter unit location"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UFormGroup, { label: "Notes" }, {
                              default: withCtx(() => [
                                createVNode(_component_UTextarea, {
                                  modelValue: unref(editForm).notes,
                                  "onUpdate:modelValue": ($event) => unref(editForm).notes = $event,
                                  placeholder: "Additional notes"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                            createVNode(_component_UButton, {
                              color: "gray",
                              variant: "ghost",
                              onClick: ($event) => showEditModal.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_component_UButton, {
                              type: "submit",
                              color: "primary",
                              loading: unref(isUpdating)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Update Unit")
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
                      state: unref(editForm),
                      onSubmit: updateUnit
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "space-y-4" }, [
                          createVNode(_component_UFormGroup, {
                            label: "Unit Name",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(editForm).name,
                                "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                                placeholder: "Enter unit name"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "Location" }, {
                            default: withCtx(() => [
                              createVNode(_component_UTextarea, {
                                modelValue: unref(editForm).location,
                                "onUpdate:modelValue": ($event) => unref(editForm).location = $event,
                                placeholder: "Enter unit location"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "Notes" }, {
                            default: withCtx(() => [
                              createVNode(_component_UTextarea, {
                                modelValue: unref(editForm).notes,
                                "onUpdate:modelValue": ($event) => unref(editForm).notes = $event,
                                placeholder: "Additional notes"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            onClick: ($event) => showEditModal.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            type: "submit",
                            color: "primary",
                            loading: unref(isUpdating)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Update Unit")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["state"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Edit Unit")
                ]),
                default: withCtx(() => [
                  createVNode(_component_UForm, {
                    state: unref(editForm),
                    onSubmit: updateUnit
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode(_component_UFormGroup, {
                          label: "Unit Name",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(editForm).name,
                              "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                              placeholder: "Enter unit name"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, { label: "Location" }, {
                          default: withCtx(() => [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(editForm).location,
                              "onUpdate:modelValue": ($event) => unref(editForm).location = $event,
                              placeholder: "Enter unit location"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, { label: "Notes" }, {
                          default: withCtx(() => [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(editForm).notes,
                              "onUpdate:modelValue": ($event) => unref(editForm).notes = $event,
                              placeholder: "Additional notes"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "flex justify-end space-x-3 mt-6" }, [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          onClick: ($event) => showEditModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          color: "primary",
                          loading: unref(isUpdating)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Update Unit")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ])
                    ]),
                    _: 1
                  }, 8, ["state"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-LGqxF42Z.mjs.map
