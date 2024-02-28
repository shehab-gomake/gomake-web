
import { Button } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { HeaderTitle } from "@/widgets/header-title/header-title";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { useGomakeRouter } from "@/hooks";

const DepositsHeaderSection = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const { navigate } = useGomakeRouter();

    return (
        <div style={classes.headerStyle}>
            <HeaderTitle title={t("tabs.deposits")} marginTop={1} marginBottom={1} />
            <Button
                style={classes.createNew}
                onClick={() => navigate(`/deposit`)}
                startIcon={<AddCircleOutlineIcon style={{ color: 'black', fontSize: "24px" }} />}>
                {t("sales.quote.createNew")}
            </Button>
        </div>
    )
}
export { DepositsHeaderSection }