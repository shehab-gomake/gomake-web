import { useMessageTemplate } from '@/widgets/settings-mailing/useMessageTemplate';
import React, { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import { useStyle } from './style';
import { Stack } from '@mui/material';
import { useRecoilState } from 'recoil';
import { smsBodyState, smsSubjectState } from '@/widgets/settings-mailing/states/state';
import { useTranslation } from 'react-i18next';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { LeftArrowIcon } from "@/components/icons/left-arrow-icon";
import { RightArrowIcon } from "@/components/icons/right-arrow-icon";
import { useContext } from "react";
import { IconButton } from "@mui/material";
import { EditorTYPE } from '../../enums/enum';
// import 'react-quill/dist/quill.snow.css';
const ReactQuill = lazy(() => import('react-quill'));
import debounce from 'lodash.debounce';

interface IProps {
    headerEditor: EditorTYPE;
}

const QuillEditor = ({ headerEditor }: IProps) => {
    const { templateVariables } = useMessageTemplate();
    const { classes } = useStyle();
    const { t } = useTranslation();
    const editorRefSubject = useRef<any>();
    const editorRefBody = useRef<any>();
    const editorRef = headerEditor ? editorRefBody : editorRefSubject;
    type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;
    const dir: 'rtl' | 'ltr' = t('direction');
    const RTL = dir === 'rtl';
    const apiRef: { current: scrollVisibilityApiType } = useRef(null);

    useEffect(() => {
        if (RTL && apiRef.current?.scrollContainer.current)
            apiRef.current.scrollContainer.current.scrollLeft = 99999;
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

    }, [])

    const AddVariable = (value) => {
        const quill = editorRef.current.editor;
        if (!quill) {
            return;
        }

        let range = quill.getSelection(true);
        let position = range.index;

        if (range.index === 0) {
            // Insert at the beginning with a space
            quill.insertEmbed(
                0,
                'TemplateMarker',
                {
                    color: 'rgb(235, 236, 255)',
                    marker: value?.value,
                    title: value?.label,
                },
            );
            quill.insertText(1, ' '); // Add a space
            quill.setSelection(2, 0);
            return;
        }

        if (range.index === quill.getLength() - 2) {

            const nextChar = quill.getText(range.index + 1, 1);
            position += nextChar !== ' ' ? 1 : 0;
            quill.insertText(position, ' '); // Add a space
            position += 1;

        }
        else if (range.index === quill.getLength() - 1) {

            quill.insertText(position, ' '); // Add a space
            position += 1;

        }

        else if (range.index > 0) {

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

        // Adjust the selection to be after the inserted variable
        quill.insertText(position + 1, ' '); // Add a space
        quill.setSelection(position + 1, 0);
    };



    const [body, setBody] = useRecoilState<string>(smsBodyState);
    const handleChangeBody = useMemo(() => debounce(value => {
        setBody(value);
    }, 300), [setBody]);


    const [subject, setSubject] = useRecoilState<string>(smsSubjectState);
    const handleChangeSubject = useMemo(() => debounce(value => {
        setSubject(value);
    }, 300), [setSubject]);


    function LeftArrow() {
        const { scrollPrev } = useContext(VisibilityContext);
        return (
            <IconButton onClick={() => (scrollPrev())} style={{ display: "flex" }} >
                {RTL ? <RightArrowIcon /> : <LeftArrowIcon />}
            </IconButton>
        );
    }

    function RightArrow() {
        const { scrollNext } = useContext(VisibilityContext);
        return (
            <IconButton onClick={() => (scrollNext())} style={{ display: "flex" }}>
                {RTL ? <LeftArrowIcon /> : <RightArrowIcon />}
            </IconButton>
        );
    }

    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                ['link'],
            ],
        },
        clipboard: {
            matchVisual: false,
        },
    };

    return (
        <div dir={dir} className='editorDiv' style={{width: "100%"}}>
            <Suspense>
                <ReactQuill modules={modules} style={headerEditor ? classes.myEditorBody : classes.myEditorSubject} value={headerEditor ? body : subject} onChange={headerEditor ? handleChangeBody : handleChangeSubject} ref={editorRef} id='editor' />
            </Suspense>
            <Stack style={classes.variablesContainer}   >
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} apiRef={apiRef}
                    RTL={RTL}>
                    {templateVariables?.map((option) => (
                        <button style={classes.variableStyle}
                            onClick={() => AddVariable(option)}>
                            {option?.label}
                        </button>
                    ))}
                </ScrollMenu>
            </Stack>
        </div>
    );
};

export { QuillEditor };