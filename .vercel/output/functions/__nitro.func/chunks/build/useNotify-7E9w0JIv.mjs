import { M as useToast } from './server.mjs';

const useNotify = () => {
  const toast = useToast();
  const notifySuccess = (message, timeout = 3e3) => {
    toast.add({
      title: "Success",
      description: message,
      color: "green",
      timeout
    });
  };
  const notifyError = (message, timeout = 5e3) => {
    toast.add({
      title: "Error",
      description: message,
      color: "red",
      timeout
    });
  };
  const notifyInfo = (message, timeout = 3e3) => {
    toast.add({
      title: "Info",
      description: message,
      color: "blue",
      timeout
    });
  };
  const notifyWarning = (message, timeout = 4e3) => {
    toast.add({
      title: "Warning",
      description: message,
      color: "yellow",
      timeout
    });
  };
  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning
  };
};

export { useNotify as u };
//# sourceMappingURL=useNotify-7E9w0JIv.mjs.map
