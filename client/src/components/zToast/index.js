import {createVNode, render, ref} from 'vue'
import zToast from './zToast.vue'

export const useToast = () => {
  const container = document.createElement('div');
  const toast = ref(null);
  const toastQueue = ref([]);
  const toastInstance = (options) => {
    if (options == null) return close;

    toastQueue.value.push(options);
    if (toast.value) return close;
    toast.value = createToast();
    return close;
  }

  const createToast = () => {
    const instance = createVNode(zToast, {
        onClose: () => {
          toastQueue.value.shift();
          if (!toastQueue.value.length) {
            toast.value = null;
            return;
          }
          toast.value = createToast();
        },
      },
      toastQueue.value[0]
    );

    document.body.appendChild(container);
    render(instance, container);

    setTimeout(close, 3000)

    return instance;
  }

  const close = () => {
    toastQueue.value.shift();
    if (!toastQueue.value.length) {
      render(null, container);
      document.body.removeChild(container);
      toast.value = null;
      return;
    }
    toast.value = createToast();
  }

  return toastInstance;
}

export const showToast = useToast();
