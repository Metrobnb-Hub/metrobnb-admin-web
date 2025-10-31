export const useNotify = () => {
  const toast = useToast()

  const notifySuccess = (message: string, timeout: number = 3000) => {
    toast.add({
      title: 'Success',
      description: message,
      color: 'green',
      timeout
    })
  }

  const notifyError = (message: string, timeout: number = 5000) => {
    toast.add({
      title: 'Error',
      description: message,
      color: 'red',
      timeout
    })
  }

  const notifyInfo = (message: string, timeout: number = 3000) => {
    toast.add({
      title: 'Info',
      description: message,
      color: 'blue',
      timeout
    })
  }

  const notifyWarning = (message: string, timeout: number = 4000) => {
    toast.add({
      title: 'Warning',
      description: message,
      color: 'yellow',
      timeout
    })
  }

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning
  }
}