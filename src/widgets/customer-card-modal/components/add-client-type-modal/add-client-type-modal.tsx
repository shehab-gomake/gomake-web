import { useTranslation } from "react-i18next";
import {
    GoMakeModal,
    GomakePrimaryButton,
    GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";

interface IProps {
    openModal: boolean,
    modalTitle?: string,
    onClose: ()=>void,
    onChangeStateClientType?: (key:string,value:string)=>void,
    createNewClientType?: ()=>void,
}
const AddClientTypeModal = ({
    openModal,
    modalTitle,
    onClose,
    onChangeStateClientType,
    createNewClientType,
}: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    return (
        <>
            <GoMakeModal
                openModal={openModal}
                modalTitle={modalTitle}
                onClose={onClose}
                insideStyle={classes.insideStyle}
            >
                <div style={{ marginTop: 20, height: "80%" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            height: "100%",
                        }}
                    >
                        <div style={classes.mainInputsContainer}>
                            <div style={{ width: "100%" }}>
                                <GomakeTextInput
                                    style={classes.textInputStyle}
                                    placeholder={t("Enter name")}
                                    onChange={(e: any) => {
                                        onChangeStateClientType("name", e.target.value);
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%" }}>
                                <GomakeTextInput
                                    style={classes.textInputStyle}
                                    placeholder={t("Enter code")}
                                    onChange={(e: any) => {
                                        onChangeStateClientType("code", e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div style={classes.btnContainer}>
                            <GomakePrimaryButton
                                style={classes.addBtnStyle}
                                onClick={() => createNewClientType()}
                            >
                                {t("add new client type")}
                            </GomakePrimaryButton>
                        </div>
                    </div>
                </div>
            </GoMakeModal>
        </>
    );
};
export { AddClientTypeModal };