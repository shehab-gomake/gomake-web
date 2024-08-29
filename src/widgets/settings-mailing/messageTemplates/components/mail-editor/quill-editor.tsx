import { useMessageTemplate } from '@/widgets/settings-mailing/useMessageTemplate';
import React, { Suspense, lazy, useEffect, useRef, useContext } from 'react';
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
    value: string;
    setValue: (value: string) => void;
}

const QuillEditor = ({ value, setValue }: IProps) => {
    const { templateVariables } = useMessageTemplate();
    const { classes } = useStyle();
    const { t } = useTranslation();

    const editorRef = useRef<any>();

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

    const handleChange = (value: string) => {
        setValue(value);
    };

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
              }
            `}</style>
            <Suspense fallback={<div>Loading editor...</div>}>
                <ReactQuill
                    modules={modules}
                    style={classes.myEditor}
                    value={value}
                    onChange={handleChange}
                    ref={editorRef}
                    id="editor"
                />
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
