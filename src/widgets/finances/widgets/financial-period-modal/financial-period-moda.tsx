import { GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { FormInput } from "@/components/form-inputs/form-input";
import { FinancialPeriodInputs } from "./inputs";
import { IInput } from "@/components/form-inputs/interfaces";
import { useFinancialPeriodModal } from "./use-financial-period-modal";
import { SecondaryButton } from "@/components/button/secondary-button";


const FinancialPeriodModal = ({ openModal, onClose }) => {
    const { classes } = useStyle();
    const {
        t,
        state,
        setState,
        onChangeInputs,
        monthStatues,
        months,
        years,
        onClickSave
    } = useFinancialPeriodModal({onClose});


    return (
        <>
            <GoMakeModal
                openModal={openModal}
                modalTitle={t("financesWidget.financialPeriod")}
                onClose={onClose}
                insideStyle={classes.insideStyle}
            >
                <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} height={"100%"}>
                    <Stack direction={"row"} gap={"5px"} width={"140px"}>
                        {FinancialPeriodInputs(state, months, years, monthStatues).map((item) => (
                            <FormInput
                                input={item as IInput}
                                changeState={onChangeInputs}
                                error={false}
                                readonly={false}
                            />
                        ))}
                    </Stack>
                    <SecondaryButton style={{alignSelf:"center"}} variant="contained" onClick={onClickSave}>{t("payment.save")}</SecondaryButton>
                </Stack>

            </GoMakeModal>
        </>
    );
};
export { FinancialPeriodModal };