import type { Document } from "@notionkiller/shared/types";

export function useBulkActions() {
    const API_URL = import.meta.env.VITE_API_URL
    const cookie = useCookie('auth-token')
    const toast = useToast()
    const isBulkProcessing = ref(false)

    async function handleBulkDelete(documentsIds: Set<number>) {
        const confirmDialog = useConfirm()

        try {
            // Confirmer la suppression
            const confirmed = await confirmDialog.confirm({
                title: 'Delete Multiple Documents',
                message: `Are you sure you want to delete ${documentsIds.size} document${documentsIds.size > 1 ? 's' : ''}? This action cannot be undone.`,
                confirmLabel: 'Delete All',
                cancelLabel: 'Cancel',
                confirmButtonColor: 'red'
            })

            if (!confirmed) return

            isBulkProcessing.value = true

            // Supprimer les documents en parallèle
            const deletePromises = Array.from(documentsIds).map(id =>
                $fetch(`${API_URL}/documents/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${cookie.value}`
                    }
                })
            )

            await Promise.all(deletePromises)

            toast.add({
                title: 'Success',
                description: `Successfully deleted ${documentsIds.size} document${documentsIds.size > 1 ? 's' : ''}`,
                icon: 'i-heroicons-check-circle',
                color: 'green'
            })

            // Retourner true pour indiquer le succès
            return true
        } catch (error) {
            toast.add({
                title: 'Error',
                description: 'Failed to delete some documents',
                icon: 'i-heroicons-x-circle',
                color: 'red'
            })
            return false
        } finally {
            isBulkProcessing.value = false
        }
    }

    async function handleBulkExport(selectedDocuments: Document[]) {
        try {
            isBulkProcessing.value = true

            // Modal pour choisir le format d'export
            const exportModal = useModal()
            const result = await new Promise<{ format: 'markdown' | 'html' | 'txt' } | null>(resolve => {
                exportModal.open({
                    title: 'Export Documents',
                    content: 'Choose export format:',
                    buttons: [
                        {
                            label: 'Markdown (.md)',
                            click: () => resolve({ format: 'markdown' })
                        },
                        {
                            label: 'HTML (.html)',
                            click: () => resolve({ format: 'html' })
                        },
                        {
                            label: 'Plain Text (.txt)',
                            click: () => resolve({ format: 'txt' })
                        },
                        {
                            label: 'Cancel',
                            click: () => resolve(null)
                        }
                    ]
                })
            })

            if (!result) return

            // Créer un fichier zip
            const JSZip = await import('jszip')
            const zip = new JSZip.default()

            // Ajouter chaque document au zip
            for (const doc of selectedDocuments) {
                let content = ''
                let extension = ''

                switch (result.format) {
                    case 'markdown':
                        content = `# ${doc.title}\n\n${doc.content}`
                        extension = 'md'
                        break
                    case 'html':
                        const marked = await import('marked')
                        content = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>${doc.title}</title>
                <style>
                  body { max-width: 800px; margin: 40px auto; padding: 0 20px; font-family: -apple-system, system-ui, sans-serif; }
                  pre { background: #f5f5f5; padding: 1em; overflow-x: auto; }
                  img { max-width: 100%; }
                </style>
              </head>
              <body>
                <h1>${doc.title}</h1>
                ${marked.parse(doc.content)}
              </body>
              </html>
            `
                        extension = 'html'
                        break
                    case 'txt':
                        content = `${doc.title}\n\n${doc.content.replace(/[#*`]/g, '')}`
                        extension = 'txt'
                        break
                }

                zip.file(`${doc.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`, content)
            }

            // Générer et télécharger le zip
            const blob = await zip.generateAsync({ type: 'blob' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `documents_export_${new Date().toISOString().split('T')[0]}.zip`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast.add({
                title: 'Success',
                description: `Successfully exported ${selectedDocuments.length} document${selectedDocuments.length > 1 ? 's' : ''}`,
                icon: 'i-heroicons-check-circle',
                color: 'green'
            })
        } catch (error) {
            toast.add({
                title: 'Error',
                description: 'Failed to export documents',
                icon: 'i-heroicons-x-circle',
                color: 'red'
            })
        } finally {
            isBulkProcessing.value = false
        }
    }

    return {
        handleBulkDelete,
        handleBulkExport,
        isBulkProcessing
    }
}