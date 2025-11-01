export const useConfirm = () => {
  const confirmModal = inject('confirmModal', ref(null))

  const confirm = (message: string, options?: {
    title?: string
    confirmText?: string
    cancelText?: string
    confirmColor?: string
    icon?: string
    iconClass?: string
  }): Promise<boolean> => {
    if (!confirmModal?.value) {
      console.warn('Confirm modal not available, falling back to browser confirm')
      return Promise.resolve(window.confirm(message))
    }

    // Set modal properties
    if (options?.title) confirmModal.value.title = options.title
    if (options?.confirmText) confirmModal.value.confirmText = options.confirmText
    if (options?.cancelText) confirmModal.value.cancelText = options.cancelText
    if (options?.confirmColor) confirmModal.value.confirmColor = options.confirmColor
    if (options?.icon) confirmModal.value.icon = options.icon
    if (options?.iconClass) confirmModal.value.iconClass = options.iconClass
    
    confirmModal.value.message = message
    
    return confirmModal.value.show()
  }

  return {
    confirm
  }
}
