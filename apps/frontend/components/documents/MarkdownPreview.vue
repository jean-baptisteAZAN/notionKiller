<script setup lang="ts">
defineProps<{
  markdown: string;
}>();
</script>

<template>
  <div
    class="prose max-w-none dark:prose-invert bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm overflow-auto"
  >
    <div v-html="markdown" />
  </div>
</template>

<style>
.prose code:not(pre code) {
  background-color: #f3f4f6;
  color: #1f2937;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-weight: 500;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 0.875em;
  color: inherit;
  font-weight: normal;
}

.dark .prose code:not(pre code) {
  background-color: #374151;
  color: #f9fafb;
}

.dark .prose pre {
  background-color: #111827;
}

.prose pre code .keyword {
  color: #93c5fd;
}

.prose pre code .string {
  color: #86efac;
}

.prose pre code .comment {
  color: #9ca3af;
}

.prose pre {
  border: 1px solid #e5e7eb;
}

.dark .prose pre {
  border-color: #374151;
}

.prose pre:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.prose pre code .line-highlight {
  background-color: rgba(255, 255, 255, 0.1);
  display: block;
  margin: 0 -1rem;
  padding: 0 1rem;
}

.prose pre {
  position: relative;
}

.prose pre[data-language]::before {
  content: attr(data-language);
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 500;
}
</style>
