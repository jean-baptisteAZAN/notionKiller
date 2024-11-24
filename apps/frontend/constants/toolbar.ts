import type {
    ToolbarSection,
    ShortcutConfig,
    ModifierKeys,
    TableData,
    LinkData
} from '@/types/editor'

// Détection Mac OS
const isMac = process.client && navigator.platform.toUpperCase().indexOf('MAC') >= 0

// Configuration des touches de modification
export const MODIFIER_KEY: ModifierKeys = {
    text: isMac ? '⌘' : 'Ctrl',
    key: isMac ? 'metaKey' : 'ctrlKey',
    altText: isMac ? '⌥' : 'Alt',
    altKey: 'altKey',
    shiftText: isMac ? '⇧' : 'Shift',
    shiftKey: 'shiftKey'
}

export const DEFAULT_TABLE_CONFIG: TableData = {
    rows: 3,
    cols: 3,
    headers: ['Header 1', 'Header 2', 'Header 3'],
    alignments: ['left', 'center', 'left']
}

export const DEFAULT_LINK: LinkData = {
    text: '',
    url: '',
    title: '',
    position: {
        start: 0,
        end: 0
    }
}

// Configuration complète des raccourcis
export const SHORTCUTS: Record<string, ShortcutConfig> = {
    // Titres
    'h1': {
        prefix: '# ',
        suffix: '',
        placeholder: 'Heading 1',
        key: '1',
        modifier: MODIFIER_KEY.key
    },
    'h2': {
        prefix: '## ',
        suffix: '',
        placeholder: 'Heading 2',
        key: '2',
        modifier: MODIFIER_KEY.key
    },
    'h3': {
        prefix: '### ',
        suffix: '',
        placeholder: 'Heading 3',
        key: '3',
        modifier: MODIFIER_KEY.key
    },

    // Formatage de texte
    'bold': {
        prefix: '**',
        suffix: '**',
        placeholder: 'bold text',
        key: 'b',
        modifier: MODIFIER_KEY.key
    },
    'italic': {
        prefix: '*',
        suffix: '*',
        placeholder: 'italic text',
        key: 'i',
        modifier: MODIFIER_KEY.key
    },
    'strikethrough': {
        prefix: '~~',
        suffix: '~~',
        placeholder: 'strikethrough text',
        key: 's',
        modifier: [MODIFIER_KEY.key, MODIFIER_KEY.altKey]
    },

    // Code
    'inlineCode': {
        prefix: '`',
        suffix: '`',
        placeholder: 'code',
        key: 'k',
        modifier: MODIFIER_KEY.key
    },

    // Listes
    'bulletList': {
        prefix: '- ',
        suffix: '',
        placeholder: 'list item',
        key: 'u',
        modifier: MODIFIER_KEY.key
    },
    'numberList': {
        prefix: '1. ',
        suffix: '',
        placeholder: 'list item',
        key: 'o',
        modifier: MODIFIER_KEY.key
    },
    'taskList': {
        prefix: '- [ ] ',
        suffix: '',
        placeholder: 'task',
        key: 't',
        modifier: MODIFIER_KEY.key
    },

    // Autres éléments
    'quote': {
        prefix: '> ',
        suffix: '',
        placeholder: 'quote',
        key: 'q',
        modifier: MODIFIER_KEY.key
    },
    'link': {
        prefix: '[',
        suffix: '](url)',
        placeholder: 'link text',
        key: 'l',
        modifier: MODIFIER_KEY.key
    },
    'image': {
        prefix: '![',
        suffix: '](url)',
        placeholder: 'image alt',
        key: 'i',
        modifier: [MODIFIER_KEY.key, MODIFIER_KEY.shiftKey]
    }
}

const createToolbarAction = (
    icon: string,
    label: string,
    options: {
        shortcut?: string,
        modalAction?: 'link' | 'table' | 'image',
        action?: string,
        tooltip?: string
    }
) => ({
    icon,
    label,
    ...options,
    tooltip: options.tooltip || `${label} ${options.shortcut ? `(${MODIFIER_KEY.text}+${options.shortcut})` : ''}`
})

