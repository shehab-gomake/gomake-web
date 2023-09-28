import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import { useStyle } from "./style";

const UpdateDocumentBtn = ({onClickUpdate}: any) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    return (
        <Button sx={classes.actionBtn} onClick={onClickUpdate}>{t('documentingSettings.update')}</Button>
    );
}
export {UpdateDocumentBtn}