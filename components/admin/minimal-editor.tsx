"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Toggle } from "@/components/ui/toggle"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Image as ImageIcon,
} from "lucide-react"
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'

const Toolbar = ({ editor }: { editor: import('@tiptap/react').Editor | null }) => {
    const addLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('URL Gambar')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    if (!editor) return null

    return (
        <div className="border-b bg-gray-50/50 dark:bg-gray-800/50 p-2 flex flex-wrap gap-1 sticky top-0 z-10 backdrop-blur-sm">
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-border mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <Heading3 className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-border mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('blockquote')}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-border mx-1" />

            <Button variant="ghost" size="sm" onClick={addLink} className={editor.isActive('link') ? 'bg-accent' : ''}>
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={addImage}>
                <ImageIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}

interface MinimalEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
}

export function MinimalEditor({ value, onChange, placeholder = "Tulis sesuatu..." }: MinimalEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'foreground hover:underline cursor-pointer',
                },
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4 shadow-sm',
                },
            }),
            Placeholder.configure({
                placeholder,
            })
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    return (
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

