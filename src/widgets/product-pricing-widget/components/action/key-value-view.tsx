import Stack from "@mui/material/Stack";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { Divider, IconButton } from "@mui/material";
import { IOutput } from "@/widgets/product-pricing-widget/interface";
import { useEffect, useState } from "react";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import Button from "@mui/material/Button";
import { EWorkSource, HtmlElementType } from "@/widgets/product-pricing-widget/enums";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { isCurrency } from "@/utils/is-currency";
import { EditIcon, PlusIcon } from "@/icons";
import { NotesForActionModal } from "./notes-for-action-modal";
import { updateProductItemDraftActionData } from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue } from "recoil";
import { currentCalculationConnectionId } from "@/store";
import { removeTags } from "@/utils/helpers";

interface IKeyValueViewProps extends IOutput {
    valueColor?: string;
    key?: string;
    onUpdate?: (v: string) => void;
    source?: EWorkSource;
}

interface IParametersMappingProps {
    parameters: IKeyValueViewProps[]
    source?: EWorkSource;
    isWorkFlows?: boolean;
    isProductionFloor?: boolean;
}

const ParametersMapping = ({ parameters, source, isWorkFlows = false, isProductionFloor = false }: IParametersMappingProps) => {
    return (
        <>
            {parameters?.flatMap((parameter, index, array) => {
                const keyValueComponent = (
                    <KeyValueViewComponent key={`key-value-${index}`} source={source} {...parameter} />
                );
                const isLastElement = index >= array.length - 1;
                const unitType = parameter?.unitType
                const parameterKey = parameter?.key
                if (isProductionFloor && unitType === 2) {
                    return (
                        <PermissionCheck userPermission={Permissions.SHOW_COSTS_IN_PRODUCTION_FLOOR}>
                            {
                                isLastElement
                                    ? keyValueComponent
                                    : [keyValueComponent, <Divider key={`divider-${index}`} orientation="vertical" flexItem />]
                            }
                        </PermissionCheck>

                    )
                }
                else if (isWorkFlows) {
                    if (parameterKey === "totalCost") {
                        return (
                            <PermissionCheck userPermission={Permissions.SHOW_COSTS_IN_CALCULATIONS}>
                                {
                                    isLastElement
                                        ? keyValueComponent
                                        : [keyValueComponent, <Divider key={`divider-${index}`} orientation="vertical" flexItem />]
                                }
                            </PermissionCheck>
                        )
                    }
                    if (parameterKey === "profit") {
                        return (
                            <PermissionCheck userPermission={Permissions.SHOW_PROFITS_IN_CALCULATIONS}>
                                {
                                    isLastElement
                                        ? keyValueComponent
                                        : [keyValueComponent, <Divider key={`divider-${index}`} orientation="vertical" flexItem />]
                                }
                            </PermissionCheck>
                        )
                    }

                    else {
                        return isLastElement
                            ? keyValueComponent
                            : [keyValueComponent, <Divider key={`divider-${index}`} orientation="vertical" flexItem />];
                    }

                }
                else if (unitType === 2 && !isWorkFlows) {
                    return (
                        <PermissionCheck userPermission={Permissions.SHOW_COSTS_IN_CALCULATIONS}>
                            {
                                isLastElement
                                    ? keyValueComponent
                                    : [keyValueComponent, <Divider key={`divider-${index}`} orientation="vertical" flexItem />]
                            }
                        </PermissionCheck>

                    )
                }
                else {
                    return isLastElement
                        ? keyValueComponent
                        : [keyValueComponent, <Divider key={`divider-${index}`} orientation="vertical" flexItem />];
                }
            })}
        </>
    );
};


const TextAreaActionsMapping = ({ parameters, actionId, currentProductItemValue, productType }: any) => {
    return (
        <>
            {parameters?.flatMap((parameter, index, array) => {
                const keyValueComponent = (
                    <KeyValueViewComponent
                        key={`key-value-${index}`}
                        {...parameter}
                        actionId={actionId}
                        currentProductItemValue={currentProductItemValue}
                        productType={productType}
                    />
                );
                const isLastElement = index >= array.length - 1;
                return isLastElement
                    ? keyValueComponent
                    : [keyValueComponent, <Divider key={`divider-${index}`} orientation="vertical" flexItem />];
            })}
        </>
    );
};

