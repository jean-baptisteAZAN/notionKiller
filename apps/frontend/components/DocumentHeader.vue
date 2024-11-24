<script setup lang="ts">
import type { Document } from '@/types/document'

defineProps<{
  document: Document
  isEditing: boolean
  hasUnsavedChanges: boolean
}>()

defineEmits<{
  edit: []
  cancel: []
  save: []
  delete: []
}>()
</script>

<template>
  <div class="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
    <div class="flex items-center gap-4">
      <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          @click="navigateTo('/dashboard')"
      />
      <div>
        <h1 class="text-2xl font-bold">{{ document.title }}</h1>
        <p class="text-sm text-gray-500">
          Last edited {{ new Date(document.updatedAt).toLocaleString() }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <UButton
          v-if="hasUnsavedChanges"
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-arrow-path"
          label="Saving..."
          disabled
      />

      <template v-if="isEditing">
        <UButton
            color="gray"
            label="Cancel"
            @click="$emit('cancel')"
        />
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

      <UPopover>
        <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-vertical"
        />

        <template #content>
          <div class="p-2">
            <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                label="Delete"
                @click="$emit('delete')"
            />
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>