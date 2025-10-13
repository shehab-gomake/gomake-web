/**
 * FrontDesk Quill Editor
 * Wrapper for QuillEditor that provides FrontDesk-specific template variables
 */

import React, { Suspense, lazy, useEffect, useRef, useContext } from 'react';
import { Stack, IconButton, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { LeftArrowIcon } from '@/components/icons/left-arrow-icon';
import { RightArrowIcon } from '@/components/icons/right-arrow-icon';
import { useRecoilValue } from 'recoil';
import { settingsTemplateVariablesAtom } from '@/store/frontdesk/atoms/settings.atoms';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { FONT_FAMILY } from '@/utils/font-family';

// Lazy load ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

interface IProps {
  value: string;
  setValue: (value: string) => void;
}

export const FrontdeskQuillEditor: React.FC<IProps> = ({ value, setValue }) => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const templateVariables = useRecoilValue(settingsTemplateVariablesAtom);

  const editorRef = useRef<any>();
  const apiRef = useRef<any>(null);

  const dir: 'rtl' | 'ltr' = t('direction');
  const RTL = dir === 'rtl';

  useEffect(() => {
    if (RTL && apiRef.current?.scrollContainer.current) {
      apiRef.current.scrollContainer.current.scrollLeft = 99999;
    }
  }, [apiRef, RTL]);

  useEffect(() => {
    const { Quill } = require('react-quill');
    const Embed = Quill.import('blots/embed');

    class TemplateMarker extends Embed {
      static create(value: any) {
        const node = super.create(value);
        node.setAttribute('class', 'badgeVariable');
        node.setAttribute('data-marker', value.marker);
        node.setAttribute('data-title', value.title);
        node.innerHTML = value.title;
        return node;
      }

      static value(node: any) {
        return {
          marker: node.getAttribute('data-marker'),
          title: node.getAttribute('data-title'),
        };
      }
    }

    TemplateMarker.blotName = 'TemplateMarker';
    TemplateMarker.tagName = 'span';

    Quill.register({
      'formats/TemplateMarker': TemplateMarker,
    });
  }, []);

  // Add Ctrl + A / Cmd + A keyboard shortcut for Select All
  useEffect(() => {
    const quill = editorRef.current?.editor;
    if (quill) {
      const handleKeyDown = (event: KeyboardEvent) => {
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
  const AddVariable = (option: any) => {
    const quill = editorRef.current?.editor;
    if (!quill) {
      return;
    }

    const range = quill.getSelection(true);
    let position = range.index;

    if (range.index === 0) {
      quill.insertEmbed(0, 'TemplateMarker', {
        color: 'rgb(235, 236, 255)',
        marker: option?.value,
        title: option?.label,
      });
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

    quill.insertEmbed(position, 'TemplateMarker', {
      color: 'rgb(235, 236, 255)',
      marker: option?.value,
      title: option?.label,
    });
    quill.insertText(position + 1, ' ');
    quill.setSelection(position + 1, 0);
  };

  // ScrollMenu arrow components
  function LeftArrow() {
    const { scrollPrev } = useContext(VisibilityContext);
    return (
      <IconButton onClick={() => scrollPrev()} style={{ display: 'flex' }}>
        {RTL ? <RightArrowIcon /> : <LeftArrowIcon />}
      </IconButton>
    );
  }

  function RightArrow() {
    const { scrollNext } = useContext(VisibilityContext);
    return (
      <IconButton onClick={() => scrollNext()} style={{ display: 'flex' }}>
        {RTL ? <LeftArrowIcon /> : <RightArrowIcon />}
      </IconButton>
    );
  }

  // Quill modules configuration
  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: '1' }, { header: '2' }],
        ['link'],
        [{ direction: 'rtl' }],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  // Styles
  const myEditorStyle = {
    height: 200,
    borderRadius: '0px 0px 12px 12px',
    borderColor: '#9695C7',
    ...FONT_FAMILY.Lexend(400, 16),
    lineHeight: '20px',
    color: primaryColor(900),
  };

  const variableStyle = {
    ...FONT_FAMILY.Lexend(400, 13),
    display: 'flex',
    width: '200px',
    minWidth: 120,
    height: '24px',
    borderRadius: '4px',
    background: '#FFFFFF',
    color: '#2E3092',
    justifyContent: 'center',
    padding: '1px',
    margin: '4px',
    border: '1px solid rgb(130, 131, 190)',
    alignItems: 'center',
    textAlign: 'center' as 'center',
    cursor: 'pointer',
  };

  const variablesContainerStyle = {
    paddingTop: '3px',
    width: '100%',
  };

  return (
    <div dir={dir} className="editorDiv" style={{ width: '100%' }}>
      <style jsx global>{`
        .ql-editor {
          direction: ${dir};
          text-align: ${RTL ? 'right' : 'left'};
          height: 145px !important;
        }
      `}</style>
      <Suspense fallback={<CircularProgress size={24} />}>
        <ReactQuill
          modules={modules}
          style={myEditorStyle}
          value={value}
          onChange={handleChange}
          ref={editorRef}
          id="editor"
        />
      </Suspense>
      {templateVariables && templateVariables.length > 0 && (
        <Stack style={variablesContainerStyle}>
          <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} apiRef={apiRef} RTL={RTL}>
            {templateVariables.map((option) => (
              <button
                key={option?.value}
                style={variableStyle}
                onClick={() => AddVariable(option)}
              >
                {option?.label}
              </button>
            ))}
          </ScrollMenu>
        </Stack>
      )}
    </div>
  );
};