const KeyValueViewComponent = ({
    name,
    id,
    values,
    valueColor,
    defaultUnit,
    outSourceValues,
    source,
    htmlElementType,
    isEditable,
    actionId,
    currentProductItemValue,
    productType
}: any) => {
    const { callApi } = useGomakeAxios();
    const connectionId = useRecoilValue(currentCalculationConnectionId);

    const [value, setValue] = useState<string>("");
    const [openModal, setOpenModal] = useState<boolean>(false);
    useEffect(() => {
        if (values && values.length > 0) {
            setValue(values[0])
        }
    }, [values])
    const handleOnClose = () => {
        setOpenModal(false);
    }
    const handleOnOpen = () => {
        setOpenModal(true);
    }

    const onClickSaveNoteForAction = async (comment: string) => {
        const callBack = (res) => {
            if (res.success) {
                setValue(comment)
                handleOnClose()
            }
        };
        await updateProductItemDraftActionData(callApi, callBack, {
            productItemValueId: currentProductItemValue?.productItemValueId,
            actionId: actionId,
            value: comment,
            fieldName: name,
            productType: productType,
            signalRConnectionId: connectionId,
            OutputId: id
        })
    };
    const { classes } = useStyle();
    const curValues = source === EWorkSource.OUT ? !!outSourceValues ? outSourceValues : ['0'] : values;
    const formattedValue = removeTags(value).length > 8 ? `${removeTags(value).substring(0, 4)}...` : removeTags(value);

    return (
        <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
            <span style={classes.detailTitle}>{name}</span>

            <span style={valueColor ? { ...classes.detailValue, color: valueColor } : classes.detailValue}>
                {/* {!!defaultUnit ? `${removeTags(value)} ${defaultUnit}` : removeTags(value)} */}
                {!!defaultUnit ? `${formattedValue} ${defaultUnit}` : formattedValue}

            </span>
            {htmlElementType === HtmlElementType.TEXT_AREA && !value && isEditable && <IconButton onClick={handleOnOpen}>
                <PlusIcon />
            </IconButton>}
            {htmlElementType === HtmlElementType.TEXT_AREA && value && isEditable && <IconButton onClick={handleOnOpen}>
                <EditIcon /></IconButton>}

            {
                openModal && <NotesForActionModal
                    openModal={openModal}
                    onClose={handleOnClose}
                    value={value}
                    setValue={setValue}
                    onSend={onClickSaveNoteForAction}
                />
            }

        </Stack>
    );
}

const EditableKeyValueViewComponent = ({
    name,
    values,
    valueColor,
    defaultUnit,
    onUpdate,
    outSourceValues,
    source
}: IKeyValueViewProps) => {
    const { classes } = useStyle();
    let value = '0';
    //source === EWorkSource.OUT ? !!outSourceValues && outSourceValues[0] ? outSourceValues[0] : '0' : values[0]
    if (source === EWorkSource.OUT && outSourceValues && outSourceValues.length > 0) {
        value = outSourceValues[0];
    } else if (values && values.length > 0) {
        value = values[0];
    }
    const [edit, setEdit] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>(value);
    const handleValueClick = (e) => {
        e.stopPropagation();
        setEdit(true);
    }

    const handleCancelUpdate = () => {
        setEdit(false);
        setEditValue(value);
    }

    const onInputChange = (v: string) => {
        setEditValue(v);
    };

    const handleValueUpdate = () => {
        onUpdate(editValue);
        setEdit(false);
    }
    return (
        <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
            <span style={classes.detailTitle}>{name}</span>
            {edit ? <UpdateValueInput value={editValue} onUpdate={handleValueUpdate} onInputChange={onInputChange}
                clickedOut={handleValueUpdate} onCancel={handleCancelUpdate} /> :
                <Button onClick={handleValueClick} variant={'text'} style={valueColor ? {
                    ...classes.detailValue,
                    color: valueColor
                } : classes.detailValue}>{!!defaultUnit ? `${value} ${defaultUnit}` : value}</Button>}
        </Stack>
    )
}

export { KeyValueViewComponent, ParametersMapping, EditableKeyValueViewComponent, TextAreaActionsMapping }