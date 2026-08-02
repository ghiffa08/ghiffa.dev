import { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { Youtube } from '@tiptap/extension-youtube';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { uploadToCloudinary } from '../../utils/cloudinary';

// ─── StarterKit already includes:
//   Bold, Italic, Strike, Code, CodeBlock, Blockquote, HorizontalRule, Heading,
//   BulletList, OrderedList, HardBreak, History, Underline, Link, Paragraph, etc.
// We ONLY add extensions NOT in StarterKit: Image, TextAlign, Youtube, Table.

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  bold:        'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
  italic:      'M19 4h-9M14 20H5M15 4 9 20',
  underline:   'M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16',
  strike:      'M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16',
  ul:          'M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01',
  ol:          'M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1',
  quote:       'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z',
  code:        'M16 18l6-6-6-6M8 6l-6 6 6 6',
  hr:          'M5 12h14',
  link:        'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  image:       'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  youtube:     'M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z',
  table:       'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
  alignLeft:   'M21 6H3M15 12H3M17 18H3',
  alignCenter: 'M21 6H3M17 12H7M19 18H5',
  alignRight:  'M21 6H3M21 12H9M21 18H11',
  undo:        'M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13',
  redo:        'M21 7v6h-6M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13',
};

// ─── Toolbar Button ────────────────────────────────────────────────────────
function ToolbarBtn({ onClick, active, title, iconKey, children, disabled }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      className={[
        'flex items-center justify-center w-8 h-8 transition-all duration-150 text-xs font-mono font-bold',
        active   ? 'bg-[#111111] text-white' : 'bg-transparent text-[#444444] hover:bg-[#F0F0F0] hover:text-[#111111]',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {iconKey ? <Icon d={ICONS[iconKey]} /> : children}
    </button>
  );
}

const Sep = () => <div className="w-px h-6 bg-[#E5E5E5] mx-0.5 self-center shrink-0" />;

// ─── Main Editor ──────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange }) {
  const imgInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      // StarterKit already includes: Bold, Italic, Strike, Underline, Link,
      // Code, CodeBlock, Heading(1-6), BulletList, OrderedList, Blockquote,
      // HorizontalRule, History, HardBreak, Document, Paragraph, Text, Gapcursor
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // codeBlock uses default (no lowlight), that's fine
      }),
      // Extensions NOT in StarterKit:
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ controls: true, nocookie: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // ── Sync editor content when value changes externally (edit mode) ─────
  // MUST be in useEffect to avoid setState-during-render React error
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      // Use queueMicrotask to ensure we're outside the render cycle
      queueMicrotask(() => {
        editor.commands.setContent(value || '', false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // ── Image upload ──────────────────────────────────────────────────────
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    e.target.value = '';
    try {
      const url = await uploadToCloudinary(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    }
  }, [editor]);

  // ── Link toggle ───────────────────────────────────────────────────────
  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL:', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  // ── YouTube embed ─────────────────────────────────────────────────────
  const handleYouTube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Paste YouTube URL:');
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  // ── Table ─────────────────────────────────────────────────────────────
  const handleInsertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return (
    <div className="border border-[#E5E5E5] bg-white min-h-[200px] flex items-center justify-center">
      <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Loading editor...</span>
    </div>
  );

  const isActive = (type, opts) => editor.isActive(type, opts);
  const can = editor.can();

  return (
    <div className="border border-[#E5E5E5] bg-white">
      {/* ── TOOLBAR ── */}
      <div className="flex flex-wrap items-center gap-0 p-2 border-b border-[#E5E5E5] bg-[#FAFAFA] sticky top-0 z-10">
        {/* History */}
        <ToolbarBtn title="Undo (Ctrl+Z)" iconKey="undo" onClick={() => editor.chain().focus().undo().run()} disabled={!can.undo()} />
        <ToolbarBtn title="Redo (Ctrl+Y)" iconKey="redo" onClick={() => editor.chain().focus().redo().run()} disabled={!can.redo()} />
        <Sep />

        {/* Headings */}
        <ToolbarBtn title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={isActive('heading', { level: 1 })}><span className="text-[11px] font-black">H1</span></ToolbarBtn>
        <ToolbarBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={isActive('heading', { level: 2 })}><span className="text-[11px] font-black">H2</span></ToolbarBtn>
        <ToolbarBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={isActive('heading', { level: 3 })}><span className="text-[11px] font-black">H3</span></ToolbarBtn>
        <Sep />

        {/* Marks */}
        <ToolbarBtn title="Bold (Ctrl+B)"        iconKey="bold"      onClick={() => editor.chain().focus().toggleBold().run()}      active={isActive('bold')} />
        <ToolbarBtn title="Italic (Ctrl+I)"      iconKey="italic"    onClick={() => editor.chain().focus().toggleItalic().run()}    active={isActive('italic')} />
        <ToolbarBtn title="Underline (Ctrl+U)"   iconKey="underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={isActive('underline')} />
        <ToolbarBtn title="Strikethrough"        iconKey="strike"    onClick={() => editor.chain().focus().toggleStrike().run()}    active={isActive('strike')} />
        <Sep />

        {/* Alignment */}
        <ToolbarBtn title="Align Left"   iconKey="alignLeft"   onClick={() => editor.chain().focus().setTextAlign('left').run()}   active={isActive({ textAlign: 'left' })} />
        <ToolbarBtn title="Align Center" iconKey="alignCenter" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={isActive({ textAlign: 'center' })} />
        <ToolbarBtn title="Align Right"  iconKey="alignRight"  onClick={() => editor.chain().focus().setTextAlign('right').run()}  active={isActive({ textAlign: 'right' })} />
        <Sep />

        {/* Blocks */}
        <ToolbarBtn title="Bullet List"   iconKey="ul"    onClick={() => editor.chain().focus().toggleBulletList().run()}  active={isActive('bulletList')} />
        <ToolbarBtn title="Ordered List"  iconKey="ol"    onClick={() => editor.chain().focus().toggleOrderedList().run()} active={isActive('orderedList')} />
        <ToolbarBtn title="Blockquote"    iconKey="quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={isActive('blockquote')} />
        <ToolbarBtn title="Code Block"    iconKey="code"  onClick={() => editor.chain().focus().toggleCodeBlock().run()}   active={isActive('codeBlock')} />
        <ToolbarBtn title="Divider Line"  iconKey="hr"    onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <Sep />

        {/* Media & Links */}
        <ToolbarBtn title="Insert / Edit Link" iconKey="link"    onClick={handleSetLink}                      active={isActive('link')} />
        <ToolbarBtn title="Upload Image"        iconKey="image"   onClick={() => imgInputRef.current?.click()} />
        <ToolbarBtn title="Embed YouTube Video" iconKey="youtube" onClick={handleYouTube} />
        <ToolbarBtn title="Insert Table"        iconKey="table"   onClick={handleInsertTable} />
        <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* ── EDITOR AREA ── */}
      <EditorContent
        editor={editor}
        className="rich-editor-content min-h-[400px] px-6 py-5"
      />

      {/* ── Scoped Styles ── */}
      <style>{`
        .rich-editor-content .ProseMirror {
          min-height: 380px;
          outline: none;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #222;
          line-height: 1.8;
          caret-color: #111;
        }
        .rich-editor-content .ProseMirror p.is-editor-empty:first-child::before {
          color: #aaa;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .rich-editor-content .ProseMirror h1 { font-family: 'Playfair Display', serif; font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 0.75rem; color: #111; line-height: 1.2; }
        .rich-editor-content .ProseMirror h2 { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; margin: 1.25rem 0 0.6rem; color: #111; }
        .rich-editor-content .ProseMirror h3 { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 600; margin: 1rem 0 0.5rem; color: #111; }
        .rich-editor-content .ProseMirror p { margin: 0 0 1rem; }
        .rich-editor-content .ProseMirror ul,
        .rich-editor-content .ProseMirror ol { padding-left: 1.5rem; margin: 0 0 1rem; }
        .rich-editor-content .ProseMirror li { margin-bottom: 0.3rem; }
        .rich-editor-content .ProseMirror blockquote {
          border-left: 3px solid #111; margin: 1.5rem 0;
          padding: 0.75rem 1.25rem; background: #F5F5F5;
          font-style: italic; color: #555;
        }
        .rich-editor-content .ProseMirror code {
          font-family: 'JetBrains Mono', monospace;
          background: #F0F0F0; padding: 0.1rem 0.35rem;
          font-size: 0.875em; border: 1px solid #E5E5E5;
        }
        .rich-editor-content .ProseMirror pre {
          background: #111; color: #fafafa;
          padding: 1.25rem; overflow-x: auto; margin: 1.25rem 0;
        }
        .rich-editor-content .ProseMirror pre code { background: transparent; border: none; color: inherit; padding: 0; }
        .rich-editor-content .ProseMirror img {
          max-width: 100%; height: auto; margin: 1.5rem 0;
          border: 1px solid #E5E5E5; display: block;
        }
        .rich-editor-content .ProseMirror a { color: #111; text-decoration: underline; text-underline-offset: 3px; }
        .rich-editor-content .ProseMirror hr { border: none; border-top: 1px solid #E5E5E5; margin: 1.75rem 0; }
        .rich-editor-content .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; overflow: hidden; }
        .rich-editor-content .ProseMirror th,
        .rich-editor-content .ProseMirror td { border: 1px solid #E5E5E5; padding: 0.6rem 0.9rem; text-align: left; }
        .rich-editor-content .ProseMirror th {
          background: #F5F5F5; font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .rich-editor-content .ProseMirror .selectedCell { background: rgba(0,0,0,0.05); }
        .rich-editor-content .ProseMirror iframe,
        .rich-editor-content .ProseMirror .youtube-embed {
          width: 100%; aspect-ratio: 16/9;
          margin: 1.5rem 0; border: 1px solid #E5E5E5; display: block;
        }
      `}</style>
    </div>
  );
}
