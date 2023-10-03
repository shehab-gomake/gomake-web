import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import { creationDocumetInputs } from "../../inputs/document-creation-inputs";
import { useStyle } from "../../style";
import { useEffect } from "react";
import { UseDocumentDesign } from "@/widgets/settings-documenting/use-document-design";
import { useRecoilState } from "recoil";
import { documentDesignState } from "@/widgets/settings-documenting/state/documents-state";

interface IProps {
    documentCreation:{
        agentId:  string,
        documentId: string,
      
    };
    setdocumentCreation?: (documentCreation: any) => void;
}



const DocumentCreation = ({documentCreation, setdocumentCreation }: IProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {getDocumentTypes , getDocumentDesignByCreationDoc} = UseDocumentDesign();
    const [documentDesign, setdocumentDesign] = useRecoilState(documentDesignState);
    const onChangeInputs = (key, value) => {
        setdocumentCreation({ ...documentCreation, [key]: value })
     
    }

    useEffect(() =>{
        getDocumentDesignByCreationDoc(documentCreation);
        console.log(documentDesign);
    },[documentCreation])
    useEffect(() => {
        getDocumentTypes();
        
      }, []);
    return (
        <>
            <div>
                <Stack direction={'row'}  marginTop={"24px"}>
                        <span style={classes.subTitleStyle} >{t("documentingDesign.documnetCreation.documentinCreation")}</span>
                </Stack>
                <Stack direction={'row'}  marginTop={"24px"} width={"90%"} gap={"16px"} >

                    {
                        creationDocumetInputs(documentCreation).map(item => <Stack direction={'column'}  key={item.name} width={"180px"} >
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    }
                </Stack>
            </div>
        </>
    );
}

export {DocumentCreation}


