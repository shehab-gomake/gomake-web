import { useTranslation } from "react-i18next";
import {
    GoMakeModal,
    GomakePrimaryButton,
    GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useClientType } from "./use-client-type";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";

interface IProps {
    openModal: boolean,
    modalTitle?: string,
    onClose: () => void,
    clientTypeId: CLIENT_TYPE_Id
}

const AddClientTypeModal = ({
    openModal,
    modalTitle,
    onClose,
    clientTypeId
}: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { clientTypeName, setClientTypeName, addClientType } = useClientType(clientTypeId);

    return (
        <>
            <GoMakeModal
                openModal={openModal}
                modalTitle={modalTitle}
                onClose={onClose}
                insideStyle={classes.insideStyle}
            >
                <div style={{ marginTop: 20, height: "80%" }}>
                    <div style={classes.containerButtons}>
                        <GomakeTextInput
                            style={classes.textInputStyle}
                            placeholder={t("Enter name")}
                            onChange={(e: any) => {
                                setClientTypeName(e.target.value);
                            }}
                        />
                        <div style={classes.btnContainer}>
                            <GomakePrimaryButton
                                style={classes.addBtnStyle}
                                onClick={() => addClientType(clientTypeName)}
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