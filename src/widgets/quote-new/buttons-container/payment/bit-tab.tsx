import { GomakeTextInput } from "@/components";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";



const BitTab = () => {
    const { t } = useTranslation();

    return (
        <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} padding={"0 5px"} height={570} >
            <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
                <span>{t("payment.totalBit")}</span>
                <GomakeTextInput
                    style={{ height: "40px", maxWidth: 180 }}
                    type={"number"}
                    placeholder={t("payment.sum")}
                    value={null}
                />
            </Stack>
            <SecondaryButton variant={'contained'} style={{ display: "flex", alignSelf: "center", width: "80%" }}>
                {t('payment.save')}
            </SecondaryButton>
        </Stack>

    );
}
export { BitTab }