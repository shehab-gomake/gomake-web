import { useTranslation } from "react-i18next";
import {
    GoMakeModal,
    GomakePrimaryButton,
    GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { EditIcon, RemoveIcon } from "@/icons";
import { useClientType } from "./use-client-type";
import { IconButton, Tooltip } from "@mui/material";

const ClientTypeModal = ({
    openModal,
    onClose,
    modalTitle,
    clientTypeId,
}: any) => {
    const {
        clientTypeName,
        setClientTypeName,
        addClientType,
        deleteClientType,
        updateClientType,
        clientTypesCategories,
        editedValues,
        handleInputChange } = useClientType(clientTypeId);
    const { t } = useTranslation();
    const { classes } = useStyle();

    const handleUpdateClick = (item) => {
        const updatedClientType = {
            ...item,
            clientTypeName: editedValues[item.id]?.clientTypeName || item.label,
            additionProfits: editedValues[item.id]?.additionProfits || item.additionProfits,
        };
        updateClientType(updatedClientType);
        onClose();
    };

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
                            <div style={classes.optionStyle} key={`option-${index}`}>
                                <div style={classes.textInputContainer} >
                                    <GomakeTextInput
                                        key={`name-${index}`}
                                        style={classes.textInputStyle}
                                        placeholder={t("products.addProduct.admin.enterName")}
                                        defaultValue={item?.label}
                                        value={editedValues[item.id]?.clientTypeName !== undefined ? editedValues[item.id].clientTypeName : item.label}
                                        disabled={false}
                                        onChange={(e) => handleInputChange(item.id, 'clientTypeName', e.target.value)}
                                    />
                                </div>
                                <div style={{display:"flex" , flexDirection:"row" , alignItems:"center" , gap:"5px"}}>
                                <Tooltip title={t("customers.modal.additionProfits")}>
                                    <GomakeTextInput
                                        key={`percent-${index}`}
                                        style={{...classes.textInputStyle , width:"75px"}}
                                        defaultValue={item?.additionProfits}
                                        value={editedValues[item.id]?.additionProfits !== undefined ? editedValues[item.id].additionProfits : item.additionProfits}
                                        type="number"
                                        onChange={(e) => handleInputChange(item.id, 'additionProfits', e.target.value)}
                                    />
                                    </Tooltip>
                                    %
                                    </div>

                                <div>
                                    <IconButton
                                        onClick={() => handleUpdateClick(item)}
                                        size={"small"}
                                    ><EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => { deleteClientType(item?.id); onClose(); }}
                                        size={"small"}
                                    ><RemoveIcon />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                        <div style={classes.textInputContainer}>
                            <GomakeTextInput
                                style={classes.textInputStyle}
                                placeholder={t("products.addProduct.admin.enterName")}
                                onChange={(e) => setClientTypeName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={classes.addClientTypeBtnContainer} >
                        <GomakePrimaryButton
                            style={classes.addClientTypeBtn}
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
