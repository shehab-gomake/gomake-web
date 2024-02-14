import {Stack, Table, TableBody, TableCell, TableRow} from "@mui/material";
import {useMaterialsPricing} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/use-materials-pricing";
import {SecondaryButton} from "@/components/button/secondary-button";
import {convertWidthToVW} from "@/utils/adapter";
import {FONT_FAMILY} from "@/utils/font-family";
import TextField from "@mui/material/TextField";
import {PrimaryButton} from "@/components/button/primary-button";
import {useStyle} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/style";
import {useTranslation} from "react-i18next";

const QuickSetupCalculationComponent = () => {
    const {step, onChange, state} = useMaterialsPricing();
    const {t} = useTranslation();
    const {classes} = useStyle();
    return (
        <Stack gap={'50px'} minWidth={convertWidthToVW(700)} alignItems={'center'}>
            <h3 style={{textAlign: 'center'}}>{step.stepTitle}</h3>
            <Table width={'100%'}>
                <TableBody>
                    {
                        step.parameters.map(parameter => <TableRow style={{border: 0}}>
                            <TableCell align={'left'}>
                                <span style={{width: '30%', justifySelf: 'start'}}>{parameter.label}</span>
                            </TableCell>
                            <TableCell align={'right'}>
                                <TextField placeholder={'Price'} size={'small'} variant={'outlined'}
                                           style={{width: '100px', padding: 0, border: '1px solid black'}}
                                           type={'number'}
                                           value={state[parameter?.parameterKey]}
                                           onChange={(e) => onChange(parameter.parameterKey, e?.target?.value)}/>
                            </TableCell>
                            <TableCell align={'right'}>
                                <SecondaryButton sx={{
                                    '&:hover': {
                                        letterSpacing: 0
                                    },
                                    minWidth: 'fit-content',
                                    width: '30%',
                                    textDecoration: 'underLine', ...FONT_FAMILY.Outfit(600, 14)
                                }}>I don’t use this material</SecondaryButton>
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>
            <Stack width={'100%'} alignItems={'center'} gap={'5px'}>
                <PrimaryButton style={classes.nextButton} variant={'contained'}>{t('signup.next')}</PrimaryButton>
                <SecondaryButton>Skip</SecondaryButton>
            </Stack>
        </Stack>
    )
}

export {QuickSetupCalculationComponent}