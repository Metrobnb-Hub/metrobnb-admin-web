export const usePWA = () => {
  const isOnline = ref(true)
  const isInstallable = ref(false)
  const deferredPrompt = ref<any>(null)

  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  const handleInstallPrompt = (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e
    isInstallable.value = true
  }

  const installApp = async () => {
    if (!deferredPrompt.value) return false
    
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      deferredPrompt.value = null
      isInstallable.value = false
      return true
    }
    return false
  }

  onMounted(() => {
    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
    window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
  })

  return {
    isOnline: readonly(isOnline),
    isInstallable: readonly(isInstallable),
    installApp
  }
}