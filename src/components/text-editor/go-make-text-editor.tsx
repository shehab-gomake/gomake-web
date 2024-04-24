import React, {CSSProperties, lazy, Suspense, useEffect, useMemo, useRef, useState} from "react";
import {debounce} from "@mui/material";
import "react-quill/dist/quill.snow.css";

const ReactQuill = lazy(() => import('react-quill'));


const GoMakeTextEditor = ({onSend, containerStyle = {}}: {onSend: (v: string) => void; containerStyle?: CSSProperties}) => {
    const [value, setValue] = useState<string>('');
    const [sendButtonAdded, setButtonAdded] = useState<boolean>(false)
    const reactQuillRef = useRef(null);

    function handle ()  {
        onSend(this.quill.root.innerHTML)
    }

    useEffect(() => {
        if (reactQuillRef.current && !sendButtonAdded) {
            setButtonAdded(true)
            const quill = reactQuillRef.current.getEditor();
            const toolbar = quill.getModule('toolbar').container;
            const buttonWrapper = document.createElement('span');
            buttonWrapper.className = 'ql-formats';
            buttonWrapper.style.marginLeft = 'auto';
            const customButton = document.createElement('button');
            customButton.innerText = 'send';
            customButton.onclick = () => handle.call({ quill });
            customButton.style.backgroundColor =  '#2E3092';
            customButton.style.color =  'white';
            customButton.style.width =  '65px';
            customButton.style.height =  '40px';
            customButton.style.borderRadius =  '8px';
            buttonWrapper.appendChild(customButton)
            toolbar.appendChild(buttonWrapper);
            toolbar.style.display = 'flex';
            toolbar.style.alignItems = 'center';
            toolbar.style.flexWrap = 'wrap';

            setButtonAdded(true)
        }
    }, [reactQuillRef.current]);

    const handleTextChange = useMemo(() => debounce(value => {
        setValue(value);
    }, 300), [setValue]);
    const style: CSSProperties = {
        display: 'flex',
        flexDirection: 'column-reverse',
        width: '100%',
        borderColor: "#9695C7",
    }

    // const modules = {
    //     toolbar: {
    //         container: [
    //             [{ 'header': [1, 2, false] }],
    //             ['bold', 'italic', 'underline', 'blockquote'],
    //             [{'list': 'ordered'}, {'list': 'bullet'}],
    //             ['link', 'image'],
    //             ['send'] // This is the custom button identifier
    //         ],
    //         handlers: {
    //             'send': handle
    //         }
    //     },
    // };

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
        <div style={{width: "100%", height: '100%', ...containerStyle}}>
            <Suspense>
                <ReactQuill ref={reactQuillRef} formats={formats}  style={style} value={value} onChange={handleTextChange} id='editor'
                            placeholder={'Enter Your Comment here'}/>
            </Suspense>
        </div>
    );
};


export {GoMakeTextEditor};