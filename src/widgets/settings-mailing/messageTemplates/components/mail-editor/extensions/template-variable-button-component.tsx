import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Button, IconButton } from '@mui/material';
import { FONT_FAMILY } from '@/utils/font-family';
import EditIcon from '@mui/icons-material/Edit';

export const TemplateVariableButtonComponent = (props: any) => {
    const { node, updateAttributes } = props;
    const { marker, title, displayText } = node.attrs;
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(displayText || title);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check if this is a link-type variable
    const isLinkVariable = (title && title.toLowerCase().includes('link')) ||
        (marker && marker.toLowerCase().includes('link'));

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        setEditText(displayText || title);
    }, [displayText, title]);

    const handleClick = () => {
        if (isLinkVariable) {
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (editText.trim()) {
            updateAttributes({ displayText: editText });
        } else {
            setEditText(displayText || title);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBlur();
        } else if (e.key === 'Escape') {
            setEditText(displayText || title);
            setIsEditing(false);
        }
    };

    // For non-link variables, show as plain text
    if (!isLinkVariable) {
        return (
            <NodeViewWrapper as="span" style={{ display: 'inline', margin: '0' }}>
                <span
                    style={{
                        ...FONT_FAMILY.Inter(400, 14),
                        color: '#666',
                    }}
                >
                    {title}
                </span>
            </NodeViewWrapper>
        );
    }

    // For link variables, show as editable button
    return (
        <NodeViewWrapper as="span" style={{ display: 'inline-block', margin: '0 2px', position: 'relative' }}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    style={{
                        padding: '6px 14px',
                        fontSize: '13px',
                        backgroundColor: '#5048ED',
                        color: '#fff',
                        border: '2px solid #fff',
                        borderRadius: '6px',
                        outline: 'none',
                        ...FONT_FAMILY.Inter(500, 13),
                        minWidth: '100px',
                    }}
                />
            ) : (
                <div
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleClick}
                        sx={{
                            minWidth: 'auto',
                            padding: '6px 14px',
                            fontSize: '13px',
                            textTransform: 'none',
                            backgroundColor: '#5048ED',
                            color: '#fff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            ...FONT_FAMILY.Inter(500, 13),
                            '&:hover': {
                                backgroundColor: '#3d38c4',
                            },
                            boxShadow: '0 2px 4px rgba(80, 72, 237, 0.2)',
                        }}
                        title={`Click to edit button text`}
                    >
                        {displayText || title}
                    </Button>
                    {isHovered && (
                        <IconButton
                            size="small"
                            onClick={handleClick}
                            sx={{
                                padding: '2px',
                                backgroundColor: '#5048ED',
                                color: '#fff',
                                width: '20px',
                                height: '20px',
                                '&:hover': {
                                    backgroundColor: '#3d38c4',
                                },
                            }}
                            title="Edit button text"
                        >
                            <EditIcon sx={{ fontSize: '14px' }} />
                        </IconButton>
                    )}
                </div>
            )}
        </NodeViewWrapper>
    );
};

