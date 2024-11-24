import { ref, computed } from 'vue'
import type { Document } from '@/types/document'

export function useDocument(documentId: string) {
    const document = ref<Document | null>(null)
    const isLoading = ref(true)
    const isSaving = ref(false)

    const API_URL = import.meta.env.VITE_API_URL
    const cookie = useCookie('auth-token')

    async function fetchDocument() {
        try {
            isLoading.value = true
            const response = await $fetch(`${API_URL}/documents/${documentId}`, {
                headers: {
                    'Authorization': `Bearer ${cookie.value}`
                }
            })
            document.value = response
        } catch (error) {
            useToast().add({
                title: 'Error',
                description: 'Failed to load document',
                icon: 'i-heroicons-x-circle',
                color: 'red'
            })
        } finally {
            isLoading.value = false
        }
    }

    async function saveDocument(content: string, isAutoSave = false) {
        if (isSaving.value) return
        try {
            isSaving.value = true
            const response = await $fetch(`${API_URL}/documents/${documentId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${cookie.value}`
                },
                body: {
                    title: document.value?.title,
                    content
                }
            })
            console.log(response);

            document.value = response

            if (!isAutoSave) {
                useToast().add({
                    title: 'Success',
                    description: 'Document saved successfully',
                    icon: 'i-heroicons-check-circle',
                    color: 'green'
                })
            }

            return true
        } catch (error) {
            useToast().add({
                title: 'Error',
                description: 'Failed to save document',
                icon: 'i-heroicons-x-circle',
                color: 'red'
            })
            return false
        } finally {
            isSaving.value = false
        }
    }

    async function deleteDocument() {
        try {
            await $fetch(`${API_URL}/documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${cookie.value}`
                }
            })
            return true
        } catch (error) {
            useToast().add({
                title: 'Error',
                description: 'Failed to delete document',
                icon: 'i-heroicons-x-circle',
                color: 'red'
            })
            return false
        }
    }

    return {
        document,
        isLoading,
        isSaving,
        fetchDocument,
        saveDocument,
        deleteDocument
    }
}