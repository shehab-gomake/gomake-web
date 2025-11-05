/**
 * MessageEditor Component
 *
 * Rich text editor for composing messages using TipTap.
 * Supports basic formatting (bold, italic, links) with keyboard shortcuts.
 */

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Box, Stack, IconButton, Tooltip, Typography } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import LinkIcon from "@mui/icons-material/Link";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface MessageEditorProps {
  /** Current content (HTML) */
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
}

export const MessageEditor: React.FC<MessageEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your message here...",
  error,
  disabled = false,
  minHeight = 200,
}) => {
  const { neutralColor, primaryColor } = useGomakeTheme();

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
      // Get HTML content
      const html = editor.getHTML();
      // If content is just empty paragraph, return empty string
      const isEmpty = html === "<p></p>" || html === "";
      onChange(isEmpty ? "" : html);
    },
    editorProps: {
      attributes: {
        class: "message-editor-content",
      },
    },
  });

  // Update editor content when prop changes (but don't trigger onChange)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
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

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight,
        border: error ? `1px solid #ef4444` : `1px solid ${neutralColor(200)}`,
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: neutralColor(0),
        "&:focus-within": {
          borderColor: error ? "#ef4444" : primaryColor(500),
        },
      }}
    >
      {/* Toolbar */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          px: 1,
          py: 0.5,
          borderBottom: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
        }}
      >
        <Tooltip title="Bold (Ctrl+B)">
          <IconButton
            size="small"
            onClick={toggleBold}
            disabled={disabled}
            sx={{
              color: editor.isActive("bold") ? primaryColor(600) : neutralColor(600),
              backgroundColor: editor.isActive("bold") ? primaryColor(50) : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("bold") ? primaryColor(100) : neutralColor(100),
              },
            }}
          >
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic (Ctrl+I)">
          <IconButton
            size="small"
            onClick={toggleItalic}
            disabled={disabled}
            sx={{
              color: editor.isActive("italic") ? primaryColor(600) : neutralColor(600),
              backgroundColor: editor.isActive("italic") ? primaryColor(50) : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("italic") ? primaryColor(100) : neutralColor(100),
              },
            }}
          >
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ width: 1, height: 24, backgroundColor: neutralColor(200), mx: 0.5 }} />

        <Tooltip title="Bullet List">
          <IconButton
            size="small"
            onClick={toggleBulletList}
            disabled={disabled}
            sx={{
              color: editor.isActive("bulletList") ? primaryColor(600) : neutralColor(600),
              backgroundColor: editor.isActive("bulletList") ? primaryColor(50) : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("bulletList") ? primaryColor(100) : neutralColor(100),
              },
            }}
          >
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            size="small"
            onClick={toggleOrderedList}
            disabled={disabled}
            sx={{
              color: editor.isActive("orderedList") ? primaryColor(600) : neutralColor(600),
              backgroundColor: editor.isActive("orderedList") ? primaryColor(50) : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("orderedList") ? primaryColor(100) : neutralColor(100),
              },
            }}
          >
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ width: 1, height: 24, backgroundColor: neutralColor(200), mx: 0.5 }} />

        <Tooltip title="Insert Link (Ctrl+K)">
          <IconButton
            size="small"
            onClick={setLink}
            disabled={disabled}
            sx={{
              color: editor.isActive("link") ? primaryColor(600) : neutralColor(600),
              backgroundColor: editor.isActive("link") ? primaryColor(50) : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("link") ? primaryColor(100) : neutralColor(100),
              },
            }}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Editor Content */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflow: "auto",
          "& .message-editor-content": {
            outline: "none",
            minHeight: minHeight - 60,
            color: neutralColor(900),
            fontSize: "0.938rem",
            lineHeight: 1.6,
            fontFamily: "inherit",

            // Placeholder styling
            "& p.is-editor-empty:first-of-type::before": {
              content: "attr(data-placeholder)",
              float: "left",
              color: neutralColor(400),
              pointerEvents: "none",
              height: 0,
            },

            // Typography styles
            "& p": {
              marginTop: 0,
              marginBottom: "0.75em",
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
              marginBottom: "0.75em",
            },
            "& li": {
              marginBottom: "0.25em",
            },
            "& a": {
              color: primaryColor(600),
              textDecoration: "underline",
              cursor: "pointer",
              "&:hover": {
                color: primaryColor(700),
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
            color: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            borderTop: `1px solid ${neutralColor(200)}`,
          }}
        >
          {error}
        </Typography>
      )}

      {/* Character Count (Optional) */}
      <Typography
        sx={{
          px: 2,
          py: 0.5,
          fontSize: "0.75rem",
          color: neutralColor(500),
          textAlign: "right",
          borderTop: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
        }}
      >
        {editor.storage.characterCount?.characters() || 0} characters
      </Typography>
    </Box>
  );
};
