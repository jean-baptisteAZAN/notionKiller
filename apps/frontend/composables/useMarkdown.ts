import MarkdownIt from 'markdown-it'
import { ref, computed } from 'vue'

export function useMarkdown(initialContent = '') {
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true
    })

    const editedContent = ref(initialContent)

    const renderedMarkdown = computed(() => {
        return md.render(editedContent.value || '')
    })

    function insertMarkdown(prefix: string, suffix: string, placeholder: string) {
        const currentContent = editedContent.value
        if (!currentContent) {
            const newContent = prefix + placeholder + suffix
            editedContent.value = newContent
            return
        }
        const needsNewLine = !currentContent.endsWith('\n') && !prefix.startsWith('\n')
        const newContent = currentContent +
            (needsNewLine ? '\n' : '') +
            prefix +
            placeholder +
            suffix +
            (suffix.endsWith('\n') ? '' : '\n')

        editedContent.value = newContent
        window.dispatchEvent(new CustomEvent('content-updated'))
    }

    function setContent(content: string) {
        editedContent.value = content
    }

    function getContent() {
        return editedContent.value
    }

    return {
        editedContent,
        renderedMarkdown,
        insertMarkdown,
        setContent,
        getContent
    }
}