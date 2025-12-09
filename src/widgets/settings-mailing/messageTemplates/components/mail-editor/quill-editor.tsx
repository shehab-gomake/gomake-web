import { useMessageTemplate } from '@/widgets/settings-mailing/useMessageTemplate';
import React, { Suspense, lazy, useEffect, useRef, useContext, useMemo, useState, useCallback } from 'react';
import { useStyle } from './style';
import { Stack, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { LeftArrowIcon } from "@/components/icons/left-arrow-icon";
import { RightArrowIcon } from "@/components/icons/right-arrow-icon";

// Lazy load ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

interface IProps {
    value: string | null | undefined;
    setValue: (value: string) => void;
}

// Error boundary component specifically for Quill editor
class QuillErrorBoundary extends React.Component<
    { children: React.ReactNode; onError: () => void },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode; onError: () => void }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Quill editor error caught:', error, errorInfo);
        this.props.onError();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '10px', color: '#f44336' }}>
                    Error loading editor. Please try again.
                </div>
            );
        }

        return this.props.children;
    }
}

const QuillEditor = ({ value, setValue }: IProps) => {
    const { templateVariables } = useMessageTemplate();
    const { classes } = useStyle();
    const { t } = useTranslation();

    const editorRef = useRef<any>();
    const [editorKey, setEditorKey] = useState(0);
    const [hasError, setHasError] = useState(false);
    const isInternalUpdateRef = useRef(false);
    const previousValueRef = useRef<string | null | undefined>(value);
    const isInitializedRef = useRef(false);
    
    // Normalize and sanitize value to always be a valid string - this prevents null/undefined errors
    // Also ensures the HTML is safe for Quill to parse
    const normalizedValue = useMemo(() => {
        if (!value || typeof value !== 'string') return '';
        
        try {
            // Trim and check for empty content
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
            
            // Remove elements that Quill doesn't support or might cause issues
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
            
            // Remove any nodes that aren't proper DOM elements (text nodes are fine)
            const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT);
            const nodesToRemove: Element[] = [];
            let node: Node | null;
            while ((node = walker.nextNode())) {
                if (node instanceof Element) {
                    // Check if node is a proper element
                    if (!node.tagName || typeof node.appendChild !== 'function') {
                        nodesToRemove.push(node);
                    }
                }
            }
            nodesToRemove.forEach(n => {
                try {
                    n.remove();
                } catch (e) {
                    // Ignore removal errors
                }
            });
            
            // Remove attributes that might cause issues
            const allElements = body.querySelectorAll('*');
            allElements.forEach(el => {
                try {
                    // Keep only safe attributes
                    const safeAttributes = ['href', 'target', 'class', 'data-marker', 'data-title'];
                    Array.from(el.attributes).forEach(attr => {
                        if (!safeAttributes.includes(attr.name.toLowerCase())) {
                            el.removeAttribute(attr.name);
                        }
                    });
                } catch (e) {
                    // Ignore attribute removal errors
                }
            });
            
            // Get the sanitized HTML
            let sanitized = body.innerHTML;
            
            // Ensure we have valid HTML structure - if empty or just whitespace, return empty
            if (!sanitized || sanitized.trim() === '' || sanitized.trim() === '<br>' || sanitized.trim() === '<br/>') {
                return '';
            }
            
            // Ensure content starts with a block element that Quill expects
            // Quill works best with block-level elements like <p>, <div>, etc.
            const trimmedSanitized = sanitized.trim();
            if (!trimmedSanitized.match(/^<(p|div|h[1-6]|blockquote|pre|ul|ol|li)/i)) {
                // Wrap in a paragraph if it doesn't start with a block element
                sanitized = `<p>${trimmedSanitized}</p>`;
            }
            
            return sanitized;
        } catch (error) {
            console.warn('Error sanitizing HTML:', error);
            return '';
        }
    }, [value]);
    
    // Handle editor initialization errors
    useEffect(() => {
        if (hasError) {
            // Reset error state and remount editor after a short delay
            isInitializedRef.current = false;
            const timer = setTimeout(() => {
                setHasError(false);
                setEditorKey(prev => prev + 1);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [hasError]);
    
    // Initialize previousValueRef on mount
    useEffect(() => {
        previousValueRef.current = value;
    }, []);

    // Reset editor key when value changes externally (not from internal updates)
    useEffect(() => {
        // Only remount if value changed externally (not due to our own setValue call)
        if (!isInternalUpdateRef.current) {
            const prevValue = previousValueRef.current;
            const hasChanged = prevValue !== value;
            
            if (hasChanged) {
                // Reset initialization flag when value changes externally
                isInitializedRef.current = false;
                
                // Force remount when value changes from/to null/undefined to handle edge cases
                const isNullishChange = 
                    (prevValue === null || prevValue === undefined) !== (value === null || value === undefined);
                
                if (isNullishChange) {
                    setEditorKey(prev => prev + 1);
                }
                previousValueRef.current = value;
            }
        }
        // Reset the flag after processing
        isInternalUpdateRef.current = false;
    }, [value]);

    type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;
    const dir: 'rtl' | 'ltr' = t('direction');
    const RTL = dir === 'rtl';
    const apiRef: { current: scrollVisibilityApiType } = useRef(null);

    useEffect(() => {
        if (RTL && apiRef.current?.scrollContainer.current) {
            apiRef.current.scrollContainer.current.scrollLeft = 99999;
        }
    }, [apiRef, RTL]);

    useEffect(() => {
        const { Quill } = require("react-quill");
        var Embed = Quill.import('blots/embed');
        class TemplateMarker extends Embed {
            static create(value) {
                let node = super.create(value);
                node.setAttribute('class', 'badgeVariable');
                node.setAttribute('data-marker', value.marker);
                node.setAttribute('data-title', value.title);
                node.innerHTML = value.title;
                return node;
            }

            static value(node) {
                return {
                    marker: node.getAttribute('data-marker'),
                    title: node.getAttribute('data-title'),
                };
            }
        }

        TemplateMarker.blotName = 'TemplateMarker';
        TemplateMarker.tagName = 'span';

        Quill.register({
            'formats/TemplateMarker': TemplateMarker
        });
    }, []);

    // Simple ref callback - ReactQuill handles content initialization internally
    const handleEditorRef = (ref: any) => {
        editorRef.current = ref;
        // Mark editor as initialized after a short delay to allow ReactQuill to finish setup
        if (ref && !isInitializedRef.current) {
            setTimeout(() => {
                isInitializedRef.current = true;
            }, 100);
        }
    };

    // Add Ctrl + A / Cmd + A keyboard shortcut for Select All
    useEffect(() => {
        const quill = editorRef.current?.editor;
        if (quill) {
            const handleKeyDown = (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
                    event.preventDefault();
                    quill.setSelection(0, quill.getLength());
                }
            };

            quill.root.addEventListener('keydown', handleKeyDown);

            return () => {
                quill.root.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [editorRef]);

    const handleChange = useCallback((newValue: string) => {
        // Prevent onChange during initial setup to avoid infinite loops
        if (!isInitializedRef.current) {
            return;
        }
        
        // Prevent infinite loops by checking if value actually changed
        const currentValue = value || '';
        const normalizedNewValue = newValue || '';
        
        // Normalize HTML for comparison (remove empty tags, normalize whitespace)
        const normalizeForComparison = (html: string) => {
            if (!html) return '';
            return html
                .replace(/<p><br><\/p>/gi, '')
                .replace(/<p><\/p>/gi, '')
                .replace(/<br\s*\/?>/gi, '')
                .trim();
        };
        
        const normalizedCurrent = normalizeForComparison(currentValue);
        const normalizedNew = normalizeForComparison(normalizedNewValue);
        
        // Only update if the value actually changed
        if (normalizedCurrent !== normalizedNew) {
            isInternalUpdateRef.current = true;
            setValue(newValue);
        }
    }, [value, setValue]);

    // AddVariable function
    const AddVariable = (value) => {
        const quill = editorRef.current.editor;
        if (!quill) {
            return;
        }

        let range = quill.getSelection(true);
        let position = range.index;

        if (range.index === 0) {
            quill.insertEmbed(
                0,
                'TemplateMarker',
                {
                    color: 'rgb(235, 236, 255)',
                    marker: value?.value,
                    title: value?.label,
                },
            );
            quill.insertText(1, ' ');
            quill.setSelection(2, 0);
            return;
        }

        if (range.index === quill.getLength() - 2) {
            const nextChar = quill.getText(range.index + 1, 1);
            position += nextChar !== ' ' ? 1 : 0;
            quill.insertText(position, ' ');
            position += 1;
        } else if (range.index === quill.getLength() - 1) {
            quill.insertText(position, ' ');
            position += 1;
        } else if (range.index > 0) {
            const prevChar = quill.getText(range.index - 1, 1);
            position += prevChar !== ' ' ? 1 : 0;
        }

        quill.insertEmbed(
            position,
            'TemplateMarker',
            {
                color: 'rgb(235, 236, 255)',
                marker: value?.value,
                title: value?.label,
            },
        );
        quill.insertText(position + 1, ' ');
        quill.setSelection(position + 1, 0);
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

    // Quill modules configuration
    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'header': '1' }, { 'header': '2' }],
                ['link'],
                [{ 'direction': 'rtl' }]
            ],
        },
        clipboard: {
            matchVisual: false,
        },
    };

    return (
        <div dir={dir} className="editorDiv" style={{ width: "100%" }}>
            <style jsx global>{`
              .ql-editor {
                direction: ${dir};
                text-align: ${RTL ? "right" : "left"};
                height: 145px !important;
              }
            `}</style>
            <Suspense fallback={<div>Loading editor...</div>}>
                <QuillErrorBoundary
                    onError={() => {
                        setHasError(true);
                    }}
                >
                    <ReactQuill
                        key={editorKey}
                        modules={modules}
                        style={classes.myEditor}
                        value={normalizedValue}
                        onChange={handleChange}
                        ref={handleEditorRef}
                        id="editor"
                        theme="snow"
                        preserveWhitespace={false}
                        bounds="self"
                    />
                </QuillErrorBoundary>
            </Suspense>
            <Stack style={classes.variablesContainer}>
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} apiRef={apiRef} RTL={RTL}>
                    {templateVariables?.map((option) => (
                        <button
                            key={option?.value}
                            style={classes.variableStyle}
                            onClick={() => AddVariable(option)}
                        >
                            {option?.label}
                        </button>
                    ))}
                </ScrollMenu>
            </Stack>
        </div>
    );
};

export { QuillEditor };
