<script setup lang="ts">
import type { EditorEvents, EditorState } from "@/types/editor";
import {
  TOOLBAR_SECTIONS,
  checkModifiers,
  createDefaultEditorState,
  createEditorEventHandlers,
  SHORTCUTS,
} from "@/constants/toolbar";
import Toolbar from "@/components/documents/Toolbar.vue";
import MarkdownPreview from "@/components/documents/MarkdownPreview.vue";
import LinkModal from "~/components/documents/LinkModal.vue";
import TableModal from "~/components/documents/TableModal.vue";

const props = defineProps<{
  modelValue: string;
  markdown: string;
}>();

const emit = defineEmits<EditorEvents>();
const editorState = reactive<EditorState>(createDefaultEditorState());
const showLinkModal = ref(false);
const showTableModal = ref(false);
const imageUploadRef = ref<HTMLInputElement | null>(null);

const eventHandlers = createEditorEventHandlers(emit);

function handleKeyboardShortcuts(e: KeyboardEvent) {
  for (const [name, config] of Object.entries(SHORTCUTS)) {
    if (
      e.key.toLowerCase() === config.key.toLowerCase() &&
      checkModifiers(e, config.modifier)
    ) {
      e.preventDefault();

      const selection = getSelection();
      if (selection) {
        editorState.selectedText = selection.content;
        editorState.cursorPosition = selection.start;
      }

      emit(
        "insert-markdown",
        config.prefix,
        config.suffix,
        editorState.selectedText || config.placeholder,
      );
      break;
    }
  }
}

const localTextareaRef = ref<HTMLTextAreaElement | null>(null);

function getSelection() {
  const textarea = localTextareaRef.value;
  if (!textarea) return null;

  return {
    content: props.modelValue.substring(
      textarea.selectionStart,
      textarea.selectionEnd,
    ),
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  };
}

const API_URL = import.meta.env.VITE_API_URL;
const cookie = useCookie("auth-token");

async function handleImageUpload(files: FileList | null) {
  if (!files?.length) return;

  try {
    const formData = new FormData();
    formData.append("image", files[0]);

    const response = await $fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
      body: formData,
    });

    emit("insert-markdown", "![", `](${response.url})`, files[0].name);

    useToast().add({
      title: "Success",
      description: "Image uploaded successfully",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
  } catch (error) {
    useToast().add({
      title: "Error",
      description: "Failed to upload image",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  } finally {
    editorState.isDragging = false;
  }
}

function handleToolbarAction(tool: any) {
  const selection = getSelection();
  if (selection) {
    editorState.selectedText = selection.content;
    editorState.cursorPosition = selection.start;
  }

  if (tool.modalAction) {
    switch (tool.modalAction) {
      case "link":
        showLinkModal.value = true;
        break;
      case "table":
        showTableModal.value = true;
        break;
      case "image":
        imageUploadRef.value?.click();
        break;
    }
  } else if (tool.shortcut && SHORTCUTS[tool.shortcut]) {
    const config = SHORTCUTS[tool.shortcut];
    emit(
      "insert-markdown",
      config.prefix,
      config.suffix,
      editorState.selectedText || config.placeholder,
    );
  } else if (tool.action) {
    emit("insert-markdown", tool.action, "", "");
  }
}
function handleDragOver(e: DragEvent) {
  e.preventDefault();
  editorState.isDragging = true;
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault();
  editorState.isDragging = false;
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  handleImageUpload(e.dataTransfer?.files ?? null);
}

function handleBlur() {
  setTimeout(() => {
    editorState.selectedText = "";
    editorState.cursorPosition = 0;
  }, 100);
}

function handleModalInsert(
  prefix: string,
  suffix: string,
  placeholder: string,
) {
  console.log("Modal insert:", { prefix, suffix, placeholder }); // Debug
  emit("insert-markdown", prefix, suffix, placeholder);
}
</script>

<template>
  <div
    class="grid gap-6 grid-cols-2"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="relative">
      <Toolbar :sections="TOOLBAR_SECTIONS" @action="handleToolbarAction" />

      <UTextarea
        ref="localTextareaRef"
        :model-value="modelValue"
        :rows="20"
        placeholder="Write your markdown content here..."
        class="font-mono w-full resize-none focus:outline-none p-4"
        @update:model-value="emit('update:modelValue', $event)"
        @keydown="handleKeyboardShortcuts"
        @select="eventHandlers.onSelectionChange"
        @blur="handleBlur"
      />

      <input
        ref="imageUploadRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload($event.target?.files)"
      />

      <div
        v-if="editorState.isDragging"
        class="absolute inset-0 border-2 border-dashed border-primary-500 bg-primary-50 dark:bg-primary-900 bg-opacity-50 flex items-center justify-center"
      >
        <p class="text-lg text-primary-700 dark:text-primary-300">
          Drop image here to upload
        </p>
      </div>
    </div>

    <MarkdownPreview :markdown="markdown" />

    <LinkModal v-model="showLinkModal" @insert="handleModalInsert" />

    <TableModal v-model="showTableModal" @insert="handleModalInsert" />
  </div>
</template>

<style scoped>
.textarea-container {
  position: relative;
}

/* Style pour le textarea */
:deep(.textarea) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  line-height: 1.6;
  tab-size: 4;
}

/* Scrollbar styling */
:deep(.textarea)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.textarea)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.textarea)::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark :deep(.textarea)::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>
