import type { Document } from "@notionkiller/shared/types";
import { ref } from 'vue'

export function useBulkActions() {
    const API_URL = import.meta.env.VITE_API_URL
    const cookie = useCookie('auth-token')
    const toast = useToast()
    const isBulkProcessing = ref(false)
    const confirmDialog = useConfirm()
    const selectedDocumentsIds = ref(new Set<number>())
    const selectedDocumentsList = ref<Document[]>([])

    async function handleBulkDelete(documentsIds: Set<number>) {
        try {
            const confirmed = await confirmDialog.confirm({
                title: 'Confirm Deletion',
                content: `Are you sure you want to delete ${documentsIds.size} documents? This action cannot be undone.`,
                confirmLabel: 'Delete',
                cancelLabel: 'Cancel',
                type: 'danger'
            })

            if (!confirmed) return false

            isBulkProcessing.value = true

            const deletePromises = Array.from(documentsIds).map(id =>
                $fetch(`${API_URL}/documents/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${cookie.value}`
                    }
                }).catch(error => {
                    console.error(`Failed to delete document ${id}:`, error)
                    throw error
                })
            )

            await Promise.all(deletePromises)

            selectedDocumentsIds.value.clear()
            selectedDocumentsList.value = []

            toast.add({
                title: 'Success',
                description: `Successfully deleted ${documentsIds.size} documents`,
                icon: 'i-heroicons-check-circle',
                color: 'green'
            })

            return true
        } catch (error) {
            console.error('Bulk delete error:', error)
            toast.add({
                title: 'Error',
                description: 'Failed to delete documents',
                icon: 'i-heroicons-x-circle',
                color: 'red'
            })
            return false
        } finally {
            isBulkProcessing.value = false
        }
    }

    async function handleBulkExport(documents: Document[]) {
        try {
            isBulkProcessing.value = true;
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            documents.forEach((doc) => {
                const htmlContent = `
                <html>
                    <head><title>${doc.title}</title></head>
                    <body>${doc.content}</body>
                </html>`;
                zip.file(`${doc.title}.html`, htmlContent);
            });
            const blob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'documents-export.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.add({
                title: 'Success',
                description: `${documents.length} documents exported successfully`,
                icon: 'i-heroicons-check-circle',
                color: 'green'
            });
        } catch (error) {
            console.error('Export error:', error);
            toast.add({
                title: 'Error',
                description: 'Failed to export documents',
                icon: 'i-heroicons-x-circle',
                color: 'red'
            });
        } finally {
            isBulkProcessing.value = false;
        }
    }

    return {
        handleBulkDelete,
        handleBulkExport,
        isBulkProcessing,
        selectedDocuments: selectedDocumentsIds,
        selectedDocumentsList,
    }
}
