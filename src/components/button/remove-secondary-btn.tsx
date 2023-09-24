import {DeleteIcon} from "@/components/icons/delete-icon";
import {useStyle} from "@/components/button/style";
import {useTranslation} from "react-i18next";
import {ButtonProps} from "@mui/material/Button";
import {SecondaryButton} from "@/components/button/secondary-button";


const RemoveSecondaryBtn = ({onClick}: ButtonProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
  return (
      <SecondaryButton variant={'text'}  onClick={onClick}  style={classes.deleteIcon}
                       startIcon={<DeleteIcon height={20} width={20} color={classes.iconColor}/>}>
          {t('navigationButtons.remove')}
      </SecondaryButton>
  );
};

export {RemoveSecondaryBtn};