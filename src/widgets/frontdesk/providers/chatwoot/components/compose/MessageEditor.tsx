/**
 * MessageEditor Component
 *
 * Premium rich text editor for composing messages using TipTap.
 * Supports basic formatting (bold, italic, links) with keyboard shortcuts.
 * Outputs Markdown format compatible with Chatwoot's message storage.
 * 
 * Features:
 * - Modern, clean design with subtle borders
 * - Smooth focus states with ring effect
 * - Consistent icon styling
 * - Private note mode with amber accent
 */

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Box, Stack, IconButton, Tooltip, Typography, Divider } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import LinkIcon from "@mui/icons-material/Link";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";
import { htmlToMarkdown, isEmptyHtml } from "@/utils/markdown-converter";

interface MessageEditorProps {
  /** Current content (Markdown) */
  content: string;
  /** Callback when content changes */
  onChange: (content: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error state */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Minimum height */
  minHeight?: number;
  /** Whether this is a private note (affects background color) */
  isPrivateNote?: boolean;
}

export const MessageEditor: React.FC<MessageEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your message here...",
  error,
  disabled = false,
  minHeight = 200,
  isPrivateNote = false,
}) => {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issues in Next.js
    extensions: [
      StarterKit.configure({
        heading: false, // Disable headings for message composition
        codeBlock: false, // Disable code blocks
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      // Get HTML content from editor
      const html = editor.getHTML();

      // Convert HTML to Markdown (Chatwoot expects Markdown)
      const markdown = htmlToMarkdown(html);

      // Call onChange with Markdown content
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: "message-editor-content",
      },
    },
  });

  // Update editor content when prop changes (but don't trigger onChange)
  // Note: content prop is Markdown, but editor works with HTML
  // We don't convert back to HTML since the editor maintains its own state
  React.useEffect(() => {
    if (editor && content) {
      const currentMarkdown = htmlToMarkdown(editor.getHTML());
      // Only update if content actually changed to avoid cursor jumps
      if (content !== currentMarkdown) {
        // For now, set content as plain text since Markdown→HTML conversion
        // would require a separate library. Editor will treat it as plain text.
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    // Cancelled
    if (url === null) return;

    // Empty string removes link
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleUndo = useCallback(() => {
    editor?.chain().focus().undo().run();
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor?.chain().focus().redo().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  // Background color for private note mode - use a warm, subtle amber/yellow tint
  // to clearly indicate private mode without being too distracting
  const backgroundColor = isPrivateNote 
    ? colorTokens.warning[50] // Light amber/yellow tint for private notes
    : colorTokens.semantic.background.primary;

  // Common icon button style for toolbar
  const toolbarButtonStyle = (isActive: boolean) => ({
    color: isActive ? colorTokens.primary[600] : colorTokens.neutral[500],
    backgroundColor: isActive ? colorTokens.primary[50] : "transparent",
    borderRadius: `${radiusTokens.sm}px`,
    p: 0.75,
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: isActive ? colorTokens.primary[100] : colorTokens.neutral[100],
      color: isActive ? colorTokens.primary[700] : colorTokens.neutral[700],
    },
    "& .MuiSvgIcon-root": {
      fontSize: 18,
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight,
        border: error 
          ? `1px solid ${colorTokens.error[400]}` 
          : isPrivateNote 
            ? `1px solid ${colorTokens.warning[300]}` // Amber border for private notes
            : `1px solid ${colorTokens.neutral[200]}`,
        borderRadius: `${radiusTokens.lg}px`,
        overflow: "hidden",
        backgroundColor,
        transition: "all 0.2s ease",
        "&:focus-within": {
          borderColor: error 
            ? colorTokens.error[500] 
            : isPrivateNote 
              ? colorTokens.warning[400]
              : colorTokens.primary[400],
          boxShadow: error
            ? `0 0 0 3px ${colorTokens.error[100]}`
            : isPrivateNote
              ? `0 0 0 3px ${colorTokens.warning[100]}`
              : `0 0 0 3px ${colorTokens.primary[100]}`,
        },
      }}
    >
      {/* Toolbar - Clean, minimal design */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: `1px solid ${isPrivateNote ? colorTokens.warning[200] : colorTokens.neutral[200]}`,
          backgroundColor: isPrivateNote ? colorTokens.warning[25] : colorTokens.neutral[50],
        }}
      >
        <Tooltip title="Bold (Ctrl+B)" arrow>
          <IconButton
            size="small"
            onClick={toggleBold}
            disabled={disabled}
            sx={toolbarButtonStyle(editor.isActive("bold"))}
          >
            <FormatBoldIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic (Ctrl+I)" arrow>
          <IconButton
            size="small"
            onClick={toggleItalic}
            disabled={disabled}
            sx={toolbarButtonStyle(editor.isActive("italic"))}
          >
            <FormatItalicIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: colorTokens.neutral[200] }} />

        <Tooltip title="Bullet List" arrow>
          <IconButton
            size="small"
            onClick={toggleBulletList}
            disabled={disabled}
            sx={toolbarButtonStyle(editor.isActive("bulletList"))}
          >
            <FormatListBulletedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List" arrow>
          <IconButton
            size="small"
            onClick={toggleOrderedList}
            disabled={disabled}
            sx={toolbarButtonStyle(editor.isActive("orderedList"))}
          >
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: colorTokens.neutral[200] }} />

        <Tooltip title="Insert Link (Ctrl+K)" arrow>
          <IconButton
            size="small"
            onClick={setLink}
            disabled={disabled}
            sx={toolbarButtonStyle(editor.isActive("link"))}
          >
            <LinkIcon />
          </IconButton>
        </Tooltip>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        <Tooltip title="Undo (Ctrl+Z)" arrow>
          <IconButton
            size="small"
            onClick={handleUndo}
            disabled={disabled || !editor.can().undo()}
            sx={{
              ...toolbarButtonStyle(false),
              "&:disabled": {
                color: colorTokens.neutral[300],
                backgroundColor: "transparent",
              },
            }}
          >
            <UndoIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo (Ctrl+Shift+Z)" arrow>
          <IconButton
            size="small"
            onClick={handleRedo}
            disabled={disabled || !editor.can().redo()}
            sx={{
              ...toolbarButtonStyle(false),
              "&:disabled": {
                color: colorTokens.neutral[300],
                backgroundColor: "transparent",
              },
            }}
          >
            <RedoIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Editor Content - Generous padding for comfortable typing */}
      <Box
        sx={{
          flex: 1,
          px: 2.5,
          py: 2,
          overflow: "auto",
          backgroundColor: "transparent",
          "& .message-editor-content": {
            outline: "none",
            minHeight: minHeight - 80,
            color: colorTokens.neutral[900],
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            fontFamily: "inherit",
            backgroundColor: "transparent",

            // Placeholder styling
            "& p.is-editor-empty:first-of-type::before": {
              content: "attr(data-placeholder)",
              float: "left",
              color: colorTokens.neutral[400],
              pointerEvents: "none",
              height: 0,
              fontStyle: "italic",
            },

            // Typography styles
            "& p": {
              marginTop: 0,
              marginBottom: "0.875em",
              "&:last-child": {
                marginBottom: 0,
              },
            },
            "& strong": {
              fontWeight: 600,
            },
            "& em": {
              fontStyle: "italic",
            },
            "& ul, & ol": {
              paddingLeft: "1.5em",
              marginTop: "0.5em",
              marginBottom: "0.875em",
            },
            "& li": {
              marginBottom: "0.375em",
            },
            "& a": {
              color: colorTokens.primary[600],
              textDecoration: "underline",
              cursor: "pointer",
              "&:hover": {
                color: colorTokens.primary[700],
              },
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {/* Error Message */}
      {error && (
        <Typography
          sx={{
            px: 2,
            py: 1,
            fontSize: "0.75rem",
            fontWeight: 500,
            color: colorTokens.error[600],
            backgroundColor: colorTokens.error[50],
            borderTop: `1px solid ${colorTokens.error[200]}`,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
