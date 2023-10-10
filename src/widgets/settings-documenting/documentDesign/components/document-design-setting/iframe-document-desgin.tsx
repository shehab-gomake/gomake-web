
import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import { Stack } from "@mui/material";
interface IframeProps {
    src: string;

 };
const IframeDocumentDesign = ({ src } : IframeProps) => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    return (
        <div style={{backgroundColor:"#FFFFFF" , boxShadow:"0px 4px 40px 0px rgba(0, 0, 0, 0.08)" , position:"relative", width:"100%",minHeight:"40%",padding:10}}>
           <div>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleStyle} >{t("documentingDesign.IframeDocument.Document")}</span> <span  style={classes.subTitleStyle} >  - Document Type </span>
                </Stack>
           </div>
            <div style={{position:"relative",height:"100%",width:"100%",paddingTop:"56.25%"}}>
            <iframe
                   style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",}}
                    src={src}
                    allowFullScreen
            ></iframe>
            </div>
            
        </div>
    );
};

export {IframeDocumentDesign};