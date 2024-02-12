import { Stack } from "@mui/material";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "../../style";

const FooterSection = () => {
    const { t} = usePaymentMethodsTabs();
    const { classes } = useStyle();

    return (
        <div style={{display:"flex" , flexDirection:"column",alignItems:"center",gap:"10px"}}>
            <Stack width={"80%"}>
        <Stack style={{...classes.saveBtn  ,border:"2px solid rgb(235 236 255)" ,  flexDirection:"row" , justifyContent:"space-between"}}>
            <span>hello</span><input readOnly style={{border:"none"}} value={"5$"}></input>
        </Stack>
        <Stack style={{...classes.saveBtn , borderRight:"2px solid rgb(235 236 255)" , borderLeft:"2px solid rgb(235 236 255)", flexDirection:"row" , justifyContent:"space-between"}}>
            <span>hello</span><input style={{border:"none"}} value={"17$"}></input>
        </Stack>
        <Stack style={{...classes.saveBtn , border:"2px solid rgb(235 236 255)" ,flexDirection:"row" , justifyContent:"space-between"}}>
            <span>hello</span><input style={{border:"none"}} value={"17$"}></input>
        </Stack>
        </Stack>
        <SecondaryButton variant={'contained'} style={classes.saveBtn}>{t('payment.save')}</SecondaryButton>
        </div>
    );
};
 
export { FooterSection };
