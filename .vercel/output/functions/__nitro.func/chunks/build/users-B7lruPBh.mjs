import { f as __nuxt_component_0$2, e as __nuxt_component_1$1, g as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { _ as __nuxt_component_5 } from './Select-C-fTWFr4.mjs';
import { _ as __nuxt_component_6$1 } from './Dropdown-rKaqrBy2.mjs';
import { _ as __nuxt_component_8 } from './Checkbox-CvybKiXl.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, isRef, createBlock, createCommentVNode, openBlock, toDisplayString, withModifiers, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { debounce } from 'lodash-es';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useApi } from './api-BDnKztVE.mjs';
import { u as useApiResponse } from './useApiResponse-BHNeCLLh.mjs';
import { u as useConfirm } from './useConfirm-E6nJ9sX9.mjs';
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
import './use-resolve-button-type-CgmJ7gVL.mjs';
import './usePopper-DZihrI_3.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "users",
  __ssrInlineRender: true,
  setup(__props) {
    const { user: currentUser } = useAuth();
    const { getPartners, getUserList, createUser, regeneratePassword, deleteUser } = useApi();
    const { extractData } = useApiResponse();
    const loading = ref(false);
    const showCreateModal = ref(false);
    const userFormError = ref("");
    const showSuccessModal = ref(false);
    const showPasswordModal = ref(false);
    const editingUser = ref(null);
    const saving = ref(false);
    const createdUserData = ref(null);
    const regeneratedPasswordData = ref(null);
    const filters = ref({
      search: "",
      role: ""
    });
    const userForm = ref({
      name: "",
      email: "",
      role: ""
    });
    watch(() => userForm.value.email, () => {
      if (userFormError.value) {
        userFormError.value = "";
      }
    });
    const selectedPartners = ref([]);
    const partners = ref([]);
    const roleOptions = [
      { label: "Manager", value: "manager" },
      { label: "Staff", value: "staff" },
      { label: "Partner", value: "partner" }
    ];
    const users = ref([]);
    const canCreateUsers = computed(() => {
      var _a;
      const role = (_a = currentUser.value) == null ? void 0 : _a.role;
      return ["admin", "owner"].includes(role);
    });
    const canEditUser = (user) => {
      var _a, _b;
      const role = (_a = currentUser.value) == null ? void 0 : _a.role;
      if (!role) return false;
      if (["owner", "admin"].includes(role)) {
        return !["owner", "admin"].includes(user.role) || user.id === ((_b = currentUser.value) == null ? void 0 : _b.id);
      }
      if (role === "manager") {
        return ["staff", "partner"].includes(user.role);
      }
      return false;
    };
    const canDeleteUser = (user) => {
      var _a, _b;
      const role = (_a = currentUser.value) == null ? void 0 : _a.role;
      return ["owner", "admin"].includes(role) && !["owner", "admin"].includes(user.role) && user.id !== ((_b = currentUser.value) == null ? void 0 : _b.id);
    };
    const canRegeneratePassword = (user) => {
      var _a, _b;
      const role = (_a = currentUser.value) == null ? void 0 : _a.role;
      return ["owner", "admin"].includes(role) && user.id !== ((_b = currentUser.value) == null ? void 0 : _b.id);
    };
    const getRoleClass = (role) => {
      const classes = {
        admin: "bg-purple-100 text-purple-800",
        manager: "bg-blue-100 text-blue-800",
        staff: "bg-green-100 text-green-800",
        partner: "bg-yellow-100 text-yellow-800"
      };
      return classes[role] || "bg-gray-100 text-gray-800";
    };
    const applyFilters = () => {
    };
    const debouncedSearch = debounce(() => {
    }, 300);
    watch(showCreateModal, async (isOpen) => {
      if (isOpen) {
        await loadPartners();
      }
    });
    const editUser = (user) => {
      editingUser.value = user;
      userForm.value = {
        name: user.name,
        email: user.email,
        role: user.role
      };
      selectedPartners.value = user.accessible_partners || [];
      showCreateModal.value = true;
    };
    const regeneratePasswordAction = async (user) => {
      var _a, _b;
      const { confirm } = useConfirm();
      if (await confirm(`Regenerate password for ${user.name}?

This will create a new temporary password that the user must change on next login.`, {
        title: "Regenerate Password",
        confirmText: "Regenerate",
        confirmColor: "orange"
      })) {
        try {
          const response = await regeneratePassword(user.id);
          if (response && (response.email || ((_a = response.data) == null ? void 0 : _a.email))) {
            const responseData = response.data || response;
            regeneratedPasswordData.value = {
              email: responseData.email,
              temporaryPassword: responseData.temporary_password,
              requiresPasswordChange: responseData.requires_password_change || true
            };
            showPasswordModal.value = true;
            await loadUsers();
            const { notifySuccess } = useNotify();
            notifySuccess(`Password regenerated for ${user.name}`);
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error("Error regenerating password:", error);
          const { notifyError } = useNotify();
          const errorMessage = ((_b = error.message) == null ? void 0 : _b.includes("admin/owner")) ? "Only admin/owner can regenerate passwords" : `Failed to regenerate password: ${error.message || "Unknown error"}`;
          notifyError(errorMessage);
        }
      }
    };
    const deleteUserAction = async (user) => {
      var _a;
      const { confirm } = useConfirm();
      if (await confirm(`Are you sure you want to delete ${user.name}?`, {
        title: "Delete User",
        confirmText: "Delete",
        confirmColor: "red"
      })) {
        try {
          const response = await deleteUser(user.id);
          if (response.success) {
            const { notifySuccess } = useNotify();
            notifySuccess(`User ${user.name} deleted successfully`);
            await loadUsers();
          } else {
            throw new Error(response.message || "Failed to delete user");
          }
        } catch (error) {
          const { notifyError } = useNotify();
          const errorMessage = ((_a = error.message) == null ? void 0 : _a.includes("admin/owner")) ? "Only admin/owner can delete users" : `Failed to delete user: ${error.message || "Unknown error"}`;
          notifyError(errorMessage);
        }
      }
    };
    const closeModal = () => {
      showCreateModal.value = false;
      userFormError.value = "";
      editingUser.value = null;
      userForm.value = {
        name: "",
        email: "",
        role: ""
      };
      selectedPartners.value = [];
    };
    const loadPartners = async () => {
      try {
        const result = await getPartners();
        partners.value = extractData(result);
      } catch (error) {
        partners.value = [];
        const { notifyError } = useNotify();
        notifyError(`Failed to load partners: ${error.message || "Unknown error"}`);
      }
    };
    const loadUsers = async () => {
      try {
        loading.value = true;
        const result = await getUserList();
        users.value = extractData(result);
      } catch (error) {
        users.value = [];
        const { notifyError } = useNotify();
        notifyError(`Failed to load users: ${error.message || "Unknown error"}`);
      } finally {
        loading.value = false;
      }
    };
    const getUserActions = (user) => {
      const actions = [];
      if (canEditUser(user)) {
        actions.push([{
          label: "Edit User",
          icon: "i-heroicons-pencil-square",
          click: () => editUser(user)
        }]);
      }
      if (canRegeneratePassword(user)) {
        actions.push([{
          label: "Reset Password",
          icon: "i-heroicons-key",
          click: () => regeneratePasswordAction(user)
        }]);
      }
      if (canDeleteUser(user)) {
        actions.push([{
          label: "Delete User",
          icon: "i-heroicons-trash",
          click: () => deleteUserAction(user)
        }]);
      }
      return actions;
    };
    const copyToClipboard = async (text) => {
      try {
        await (void 0).clipboard.writeText(text);
        const { notifySuccess } = useNotify();
        notifySuccess("Copied to clipboard!");
      } catch (error) {
        const { notifyError } = useNotify();
        notifyError("Failed to copy to clipboard");
      }
    };
    const handleUserSubmit = async () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      userFormError.value = "";
      saving.value = true;
      try {
        const userData = {
          name: userForm.value.name,
          email: userForm.value.email,
          role: userForm.value.role,
          partner_ids: selectedPartners.value
        };
        if (editingUser.value) {
          throw new Error("User update not implemented yet");
        } else {
          const response = await createUser({
            email: userData.email,
            name: userData.name,
            role: userData.role,
            accessible_partners: selectedPartners.value
          });
          if (response && (response.email || ((_a = response.data) == null ? void 0 : _a.email) || response.success)) {
            const responseData = response.data || response;
            createdUserData.value = {
              email: responseData.email,
              temporaryPassword: responseData.temporary_password,
              message: responseData.message || "User must change password on first login."
            };
            closeModal();
            showSuccessModal.value = true;
            await loadUsers();
            const { notifySuccess } = useNotify();
            notifySuccess(`User ${responseData.email} created successfully`);
          } else {
            throw new Error("Invalid response format");
          }
        }
      } catch (error) {
        let errorMessage = "Failed to save user";
        if ((_c = (_b = error.data) == null ? void 0 : _b.error) == null ? void 0 : _c.message) {
          errorMessage = error.data.error.message;
        } else if (((_d = error.message) == null ? void 0 : _d.includes("User already exists")) || ((_e = error.message) == null ? void 0 : _e.includes("email_exists"))) {
          errorMessage = `A user with email "${userForm.value.email}" already exists. Please use a different email address.`;
        } else if ((_f = error.message) == null ? void 0 : _f.includes("422")) {
          errorMessage = "Invalid user data. Please check all fields and try again.";
        } else if (((_g = error.message) == null ? void 0 : _g.includes("403")) || ((_h = error.message) == null ? void 0 : _h.includes("unauthorized"))) {
          errorMessage = "You do not have permission to create users.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        userFormError.value = errorMessage;
      } finally {
        saving.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_6;
      const _component_USelect = __nuxt_component_5;
      const _component_UDropdown = __nuxt_component_6$1;
      const _component_UModal = __nuxt_component_0;
      const _component_UCheckbox = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 space-y-6" }, _attrs))}><div class="flex justify-between items-center"><h1 class="text-2xl font-bold">User Management</h1>`);
      if (unref(canCreateUsers)) {
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
              _push2(` Add User `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-heroicons-plus",
                  class: "mr-2"
                }),
                createTextVNode(" Add User ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"><div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).search,
        "onUpdate:modelValue": ($event) => unref(filters).search = $event,
        placeholder: "Search users...",
        onInput: unref(debouncedSearch)
      }, null, _parent));
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(filters).role,
        "onUpdate:modelValue": ($event) => unref(filters).role = $event,
        options: roleOptions,
        placeholder: "All Roles",
        onChange: applyFilters
      }, null, _parent));
      _push(`</div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "animate-spin h-6 w-6 mx-auto mb-2"
        }, null, _parent));
        _push(` Loading users... </div>`);
      } else {
        _push(`<table class="w-full"><thead class="bg-gray-50 dark:bg-gray-700"><tr><th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th><th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Role</th><th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Partner Access</th><th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th><th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`);
        ssrRenderList(unref(users), (user) => {
          var _a;
          _push(`<tr><td class="px-4 py-3"><div class="flex items-center"><div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-user",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</div><div><div class="font-medium text-gray-900 dark:text-white">${ssrInterpolate(user.name)}</div><div class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(user.email)}</div></div></div></td><td class="px-4 py-3"><span class="${ssrRenderClass([getRoleClass(user.role), "px-2 py-1 rounded-full text-xs font-medium capitalize"])}">${ssrInterpolate(user.role)}</span></td><td class="px-4 py-3">`);
          if ((_a = user.accessible_partners) == null ? void 0 : _a.length) {
            _push(`<div class="flex flex-wrap gap-1"><!--[-->`);
            ssrRenderList(user.accessible_partners.slice(0, 2), (partner) => {
              _push(`<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">${ssrInterpolate(partner.name)}</span>`);
            });
            _push(`<!--]-->`);
            if (user.accessible_partners.length > 2) {
              _push(`<span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"> +${ssrInterpolate(user.accessible_partners.length - 2)} more </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<span class="text-gray-500 dark:text-gray-400 text-sm">${ssrInterpolate(user.partner_access_summary || "All partners")}</span>`);
          }
          _push(`</td><td class="px-4 py-3"><span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"> Active </span></td><td class="px-4 py-3">`);
          _push(ssrRenderComponent(_component_UDropdown, {
            items: getUserActions(user)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "gray",
                  variant: "ghost",
                  icon: "i-heroicons-ellipsis-horizontal",
                  size: "sm"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    icon: "i-heroicons-ellipsis-horizontal",
                    size: "sm"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      if (!unref(loading) && unref(users).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500 dark:text-gray-400"> No users found </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showPasswordModal),
        "onUpdate:modelValue": ($event) => isRef(showPasswordModal) ? showPasswordModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><div class="text-center"${_scopeId}><div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-key",
              class: "h-6 w-6 text-orange-600"
            }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"${_scopeId}> Password Regenerated Successfully! </h3>`);
            if (unref(regeneratedPasswordData)) {
              _push2(`<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left"${_scopeId}><div class="space-y-3"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>User Email</label><div class="flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2"${_scopeId}><span class="font-mono text-sm"${_scopeId}>${ssrInterpolate(unref(regeneratedPasswordData).email)}</span>`);
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: ($event) => copyToClipboard(unref(regeneratedPasswordData).email),
                size: "xs",
                variant: "ghost"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-clipboard" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UIcon, { name: "i-heroicons-clipboard" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>New Temporary Password</label><div class="flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2"${_scopeId}><span class="font-mono text-sm font-bold text-red-600"${_scopeId}>${ssrInterpolate(unref(regeneratedPasswordData).temporaryPassword)}</span>`);
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: ($event) => copyToClipboard(unref(regeneratedPasswordData).temporaryPassword),
                size: "xs",
                variant: "ghost"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-clipboard" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UIcon, { name: "i-heroicons-clipboard" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div><div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded"${_scopeId}><div class="flex items-start"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-exclamation-triangle",
                class: "h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5"
              }, null, _parent2, _scopeId));
              _push2(`<div class="text-sm text-yellow-700 dark:text-yellow-300"${_scopeId}><p class="font-medium mb-1"${_scopeId}>Important:</p><p${_scopeId}>The user must change their password on next login.</p><p class="mt-2"${_scopeId}>Please share this temporary password securely with the user.</p></div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => showPasswordModal.value = false,
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Got it `);
                } else {
                  return [
                    createTextVNode(" Got it ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("div", { class: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-key",
                      class: "h-6 w-6 text-orange-600"
                    })
                  ]),
                  createVNode("h3", { class: "text-lg font-semibold mb-4 text-gray-900 dark:text-white" }, " Password Regenerated Successfully! "),
                  unref(regeneratedPasswordData) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left"
                  }, [
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "User Email"),
                        createVNode("div", { class: "flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2" }, [
                          createVNode("span", { class: "font-mono text-sm" }, toDisplayString(unref(regeneratedPasswordData).email), 1),
                          createVNode(_component_UButton, {
                            onClick: ($event) => copyToClipboard(unref(regeneratedPasswordData).email),
                            size: "xs",
                            variant: "ghost"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UIcon, { name: "i-heroicons-clipboard" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "New Temporary Password"),
                        createVNode("div", { class: "flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2" }, [
                          createVNode("span", { class: "font-mono text-sm font-bold text-red-600" }, toDisplayString(unref(regeneratedPasswordData).temporaryPassword), 1),
                          createVNode(_component_UButton, {
                            onClick: ($event) => copyToClipboard(unref(regeneratedPasswordData).temporaryPassword),
                            size: "xs",
                            variant: "ghost"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UIcon, { name: "i-heroicons-clipboard" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded" }, [
                      createVNode("div", { class: "flex items-start" }, [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-exclamation-triangle",
                          class: "h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5"
                        }),
                        createVNode("div", { class: "text-sm text-yellow-700 dark:text-yellow-300" }, [
                          createVNode("p", { class: "font-medium mb-1" }, "Important:"),
                          createVNode("p", null, "The user must change their password on next login."),
                          createVNode("p", { class: "mt-2" }, "Please share this temporary password securely with the user.")
                        ])
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode(_component_UButton, {
                    onClick: ($event) => showPasswordModal.value = false,
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Got it ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showSuccessModal),
        "onUpdate:modelValue": ($event) => isRef(showSuccessModal) ? showSuccessModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><div class="text-center"${_scopeId}><div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-check",
              class: "h-6 w-6 text-green-600"
            }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"${_scopeId}> User Created Successfully! </h3>`);
            if (unref(createdUserData)) {
              _push2(`<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left"${_scopeId}><div class="space-y-3"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>Email</label><div class="flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2"${_scopeId}><span class="font-mono text-sm"${_scopeId}>${ssrInterpolate(unref(createdUserData).email)}</span>`);
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: ($event) => copyToClipboard(unref(createdUserData).email),
                size: "xs",
                variant: "ghost"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-clipboard" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UIcon, { name: "i-heroicons-clipboard" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>Temporary Password</label><div class="flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2"${_scopeId}><span class="font-mono text-sm font-bold text-red-600"${_scopeId}>${ssrInterpolate(unref(createdUserData).temporaryPassword)}</span>`);
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: ($event) => copyToClipboard(unref(createdUserData).temporaryPassword),
                size: "xs",
                variant: "ghost"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-clipboard" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UIcon, { name: "i-heroicons-clipboard" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div><div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded"${_scopeId}><div class="flex items-start"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-exclamation-triangle",
                class: "h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5"
              }, null, _parent2, _scopeId));
              _push2(`<div class="text-sm text-yellow-700 dark:text-yellow-300"${_scopeId}><p class="font-medium mb-1"${_scopeId}>Important:</p><p${_scopeId}>${ssrInterpolate(unref(createdUserData).message)}</p><p class="mt-2"${_scopeId}>Please share these credentials securely with the new user.</p></div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => showSuccessModal.value = false,
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Got it `);
                } else {
                  return [
                    createTextVNode(" Got it ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("div", { class: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-check",
                      class: "h-6 w-6 text-green-600"
                    })
                  ]),
                  createVNode("h3", { class: "text-lg font-semibold mb-4 text-gray-900 dark:text-white" }, " User Created Successfully! "),
                  unref(createdUserData) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left"
                  }, [
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Email"),
                        createVNode("div", { class: "flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2" }, [
                          createVNode("span", { class: "font-mono text-sm" }, toDisplayString(unref(createdUserData).email), 1),
                          createVNode(_component_UButton, {
                            onClick: ($event) => copyToClipboard(unref(createdUserData).email),
                            size: "xs",
                            variant: "ghost"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UIcon, { name: "i-heroicons-clipboard" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Temporary Password"),
                        createVNode("div", { class: "flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2" }, [
                          createVNode("span", { class: "font-mono text-sm font-bold text-red-600" }, toDisplayString(unref(createdUserData).temporaryPassword), 1),
                          createVNode(_component_UButton, {
                            onClick: ($event) => copyToClipboard(unref(createdUserData).temporaryPassword),
                            size: "xs",
                            variant: "ghost"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_UIcon, { name: "i-heroicons-clipboard" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded" }, [
                      createVNode("div", { class: "flex items-start" }, [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-exclamation-triangle",
                          class: "h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5"
                        }),
                        createVNode("div", { class: "text-sm text-yellow-700 dark:text-yellow-300" }, [
                          createVNode("p", { class: "font-medium mb-1" }, "Important:"),
                          createVNode("p", null, toDisplayString(unref(createdUserData).message), 1),
                          createVNode("p", { class: "mt-2" }, "Please share these credentials securely with the new user.")
                        ])
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode(_component_UButton, {
                    onClick: ($event) => showSuccessModal.value = false,
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Got it ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showCreateModal),
        "onUpdate:modelValue": ($event) => isRef(showCreateModal) ? showCreateModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(editingUser) ? "Edit User" : "Create New User")}</h3><form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"${_scopeId}>Name</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(userForm).name,
              "onUpdate:modelValue": ($event) => unref(userForm).name = $event,
              type: "text",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(userForm).email,
              "onUpdate:modelValue": ($event) => unref(userForm).email = $event,
              type: "email",
              required: "",
              disabled: !!unref(editingUser)
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"${_scopeId}>Role</label>`);
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(userForm).role,
              "onUpdate:modelValue": ($event) => unref(userForm).role = $event,
              options: roleOptions,
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(userForm).role === "staff" || unref(userForm).role === "partner") {
              _push2(`<div${_scopeId}><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"${_scopeId}>Partner Access</label><p class="text-xs text-gray-500 dark:text-gray-400 mb-2"${_scopeId}>Select which partners this user can access</p><div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(partners), (partner) => {
                _push2(`<div class="flex items-center"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UCheckbox, {
                  id: `partner-${partner.id}`,
                  modelValue: unref(selectedPartners),
                  "onUpdate:modelValue": ($event) => isRef(selectedPartners) ? selectedPartners.value = $event : null,
                  value: partner.id,
                  class: "mr-3"
                }, null, _parent2, _scopeId));
                _push2(`<label${ssrRenderAttr("for", `partner-${partner.id}`)} class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"${_scopeId}>${ssrInterpolate(partner.name)} <span class="text-xs text-gray-500 ml-2"${_scopeId}>(${ssrInterpolate(partner.email || "No email")})</span></label></div>`);
              });
              _push2(`<!--]-->`);
              if (unref(partners).length === 0) {
                _push2(`<div class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}> No partners available. Create partners first. </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(userFormError)) {
              _push2(`<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"${_scopeId}><p class="text-red-600 dark:text-red-400 text-sm"${_scopeId}>${ssrInterpolate(unref(userFormError))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-end space-x-3 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: closeModal,
              variant: "ghost"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              loading: unref(saving),
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(saving) ? "Saving..." : unref(editingUser) ? "Update" : "Create")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(saving) ? "Saving..." : unref(editingUser) ? "Update" : "Create"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("h3", { class: "text-lg font-semibold mb-4 text-gray-900 dark:text-white" }, toDisplayString(unref(editingUser) ? "Edit User" : "Create New User"), 1),
                createVNode("form", {
                  onSubmit: withModifiers(handleUserSubmit, ["prevent"]),
                  class: "space-y-4"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Name"),
                    createVNode(_component_UInput, {
                      modelValue: unref(userForm).name,
                      "onUpdate:modelValue": ($event) => unref(userForm).name = $event,
                      type: "text",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Email"),
                    createVNode(_component_UInput, {
                      modelValue: unref(userForm).email,
                      "onUpdate:modelValue": ($event) => unref(userForm).email = $event,
                      type: "email",
                      required: "",
                      disabled: !!unref(editingUser)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Role"),
                    createVNode(_component_USelect, {
                      modelValue: unref(userForm).role,
                      "onUpdate:modelValue": ($event) => unref(userForm).role = $event,
                      options: roleOptions,
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  unref(userForm).role === "staff" || unref(userForm).role === "partner" ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("label", { class: "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" }, "Partner Access"),
                    createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400 mb-2" }, "Select which partners this user can access"),
                    createVNode("div", { class: "space-y-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(partners), (partner) => {
                        return openBlock(), createBlock("div", {
                          key: partner.id,
                          class: "flex items-center"
                        }, [
                          createVNode(_component_UCheckbox, {
                            id: `partner-${partner.id}`,
                            modelValue: unref(selectedPartners),
                            "onUpdate:modelValue": ($event) => isRef(selectedPartners) ? selectedPartners.value = $event : null,
                            value: partner.id,
                            class: "mr-3"
                          }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "value"]),
                          createVNode("label", {
                            for: `partner-${partner.id}`,
                            class: "text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                          }, [
                            createTextVNode(toDisplayString(partner.name) + " ", 1),
                            createVNode("span", { class: "text-xs text-gray-500 ml-2" }, "(" + toDisplayString(partner.email || "No email") + ")", 1)
                          ], 8, ["for"])
                        ]);
                      }), 128)),
                      unref(partners).length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-gray-500 dark:text-gray-400"
                      }, " No partners available. Create partners first. ")) : createCommentVNode("", true)
                    ])
                  ])) : createCommentVNode("", true),
                  unref(userFormError) ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                  }, [
                    createVNode("p", { class: "text-red-600 dark:text-red-400 text-sm" }, toDisplayString(unref(userFormError)), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex justify-end space-x-3 pt-4" }, [
                    createVNode(_component_UButton, {
                      onClick: closeModal,
                      variant: "ghost"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      loading: unref(saving),
                      color: "primary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(saving) ? "Saving..." : unref(editingUser) ? "Update" : "Create"), 1)
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ], 32)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=users-B7lruPBh.mjs.map
