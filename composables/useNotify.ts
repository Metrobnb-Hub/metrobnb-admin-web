export const useNotify = () => {
  const toast = useToast()

  const notifySuccess = (message: string) => {
    toast.add({
      title: 'Success',
      description: message,
      color: 'green'
    })
  }

  const notifyError = (message: string) => {
    toast.add({
      title: 'Error',
      description: message,
      color: 'red'
    })
  }

  const notifyInfo = (message: string) => {
    toast.add({
      title: 'Info',
      description: message,
      color: 'blue'
    })
  }

  return {
    notifySuccess,
    notifyError,
    notifyInfo
  }
}