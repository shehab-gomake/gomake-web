import Stack from "@mui/material/Stack";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {Divider} from "@mui/material";
import {IOutput} from "@/widgets/product-pricing-widget/interface";
import {useState} from "react";
import {UpdateValueInput} from "@/components/text-input/update-value-input";
import Button from "@mui/material/Button";

interface IKeyValueViewProps extends IOutput {
    valueColor?: string;
    key?: string;
    onUpdate?: (v: string) => void;
}

interface IParametersMappingProps {
    parameters: IKeyValueViewProps[]
}

const ParametersMapping = ({parameters}: IParametersMappingProps) => {
    return <>
        {
            parameters?.flatMap((parameter, index, array) => {
                return index < array.length - 1 ? [<KeyValueViewComponent {...parameter}/>,
                    <Divider  orientation={'vertical'} flexItem/>] : [
                    <KeyValueViewComponent {...parameter}/>]
            })
        }
    </>
}
const KeyValueViewComponent = ({name, values, valueColor, defaultUnit}: IKeyValueViewProps) => {
    const {classes} = useStyle();
    return (
        <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
            <span style={classes.detailTitle}>{name}</span>
            {
                values?.map(value => <span style={valueColor ? {
                    ...classes.detailValue,
                    color: valueColor
                } : classes.detailValue}>{!!defaultUnit ? `${value} ${defaultUnit}` : value}</span>)
            }

        </Stack>
    )
}

const EditableKeyValueViewComponent = ({name, values, valueColor, defaultUnit, onUpdate}: IKeyValueViewProps) => {
    const {classes} = useStyle();
    const value = values[0];
    const [edit, setEdit] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>(value);
    const handleValueClick = (e) => {
        e.stopPropagation();
        setEdit(true);
    }

    const handleCancelUpdate = () => {
        setEdit(false);
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
            {edit ? <UpdateValueInput value={editValue} onUpdate={handleValueUpdate} onInputChange={onInputChange} clickedOut={handleValueUpdate} onCancel={handleCancelUpdate}/> : <Button onClick={handleValueClick} variant={'text'} style={valueColor ? {
                ...classes.detailValue,
                color: valueColor
            } : classes.detailValue}>{!!defaultUnit ? `${value} ${defaultUnit}` : value}</Button>}


        </Stack>
    )
}

export {KeyValueViewComponent, ParametersMapping, EditableKeyValueViewComponent}