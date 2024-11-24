<script setup lang="ts">
import type { CreateDocumentDTO } from "@notionkiller/shared";

const isOpen = ref(false);
const isLoading = ref(false);
const toast = useToast();

const document = ref<CreateDocumentDTO>({
  title: "",
  content: ""
});

const emit = defineEmits(["document:created"]);

// Suggestions de titres pour inspirer l'utilisateur
const titleSuggestions = [
  "Meeting Notes",
  "Project Ideas",
  "Weekly Plan",
  "Research Notes",
  "Task List",
  "Brainstorming"
];

const randomPlaceholder = computed(() => {
  return titleSuggestions[Math.floor(Math.random() * titleSuggestions.length)];
});

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
  document.value = { title: "", content: "" };
}

async function handleSubmit() {
  if (!document.value.title.trim()) return;

  try {
    isLoading.value = true;
    const API_URL = import.meta.env.VITE_API_URL;
    const token = useCookie("auth-token").value;

    const response = await $fetch(`${API_URL}/documents`, {
      method: "POST",
      body: document.value,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.add({
      title: "Success",
      description: "Document created successfully",
      icon: "i-heroicons-check-circle",
      color: "green",
    });

    emit("document:created", response);
    closeModal();
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to create document",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }
}

defineExpose({ openModal });
</script>

<template>
  <UModal
      v-model="isOpen"
      :ui="{
      container: 'flex min-h-full items-end sm:items-center justify-center',
      width: 'sm:max-w-lg',
      base: 'relative transform overflow-hidden rounded-t-xl sm:rounded-xl bg-white dark:bg-gray-900 text-left shadow-xl transition-all',
    }"
  >
    <UCard
        :ui="{
        base: 'bg-white dark:bg-gray-900',
        header: { padding: 'px-6 py-5 sm:py-6' },
        body: { padding: 'px-6 py-2' },
        footer: { padding: 'px-6 py-4' }
      }"
    >
      <template #header>
        <div class="flex flex-col items-center text-center">
          <div class="rounded-full bg-primary-50 dark:bg-primary-900/50 p-3 mb-4">
            <UIcon
                name="i-heroicons-document-plus"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
            />
          </div>
          <h3 class="text-lg font-medium leading-6">
            Create New Document
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Give your document a meaningful title to get started
          </p>
        </div>
      </template>

      <form @submit.prevent="handleSubmit" class="py-4">
        <UInput
            v-model="document.title"
            :placeholder="randomPlaceholder"
            size="lg"
            class="text-lg"
            icon="i-heroicons-pencil"
            autofocus
            @keydown="handleKeydown"
        >
          <template #trailing>
            <span
                class="text-xs text-gray-400"
                :class="{ 'text-red-400': document.title.length > 50 }"
            >
              {{ document.title.length }}/50
            </span>
          </template>
        </UInput>

        <!-- Suggestions -->
        <div class="mt-4 flex flex-wrap gap-2">
          <UButton
              v-for="suggestion in titleSuggestions"
              :key="suggestion"
              color="gray"
              variant="soft"
              size="xs"
              @click="document.title = suggestion"
          >
            {{ suggestion }}
          </UButton>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-between items-center">
          <p class="text-xs text-gray-500">
            Press Enter to create
          </p>
          <div class="flex gap-2">
            <UButton
                color="gray"
                variant="soft"
                @click="closeModal"
            >
              Cancel
            </UButton>
            <UButton
                color="primary"
                icon="i-heroicons-arrow-right"
                :loading="isLoading"
                :disabled="!document.title.trim() || document.title.length > 50"
                @click="handleSubmit"
            >
              Create & Edit
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>