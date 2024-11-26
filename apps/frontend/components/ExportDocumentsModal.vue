<script setup lang="ts">
import type { Document } from "@notionkiller/shared/types";
import JSZip from 'jszip';
import MarkdownIt from 'markdown-it';

type ExportFormat = "markdown" | "html" | "txt";

const props = defineProps<{
  documents: Document[]
}>()

const modal = ref()
const isLoading = ref(false)
const selectedFormat = ref<ExportFormat>('markdown')
const toast = useToast()

const formatOptions = [
  { label: 'Markdown (.md)', value: 'markdown' },
  { label: 'HTML (.html)', value: 'html' },
  { label: 'Text (.txt)', value: 'txt' }
]

function openModal() {
  selectedFormat.value = 'markdown'
  isLoading.value = false
  modal.value?.open()
}

async function generateExportContent(doc: Document, format: ExportFormat) {
  let content = ''

  const metadata = [
    `---`,
    `title: ${doc.title}`,
    `created: ${doc.created_at}`,
    `updated: ${doc.updated_at}`,
    `---\n\n`,
  ].join('\n')

  content = metadata + doc.content

  if (format === 'html') {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })

    content = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${doc.title}</title>
                <style>
                    body {
                        max-width: 800px;
                        margin: 40px auto;
                        padding: 0 20px;
                        font-family: -apple-system, system-ui, sans-serif;
                        line-height: 1.6;
                    }
                    pre { background: #f5f5f5; padding: 1em; }
                    img { max-width: 100%; }
                    .metadata {
                        color: #666;
                        font-size: 0.9em;
                        margin-bottom: 2em;
                    }
                </style>
            </head>
            <body>
                <h1>${doc.title}</h1>
                <div class="metadata">
                    Last updated: ${new Date(doc.updated_at).toLocaleString()}
                </div>
                ${md.render(doc.content)}
            </body>
            </html>
        `.trim()
  } else if (format === 'txt') {
    content = content
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`{3}[\s\S]*?`{3}/g, '')
  }

  return content
}

async function handleExport() {
  if (props.documents.length === 0) {
    toast.add({
      title: 'Warning',
      description: 'No documents selected for export',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'yellow'
    })
    return
  }

  try {
    isLoading.value = true

    const zip = new JSZip()
    const folderName = `export_${new Date().toISOString().split('T')[0]}`
    const folder = zip.folder(folderName)

    if (!folder) throw new Error('Failed to create zip folder')

    for (const doc of props.documents) {
      const content = await generateExportContent(doc, selectedFormat.value)
      const extension = selectedFormat.value === 'markdown' ? 'md' : selectedFormat.value
      const sanitizedFileName = doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      folder.file(`${sanitizedFileName}.${extension}`, content)
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${folderName}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.add({
      title: 'Success',
      description: `Successfully exported ${props.documents.length} documents`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })

    modal.value?.close()
  } catch (error) {
    console.error('Export error:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to export documents',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  openModal
})
</script>

<template>
  <UModal ref="modal" :ui="{ width: 'sm:max-w-md' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Export {{ documents.length }} Documents
          </h3>
        </div>
      </template>

      <div class="space-y-4">
        <UFormGroup label="Export Format">
          <USelect
              v-model="selectedFormat"
              :options="formatOptions"
              placeholder="Select a format"
          />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
              color="gray"
              variant="ghost"
              label="Cancel"
              @click="modal?.close()"
          />
          <UButton
              color="primary"
              :loading="isLoading"
              :disabled="isLoading"
              label="Export"
              @click="handleExport"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>