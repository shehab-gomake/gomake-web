import { useGomakeAxios, useSnackBar } from "@/hooks";
import { updateTranslationFilesApi } from "@/services/api-service/aws-s3/update-translations-file";
import { useState } from "react";
import { useRecoilState } from "recoil";
import {
  translationsBlockModal,
  translationsModal,
} from "./components/states/states";
import { translationState } from "./components/states/interfaces";
import { uploadTranslationsExcelFileApi } from "@/services/api-service/aws-s3/download-upload-excel-translations";
import { EHttpMethod } from "@/services/api-service/enums";
import { addNewLanguageApi } from "@/services/api-service/aws-s3/update-web-translations-table";

const useTranslations = () => {
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const [state, setState] = useState<translationState>();
  const { callApi } = useGomakeAxios();
  const [openModal, setOpenModal] = useRecoilState<boolean>(translationsModal);
  const [openAddLangModal, setOpenAddLangModal] = useRecoilState<boolean>(
    translationsBlockModal
  );

  const [translationFiles, setTranslationFiles] = useState({
    en: [],
    he: [],
    ar: [],
    de: [],
  });

  // reFormat the json data
  const data = Object.entries(translationFiles.en).map(([label, value]) => {
    return {
      label,
      rows: Object.keys(value).filter((key) => typeof value[key] === "string"),
      children: Object.keys(value)
        .filter((key) => typeof value[key] === "object" && value[key] !== null)
        .map((childLabel) => ({
          label: childLabel,
          rows: Object.keys(value[childLabel]).filter(
            (key) => typeof value[childLabel][key] === "string"
          ),
        })),
    };
  });

  const downloadExcelFile = async () => {
    const result = await callApi(
      EHttpMethod.GET,
      "/v1/S3-aws/download-translations-excel-file",
      undefined,
      true,
      null,
      "blob"
    );
    const downloadLink = document.createElement("a");
    const link = URL.createObjectURL(result.data);
    downloadLink.href = link;
    downloadLink.download = "translations.xlsx";
    downloadLink.click();
  };

  const uploadExcelFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer as ArrayBuffer);
        // Convert data to a Base64 string
        var base64String = btoa(
          new Uint8Array(data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, "")
        );
        uploadTranslationsExcelFileApi(callApi, () => {}, {
          base64: base64String,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const onClickOpenAddLangModal = () => {
    setOpenAddLangModal(true);
  };

  const onClickCloseAddLangModal = () => {
    setOpenAddLangModal(false);
  };

  const onClickOpenModal = () => {
    setOpenModal(true);
  };

  const onClickCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddNewLanguage = async (langKey) => {
    const callBack = (data) => {
      if (data.success) {
        alertSuccessAdded();
      } else {
        alertFaultAdded();
      }
    };
    await addNewLanguageApi(callApi, callBack, { langKey });
  };

  return {
    data,
    state,
    setState,
    openModal,
    setOpenModal,
    translationFiles,
    setTranslationFiles,
    onClickOpenModal,
    onClickCloseModal,
    downloadExcelFile,
    uploadExcelFile,
    handleAddNewLanguage,
    onClickCloseAddLangModal,
    onClickOpenAddLangModal,
    setOpenAddLangModal,
    openAddLangModal,
  };
};

export { useTranslations };
