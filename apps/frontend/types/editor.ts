export interface ShortcutConfig {
    prefix: string
    suffix: string
    placeholder: string
    key: string
    modifier: string | string[]
}

export interface ToolbarAction {
    icon: string
    label: string
    tooltip: string
    shortcut?: string
    modalAction?: 'codeBlock' | 'link' | 'table' | 'image'
    action?: string
}

export interface ToolbarSection {
    label: string
    tools: ToolbarAction[]
}

export interface CodeBlockData {
    language: string
    code: string
    position?: {
        start: number
        end: number
    }
}

export interface LinkData {
    text: string
    url: string
    title?: string
    position?: {
        start: number
        end: number
    }
}

export interface TableData {
    rows: number
    cols: number
    headers?: string[]
    alignments?: ('left' | 'center' | 'right')[]
}

export interface EditorState {
    isDragging: boolean
    isEditing: boolean
    selectedText: string
    cursorPosition: number
}

export interface EditorEvents {
    'update:modelValue': [string]
    'insert-markdown': [string, string, string]
    'selection-change': [{ start: number, end: number }]
    'cursor-change': [number]
}

export interface ModifierKeys {
    text: string
    key: string
    altText: string
    altKey: string
    shiftText: string
    shiftKey: string
}