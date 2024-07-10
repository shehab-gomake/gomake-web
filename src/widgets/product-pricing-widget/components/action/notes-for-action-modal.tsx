import { GoMakeModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import { CSSProperties, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "@mui/material";
import ReactQuill from "react-quill";

const NotesForActionModal = ({
  onClose,
  openModal,
  onSend,
  containerStyle,
  value,
  setValue
}: any) => {
  const { classes } = useStyle();
  const [myValue, setMyValue] = useState<string>("")
  const [sendButtonAdded, setButtonAdded] = useState<boolean>(false)
  const reactQuillRef = useRef(null);
  const { t } = useTranslation();
  function handle() {
    onSend(this.quill.root.innerHTML);
  }
  useEffect(() => {
    setMyValue(value)
  }, [value]);

  useEffect(() => {
    if (reactQuillRef.current && !sendButtonAdded) {
      setButtonAdded(true)
      const quill = reactQuillRef.current.getEditor();
      const toolbar = quill.getModule('toolbar').container;
      const buttonWrapper = document.createElement('span');
      buttonWrapper.className = 'ql-formats';
      buttonWrapper.style.marginLeft = 'auto';
      const customButton = document.createElement('button');
      customButton.innerHTML = t('textEditor.send');
      customButton.onclick = () => handle.call({ quill });
      customButton.style.backgroundColor = '#2E3092';
      customButton.style.color = 'white';
      customButton.style.width = '65px';
      customButton.style.height = '40px';
      customButton.style.borderRadius = '8px';
      buttonWrapper.appendChild(customButton)
      toolbar.appendChild(buttonWrapper);
      toolbar.style.display = 'flex';
      toolbar.style.alignItems = 'center';
      toolbar.style.flexWrap = 'wrap';

      setButtonAdded(true)
    }
  }, [reactQuillRef.current]);

  const handleTextChange = useMemo(() => debounce(value => {
    setMyValue(value);
  }, 300), [setValue]);
  const style: CSSProperties = {
    display: 'flex',
    flexDirection: 'column-reverse',
    width: '100%',
    borderColor: "#9695C7",
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet', 'link', 'image'
  ];

  useEffect(() => {
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
  }, []);

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={"Notes for Action"}
      insideStyle={classes.modalStyle}
    >
      <div style={{ width: "100%", height: '100%', ...containerStyle }}>
        <Suspense>
          <ReactQuill ref={reactQuillRef} formats={formats} style={style} value={myValue} onChange={handleTextChange} id='editor'
            placeholder={t('textEditor.placeholder')} />
        </Suspense>
      </div>
      {/* <GoMakeTextEditor onSend={addComment} containerStyle={{ marginTop: 10, marginBottom: 20 }} /> */}
    </GoMakeModal>
  );
};

export { NotesForActionModal };
