import { getHumanError, getSuccessMessage } from '~/utils/errorHandler'

export const useErrorHandler = () => {
  const { notifySuccess, notifyError } = useNotify()

  const handleError = (err: any, customMessage?: string) => {
    const message = customMessage || getHumanError(err)
    notifyError(message)
    return message
  }

  const handleSuccess = (action: string, resource?: string, customMessage?: string) => {
    const message = customMessage || getSuccessMessage(action, resource)
    notifySuccess(message)
    return message
  }

  return {
    handleError,
    handleSuccess,
    getHumanError,
    getSuccessMessage
  }
}