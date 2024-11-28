import { ref } from 'vue'

interface SharedUser {
    id: number;
    email: string;
    name: string;
    permission_level: 'read' | 'write';
    created_at: string;
}

export function useDocumentShare() {
    const API_URL = import.meta.env.VITE_API_URL;
    const cookie = useCookie('auth-token');  // Ajout du cookie
    const isLoading = ref(false);
    const sharedUsers = ref<SharedUser[]>([]);

    const fetchSharedUsers = async (documentId: number) => {
        try {
            isLoading.value = true;
            const response = await $fetch<SharedUser[]>(`${API_URL}/documents/${documentId}/collaborators`, {
                headers: {
                    Authorization: `Bearer ${cookie.value}`,
                }
            });
            sharedUsers.value = response;
        } catch (err) {
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const shareDocument = async (documentId: number, email: string, permission: 'read' | 'write' = 'write') => {
        try {
            isLoading.value = true;
            await $fetch(`${API_URL}/documents/${documentId}/collaborators`, {
                method: 'POST',
                body: { email, permission_level: permission },
                headers: {
                    Authorization: `Bearer ${cookie.value}`,
                }
            });
            await fetchSharedUsers(documentId);
        } catch (err) {
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const removeShare = async (documentId: number, userId: number) => {
        try {
            isLoading.value = true;
            await $fetch(`${API_URL}/documents/${documentId}/collaborators/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${cookie.value}`,
                }
            });
            await fetchSharedUsers(documentId);
        } catch (err) {
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        sharedUsers,
        isLoading,
        shareDocument,
        removeShare,
        fetchSharedUsers,
    };
}