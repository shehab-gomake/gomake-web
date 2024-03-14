import {CircularProgress, Stack, Table, TableBody, TableCell, TableRow} from "@mui/material";
import {
    useMaterialsPricing
} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/use-materials-pricing";
import {convertWidthToVW} from "@/utils/adapter";
import TextField from "@mui/material/TextField";
import {PrimaryButton} from "@/components/button/primary-button";
import {useStyle} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/style";
import {useTranslation} from "react-i18next";

const QuickSetupMaterialsPricingWidget = () => {
    const {onChange, parameters, saveParameters, currency, loading} = useMaterialsPricing();
    const {t} = useTranslation();
    const {classes} = useStyle();
    return (
        <Stack gap={'50px'} minWidth={convertWidthToVW(700)} alignItems={'center'}>
            <h3 style={{textAlign: 'center'}}>{}</h3>
            {

                loading ? <CircularProgress size="50px" /> :
                    <Table width={'100%'}>
                        <TableBody>
                            {
                                parameters.map(parameter => <TableRow style={{border: 0}}>
                                    <TableCell align={'left'}>
                                        <span style={{
                                            width: '30%',
                                            justifySelf: 'start'
                                        }}>{`${parameter.name} (${parameter.unit})`}</span>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <TextField placeholder={'Price'} size={'small'} variant={'outlined'}
                                                   style={{width: '150px', padding: 0, border: '1px solid black'}}
                                                   type={'number'}
                                                   value={parameter.price}
                                                   onChange={(e) => onChange(parameter.id, e?.target?.value)}/>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <span>{currency()}</span>
                                    </TableCell>
                                </TableRow>)
                            }
                        </TableBody>
                    </Table>
            }
            <Stack width={'100%'} alignItems={'center'} gap={'5px'}>
                <PrimaryButton onClick={saveParameters} style={classes.nextButton}
                               variant={'contained'}>{t('signup.next')}</PrimaryButton>
            </Stack>
        </Stack>
    )
}

export {QuickSetupMaterialsPricingWidget}