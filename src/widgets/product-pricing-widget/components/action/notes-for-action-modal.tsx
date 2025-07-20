import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import {
  CSSProperties,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { debounce } from "@mui/material";
import dynamic from "next/dynamic";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
interface NotesForActionModalProps {
  onClose: () => void;
  openModal: boolean;
  onSend: (value: string) => void;
  containerStyle?: CSSProperties;
  value: string;
  setValue: (value: string) => void;
  modalTitle?: string;
  id?: string | number;
  isHaveJobName?: boolean;
  jobName?: string;
  setJobName?: (value: string) => void;
  documentType?: number;
}

const NotesForActionModal = ({
  onClose,
  openModal,
  onSend,
  containerStyle,
  value,
  setValue,
  modalTitle,
  id,
  isHaveJobName = false,
  jobName,
  setJobName,
  documentType,
}: NotesForActionModalProps) => {
  const { classes } = useStyle();
  const [myValue, setMyValue] = useState<string>("");

  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  useEffect(() => {
    setMyValue(value);
  }, [value]);

  // If you need to use the debounced version again, please let me know, Lama.
  // const handleTextChange = useCallback(
  //   debounce((value: string) => {
  //     setMyValue(value);
  //     setValue(value);
  //   }, 300),
  //   [setValue]
  // );

  const handleTextChange = useCallback(
    (value: string) => {
      setMyValue(value);
      setValue(value);
    },
    [setValue]
  );

  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
    borderColor: "#9695C7",
    direction: dir,
    textAlign: isRTL ? "right" : "left",
  };

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "blockquote",
      "list",
      "bullet",
      "link",
      "image",
    ],
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = `
        .ql-editor {
          min-height: 80px;
          border-top: 0.5px solid #ccc;
          box-shadow: none;
          height: 145px !important;
             direction: ${dir};
                text-align: ${isRTL ? "right" : "left"};
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
      modalTitle={modalTitle || t("sales.notesForAction")}
      insideStyle={classes.modalStyle}
      style={{ zIndex: 999999 }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          ...containerStyle,
        }}
      >
        {isHaveJobName &&
          (documentType === DOCUMENT_TYPE.quote ||
            documentType === DOCUMENT_TYPE.order) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span>{t("sales.quote.enterJobName")}</span>
              <GomakeTextInput
                placeholder={t("sales.cart.jobName")}
                onChange={(e: any) => {
                  setJobName(e.target.value);
                }}
                value={jobName}
              />
            </div>
          )}

        {typeof window !== "undefined" && (
          <Suspense>
            <ReactQuill
              formats={formats}
              style={style}
              value={myValue}
              // onChange={handleTextChange}
              onChange={(value) => handleTextChange(value)}
              id={`editor-quill-${id || "default"}`}
              placeholder={t("textEditor.placeholder")}
            />
            <GomakePrimaryButton
              onClick={() => {
                onSend(myValue);
              }}
              style={{
                width: "fit-content",
                height: 35,
                position: "absolute",
                bottom: 4,
                [isRTL ? "left" : "right"]: 15,
              }}
            >
              {t("mailingSettings.save")}
            </GomakePrimaryButton>
          </Suspense>
        )}
      </div>
    </GoMakeModal>
  );
};

export { NotesForActionModal };