export const TOOLBAR_SECTIONS: ToolbarSection[] = [
    {
        label: 'Headings',
        tools: [
            createToolbarAction('i-heroicons-hashtag', 'Heading 1', {
                shortcut: 'h1',
                tooltip: `Heading 1 (${MODIFIER_KEY.text}+1)`
            }),
            createToolbarAction('i-heroicons-hashtag-20-solid', 'Heading 2', {
                shortcut: 'h2',
                tooltip: `Heading 2 (${MODIFIER_KEY.text}+2)`
            }),
            createToolbarAction('i-heroicons-hashtag-circle', 'Heading 3', {
                shortcut: 'h3',
                tooltip: `Heading 3 (${MODIFIER_KEY.text}+3)`
            })
        ]
    },
    {
        label: 'Text',
        tools: [
            createToolbarAction('i-heroicons-bold', 'Bold', {
                shortcut: 'bold',
                tooltip: `Bold (${MODIFIER_KEY.text}+B)`
            }),
            createToolbarAction('i-heroicons-bars-arrow-down', 'Italic', {
                shortcut: 'italic',
                tooltip: `Italic (${MODIFIER_KEY.text}+I)`
            }),
            createToolbarAction('i-heroicons-minus', 'Strikethrough', {
                shortcut: 'strikethrough',
                tooltip: `Strikethrough (${MODIFIER_KEY.text}+${MODIFIER_KEY.altText}+S)`
            })
        ]
    },
    {
        label: 'Lists',
        tools: [
            createToolbarAction('i-heroicons-list-bullet', 'Bullet List', {
                shortcut: 'bulletList',
                tooltip: `Bullet list (${MODIFIER_KEY.text}+U)`
            }),
            createToolbarAction('i-heroicons-list-ordered', 'Numbered List', {
                shortcut: 'numberList',
                tooltip: `Numbered list (${MODIFIER_KEY.text}+O)`
            }),
            createToolbarAction('i-heroicons-check-circle', 'Task List', {
                shortcut: 'taskList',
                tooltip: `Task list (${MODIFIER_KEY.text}+T)`
            })
        ]
    },
    {
        label: 'Code',
        tools: [
            createToolbarAction('i-heroicons-code-bracket', 'Inline Code', {
                shortcut: 'inlineCode',
                tooltip: `Inline code (${MODIFIER_KEY.text}+K)`
            }),
        ]
    },
    {
        label: 'Insert',
        tools: [
            createToolbarAction('i-heroicons-link', 'Link', {
                modalAction: 'link',
                tooltip: `Insert link (${MODIFIER_KEY.text}+L)`
            }),
            createToolbarAction('i-heroicons-photo', 'Image', {
                modalAction: 'image',
                tooltip: `Insert image (${MODIFIER_KEY.text}+${MODIFIER_KEY.shiftText}+I)`
            }),
            createToolbarAction('i-heroicons-table-cells', 'Table', {
                modalAction: 'table',
                tooltip: 'Insert table'
            })
        ]
    },
    {
        label: 'Other',
        tools: [
            createToolbarAction('i-heroicons-quote-right', 'Blockquote', {
                shortcut: 'quote',
                tooltip: `Quote (${MODIFIER_KEY.text}+Q)`
            }),
            createToolbarAction('i-heroicons-minus', 'Horizontal Rule', {
                action: '\n---\n',
                tooltip: 'Horizontal rule'
            })
        ]
    }
]

export const checkModifiers = (
    event: KeyboardEvent,
    modifiers: string | string[]
): boolean => {
    const mods = Array.isArray(modifiers) ? modifiers : [modifiers]
    return mods.every(mod => event[mod as keyof KeyboardEvent])
}

export const createDefaultEditorState = () => ({
    isDragging: false,
    isEditing: false,
    selectedText: '',
    cursorPosition: 0
})

export const createEditorEventHandlers = (emit: any) => ({
    onSelectionChange: (event: Event) => {
        const target = event.target as HTMLTextAreaElement
        emit('selection-change', {
            start: target.selectionStart,
            end: target.selectionEnd
        })
    },
    onCursorChange: (event: Event) => {
        const target = event.target as HTMLTextAreaElement
        emit('cursor-change', target.selectionStart)
    }
})