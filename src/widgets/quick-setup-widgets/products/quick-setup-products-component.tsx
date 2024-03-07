import {Stack, Table, TableBody, TableCell, TableRow} from "@mui/material";
import {SecondaryButton} from "@/components/button/secondary-button";
import {convertWidthToVW} from "@/utils/adapter";
import TextField from "@mui/material/TextField";
import {PrimaryButton} from "@/components/button/primary-button";
import {useStyle} from "@/widgets/quick-setup-widgets/products/style";
import {useTranslation} from "react-i18next";
import {useQuickSetupProducts} from "@/widgets/quick-setup-widgets/products/use-quick-setup-products";

const QuickSetupProductsComponent = () => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {product, onChange, onClickNext, updatedQuantities, onClickSkip} = useQuickSetupProducts();
    return (
        <Stack gap={'40px'} minWidth={convertWidthToVW(700)}>
            <h3 style={classes.header}>{'Please calculate your price!'}</h3>
            <Stack width={'70%'} margin={'0 auto'} justifyContent={'center'}>
                <Table>
                    <TableBody>
                        {
                            product?.details && Object.entries(product?.details).map(([key, value]) =>
                                <TableRow>
                                    <TableCell style={classes.detailsKey}>{key}:</TableCell>
                                    <TableCell style={classes.detailsValue}>{value}</TableCell>
                                </TableRow>)
                        }
                    </TableBody>
                </Table>
            </Stack>
            <Table width={'100%'}>
                <TableBody>
                    {
                        updatedQuantities?.map(quantity => <TableRow style={{border: 0}}>
                            <TableCell align={'left'}>
                                <span style={{
                                    width: '30%',
                                    justifySelf: 'start'
                                }}>{`${quantity.quantity} units price:`}</span>
                            </TableCell>
                            <TableCell align={'right'}>
                                <TextField placeholder={'Price'} size={'small'} variant={'outlined'}
                                           style={{width: '100px', padding: 0, border: '1px solid black'}}
                                           type={'number'}
                                           onChange={(e) => onChange(quantity?.quantity, +e?.target?.value)}
                                           value={quantity?.price > 0 ? quantity?.price : ''}/>
                            </TableCell>
                            <TableCell align={'right'}>
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>
            <Stack width={'100%'} alignItems={'center'} gap={'5px'}>
                <PrimaryButton onClick={onClickNext} style={classes.nextButton}
                               variant={'contained'}>{t('signup.next')}</PrimaryButton>
                <SecondaryButton onClick={onClickSkip}>Skip</SecondaryButton>
            </Stack>
        </Stack>
    )
}

export {QuickSetupProductsComponent}