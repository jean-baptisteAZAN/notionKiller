<script setup lang="ts">
  import { ref } from 'vue'
  import type { Document } from '@notionkiller/shared'

  const documents = ref<Document[]>([])
  const searchQuery = ref('')

  const filteredDocuments = computed(() => {
    return documents.value.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const createDocumentModal = ref()

  function handleCreateClick() {
    createDocumentModal.value?.openModal()
  }

  function onDocumentCreated(newDoc: Document) {
    documents.value.push(newDoc)
  }
  const cookie = useCookie('auth-token')
</script>

<template>
  <div class="p-10">
    <div class="flex justify-between items-center">
      <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search documents..."
          class="max-w-sm mb-6"
      />
      <UButton
          icon="i-heroicons-plus"
          label="New Document"
          @click="handleCreateClick"
      />
    </div>

    <CreateDocumentModal
        ref="createDocumentModal"
        @document:created="onDocumentCreated"
    />
    <div class="grid gap-4">
      <UCard
          v-for="doc in filteredDocuments"
          :key="doc.id"
          :to="`/documents/${doc.id}`"
          class="hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-medium">{{ doc.title }}</h2>
            <p class="text-sm text-gray-500">
              Last updated {{ new Date(doc.updatedAt).toLocaleDateString() }}
            </p>
          </div>
          <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-chevron-right"
          />
        </div>
      </UCard>
      <div v-if="!filteredDocuments.length" class="text-center flex flex-1 gap-5 flex-col">
        <UIcon
            name="i-heroicons-document"
            class="w-12 h-12 mx-auto text-gray-400"
        />
        <p class="text-gray-600">No documents found. Create your first one!</p>
      </div>
    </div>
    <UNotifications />
  </div>
</template>