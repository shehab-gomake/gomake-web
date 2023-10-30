import { Stack } from "@mui/material";
import { useStyle } from "../style";


const ContactAddressConfirmPage =  () => {
    const { clasess } = useStyle();
      return (
        <>
        <Stack display={'flex'} direction={'row'} gap={4}>  
                <Stack>
                     <span style={clasess.subTitleStyle}>Business name  <span style={clasess.subTitleStyle2}>Company Name 1</span> </span>
                </Stack>
                <Stack>
                     <span style={clasess.subTitleStyle}>Purchase number <span style={clasess.subTitleStyle2}>No purchase number</span> </span>
                </Stack>
                <Stack>
                     <span style={clasess.subTitleStyle}>Business code <span style={clasess.subTitleStyle2}>C000036</span> </span>
                </Stack>
                <Stack>
                     <span style={clasess.subTitleStyle}>Address <span style={clasess.subTitleStyle2}>Ben Azaria 12 Yaffo Palestine, Tel Aviv</span> </span>
                </Stack>
        </Stack>
        <Stack display={'flex'} direction={'row'} gap={4} borderBottom={'1px solid #EAECF0'}>
                <Stack>
                     <span style={clasess.subTitleStyle}>Contact Name  <span style={clasess.subTitleStyle2}>John Smith </span> </span>
                </Stack>
                <Stack>
                     <span style={clasess.subTitleStyle}>Contact Name  <span style={clasess.subTitleStyle2}>John Smith </span> </span>
                </Stack>
                <Stack>
                     <span style={clasess.subTitleStyle}>Contact email  <span style={clasess.subTitleStyle2}>john.smith@gomake.com</span> </span>
                </Stack>
            
        </Stack>
        
        </>
       
      )
}

export {ContactAddressConfirmPage};