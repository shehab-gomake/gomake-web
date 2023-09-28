

import { useStyle } from "./style";
import {DocumentCreation} from "./components/document-creation/document-creation";
import { useState } from "react";
import { TitleDefinition } from "./components/TitleDefinition/title-definition";
import { TableSetting } from "./components/table-setting/table-setting";
import { Additional } from "./components/additional/additional";
import { Footer } from "./components/footer/footer";
import { QRCodes } from "./components/QRCodes/QR-codes";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { SecondaryButton } from "@/components/button/secondary-button";

const DocumentDesign = () => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    const [documentCreation , setdocumentCreation] = useState([]);
    return (
        <div style={classes.container}>
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
            <div style={{ position: "fixed", bottom: 0, right: "30%", padding: "10px", zIndex: 999}}>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <SecondaryButton variant="outlined" >{t("documentingDesign.Reset")}</SecondaryButton>
                    <SecondaryButton variant="contained">{t('documentingDesign.Save')}</SecondaryButton>

                </div>
            </div>
            
        </div>
    );
};

export {DocumentDesign};
