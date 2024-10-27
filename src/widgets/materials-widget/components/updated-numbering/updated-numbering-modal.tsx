import * as React from "react";
import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useRecoilState, } from "recoil";
import { categoryNumberingState, openUpdatedNumburingModalState } from "../../state";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState, useEffect } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { updateMaterialCategoryNumberingApi } from "@/services/api-service/materials/materials-endpoints";
interface IAddRowModalProps {
    isAdmin: boolean;
}
const UpdatedNumburingModal = (props: IAddRowModalProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
    const { callApi } = useGomakeAxios();
    const [openModal, setOpenModal] = useRecoilState<boolean>(openUpdatedNumburingModalState);
    const [categoryNumbering, setCategoryNumbering] = useRecoilState<any>(categoryNumberingState);
    const [value, setValue] = useState(categoryNumbering?.value)
    const [prefix, setPrefix] = useState(categoryNumbering?.prefix)
    useEffect(() => {
        if (categoryNumbering) {
            setValue(categoryNumbering?.value)
            setPrefix(categoryNumbering?.prefix)
        }
    }, [categoryNumbering])

    const updateMaterialCategoryNumbering = async () => {
        const callBack = res => {
            if (res.success) {
                alertSuccessUpdate()
            } else {
                alertFaultUpdate()

            }
        }
        await updateMaterialCategoryNumberingApi(callApi, callBack, {
            value,
            prefix,
            categoryKey: categoryNumbering?.categoryKey,
            materialTypeKey: categoryNumbering?.materialTypeKey
        });
    };
    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={() => { setOpenModal(false), setPrefix(""), setValue("") }}
            modalTitle={t("materialsActions." + "UpdateNumbering")}
        >
            <>
                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, marginTop: "10px", marginBottom: "20px", }}>
                    <GomakeTextInput
                        style={{
                            borderRadius: 4,
                            height: 40,
                            width: "100%",

                        }}
                        onChange={(e: any) => setPrefix(e.target.value)}
                        value={prefix}
                        placeholder={t("documentingSettings.prefix")}
                    />
                    <GomakeTextInput
                        style={{
                            borderRadius: 4,
                            height: 40,
                            width: "100%",
                        }}
                        onChange={(e: any) => setValue(e.target.value)}
                        value={value}
                        placeholder={t("documentingSettings.value")}
                    />
                </div>
                <SecondaryButton
                    onClick={updateMaterialCategoryNumbering}
                    sx={{ width: "100%" }}
                    variant={"contained"}
                >
                    {t("documentingDesign.Save")}
                </SecondaryButton>
            </>
        </GoMakeModal>
    );
};

export { UpdatedNumburingModal };