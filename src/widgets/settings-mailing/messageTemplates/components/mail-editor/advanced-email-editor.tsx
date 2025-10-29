import React, { useEffect, useRef, useContext } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Stack, IconButton, Divider, Tooltip, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { LeftArrowIcon } from "@/components/icons/left-arrow-icon";
import { RightArrowIcon } from "@/components/icons/right-arrow-icon";
import { TemplateVariableButton } from './extensions/template-variable-button';
import { useMessageTemplate } from '@/widgets/settings-mailing/useMessageTemplate';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import LinkIcon from '@mui/icons-material/Link';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { FONT_FAMILY } from '@/utils/font-family';
import { useAdvancedEmailEditorStyles } from './advanced-email-editor-styles';

interface IProps {
    value: string;
    setValue: (value: string) => void;
}

const AdvancedEmailEditor = ({ value, setValue }: IProps) => {
    const { templateVariables } = useMessageTemplate();
    const { classes } = useAdvancedEmailEditorStyles();
    const { t } = useTranslation();
    const [selectedColor, setSelectedColor] = React.useState('#000000');
    const [selectedFontSize, setSelectedFontSize] = React.useState('14px');

    type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;
    const dir: 'rtl' | 'ltr' = t('direction');
    const RTL = dir === 'rtl';
    const apiRef: { current: scrollVisibilityApiType } = useRef(null);

    useEffect(() => {
        if (RTL && apiRef.current?.scrollContainer.current) {
            apiRef.current.scrollContainer.current.scrollLeft = 99999;
        }
    }, [apiRef, RTL]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            FontFamily,
            Subscript,
            Superscript,
            TemplateVariableButton,
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
                dir: dir,
            },
        },
        onUpdate: ({ editor }) => {
            setValue(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
    }, [value, editor]);

    const addTemplateVariable = (variable: any) => {
        if (editor) {
            editor
                .chain()
                .focus()
                .setTemplateVariableButton({
                    marker: variable.value,
                    title: variable.label,
                })
                .run();
        }
    };

    const setLink = () => {
        const url = window.prompt('Enter URL');
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        if (editor) {
            editor.chain().focus().setColor(color).run();
        }
    };

    const handleFontSizeChange = (size: string) => {
        setSelectedFontSize(size);
        if (editor) {
            editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
        }
    };

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

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    return (
        <div dir={dir} style={{ width: '100%' }}>
            {/* Toolbar */}
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px 8px 0 0',
                    borderBottom: '1px solid #e0e0e0',
                    flexWrap: 'wrap',
                    gap: '4px',
                }}
            >
                {/* Text Formatting */}
                <Tooltip title="Bold">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        sx={{
                            backgroundColor: editor.isActive('bold') ? '#5048ED' : 'transparent',
                            color: editor.isActive('bold') ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive('bold') ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatBoldIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Italic">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        sx={{
                            backgroundColor: editor.isActive('italic') ? '#5048ED' : 'transparent',
                            color: editor.isActive('italic') ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive('italic') ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatItalicIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Underline">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        sx={{
                            backgroundColor: editor.isActive('underline') ? '#5048ED' : 'transparent',
                            color: editor.isActive('underline') ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive('underline') ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatUnderlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Strikethrough">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        sx={{
                            backgroundColor: editor.isActive('strike') ? '#5048ED' : 'transparent',
                            color: editor.isActive('strike') ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive('strike') ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <StrikethroughSIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Alignment */}
                <Tooltip title="Align Left">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        sx={{
                            backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#5048ED' : 'transparent',
                            color: editor.isActive({ textAlign: 'left' }) ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatAlignLeftIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Align Center">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        sx={{
                            backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#5048ED' : 'transparent',
                            color: editor.isActive({ textAlign: 'center' }) ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatAlignCenterIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Align Right">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        sx={{
                            backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#5048ED' : 'transparent',
                            color: editor.isActive({ textAlign: 'right' }) ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatAlignRightIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Justify">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        sx={{
                            backgroundColor: editor.isActive({ textAlign: 'justify' }) ? '#5048ED' : 'transparent',
                            color: editor.isActive({ textAlign: 'justify' }) ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive({ textAlign: 'justify' }) ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatAlignJustifyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Lists */}
                <Tooltip title="Bullet List">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        sx={{
                            backgroundColor: editor.isActive('bulletList') ? '#5048ED' : 'transparent',
                            color: editor.isActive('bulletList') ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive('bulletList') ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatListBulletedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Numbered List">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        sx={{
                            backgroundColor: editor.isActive('orderedList') ? '#5048ED' : 'transparent',
                            color: editor.isActive('orderedList') ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive('orderedList') ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <FormatListNumberedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Link */}
                <Tooltip title="Insert Link">
                    <IconButton
                        size="small"
                        onClick={setLink}
                        sx={{
                            backgroundColor: editor.isActive('link') ? '#5048ED' : 'transparent',
                            color: editor.isActive('link') ? '#fff' : '#666',
                            '&:hover': { backgroundColor: editor.isActive('link') ? '#3d38c4' : '#e0e0e0' },
                        }}
                    >
                        <LinkIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Text Color */}
                <Tooltip title="Text Color">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            style={{
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Undo/Redo */}
                <Tooltip title="Undo">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        sx={{ color: '#666' }}
                    >
                        <UndoIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Redo">
                    <IconButton
                        size="small"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        sx={{ color: '#666' }}
                    >
                        <RedoIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* Editor Content */}
            <div
                style={{
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    minHeight: '200px',
                    backgroundColor: '#fff',
                    padding: '12px',
                }}
            >
                <EditorContent editor={editor} className={classes.editorContent as string} />
            </div>

            {/* Template Variables */}
            <Stack
                sx={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                }}
            >
                <div
                    style={{
                        ...FONT_FAMILY.Inter(600, 13),
                        color: '#333',
                        marginBottom: '8px',
                    }}
                >
                    {t('mailingSettings.templateVariables') || 'Template Variables'}
                </div>
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} apiRef={apiRef} RTL={RTL}>
                    {templateVariables?.map((option) => (
                        <button
                            key={option?.value}
                            onClick={() => addTemplateVariable(option)}
                            style={{
                                padding: '6px 14px',
                                margin: '0 4px',
                                backgroundColor: '#5048ED',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                ...FONT_FAMILY.Inter(500, 13),
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 4px rgba(80, 72, 237, 0.2)',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#3d38c4';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(80, 72, 237, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#5048ED';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(80, 72, 237, 0.2)';
                            }}
                        >
                            {option?.label}
                        </button>
                    ))}
                </ScrollMenu>
            </Stack>
        </div>
    );
};

export { AdvancedEmailEditor };

