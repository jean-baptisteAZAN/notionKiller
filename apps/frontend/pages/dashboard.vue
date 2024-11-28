<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { formatDate } from "~/utils/formatDate";
  import type { Document } from "@notionkiller/shared/types";
  import { useBulkActions } from "~/composables/useBulkActions";

  const { handleBulkDelete, handleBulkExport, isBulkProcessing } = useBulkActions()

  const documents = ref<Document[]>([]);
  const searchQuery = ref("");
  const isLoading = ref(true);
  const sortBy = ref<'title' | 'date'>('date');
  const viewMode = ref<'grid' | 'list'>('grid');
  const selectedDocuments = ref<Set<number>>(new Set());

  const API_URL = import.meta.env.VITE_API_URL;
  const cookie = useCookie("auth-token");

  // Stats
  const stats = computed(() => ({
    total: documents.value.length,
    edited: documents.value.filter(doc =>
        new Date(doc.updated_at).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: documents.value.filter(doc => {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return new Date(doc.created_at) > lastWeek;
    }).length
  }));

  const filteredAndSortedDocuments = computed(() => {
    let docs = documents.value.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    if (sortBy.value === 'date') {
      docs = docs.sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } else {
      docs = docs.sort((a, b) => a.title.localeCompare(b.title));
    }

    return docs;
  });

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

  async function onBulkDelete() {
    if (await handleBulkDelete(selectedDocuments.value)) {
      await fetchDocuments()
      selectedDocuments.value.clear()
    }
  }

  async function onBulkExport() {
    await handleBulkExport(selectedDocuments.value)
    selectedDocuments.value.clear()
  }

  onMounted(fetchDocuments);
</script>

<template>
  <div class="p-10 space-y-6">
    <!-- Header avec stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard class="transition-transform hover:scale-105">
        <div class="text-center">
          <div class="text-3xl font-bold text-primary-600">{{ stats.total }}</div>
          <div class="text-sm text-gray-600">Total Documents</div>
        </div>
      </UCard>

      <UCard class="transition-transform hover:scale-105">
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600">{{ stats.edited }}</div>
          <div class="text-sm text-gray-600">Edited Today</div>
        </div>
      </UCard>

      <UCard class="transition-transform hover:scale-105">
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600">{{ stats.thisWeek }}</div>
          <div class="text-sm text-gray-600">Created This Week</div>
        </div>
      </UCard>
    </div>

    <!-- Barre d'actions -->
    <div class="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div class="flex items-center gap-4 flex-1">
        <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search documents..."
            class="max-w-sm"
        />

        <USelect
            v-model="sortBy"
            :options="[
            { label: 'Sort by Date', value: 'date' },
            { label: 'Sort by Title', value: 'title' }
          ]"
            class="w-40"
        />

        <div class="flex items-center gap-2 border-l pl-4">
          <UButton
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
              color="gray"
              icon="i-heroicons-squares-2x2"
              @click="viewMode = 'grid'"
          />
          <UButton
              :variant="viewMode === 'list' ? 'solid' : 'ghost'"
              color="gray"
              icon="i-heroicons-bars-3"
              @click="viewMode = 'list'"
          />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-moon"
            class="hidden sm:flex"
            @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'"
        />
        <UButton
            icon="i-heroicons-plus"
            label="New Document"
            @click="handleCreateClick"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <USkeleton v-for="n in 6" :key="n" class="h-32" />
    </div>

    <!-- Documents Grid/List -->
    <TransitionGroup
        :name="viewMode === 'grid' ? 'documents-grid' : 'documents-list'"
        tag="div"
        :class="[
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-2'
      ]"
    >
      <UCard
          v-for="doc in filteredAndSortedDocuments"
          :key="doc.id"
          @click="navigateTo(`/document/${doc.id}`)"
          class="group transition-all duration-300 hover:shadow-lg"
          :class="{
          'transform hover:-translate-y-1': viewMode === 'grid'
        }"
      >
        <div class="flex justify-between items-center">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <UCheckbox
                  v-model="selectedDocuments"
                  :value="doc.id"
                  @click.stop
              />
              <h2 class="font-medium group-hover:text-primary-600 transition-colors">
                {{ doc.title }}
              </h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              Last edited {{ formatDate(doc.updated_at) }}
            </p>
            <p v-if="viewMode === 'grid'" class="text-sm text-gray-600 mt-2 line-clamp-2">
              {{ doc.content }}
            </p>
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
                    label: 'Duplicate',
                    icon: 'i-heroicons-document-duplicate',
                  },
                  {
                    label: 'Export',
                    icon: 'i-heroicons-arrow-down-tray',
                  }
                ],
                [
                  {
                    label: 'Delete',
                    icon: 'i-heroicons-trash',
                    class: 'text-red-500'
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
        </div>
      </UCard>
    </TransitionGroup>

    <!-- Empty State -->
    <div
        v-if="!isLoading && !filteredAndSortedDocuments.length"
        class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
    >
      <UIcon
          name="i-heroicons-document"
          class="w-12 h-12 mx-auto text-gray-400 mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
        No documents found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        {{ searchQuery ? "Try adjusting your search." : "Get started by creating your first document." }}
      </p>
      <UButton
          v-if="!searchQuery"
          icon="i-heroicons-plus"
          label="Create Document"
          @click="handleCreateClick"
      />
    </div>

    <CreateDocumentModal
        ref="createDocumentModal"
        @document:created="onDocumentCreated"
    />

    <!-- Bulk Actions -->
    <div
        v-if="selectedDocuments.size > 0"
        class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-4"
    >
      <span class="text-sm text-gray-600">
        {{ selectedDocuments.size }} documents selected
      </span>
      <UButton
          color="gray"
          icon="i-heroicons-arrow-down-tray"
          label="Export"
          :loading="isBulkProcessing"
          @click="onBulkExport"
      />
      <UButton
          color="red"
          icon="i-heroicons-trash"
          label="Delete"
          :loading="isBulkProcessing"
          @click="onBulkDelete"
      />
    </div>

    <UNotifications />
  </div>
</template>

<style scoped>
  .documents-grid-move,
  .documents-list-move {
    transition: transform 0.5s;
  }

  .documents-grid-enter-active,
  .documents-grid-leave-active,
  .documents-list-enter-active,
  .documents-list-leave-active {
    transition: all 0.5s ease;
  }

  .documents-grid-enter-from,
  .documents-grid-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }

  .documents-list-enter-from,
  .documents-list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }

  .documents-grid-leave-active,
  .documents-list-leave-active {
    position: absolute;
  }
</style>