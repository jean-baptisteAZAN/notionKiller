<script setup lang="ts">
import type { Document } from "@/types/document";

defineProps<{
  document: Document;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}>();

defineEmits<{
  edit: [];
  cancel: [];
  save: [];
  delete: [];
  duplicate: [];
  rename: [string];
  export: [];
}>();

const showRenameModal = ref(false);
const newTitle = ref("");

// Pour le modal de renommage
function handleRename() {
  emit("rename", newTitle.value);
  showRenameModal.value = false;
  newTitle.value = "";
}

// Pour l'export
function handleExport() {
  // Logic to trigger export
  emit("export");
}
</script>

<template>
  <div
    class="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
  >
    <!-- Left side -->
    <div class="flex items-center gap-4">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        @click="navigateTo('/dashboard')"
        class="hover:bg-gray-100 dark:hover:bg-gray-700"
      />
      <div>
        <h1 class="text-2xl font-bold group flex items-center gap-2">
          {{ document.title }}
          <UButton
            v-if="!isEditing"
            color="gray"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            size="xs"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            @click="showRenameModal = true"
          />
        </h1>
        <p class="text-sm text-gray-500 flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="w-4 h-4" />
          Last edited {{ new Date(document.updatedAt).toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-2">
      <!-- Auto-save indicator -->
      <UButton
        v-if="hasUnsavedChanges"
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-heroicons-arrow-path"
        label="Saving..."
        disabled
      />

      <!-- Edit/Save buttons -->
      <template v-if="isEditing">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-eye"
          label="Preview"
          @click="$emit('cancel')"
        />
        <UButton color="gray" label="Cancel" @click="$emit('cancel')" />
        <UButton
          color="primary"
          label="Save"
          icon="i-heroicons-check"
          @click="$emit('save')"
        />
      </template>
      <template v-else>
        <UButton
          color="primary"
          label="Edit"
          icon="i-heroicons-pencil"
          @click="$emit('edit')"
        />
      </template>

      <UDropdown
        :items="[
          [
            {
              label: 'Duplicate',
              icon: 'i-heroicons-document-duplicate',
              click: () => $emit('duplicate'),
            },
            {
              label: 'Rename',
              icon: 'i-heroicons-pencil-square',
              click: () => (showRenameModal = true),
            },
          ],
          [
            {
              label: 'Export as...',
              icon: 'i-heroicons-arrow-down-tray',
              children: [
                {
                  label: 'Markdown (.md)',
                  icon: 'i-heroicons-document-text',
                  click: () => $emit('export', { format: 'markdown' }),
                },
                {
                  label: 'HTML (.html)',
                  icon: 'i-heroicons-code-bracket',
                  click: () => $emit('export', { format: 'html' }),
                },
                {
                  label: 'Plain Text (.txt)',
                  icon: 'i-heroicons-document',
                  click: () => $emit('export', { format: 'txt' }),
                },
              ],
            },
          ],
          [
            {
              label: 'Delete',
              icon: 'i-heroicons-trash',
              click: () => $emit('delete'),
              class: 'text-red-500 hover:text-red-600',
            },
          ],
        ]"
      >
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-vertical"
        />
      </UDropdown>
    </div>

    <!-- Rename Modal -->
    <UModal v-model="showRenameModal">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Rename Document</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="showRenameModal = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="New Title">
            <UInput
              v-model="newTitle"
              placeholder="Enter new title..."
              @keyup.enter="handleRename"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              label="Cancel"
              @click="showRenameModal = false"
            />
            <UButton
              color="primary"
              label="Rename"
              :disabled="!newTitle.trim()"
              @click="handleRename"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
.document-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
