<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Document } from "@notionkiller/shared";

const documents = ref<Document[]>([]);
const searchQuery = ref("");
const isLoading = ref(true);

const API_URL = import.meta.env.VITE_API_URL;
const cookie = useCookie("auth-token");

// Fetch documents
async function fetchDocuments() {
  try {
    isLoading.value = true;
    const response = await $fetch(`${API_URL}/documents`, {
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
    });
    documents.value = response;
  } catch (error) {
    useToast().add({
      title: "Error",
      description: "Failed to load documents",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}

const filteredDocuments = computed(() => {
  return documents.value.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const createDocumentModal = ref();

function handleCreateClick() {
  createDocumentModal.value?.openModal();
}

function onDocumentCreated(newDoc: Document) {
  documents.value = [newDoc, ...documents.value];
  useToast().add({
    title: "Success",
    description: "Document created successfully",
    icon: "i-heroicons-check-circle",
    color: "green",
  });
}

// Fetch documents on mount
onMounted(fetchDocuments);
</script>

<template>
  <div class="p-10">
    <div class="flex justify-between items-center mb-6">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search documents..."
        class="max-w-sm"
      />
      <UButton
        icon="i-heroicons-plus"
        label="New Document"
        @click="handleCreateClick"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <USkeleton v-for="n in 3" :key="n" class="h-24 w-full" />
    </div>

    <!-- Documents Grid -->
    <div v-else class="grid gap-4">
      <UCard
        v-for="doc in filteredDocuments"
        :key="doc.id"
        :to="`/document/${doc.id}`"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-medium">{{ doc.title }}</h2>
          </div>
          <div class="flex items-center gap-2">
            <UDropdown
              :items="[
                [
                  {
                    label: 'Edit',
                    icon: 'i-heroicons-pencil',
                    to: `/document/${doc.id}`,
                  },
                  {
                    label: 'Delete',
                    icon: 'i-heroicons-trash',
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
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-chevron-right"
              @click="navigateTo(`/document/${doc.id}`)"
            />
          </div>
        </div>
      </UCard>

      <!-- Empty State -->
      <div
        v-if="!isLoading && !filteredDocuments.length"
        class="text-center py-12 bg-white rounded-lg shadow-sm"
      >
        <UIcon
          name="i-heroicons-document"
          class="w-12 h-12 mx-auto text-gray-400 mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          No documents found
        </h3>
        <p class="text-gray-500 mb-4">
          {{
            searchQuery
              ? "Try adjusting your search."
              : "Get started by creating your first document."
          }}
        </p>
        <UButton
          v-if="!searchQuery"
          icon="i-heroicons-plus"
          label="Create Document"
          @click="handleCreateClick"
        />
      </div>
    </div>

    <CreateDocumentModal
      ref="createDocumentModal"
      @document:created="onDocumentCreated"
    />

    <UNotifications />
  </div>
</template>
