import React, { useEffect, useRef, useContext, useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Stack, IconButton, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { LeftArrowIcon } from "@/components/icons/left-arrow-icon";
import { RightArrowIcon } from "@/components/icons/right-arrow-icon";
import { useMessageTemplate } from '@/widgets/settings-mailing/useMessageTemplate';
import { useStyle } from './style';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import LinkIcon from '@mui/icons-material/Link';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatTextdirectionLToRIcon from '@mui/icons-material/FormatTextdirectionLToR';
import FormatTextdirectionRToLIcon from '@mui/icons-material/FormatTextdirectionRToL';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { SimpleTemplateVariable } from './extensions/simple-template-variable';

interface IProps {
    value: string | null | undefined;
    setValue: (value: string) => void;
}

const RichTextEditor = ({ value, setValue }: IProps) => {
    const { templateVariables } = useMessageTemplate();
    const { classes } = useStyle();
    const { t } = useTranslation();
    const isUpdatingRef = useRef(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;
    const dir: 'rtl' | 'ltr' = t('direction');
    const RTL = dir === 'rtl';
    const apiRef: { current: scrollVisibilityApiType } = useRef(null);

    useEffect(() => {
        if (RTL && apiRef.current?.scrollContainer.current) {
            apiRef.current.scrollContainer.current.scrollLeft = 99999;
        }
    }, [apiRef, RTL]);

    // Handle Escape key to exit fullscreen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        
        if (isFullscreen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when in fullscreen
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);

    // Normalize and sanitize value to always be a valid string
    const normalizedValue = useMemo(() => {
        if (!value || typeof value !== 'string') return '';
        
        try {
            const trimmedValue = value.trim();
            if (!trimmedValue || trimmedValue === '<br>' || trimmedValue === '<br/>') {
                return '';
            }
            
            // Create a temporary DOM element to parse and sanitize HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(trimmedValue, 'text/html');
            
            // If parsing resulted in an error (invalid HTML), return empty string
            if (doc.querySelector('parsererror')) {
                console.warn('Invalid HTML detected in template, using empty content');
                return '';
            }
            
            // Get the body element
            const body = doc.body;
            
            // Remove elements that might cause issues
            const unsupportedTags = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea', 'meta', 'link', 'base'];
            unsupportedTags.forEach(tag => {
                const elements = body.querySelectorAll(tag);
                elements.forEach(el => {
                    try {
                        el.remove();
                    } catch (e) {
                        // Ignore removal errors
                    }
                });
            });
            
            // Get the sanitized HTML
            let sanitized = body.innerHTML;
            
            // Ensure we have valid HTML structure
            if (!sanitized || sanitized.trim() === '' || sanitized.trim() === '<br>' || sanitized.trim() === '<br/>') {
                return '';
            }
            
            // Ensure content starts with a block element
            const trimmedSanitized = sanitized.trim();
            if (!trimmedSanitized.match(/^<(p|div|h[1-6]|blockquote|pre|ul|ol|li)/i)) {
                sanitized = `<p>${trimmedSanitized}</p>`;
            }
            
            return sanitized;
        } catch (error) {
            console.warn('Error sanitizing HTML:', error);
            return '';
        }
    }, [value]);

    const editor = useEditor({
        immediatelyRender: false, // Fix SSR hydration issues in Next.js
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            SimpleTemplateVariable,
        ],
        content: normalizedValue,
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
                dir: dir,
            },
        },
        onUpdate: ({ editor }) => {
            // Prevent infinite loops and handle updates safely
            if (isUpdatingRef.current) return;
            
            try {
                // Ensure editor is fully initialized
                if (!editor || !editor.view || !editor.view.state || !editor.view.state.doc) {
                    return;
                }
                
                // Always get HTML, never JSON
                const html = editor.getHTML();
                
                if (html !== undefined && html !== null && html !== '') {
                    isUpdatingRef.current = true;
                    setValue(html);
                    // Reset flag after a short delay
                    setTimeout(() => {
                        isUpdatingRef.current = false;
                    }, 0);
                }
            } catch (error) {
                console.warn('Error in onUpdate callback:', error);
                isUpdatingRef.current = false;
                // Don't set value if there's an error to avoid saving invalid data
            }
        },
    });

    // Update editor content when value prop changes externally
    useEffect(() => {
        if (isUpdatingRef.current) return; // Skip if we're in the middle of an update
        
        if (editor?.view?.state) {
            try {
                const currentHtml = editor.getHTML();
                if (normalizedValue !== currentHtml) {
                    isUpdatingRef.current = true;
                    editor.commands.setContent(normalizedValue || '', { emitUpdate: false });
                    setTimeout(() => {
                        isUpdatingRef.current = false;
                    }, 0);
                }
            } catch (error) {
                console.warn('Error setting editor content:', error);
                isUpdatingRef.current = false;
            }
        }
    }, [normalizedValue, editor]);

    // Function to add template variable (matching QuillEditor behavior)
    const addTemplateVariable = useCallback((variable: any) => {
        if (!editor || !editor.view?.state) return;

        try {
            // Ensure we have valid marker and label
            if (!variable?.value || !variable?.label) {
                console.warn('Invalid variable data:', variable);
                return;
            }

            // Insert the variable and space in one chain
            editor
                .chain()
                .focus()
                .setSimpleTemplateVariable({
                    marker: variable.value,
                    title: variable.label,
                })
                .insertContent(' ')
                .run();
        } catch (error) {
            console.warn('Error inserting template variable:', error);
        }
    }, [editor]);

    // ScrollMenu arrow components
    function LeftArrow() {
        const { scrollPrev } = useContext(VisibilityContext);
        return (
            <IconButton onClick={() => scrollPrev()} style={{ display: "flex" }}>
                {RTL ? <RightArrowIcon /> : <LeftArrowIcon />}
            </IconButton>
        );
    }

    function RightArrow() {
        const { scrollNext } = useContext(VisibilityContext);
        return (
            <IconButton onClick={() => scrollNext()} style={{ display: "flex" }}>
                {RTL ? <LeftArrowIcon /> : <RightArrowIcon />}
            </IconButton>
        );
    }

    const setLink = useCallback(() => {
        const url = window.prompt('Enter URL');
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    // Fullscreen container styles
    const fullscreenStyles: React.CSSProperties = isFullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: '#fff',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'auto',
    } : { width: "100%" };

    // Editor content JSX
    const editorContent = (
        <div dir={dir} style={fullscreenStyles}>
            <style jsx global>{`
                .tiptap-editor {
                    direction: ${dir};
                    text-align: ${RTL ? "right" : "left"};
                    min-height: ${isFullscreen ? 'calc(100vh - 200px)' : '145px'};
                    padding: 12px;
                    outline: none;
                }
                .tiptap-editor p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: ${RTL ? "right" : "left"};
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .tiptap-editor .ProseMirror {
                    outline: none;
                }
                .tiptap-editor .ProseMirror > * + * {
                    margin-top: 0.75em;
                }
                /* Template variable styling in editor */
                .tiptap-editor .badgeVariable {
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 13px;
                    margin: 0 2px;
                    cursor: default;
                    user-select: none;
                }
                /* Link variables - purple */
                .tiptap-editor .badgeVariable[data-title*="link" i],
                .tiptap-editor .badgeVariable[data-title*="Link" i],
                .tiptap-editor .badgeVariable[data-marker*="link" i],
                .tiptap-editor .badgeVariable[data-marker*="Link" i] {
                    background-color: #5048ED !important;
                    color: #ffffff !important;
                    border: none;
                }
                /* Regular variables - blue */
                .tiptap-editor .badgeVariable:not([data-title*="link" i]):not([data-title*="Link" i]):not([data-marker*="link" i]):not([data-marker*="Link" i]) {
                    background-color: #E8F4FD;
                    color: #1976D2;
                    border: 1px solid #BBDEFB;
                }
            `}</style>
            
            {/* Toolbar */}
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px 8px 0 0',
                    border: '1px solid #e0e0e0',
                    borderBottom: 'none',
                    flexWrap: 'wrap',
                    gap: '4px',
                }}
            >
                {/* Bold */}
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    sx={{
                        backgroundColor: editor.isActive('bold') ? '#5048ED' : 'transparent',
                        color: editor.isActive('bold') ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive('bold') ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Bold"
                >
                    <FormatBoldIcon fontSize="small" />
                </IconButton>

                {/* Italic */}
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    sx={{
                        backgroundColor: editor.isActive('italic') ? '#5048ED' : 'transparent',
                        color: editor.isActive('italic') ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive('italic') ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Italic"
                >
                    <FormatItalicIcon fontSize="small" />
                </IconButton>

                {/* Underline */}
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    sx={{
                        backgroundColor: editor.isActive('underline') ? '#5048ED' : 'transparent',
                        color: editor.isActive('underline') ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive('underline') ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Underline"
                >
                    <FormatUnderlinedIcon fontSize="small" />
                </IconButton>

                {/* Strikethrough */}
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    sx={{
                        backgroundColor: editor.isActive('strike') ? '#5048ED' : 'transparent',
                        color: editor.isActive('strike') ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive('strike') ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Strikethrough"
                >
                    <StrikethroughSIcon fontSize="small" />
                </IconButton>

                {/* Headings */}
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    sx={{
                        backgroundColor: editor.isActive('heading', { level: 1 }) ? '#5048ED' : 'transparent',
                        color: editor.isActive('heading', { level: 1 }) ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive('heading', { level: 1 }) ? '#3d38c4' : '#e0e0e0' 
                        },
                        fontSize: '13px',
                        fontWeight: 600,
                    }}
                    title="Heading 1"
                >
                    H1
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    sx={{
                        backgroundColor: editor.isActive('heading', { level: 2 }) ? '#5048ED' : 'transparent',
                        color: editor.isActive('heading', { level: 2 }) ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive('heading', { level: 2 }) ? '#3d38c4' : '#e0e0e0' 
                        },
                        fontSize: '13px',
                        fontWeight: 600,
                    }}
                    title="Heading 2"
                >
                    H2
                </IconButton>

                {/* Link */}
                <IconButton
                    size="small"
                    onClick={setLink}
                    sx={{
                        backgroundColor: editor.isActive('link') ? '#5048ED' : 'transparent',
                        color: editor.isActive('link') ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive('link') ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Insert Link"
                >
                    <LinkIcon fontSize="small" />
                </IconButton>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Text Alignment */}
                <IconButton
                    size="small"
                    onClick={() => {
                        if (editor.can().setTextAlign) {
                            editor.chain().focus().setTextAlign('left').run();
                        }
                    }}
                    sx={{
                        backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#5048ED' : 'transparent',
                        color: editor.isActive({ textAlign: 'left' }) ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Align Left"
                >
                    <FormatAlignLeftIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => {
                        if (editor.can().setTextAlign) {
                            editor.chain().focus().setTextAlign('center').run();
                        }
                    }}
                    sx={{
                        backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#5048ED' : 'transparent',
                        color: editor.isActive({ textAlign: 'center' }) ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Align Center"
                >
                    <FormatAlignCenterIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => {
                        if (editor.can().setTextAlign) {
                            editor.chain().focus().setTextAlign('right').run();
                        }
                    }}
                    sx={{
                        backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#5048ED' : 'transparent',
                        color: editor.isActive({ textAlign: 'right' }) ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Align Right"
                >
                    <FormatAlignRightIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => {
                        if (editor.can().setTextAlign) {
                            editor.chain().focus().setTextAlign('justify').run();
                        }
                    }}
                    sx={{
                        backgroundColor: editor.isActive({ textAlign: 'justify' }) ? '#5048ED' : 'transparent',
                        color: editor.isActive({ textAlign: 'justify' }) ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: editor.isActive({ textAlign: 'justify' }) ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title="Justify"
                >
                    <FormatAlignJustifyIcon fontSize="small" />
                </IconButton>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Text Direction - using text-align as fallback for direction */}
                <IconButton
                    size="small"
                    onClick={() => {
                        // Set LTR by aligning left
                        if (editor.can().setTextAlign) {
                            editor.chain().focus().setTextAlign('left').run();
                        }
                    }}
                    sx={{
                        color: '#666',
                        '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                    title="Left to Right"
                >
                    <FormatTextdirectionLToRIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => {
                        // Set RTL by aligning right
                        if (editor.can().setTextAlign) {
                            editor.chain().focus().setTextAlign('right').run();
                        }
                    }}
                    sx={{
                        color: '#666',
                        '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                    title="Right to Left"
                >
                    <FormatTextdirectionRToLIcon fontSize="small" />
                </IconButton>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Fullscreen Toggle */}
                <IconButton
                    size="small"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    sx={{
                        backgroundColor: isFullscreen ? '#5048ED' : 'transparent',
                        color: isFullscreen ? '#fff' : '#666',
                        '&:hover': { 
                            backgroundColor: isFullscreen ? '#3d38c4' : '#e0e0e0' 
                        },
                    }}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                </IconButton>
            </Stack>

            {/* Editor Content */}
            <div
                style={{
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    minHeight: isFullscreen ? 'calc(100vh - 200px)' : '145px',
                    backgroundColor: '#fff',
                    overflow: isFullscreen ? 'auto' : 'visible',
                }}
            >
                <EditorContent editor={editor} />
            </div>

            {/* Template Variables */}
            <Stack style={classes.variablesContainer}>
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} apiRef={apiRef} RTL={RTL}>
                    {templateVariables?.map((option) => (
                        <button
                            key={option?.value}
                            style={classes.variableStyle}
                            onClick={() => addTemplateVariable(option)}
                        >
                            {option?.label}
                        </button>
                    ))}
                </ScrollMenu>
            </Stack>
        </div>
    );

    // Use portal for fullscreen to break out of modal constraints
    if (isFullscreen && typeof document !== 'undefined') {
        return ReactDOM.createPortal(editorContent, document.body);
    }

    return editorContent;
};

export { RichTextEditor };

