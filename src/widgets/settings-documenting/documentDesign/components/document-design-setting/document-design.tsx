
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { SecondaryButton } from "@/components/button/secondary-button";
import { TitleDefinition } from "../TitleDefinition/title-definition";
import { TableSetting } from "../table-setting/table-setting";
import { Additional } from "../additional/additional";
import { Footer } from "../footer/footer";
import { QRCodes } from "../QRCodes/QR-codes";
import { useStyle } from "../../style";
import { IDocumentDesign, IDocumentDesignProps } from "../../interface";
import { DocumentCreation } from "../document-creation/document-creation";
import { UseDocumentDesign } from "@/widgets/settings-documenting/use-document-design";

const DocumentDesign = ({documentDesign , setdocumentDesign}: IDocumentDesignProps) => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    const {  AddOrUpdateDocumentDesign , ResetDocumentDesign} = UseDocumentDesign();
    const addDocumentDesign = async () => {
        console.log("documentDesign is in save button " + JSON.stringify(documentDesign))
        await AddOrUpdateDocumentDesign(documentDesign);
    };
    const ResetDeafultDocumentDesign = async () =>{
        await ResetDocumentDesign(documentDesign);
    };
    return (
        <div style={classes.container}>
           <div>
                    <div>
                       <DocumentCreation documentDesign={documentDesign}   setdocumentDesign={setdocumentDesign}  />
                    </div>
                    <div>
                        <TitleDefinition documentDesign={documentDesign}  setdocumentDesign={setdocumentDesign} />
                    </div>
                    <div>
                        <TableSetting documentDesign={documentDesign}  setdocumentDesign={setdocumentDesign}/>
                    </div>
                    <div>
                        <Additional documentDesign={documentDesign}  setdocumentDesign={setdocumentDesign}/>
                    </div>
                    <div>
                        <Footer documentDesign={documentDesign}  setdocumentDesign={setdocumentDesign}/>
                    </div>
                    <div>
                        <QRCodes documentDesign={documentDesign}  setdocumentDesign={setdocumentDesign} />
                    </div>
                    <div style={{ position: "fixed", bottom: 0,width:"11%", right: "30%", padding: "10px", zIndex: 999}}>
                        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                            <SecondaryButton onClick={ResetDeafultDocumentDesign} variant="outlined" >{t("documentingDesign.Reset")}</SecondaryButton>
                            <SecondaryButton onClick={addDocumentDesign} variant="contained">{t('documentingDesign.Save')}</SecondaryButton>

                        </div>
                    </div>
           </div>
           <div>
                
           </div>
            
        </div>
    );
};

export {DocumentDesign};
