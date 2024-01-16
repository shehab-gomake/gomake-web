import {useEffect, useState} from "react";
import {fetchS3JsonTranslation} from "@/utils/S3Translation";
import AWS from 'aws-sdk';


const useTranslationsFilesEditor = () => {
  const [selectedLang,setSelectedLang] = useState<string>("en");
  const [langJsonFile,setLangJsonFile] = useState<string>("")
  const [editedLangJsonFile,setEditedLangJsonFile] = useState<string>("")
  const [uploadPercent,setUploadPercent]= useState<number>(0)
  useEffect(()=>{
    if(selectedLang){
      debugger;
      fetchS3JsonTranslation(`${selectedLang}.json`).then(x=>{
        debugger;
        setLangJsonFile(JSON.stringify(x));
      });
    }
    
  },[selectedLang])
  const getLanguagesForSelect = () =>{
    return [{value:"en",label:"en"},{value:"ar",label:"ar"},{value:"de",label:"de"},{value:"he",label:"he"}]
  }
  const uploadEditedJsonFile = async () => {
    if(!editedLangJsonFile){
      return;
    }
    const S3_BUCKET = "gomake-translations";
    const REGION = "eu-central-1";
    const fileName = `web/${selectedLang}.json`;
    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      accessKeyId:"AKIA3JXGE2AOW7JK5EV7",
      secretAccessKey:"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",
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
          setUploadPercent(percent)
        })
        .promise();

    await upload.then((e) => {
      setUploadPercent(0);
    });
  }
  return {
    getLanguagesForSelect,
    setSelectedLang,
    selectedLang,
    langJsonFile,
    setEditedLangJsonFile,
    uploadEditedJsonFile,
    uploadPercent
  };
};
export { useTranslationsFilesEditor };
