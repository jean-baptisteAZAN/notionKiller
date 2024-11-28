<script setup lang="ts">
  import type { Document } from "@notionkiller/shared/types";
  import { formatDate } from "@/utils/formatDate";
  import ShareDocumentModal from '~/components/documents/ShareDocumentModal.vue';

  const isShareModalOpen = ref(false);

  defineProps<{
    document: Document;
    isEditing: boolean;
    hasUnsavedChanges: boolean;
  }>();

  const emit = defineEmits<{
    edit: [];
    cancel: [];
    save: [];
    delete: [];
    duplicate: [];
    rename: [string];
    export: [{ format: "markdown" | "html" | "txt" }];
  }>();

  const showRenameModal = ref(false);
  const showExportModal = ref(false);
  const newTitle = ref("");

  function handleRename() {
    emit("rename", newTitle.value);
    showRenameModal.value = false;
    newTitle.value = "";
  }

  function handleExportFormat(format: "markdown" | "html" | "txt") {
    emit("export", { format });
    showExportModal.value = false;
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
          Last edited {{ formatDate(document.updated_at) }}
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
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-moon"
          class="hidden sm:flex"
          @click="
            $colorMode.preference =
              $colorMode.value === 'dark' ? 'light' : 'dark'
          "
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
            {
              label: 'Export',
              icon: 'i-heroicons-arrow-down-tray',
              click: () => (showExportModal = true),
            },
            {
              label: 'Share',
              icon: 'i-heroicons-share',
              click: () => isShareModalOpen = true,
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
    <UModal v-model="showExportModal">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Export Document</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="showExportModal = false"
            />
          </div>
        </template>

        <div class="space-y-4 py-4">
          <div class="grid gap-2">
            <UButton
              variant="ghost"
              class="justify-start"
              @click="handleExportFormat('markdown')"
            >
              <template #leading>
                <UIcon name="i-heroicons-document-text" />
              </template>
              Markdown (.md)
            </UButton>

            <UButton
              variant="ghost"
              class="justify-start"
              @click="handleExportFormat('html')"
            >
              <template #leading>
                <UIcon name="i-heroicons-code-bracket" />
              </template>
              HTML (.html)
            </UButton>

            <UButton
              variant="ghost"
              class="justify-start"
              @click="handleExportFormat('txt')"
            >
              <template #leading>
                <UIcon name="i-heroicons-document" />
              </template>
              Plain Text (.txt)
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
    <ShareDocumentModal
        v-model="isShareModalOpen"
        :document-id="document.id"
        @close="isShareModalOpen = false"
    />
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
