import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import { CSSProperties, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "@mui/material";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const NotesForActionModal = ({
  onClose,
  openModal,
  onSend,
  containerStyle,
  value,
  setValue
}: any) => {
  const { classes } = useStyle();
  const [myValue, setMyValue] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    setMyValue(value);
  }, [value]);

  const handleTextChange = useMemo(() => debounce(value => {
    setMyValue(value);
  }, 300), [setValue]);

  const style: CSSProperties = {
    display: 'flex',
    flexDirection: 'column-reverse',
    width: '100%',
    borderColor: "#9695C7",
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet', 'link', 'image'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
        .ql-editor {
          min-height: 80px;
          border-top: 0.5px solid #ccc;
          box-shadow: none;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={"Notes for Action"}
      insideStyle={classes.modalStyle}
      style={{ zIndex: 999999 }}
    >
      <div style={{ width: "100%", height: '100%', position: "relative", ...containerStyle }}>
        {typeof window !== 'undefined' && (
          <Suspense>
            <ReactQuill
              formats={formats}
              style={style}
              value={myValue}
              onChange={handleTextChange}
              id='editor'
              placeholder={t('textEditor.placeholder')}
            />
            <GomakePrimaryButton onClick={() => { onSend(myValue) }} style={{ width: "fit-content", height: 35, position: "absolute", bottom: 4, right: 15 }}>Save</GomakePrimaryButton>
          </Suspense>
        )}
      </div>
    </GoMakeModal>
  );
};

export { NotesForActionModal };
