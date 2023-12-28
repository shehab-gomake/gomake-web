import { useGomakeAxios, useSnackBar } from "@/hooks";
import { updateTranslationFilesApi } from "@/services/api-service/aws-s3/update-translations-file";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { translationsBlockModal, translationsModal } from "./components/states/states";
import { translationState } from "./components/states/interfaces";
import { getTranslationsExcelFileApi, uploadTranslationsExcelFileApi } from "@/services/api-service/aws-s3/download-upload-excel-translations";

const useTranslations = () => {
  const { alertFaultAdded, alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [state, setState] = useState<translationState>();
  const { callApi } = useGomakeAxios();
  const [openModal, setOpenModal] = useRecoilState<boolean>(translationsModal);
  const [openBlockModal, setOpenBlockModal] = useRecoilState<boolean>(translationsBlockModal);

  const [translationFiles, setTranslationFiles] = useState({
    en: [],
    he: [],
    ar: [],
    de: [],
  });

  const handleEdit = (translationFiles, state) => {
    const updateFile = (langFile, langKey) => {
      const newLangFile = { ...langFile };
      let currentObj = newLangFile;

      for (const pathKey of state?.path) {
        currentObj = currentObj[pathKey];
      }

      const newValue = state?.[langKey];

      // Check if newValue is not empty before setting the value
      if (newValue !== undefined && newValue !== null && newValue !== '') {
        currentObj[state?.key] = newValue;
      }

      return newLangFile;
    };

    const newEnFile = updateFile(translationFiles.en, 'en');
    const newArFile = updateFile(translationFiles.ar, 'ar');
    const newHeFile = updateFile(translationFiles.he, 'he');
    const newDeFile = updateFile(translationFiles.de, 'de');

    const arrayFiles = [
      {
        key: "en",
        file: newEnFile
      },
      {
        key: "ar",
        file: newArFile
      },
      {
        key: "he",
        file: newHeFile
      },
      {
        key: "de",
        file: newDeFile
      },
    ];

    onUpdateTranslationFiles(arrayFiles);
  };

  const handleAdd = (translationFiles, state) => {
    const updateFile = (langFile, langKey) => {
      const newLangFile = { ...langFile };
      let currentObj = newLangFile;

      for (const pathKey of state?.path) {
        if (!currentObj[pathKey]) {
          currentObj[pathKey] = {};
        }
        currentObj = currentObj[pathKey];
      }

      const newKey = state?.key;
      const newValue = state?.[langKey];

      if (newValue !== undefined && newValue !== null && newValue !== '') {
        currentObj[newKey] = newValue;
      }

      return newLangFile;
    };

    const newEnFile = updateFile(translationFiles.en, 'en');
    const newArFile = updateFile(translationFiles.ar, 'ar');
    const newHeFile = updateFile(translationFiles.he, 'he');
    const newDeFile = updateFile(translationFiles.de, 'de');

    const arrayFiles = [
      {
        key: "en",
        file: newEnFile
      },
      {
        key: "ar",
        file: newArFile
      },
      {
        key: "he",
        file: newHeFile
      },
      {
        key: "de",
        file: newDeFile
      },
    ];

    onUpdateTranslationFiles(arrayFiles);

  };

  const addEmptyBlockToAllFiles = (translationFiles, blockName) => {
    let isExist = false;
    const addEmptyBlockToFile = (langFile) => {
      const newLangFile = { ...langFile };
      // Check if the block already exists
      if (!newLangFile[blockName]) {
        // Add the new empty block
        newLangFile[blockName] = {};
      } else {
        isExist = true;
      }
      return newLangFile;
    };

    const newEnFile = addEmptyBlockToFile(translationFiles.en);
    const newArFile = addEmptyBlockToFile(translationFiles.ar);
    const newHeFile = addEmptyBlockToFile(translationFiles.he);
    const newDeFile = addEmptyBlockToFile(translationFiles.de);

    const arrayFiles = [
      {
        key: "en",
        file: newEnFile
      },
      {
        key: "ar",
        file: newArFile
      },
      {
        key: "he",
        file: newHeFile
      },
      {
        key: "de",
        file: newDeFile
      },
    ];

    if (isExist) {
      alertFaultAdded();
    } else {
      onUpdateTranslationFiles(arrayFiles);
    }

  };

  // reFormat the json data
  const data = Object.entries(translationFiles.en).map(([label, value]) => {
    return {
      label,
      rows: Object.keys(value).filter((key) => typeof value[key] === 'string'),
      children: Object.keys(value)
        .filter((key) => typeof value[key] === 'object' && value[key] !== null)
        .map((childLabel) => ({
          label: childLabel,
          rows: Object.keys(value[childLabel]).filter(
            (key) => typeof value[childLabel][key] === 'string'
          ),
        })),
    };
  });

  const onUpdateTranslationFiles = async (updatedTranslationFiles) => {
    const callBack = (data) => {
      if (data.success) {
        alertSuccessUpdate();
        onClickCloseBlockModal();
        onClickCloseModal();
      } else {
        alertFaultUpdate();
      }
    }
    await updateTranslationFilesApi(callApi, callBack, updatedTranslationFiles)
  }

  const downloadExcelFile = async () => {
    const callBack = (res) => {
      if (res.success) {
        const downloadLink = document.createElement('a');
        downloadLink.href = res.data.data;
        downloadLink.download = 'translations.xlsx';
        downloadLink.click();
      }
    };
    await getTranslationsExcelFileApi(callApi, callBack);
  };

  const uploadExcelFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer as ArrayBuffer);
        // Convert data to a Base64 string
        const base64String = btoa(String.fromCharCode.apply(null, data));
        uploadTranslationsExcelFileApi(callApi, () => {
        }, { base64: base64String })
      };
      reader.readAsArrayBuffer(file)
    }
  }

  const onClickOpenBlockModal = () => {
    setOpenBlockModal(true);
  }

  const onClickCloseBlockModal = () => {
    setOpenBlockModal(false);
  }

  const onClickOpenModal = () => {
    setOpenModal(true);
  }

  const onClickCloseModal = () => {
    setOpenModal(false);
  }

  return {
    data,
    handleEdit,
    handleAdd,
    state,
    setState,
    openModal,
    setOpenModal,
    openBlockModal,
    setOpenBlockModal,
    translationFiles,
    setTranslationFiles,
    addEmptyBlockToAllFiles,
    onClickOpenBlockModal,
    onClickCloseBlockModal,
    onClickOpenModal,
    onClickCloseModal,
    downloadExcelFile,
    uploadExcelFile
  };
};

export { useTranslations };