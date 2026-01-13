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
import dynamic from "next/dynamic";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { Box, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { languageOptionsState } from "@/store/languages";
import parse from "html-react-parser";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface NotesForActionModalProps {
  onClose: () => void;
  openModal: boolean;
  onSend: (value: string, translations?: Array<{ lang: string; name: string }>) => void;
  containerStyle?: CSSProperties;
  value: string;
  setValue: (value: string) => void;
  modalTitle?: string;
  id?: string | number;
  isHaveJobName?: boolean;
  jobName?: string;
  setJobName?: (value: string) => void;
  documentType?: number;
  item?: any;
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
  item,
}: NotesForActionModalProps) => {
  const { classes } = useStyle();
  const [myValue, setMyValue] = useState<string>("");
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const allLanguages = useRecoilValue(languageOptionsState);

  // Check if contentTranslations exists and has items
  const hasTranslations =
    item?.contentTranslations &&
    Array.isArray(item.contentTranslations) &&
    item.contentTranslations.length > 0;

  // Get language name from code
  const getLanguageName = (langCode: string) => {
    const lang = allLanguages.find((l) => l.value === langCode);
    return lang?.text || langCode.toUpperCase();
  };

  // Initialize local state with the prop value when modal opens
  useEffect(() => {
    if (openModal) {
      setMyValue(value);
      // Initialize translations state
      if (hasTranslations) {
        const translationsMap: Record<string, string> = {};
        item.contentTranslations.forEach((trans: any) => {
          if (trans.lang) {
            translationsMap[trans.lang] = trans.name || "";
          }
        });
        setTranslations(translationsMap);
      }
    }
  }, [openModal, hasTranslations, item?.contentTranslations]);

  // Only update local state, NOT the parent state
  const handleTextChange = useCallback((newValue: string) => {
    setMyValue(newValue);
  }, []);

  // Handle translation change
  const handleTranslationChange = useCallback((langCode: string, newValue: string) => {
    setTranslations((prev) => ({
      ...prev,
      [langCode]: newValue,
    }));
  }, []);

  // Handle save - update parent state and call onSend with translations
  const handleSave = useCallback(() => {
    // Pass translations if they exist
    if (hasTranslations) {
      const translationsArray = Object.entries(translations).map(([lang, name]) => ({
        lang,
        name: name || "",
      }));
      // Use the first translation as the main value if myValue is empty
      const mainValue = myValue || translationsArray[0]?.name || "";
      setValue(mainValue);
      onSend(mainValue, translationsArray);
    } else {
      setValue(myValue); // Update parent state only when saving
      onSend(myValue);
    }
  }, [myValue, setValue, onSend, hasTranslations, translations]);

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
  }, [dir, isRTL]);

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
                  setJobName?.(e.target.value);
                }}
                value={jobName}
              />
            </div>
          )}

        {hasTranslations && (
          <Box
            sx={{
              marginBottom: 2,
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {item.contentTranslations.map((translation: any, index: number) => (
              <Box
                key={index}
                sx={{
                  marginBottom: index < item.contentTranslations.length - 1 ? 2 : 0,
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    marginBottom: "8px",
                    color: "#5859A8",
                  }}
                >
                  {t("sales.quote.lang")}: {getLanguageName(translation.lang)}
                </Typography>
                {typeof window !== "undefined" && (
                  <Suspense>
                    <ReactQuill
                      formats={formats}
                      style={style}
                      value={translations[translation.lang] || translation.name || ""}
                      onChange={(newValue) =>
                        handleTranslationChange(translation.lang, newValue)
                      }
                      id={`editor-quill-translation-${id}-${translation.lang}`}
                      placeholder={t("textEditor.placeholder")}
                    />
                  </Suspense>
                )}
              </Box>
            ))}
          </Box>
        )}

        {!hasTranslations && typeof window !== "undefined" && (
          <Suspense>
            <ReactQuill
              formats={formats}
              style={style}
              value={myValue}
              onChange={handleTextChange} // Only updates local state
              id={`editor-quill-${id || "default"}`}
              placeholder={t("textEditor.placeholder")}
            />
          </Suspense>
        )}
        <GomakePrimaryButton
          onClick={handleSave} // Use the new handleSave function
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
      </div>
    </GoMakeModal>
  );
};

export { NotesForActionModal };