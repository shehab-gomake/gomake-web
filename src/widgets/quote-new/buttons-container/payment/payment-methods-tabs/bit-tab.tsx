import { GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";



const BitTab = () => {
    const { t } = useTranslation();

    return (
        <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
            <span>{t("payment.totalBit")}</span>
            <GomakeTextInput
                style={{ height: "40px", maxWidth: 180 }}
                type={"number"}
                placeholder={t("payment.sum")}
                value={null}
            />
        </Stack>
    );
}
export { BitTab }