import { useTranslation } from "react-i18next";
import {
    GoMakeModal,
    GomakePrimaryButton,
    GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { RemoveIcon } from "@/icons";
import { useClientType } from "./use-client-type";
import { IconButton } from "@mui/material";

const ClientTypeModal = ({
    openModal,
    onClose,
    modalTitle,
    clientTypeId,
}: any) => {
    const { clientTypeName, setClientTypeName, addClientType, deleteClientType, clientTypesCategories } = useClientType(clientTypeId);
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
                <div >
                    <div style={{ width: "100%" }} >
                        {clientTypesCategories?.map((item, index) => (
                            <div style={classes.optionStyle} >
                                <div style={classes.textInputContainer} >
                                    <GomakeTextInput
                                        style={classes.textInputStyle}
                                        placeholder="Enter Name"
                                        defaultValue={item?.label}
                                        disabled={true}
                                    />
                                </div>
                                <IconButton
                                    onClick={() => {deleteClientType(item?.id); onClose();}}
                                    size={"small"}
                                ><RemoveIcon />
                                </IconButton>
                            </div>
                        ))}
                        <div style={classes.textInputContainer}>
                            <GomakeTextInput
                                style={classes.textInputStyle}
                                placeholder="Enter Name"
                                onChange={(e) => setClientTypeName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }} >
                        <GomakePrimaryButton
                            style={{ width: "50%", height: 40 }}
                            onClick={() => {
                                addClientType(clientTypeName);
                                onClose();
                            }}
                        >{t("customers.buttons.addClientType")}</GomakePrimaryButton>
                    </div>

                </div>
            </GoMakeModal>
        </>
    );
};
export { ClientTypeModal };