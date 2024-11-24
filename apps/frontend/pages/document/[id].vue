<script setup lang="ts">
import { useDocument } from "@/composables/useDocument";
import { useMarkdown } from "@/composables/useMarkdown";
import { useAutoSave } from "@/composables/useAutoSave";
import { useNotifications } from "@/composables/useNotifications";
import { useConfirm } from "@/composables/useConfirm";
import {
  duplicateDocument,
  renameDocument,
  exportDocument,
} from "@/utils/docsOperations";
import DocumentEditor from "@/components/documents/index.vue";
import MarkdownPreview from "~/components/documents/MarkdownPreview.vue";

const route = useRoute();
const router = useRouter();
const documentId = route.params.id as string;

const { notifySuccess, notifyError } = useNotifications();
const { document, isLoading, fetchDocument, saveDocument, deleteDocument } =
  useDocument(documentId);

const { editedContent, renderedMarkdown, insertMarkdown } = useMarkdown();

const { hasUnsavedChanges, debouncedSave } = useAutoSave(saveDocument);

const isEditing = ref(false);

watch(
  () => document.value?.content,
  (newContent) => {
    if (newContent !== undefined) {
      editedContent.value = newContent;
    }
  },
  { immediate: true },
);

watch(editedContent, (newContent) => {
  hasUnsavedChanges.value = true;
  debouncedSave(newContent);
});

const isEditingCookie = useCookie("document-editing-state");
onMounted(() => {
  if (isEditingCookie.value === "true") {
    isEditing.value = true;
  }
});

watch(isEditing, (newValue) => {
  isEditingCookie.value = newValue ? "true" : "false";
});

async function handleSave() {
  try {
    await saveDocument(editedContent.value);
    isEditing.value = false;
    notifySuccess("Document saved successfully");
  } catch (error) {
    notifyError("Failed to save document");
  }
}

async function handleDelete() {
  const confirmDialog = useConfirm();

  try {
    const confirmed = await confirmDialog.confirm({
      title: "Delete Document",
      message:
        "Are you sure you want to delete this document? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      confirmButtonColor: "red",
    });

    if (confirmed) {
      await deleteDocument();
      notifySuccess("Document deleted successfully");
      navigateTo("/dashboard");
    }
  } catch (error) {
    notifyError("Failed to delete document");
  }
}

async function handleDuplicate() {
  try {
    if (!document.value) return;
    const { success, data } = await duplicateDocument(document.value);
    if (success && data) {
      notifySuccess("Document duplicated successfully");
      navigateTo(`/document/${data.id}`);
    }
  } catch (error) {
    notifyError("Failed to duplicate document");
  }
}

async function handleRename(newTitle: string) {
  try {
    const { success } = await renameDocument(documentId, newTitle);
    if (success) {
      await fetchDocument(); // Recharger le document pour mettre à jour le titre
      notifySuccess("Document renamed successfully");
    }
  } catch (error) {
    notifyError("Failed to rename document");
  }
}

async function handleExport(options = { format: "markdown" as const }) {
  try {
    if (!document.value) return;

    const result = await exportDocument(document.value, {
      ...options,
      includeMetadata: true,
    });

    if (result.success) {
      notifySuccess(`Document exported successfully as ${result.format}`);
    }
  } catch (error) {
    notifyError(`Failed to export document: ${error.message}`);
  }
}

function handleInsertMarkdown(
  prefix: string,
  suffix: string,
  placeholder: string,
) {
  insertMarkdown(prefix, suffix, placeholder);
}

// Initialisation
onMounted(async () => {
  await fetchDocument();
  if (document.value?.content) {
    editedContent.value = document.value.content;
  }
});
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
          @save="handleSave"
          @delete="handleDelete"
          @duplicate="handleDuplicate"
          @rename="handleRename"
          @export="handleExport"
        />

        <DocumentEditor
          v-if="isEditing"
          v-model="editedContent"
          :markdown="renderedMarkdown"
          @insert-markdown="handleInsertMarkdown"
        />

        <MarkdownPreview v-else :markdown="renderedMarkdown" />
      </template>
    </div>
  </div>
</template>
