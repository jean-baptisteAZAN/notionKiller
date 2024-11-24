<script setup lang="ts">
import type { LinkData } from '@/types/editor'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  insert: [string, string, string]
}>()

const linkData = reactive<LinkData>({
  text: '',
  url: ''
})

function handleInsert() {
  emit('insert', '[', `](${linkData.url})`, linkData.text)
  emit('update:modelValue', false)
  linkData.text = ''
  linkData.url = ''
}
</script>

<template>
  <UModal
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
  >
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Insert Link</h3>
          <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="emit('update:modelValue', false)"
          />
        </div>
      </template>

      <div class="space-y-4">
        <UFormGroup label="Text">
          <UInput
              v-model="linkData.text"
              placeholder="Link text..."
          />
        </UFormGroup>

        <UFormGroup label="URL">
          <UInput
              v-model="linkData.url"
              placeholder="https://..."
          />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
              color="gray"
              label="Cancel"
              @click="emit('update:modelValue', false)"
          />
          <UButton
              color="primary"
              label="Insert"
              :disabled="!linkData.text.trim() || !linkData.url.trim()"
              @click="handleInsert"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>