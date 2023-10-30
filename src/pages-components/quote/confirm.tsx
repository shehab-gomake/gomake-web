import { GomakeIcon } from "@/icons/Gomake-icon";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { ContactAddressConfirmPage } from "./conatct-address-component/contact-address-component";
import { SeconderyPrimaryTableRow } from "@/components/tables/seconderyPrimaryTable/secondery-primary-table";

const ConfirmQuote = () => {
    const { clasess } = useStyle();
    const row = [
        ['test'  , 'test' , 'test' ,'test','test' , 'test', 'test' , 'test'] ,
        ['test'  , 'test' , 'test' ,'test','test' , 'test', 'test' , 'test'],
        ['test'  , 'test' , 'test' ,'test','test' , 'test', 'test' , 'test'],
        ['test'  , 'test' , 'test' ,'test','test' , 'test', 'test' , 'test'],
        ['test'  , 'test' , 'test' ,'test','test' , 'test', 'test' , 'test'],
        ['test'  , 'test' , 'test' ,'test','test' , 'test', 'test' , 'test']
    ]
    const HeaderRow = [
        '#' , 'Item code' , 'Item name','Details' , 'Amount','Discount','Unit Price','Final Price'
    ]
    return ( 
        <div style={clasess.HeaderConfirmPage}>
            <div style={clasess.GomakeIconStyle}>
                 <GomakeIcon />
            </div>
            <div style={clasess.MainContainerInConfirmPage}>
                <Stack direction={'row'}>
                        <span style={clasess.mainTitleStyle} >Quote - 1012381</span>
                </Stack>
                <Stack display={'flex'} direction={'row'}  borderBottom={'1px solid #EAECF0'} >
                    <Stack>
                            <span style={clasess.subTitleStyle} >Date of Reference : 10/19/2023 </span>
                    </Stack>
                    <Stack marginLeft={'30px'}>
                            <span style={clasess.subTitleStyle} >Delivery Time : 11 working days </span>
                    </Stack>
                </Stack>
                <div>
                   <ContactAddressConfirmPage/>
                </div>
                 <div style={{marginTop:20}}>
                    <SeconderyPrimaryTableRow rows={row} headers={HeaderRow}/>
                 </div>

            </div>
         
        </div>
    )
}
export { ConfirmQuote };