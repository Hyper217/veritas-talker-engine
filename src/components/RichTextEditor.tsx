import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useMemo } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Bold, Italic, Underline as UnderlineIcon, Highlighter, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-1 mb-1 border-b border-gray-100 sticky top-0 bg-white z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-gray-100 text-black' : 'text-gray-400'}`}
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-gray-100 text-black' : 'text-gray-400'}`}
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('underline') ? 'bg-gray-100 text-black' : 'text-gray-400'}`}
        title="Underline"
      >
        <UnderlineIcon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('highlight') ? 'bg-gray-100 text-black' : 'text-gray-400'}`}
        title="Highlight"
      >
        <Highlighter className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-gray-200 self-center mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-100 text-black' : 'text-gray-400'}`}
        title="Blockquote"
      >
        <Quote className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400"
        title="Undo"
      >
        <Undo className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400"
        title="Redo"
      >
        <Redo className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: Props) {
  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2],
      },
    }),
    Underline,
    Highlight.configure({ multicolor: true }),
  ], []);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none min-h-[100px] p-2 text-[12px] leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded focus-within:ring-1 focus-within:ring-black transition-all overflow-hidden flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="overflow-y-auto max-h-48" />
      
      <style>{`
        .ProseMirror p {
          margin: 0;
        }
        .ProseMirror blockquote {
          border-left: 2px solid #e5e7eb;
          padding-left: 0.5rem;
          margin-left: 0;
          font-style: italic;
        }
        .ProseMirror mark {
          background-color: #fef08a;
          padding: 0 2px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
