import {useTranslation} from "react-i18next";
import {Stack} from "@mui/material";
import {useStyle} from "@/widgets/quick-setup-widgets/finish-page/style";
import Image from "next/image";
import rocket from "@/widgets/login/right-side/rocket.png";
import Button from "@mui/material/Button";
import {useRouter} from "next/router";

const QuickSetupFinishPageWidget = () => {
  const {t} = useTranslation();
  const {classes} = useStyle();
  const {push} = useRouter();
  return (
      <Stack style={classes.container} alignItems={'center'} gap={'50px'} width={'100vw'} height={'100vh'} justifyContent={'center'} >
          <Image src={rocket} alt="gomake" priority  width={135} height={217}/>
          <h3>{t('signup.finishPageTitle')}</h3>
          <Stack alignItems={'center'} justifyContent={'center'}>
              {
                  t('signup.finishPageP').split(('\n')).map(text =>
                      <span>{text}</span>
                  )
              }
          </Stack>
          <Button onClick={() => push('/')} style={classes.button} variant={'contained'}>{t('signup.finishPageBtn')}</Button>
      </Stack>
  );
};

export {QuickSetupFinishPageWidget}