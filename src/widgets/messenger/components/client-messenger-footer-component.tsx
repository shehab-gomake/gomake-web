import Stack from "@mui/material/Stack";
import {Avatar} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useEffect, useState} from "react";
import {getCompanyLoginLogo} from "@/services/api-service/profiles/company-profile-api";
import {useGomakeAxios} from "@/hooks";
import {FONT_FAMILY} from "@/utils/font-family";

const ClientMessengerFooterComponent = ({}) => {
  const {primaryColor} = useGomakeTheme();
  const {callApi} = useGomakeAxios();
  const [printHouseInfo, setPrintHouseInfo] = useState<{loginLogo: string; name: string}>({loginLogo: '', name: ''})
  const getPrintHouseInfo = async () => {
    const callBack = (res) => {
      if (res.success) {
        setPrintHouseInfo(res.data);
      }
    };
    await getCompanyLoginLogo(callApi, callBack);
  };
  useEffect(()=>{
    getPrintHouseInfo().then();
  }, [])

  return <Stack bgcolor={primaryColor(600)} height={'50px'} justifyContent={'center'} alignItems={'center'} direction={'row'} gap={'10px'}>
    <Avatar style={{width: '26px', height: '26px'}} src={printHouseInfo.loginLogo}/>
    <span style={{color: '#FFF', ...FONT_FAMILY.Inter(600, 14), textTransform: 'capitalize'}}>{printHouseInfo.name}</span>
  </Stack>
};

export {ClientMessengerFooterComponent}