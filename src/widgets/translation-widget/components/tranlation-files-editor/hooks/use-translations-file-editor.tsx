import { useEffect, useState } from "react";
import { fetchS3JsonTranslation } from "@/utils/S3Translation";
import AWS from "aws-sdk";
import { getLangsForJsonEditorApi } from "@/services/api-service/aws-s3/update-web-translations-table";
import { useGomakeAxios } from "@/hooks";

const useTranslationsFilesEditor = () => {
  const { callApi } = useGomakeAxios();
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [langJsonFile, setLangJsonFile] = useState<string>("");
  const [editedLangJsonFile, setEditedLangJsonFile] = useState<string>("");
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [languages, setLanguages] = useState<
    { value: string; label: string }[]
  >([]);

  const uploadEditedJsonFile = async () => {
    if (!editedLangJsonFile) {
      return;
    }
    const S3_BUCKET = "gomake-translations";
    const REGION = "eu-central-1";
    const fileName = `web/${selectedLang}.json`;
    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      accessKeyId: "AKIA3JXGE2AOW7JK5EV7",
      secretAccessKey: "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",
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: editedLangJsonFile,
    };
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        const percent = (evt.loaded * 100) / evt.total;
        setUploadPercent(percent);
      })
      .promise();

    await upload.then((e) => {
      setUploadPercent(0);
    });
  };

  const fetchLanguagesForSelect = () => {
    const callBack = (res) => {
      const langOptions = res.data.map((lang: string) => ({
        value: lang,
        label: lang,
      }));
      setLanguages(langOptions);
    };
    getLangsForJsonEditorApi(callApi, callBack);
  };

  useEffect(() => {
    if (selectedLang) {
      fetchS3JsonTranslation(`${selectedLang}.json`).then((x) => {
        setLangJsonFile(JSON.stringify(x));
      });
    }
  }, [selectedLang]);

  useEffect(() => {
    fetchLanguagesForSelect();
  }, []);

  return {
    setSelectedLang,
    selectedLang,
    langJsonFile,
    setEditedLangJsonFile,
    uploadEditedJsonFile,
    uploadPercent,
    languages,
  };
};
export { useTranslationsFilesEditor };
