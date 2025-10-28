import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Button } from '@mui/material';
import { FONT_FAMILY } from '@/utils/font-family';

export const TemplateVariableButtonComponent = (props: any) => {
    const { node } = props;
    const { marker, title } = node.attrs;

    // Check if this is a link-type variable
    const isLinkVariable = (title && title.toLowerCase().includes('link')) ||
        (marker && marker.toLowerCase().includes('link'));

    return (
        <NodeViewWrapper as="span" style={{ display: 'inline-block', margin: '0 2px' }}>
            <Button
                variant="contained"
                size="small"
                sx={{
                    minWidth: 'auto',
                    padding: isLinkVariable ? '6px 14px' : '4px 10px',
                    fontSize: '13px',
                    textTransform: 'none',
                    backgroundColor: isLinkVariable ? '#5048ED' : '#f0f0f0',
                    color: isLinkVariable ? '#fff' : '#333',
                    borderRadius: '6px',
                    cursor: 'default',
                    ...FONT_FAMILY.Inter(500, 13),
                    '&:hover': {
                        backgroundColor: isLinkVariable ? '#5048ED' : '#f0f0f0',
                    },
                    boxShadow: isLinkVariable ? '0 2px 4px rgba(80, 72, 237, 0.2)' : 'none',
                }}
                title={marker}
            >
                {title}
            </Button>
        </NodeViewWrapper>
    );
};

