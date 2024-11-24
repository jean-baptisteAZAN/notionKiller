import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

export function useAutoSave(
  saveCallback: (content: string, autoSave: boolean) => Promise<boolean>,
) {
  const hasUnsavedChanges = ref(false);

  const debouncedSave = useDebounceFn(async (content: string) => {
    if (hasUnsavedChanges.value) {
      const saved = await saveCallback(content, true);
      if (saved) {
        hasUnsavedChanges.value = false;
      }
    }
  }, 2000);

  return {
    hasUnsavedChanges,
    debouncedSave,
  };
}
