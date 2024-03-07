import Stack from "@mui/material/Stack";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {Divider} from "@mui/material";
import {IOutput} from "@/widgets/product-pricing-widget/interface";
import {useState} from "react";
import {UpdateValueInput} from "@/components/text-input/update-value-input";
import Button from "@mui/material/Button";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";

interface IKeyValueViewProps extends IOutput {
    valueColor?: string;
    key?: string;
    onUpdate?: (v: string) => void;
    source?: EWorkSource;
}

interface IParametersMappingProps {
    parameters: IKeyValueViewProps[]
    source?: EWorkSource;
}

const ParametersMapping = ({parameters, source}: IParametersMappingProps) => {
    return <>
        {
            parameters?.flatMap((parameter, index, array) => {
                return index < array.length - 1 ? [<KeyValueViewComponent source={source} {...parameter}/>,
                    <Divider orientation={'vertical'} flexItem/>] : [
                    <KeyValueViewComponent {...parameter} source={source}/>]
            })
        }
    </>
}
const KeyValueViewComponent = ({
                                   name,
                                   values,
                                   valueColor,
                                   defaultUnit,
                                   outSourceValues,
                                   source
                               }: IKeyValueViewProps) => {
    const {classes} = useStyle();
    const curValues = source === EWorkSource.OUT ? !!outSourceValues ? outSourceValues : ['0'] : values;
    return (
        <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
            <span style={classes.detailTitle}>{name}</span>
            {
                curValues?.map(value => <span style={valueColor ? {
                    ...classes.detailValue,
                    color: valueColor
                } : classes.detailValue}>{!!defaultUnit ? `${value} ${defaultUnit}` : value}</span>)
            }

        </Stack>
    )
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
    const {classes} = useStyle();
    let value = '0';
    //source === EWorkSource.OUT ? !!outSourceValues && outSourceValues[0] ? outSourceValues[0] : '0' : values[0]
    if(source === EWorkSource.OUT && outSourceValues && outSourceValues.length > 0 ){
        value = outSourceValues[0];
    }else if(values && values.length > 0){
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
                                      clickedOut={handleValueUpdate} onCancel={handleCancelUpdate}/> :
                <Button onClick={handleValueClick} variant={'text'} style={valueColor ? {
                    ...classes.detailValue,
                    color: valueColor
                } : classes.detailValue}>{!!defaultUnit ? `${value} ${defaultUnit}` : value}</Button>}


        </Stack>
    )
}

export {KeyValueViewComponent, ParametersMapping, EditableKeyValueViewComponent}