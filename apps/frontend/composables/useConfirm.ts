// composables/useConfirm.ts
import { ref } from "vue";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonColor?: "primary" | "red" | "green" | "gray";
}

interface ConfirmDialogState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
}

// État global pour le dialog
const state = reactive<ConfirmDialogState>({
  isOpen: false,
  options: {
    title: "Confirm Action",
    message: "Are you sure you want to delete this item?",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    confirmButtonColor: "primary",
  },
  resolve: null,
});

export function useConfirm() {
  function confirm(opts: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      state.options = {
        ...state.options,
        ...opts,
      };
      state.resolve = resolve;
      state.isOpen = true;
    });
  }

  function handleConfirm() {
    state.isOpen = false;
    if (state.resolve) {
      state.resolve(true);
      state.resolve = null;
    }
  }

  function handleCancel() {
    state.isOpen = false;
    if (state.resolve) {
      state.resolve(false);
      state.resolve = null;
    }
  }

  return {
    isOpen: computed(() => state.isOpen),
    options: readonly(state.options),
    confirm,
    handleConfirm,
    handleCancel,
  };
}
