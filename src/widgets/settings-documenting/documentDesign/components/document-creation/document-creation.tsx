import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import { creationDocumetInputs } from "../../inputs/document-creation-inputs";
import { useStyle } from "../../style";
import { useEffect } from "react";
import { UseDocumentDesign } from "@/widgets/settings-documenting/use-document-design";
import { IDocumentDesign, IDocumentDesignProps } from "../../interface";



const DocumentCreation = ({documentDesign ,setdocumentDesign}: IDocumentDesignProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {getDocumentTypes , getDocumentDesignByCreationDoc} = UseDocumentDesign();
    const onChangeInputs = (key, value) => {
        setdocumentDesign({ ...documentDesign, [key]: value })

    }
  
    useEffect(() => {
        getDocumentTypes();
      }, []);
      
    useEffect(() =>{   
        getDocumentDesignByCreationDoc(documentDesign?.docType , documentDesign?.agentId);
    },[documentDesign?.docType , documentDesign?.agentId]);
    return (
        <>
            <div>
                <Stack direction={'row'}  marginTop={"24px"}>
                        <span style={classes.subTitleStyle} >{t("documentingDesign.documnetCreation.documentinCreation")}</span>
                </Stack>
                <Stack direction={'row'}  marginTop={"24px"} width={"90%"} gap={"16px"} >

                    {
                        creationDocumetInputs(documentDesign).map(item => <Stack direction={'column'}  key={item.name} width={"180px"} >
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    }
                </Stack>
            </div>
        </>
    );
}

export {DocumentCreation}


