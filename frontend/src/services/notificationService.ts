import toast from 'react-hot-toast';

export const notificationService = {
  success: (message: string, options?: any) => {
    toast.success(message, {
      ...options,
      style: {
        background: '#28a745',
        color: '#fff',
        fontWeight: 500,
      },
    });
  },

  error: (message: string, options?: any) => {
    toast.error(message, {
      ...options,
      style: {
        background: '#dc3545',
        color: '#fff',
        fontWeight: 500,
      },
    });
  },

  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      ...options,
      style: {
        background: '#192C57',
        color: '#fff',
      },
    });
  },

  info: (message: string, options?: any) => {
    toast(message, {
      ...options,
      style: {
        background: '#17a2b8',
        color: '#fff',
        fontWeight: 500,
      },
    });
  },

  warning: (message: string, options?: any) => {
    toast(message, {
      ...options,
      style: {
        background: '#ffc107',
        color: '#192C57',
        fontWeight: 500,
      },
    });
  },

  promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }, options?: any) => {
    return toast.promise(promise, messages, options);
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};
