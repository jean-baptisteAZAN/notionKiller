export function useNotifications() {
  const toast = useToast();

  function notifySuccess(message: string) {
    toast.add({
      title: "Success",
      description: message,
      icon: "i-heroicons-check-circle",
      color: "green",
    });
  }

  function notifyError(message: string) {
    toast.add({
      title: "Error",
      description: message,
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  }

  return {
    notifySuccess,
    notifyError,
  };
}
