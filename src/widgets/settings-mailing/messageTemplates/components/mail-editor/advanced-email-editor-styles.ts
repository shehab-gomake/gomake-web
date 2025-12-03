import { useMemo } from "react";

const useAdvancedEmailEditorStyles = () => {
    const classes = useMemo(() => {
        return {
            editorContent: {
                '& .tiptap-editor': {
                    outline: 'none',
                    minHeight: '200px',
                    '&:focus': {
                        outline: 'none',
                    },
                },
                '& .ProseMirror': {
                    outline: 'none',
                    minHeight: '200px',
                    '&:focus': {
                        outline: 'none',
                    },
                    '& p': {
                        margin: '0.5em 0',
                    },
                    '& h1': {
                        fontSize: '2em',
                        fontWeight: 'bold',
                        margin: '0.67em 0',
                    },
                    '& h2': {
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        margin: '0.75em 0',
                    },
                    '& h3': {
                        fontSize: '1.17em',
                        fontWeight: 'bold',
                        margin: '0.83em 0',
                    },
                    '& ul, & ol': {
                        paddingLeft: '1.5em',
                        margin: '0.5em 0',
                    },
                    '& a': {
                        color: '#5048ED',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    },
                    '& code': {
                        backgroundColor: '#f5f5f5',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                    },
                },
            },
        };
    }, []);

    return {
        classes,
    };
};

export { useAdvancedEmailEditorStyles };
