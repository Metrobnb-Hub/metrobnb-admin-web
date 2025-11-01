import { inject, ref } from 'vue';

const useConfirm = () => {
  const confirmModal = inject("confirmModal", ref(null));
  const confirm = (message, options) => {
    if (!(confirmModal == null ? void 0 : confirmModal.value)) {
      console.warn("Confirm modal not available, falling back to browser confirm");
      return Promise.resolve((void 0).confirm(message));
    }
    if (options == null ? void 0 : options.title) confirmModal.value.title = options.title;
    if (options == null ? void 0 : options.confirmText) confirmModal.value.confirmText = options.confirmText;
    if (options == null ? void 0 : options.cancelText) confirmModal.value.cancelText = options.cancelText;
    if (options == null ? void 0 : options.confirmColor) confirmModal.value.confirmColor = options.confirmColor;
    if (options == null ? void 0 : options.icon) confirmModal.value.icon = options.icon;
    if (options == null ? void 0 : options.iconClass) confirmModal.value.iconClass = options.iconClass;
    confirmModal.value.message = message;
    return confirmModal.value.show();
  };
  return {
    confirm
  };
};

export { useConfirm as u };
//# sourceMappingURL=useConfirm-E6nJ9sX9.mjs.map
