
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { SecondaryButton } from "@/components/button/secondary-button";
import { DocumentCreation } from "../document-creation/document-creation";
import { TitleDefinition } from "../TitleDefinition/title-definition";
import { TableSetting } from "../table-setting/table-setting";
import { Additional } from "../additional/additional";
import { Footer } from "../footer/footer";
import { QRCodes } from "../QRCodes/QR-codes";
import { useStyle } from "../../style";
import { useState } from "react";

const DocumentDesign = () => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    const [documentCreation , setdocumentCreation] = useState([]);
    return (
        <div style={classes.container}>
           <div>
                <div >
                        <DocumentCreation documentCreation={documentCreation} setdocumentCreation={undefined}    />
                    </div>
                    <div>
                        <TitleDefinition documentCreation={undefined} setdocumentCreation={undefined}/>
                    </div>
                    <div>
                        <TableSetting documentCreation={undefined} setdocumentCreation={undefined}/>
                    </div>
                    <div>
                        <Additional documentCreation={undefined} setdocumentCreation={undefined}/>
                    </div>
                    <div>
                        <Footer documentCreation={undefined} setdocumentCreation={undefined}/>
                    </div>
                    <div>
                        <QRCodes documentCreation={undefined} setdocumentCreation={undefined}/>
                    </div>
                    <div style={{ position: "fixed", bottom: 0,width:"11%", right: "30%", padding: "10px", zIndex: 999}}>
                        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                            <SecondaryButton variant="outlined" >{t("documentingDesign.Reset")}</SecondaryButton>
                            <SecondaryButton variant="contained">{t('documentingDesign.Save')}</SecondaryButton>

                        </div>
                    </div>
           </div>
           <div>
                
           </div>
            
        </div>
    );
};

export {DocumentDesign};
