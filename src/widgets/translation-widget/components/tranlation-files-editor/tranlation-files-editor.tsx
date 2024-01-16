import {JSONEditor} from "@/widgets/translation-widget/components/tranlation-files-editor/json-editor/json-editor";
import {
    useTranslationsFilesEditor
} from "@/widgets/translation-widget/components/tranlation-files-editor/hooks/use-translations-file-editor";
import {GoMakeAutoComplate} from "@/components";
import { ProgressBar } from "@/components/progress-bar/progress-bar";

const TranslationsFileEditor = () =>{
    const {
        getLanguagesForSelect,
        setSelectedLang,
        selectedLang,
        langJsonFile,
        setEditedLangJsonFile,
        uploadEditedJsonFile,
        uploadPercent
    } = useTranslationsFilesEditor();
    return(
        <div style={{width:'100%',height:'100%'}}>
            <div style={{width:200,marginBottom:15}}>
                <GoMakeAutoComplate 
                    placeholder={"select lang"}
                    defaultValue={selectedLang}
                    options={getLanguagesForSelect()}
                    onChange={(e: any, value: any)=> setSelectedLang(value.value)}
                />
            </div>
            <div style={{width:'100%',height:700}}>
                {
                    uploadPercent ? (<ProgressBar
                        bottomLeftText={"Uploading...."}
                        bottomRightText={""}
                        progress={uploadPercent}/>) : <></>
                }
                <JSONEditor 
                    isSchemaSampleDataOn={true} 
                    onChange={(value) => setEditedLangJsonFile(value)} 
                    schemaValue={langJsonFile} 
                    defaultValue={langJsonFile}
                    onUploadClick={()=>uploadEditedJsonFile()}
                />
            </div>
        </div>
    )
}
export { TranslationsFileEditor };