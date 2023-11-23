import Stack from "@mui/material/Stack";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {Divider} from "@mui/material";

interface IKeyValueViewProps {
    name: string;
    values: string[];
    valueColor?: string;
    defaultUnit?: string;
}

interface IParametersMappingProps {
    parameters: IKeyValueViewProps[]
}

const ParametersMapping = ({parameters}: IParametersMappingProps) => {
    return <>
        {
            parameters?.flatMap((parameter, index, array) => {
                return index < array.length - 1 ? [<KeyValueViewComponent {...parameter}/>,
                    <Divider style={{height: '50%', margin: 'auto 0'}} orientation={'vertical'} flexItem/>] : [<KeyValueViewComponent {...parameter}/>]
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
                values?.map(value => <span style={valueColor ? {...classes.detailValue, color: valueColor} : classes.detailValue}>{!!defaultUnit ? `${value} ${defaultUnit}` : value}</span>)
            }

        </Stack>
    )
}

export {KeyValueViewComponent, ParametersMapping}