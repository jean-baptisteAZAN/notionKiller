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
        if (!documents) return []
        selectedDocumentsList.value = documents.filter(doc => selectedDocumentsIds.value.has(doc.id))
        return selectedDocumentsList.value
    }

    function updateSelectedDocuments(documents: Document[]) {
        if (!documents) return
        selectedDocumentsList.value = documents.filter(doc => selectedDocumentsIds.value.has(doc.id))
    }

    return {
        handleBulkDelete,
        handleBulkExport,
        isBulkProcessing,
        selectedDocuments: selectedDocumentsIds,
        selectedDocumentsList,
        updateSelectedDocuments
    }
}