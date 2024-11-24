<script setup lang="ts">
  import { useDocument } from '@/composables/useDocument'
  import { useMarkdown } from '@/composables/useMarkdown'
  import { useAutoSave } from '@/composables/useAutoSave'
  import DocumentEditor from '@/components/documents/index.vue'
  import MarkdownPreview from "~/components/documents/MarkdownPreview.vue";

  const route = useRoute()
  const documentId = route.params.id as string

  const {
    document,
    isLoading,
    fetchDocument,
    saveDocument,
    deleteDocument
  } = useDocument(documentId)

  const {
    editedContent,
    renderedMarkdown,
    insertMarkdown
  } = useMarkdown()

  const { hasUnsavedChanges, debouncedSave } = useAutoSave(saveDocument)

  const isEditing = ref(false)

  watch(() => document.value?.content, (newContent) => {
    if (newContent !== undefined) {
      console.log('Setting edited content:', newContent)
      editedContent.value = newContent
    }
  }, { immediate: true })

  watch(editedContent, (newContent) => {
    hasUnsavedChanges.value = true
    debouncedSave(newContent)
  })

  onMounted(async () => {
    await fetchDocument()
    if (document.value?.content)
      editedContent.value = document.value.content
  })

  const isEditingCookie = useCookie('document-editing-state')
  onMounted(() => {
    if (isEditingCookie.value === 'true') {
      isEditing.value = true
    }
  })

  watch(isEditing, (newValue) => {
    isEditingCookie.value = newValue ? 'true' : 'false'
  })

  function handleInsertMarkdown(prefix: string, suffix: string, placeholder: string) {
    console.log('Inserting markdown:', { prefix, suffix, placeholder }) // Debug
    insertMarkdown(prefix, suffix, placeholder)
  }
</script>


<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <LoadingState v-if="isLoading" />

      <template v-else-if="document">
        <DocumentHeader
            :document="document"
            :is-editing="isEditing"
            :has-unsaved-changes="hasUnsavedChanges"
            @edit="isEditing = true"
            @cancel="isEditing = false"
            @save="saveDocument(editedContent)"
            @delete="deleteDocument"
        />

        <DocumentEditor
            v-if="isEditing"
            v-model="editedContent"
            :markdown="renderedMarkdown"
            @insert-markdown="handleInsertMarkdown"
        />

        <MarkdownPreview
            v-else
            :markdown="renderedMarkdown"
        />
      </template>
    </div>
  </div>
</template>
