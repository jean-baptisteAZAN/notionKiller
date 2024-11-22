<script setup lang="ts">
  import type { CreateDocumentDTO } from '@notionkiller/shared'
  import { marked } from "marked";
  const isOpen = ref(false)
  const toast = useToast()

  const document = ref<CreateDocumentDTO>({
    title: '',
    content: ''
  })

  const emit = defineEmits(['document:created'])
  const textareaRef = ref<HTMLTextAreaElement>()

  function openModal() {
    isOpen.value = true
  }

  function closeModal() {
    isOpen.value = false
    document.value = { title: '', content: '' }
  }

  function insertMarkdown(prefix: string, suffix: string = prefix) {
    const textarea = textareaRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = document.value.content
    const before = text.substring(0, start)
    const selection = text.substring(start, end)
    const after = text.substring(end)

    document.value.content = before + prefix + selection + suffix + after

    // Remet le focus et la sélection
    nextTick(() => {
      textarea.focus()
      textarea.selectionStart = start + prefix.length
      textarea.selectionEnd = start + prefix.length + selection.length
    })
  }

  const markdownTools = [
    {
      icon: 'i-heroicons-bold',
      label: 'Bold',
      action: () => insertMarkdown('**'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: 'i-heroicons-bars-3-bottom',
      label: 'Italic',
      action: () => insertMarkdown('*'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: 'i-heroicons-code-bracket',
      label: 'Code',
      action: () => insertMarkdown('`'),
      shortcut: 'Ctrl+K'
    },
    {
      icon: 'i-heroicons-link',
      label: 'Link',
      action: () => insertMarkdown('[', '](url)'),
      shortcut: 'Ctrl+L'
    },
    {
      icon: 'i-heroicons-list-bullet',
      label: 'List',
      action: () => insertMarkdown('- '),
      shortcut: 'Ctrl+U'
    }
  ]

  async function handleSubmit() {
    try {
      const API_URL = import.meta.env.VITE_API_URL
      const token = useCookie('auth-token').value

      const response = await $fetch(`${API_URL}/api/documents`, {
        method: 'POST',
        body: document.value,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      toast.add({
        title: 'Success',
        description: 'Document created successfully',
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })

      emit('document:created', response)
      closeModal()
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to create document',
        icon: 'i-heroicons-x-circle',
        color: 'red'
      })
    }
  }

  const preview = computed(() => {
    return marked(document.value.content)
  })

defineExpose({ openModal })
</script>

<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-4xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Create New Document</h3>
          <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="closeModal"
          />
        </div>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <UFormGroup label="Title" required>
          <UInput
              v-model="document.title"
              placeholder="Enter document title"
          />
        </UFormGroup>

        <!-- Markdown Toolbar -->
        <div class="flex items-center gap-2 p-2  rounded-t-lg border border-b-0 border-black bg-black">
          <UTooltip v-for="tool in markdownTools" :key="tool.label" :text="`${tool.label} ${tool.shortcut}`">
            <UButton
                color="gray"
                variant="ghost"
                :icon="tool.icon"
                size="xs"
                @click.prevent="tool.action"
            />
          </UTooltip>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <UFormGroup label="Content" required>
              <UTextarea
                  ref="textareaRef"
                  v-model="document.content"
                  placeholder="Write your markdown content here..."
                  rows="15"
                  class="font-mono"
              />
            </UFormGroup>
          </div>

          <!-- Preview Panel -->
          <div class="border rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-2">Preview</div>
            <div class="prose prose-sm max-w-none">
              {{ preview }}
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <UButton
              color="gray"
              variant="soft"
              label="Cancel"
              @click="closeModal"
          />
          <UButton
              type="submit"
              color="primary"
              label="Create"
          />
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<style>
  .prose {
    max-width: none;
  }

  .markdown-toolbar button {
    @apply p-1 hover:bg-gray-100 rounded;
  }
</style>