
import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import { Stack } from "@mui/material";
interface IframeProps {
    src: string;
    width: string;
    height: string;
 };
const IframeDocumentDesign = ({ src, width, height } : IframeProps) => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    return (
        <div style={classes.containerIframeComponent}>
           <div>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleStyle} >{t("documentingDesign.IframeDocument.Document")}</span>
                </Stack>
           </div>
            <div>
            <iframe
                    src={src}
                    width={width}
                    height={height}
                    title="My iFrame"
                    allowFullScreen
                    ></iframe>
            </div>
            
        </div>
    );
};

export {IframeDocumentDesign};