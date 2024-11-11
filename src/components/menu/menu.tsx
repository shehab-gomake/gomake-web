import { Menu } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {Children, cloneElement} from "react";

const GoMakeMenu = ({ handleClose, open, anchorEl, ...props }) => {
  const { children }: any = props;
  const { t } = useTranslation();
  const direction = t('direction');

  return (
    <Menu
      anchorReference="anchorEl"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={
        direction === 'rtl'
          ? { vertical: 'bottom', horizontal: 'left' }
          : { vertical: 'bottom', horizontal: 'right' }
      }
      transformOrigin={
        direction === 'rtl'
          ? { vertical: 'top', horizontal: 'left' }
          : { vertical: 'top', horizontal: 'right' }
      }
      style={props.style}
      sx={props.sx}
    >
        {Children.map(children, (child) =>
            cloneElement(child, {
                onKeyDown: (event) => {
                    event.stopPropagation();
                },
            })
        )}
    </Menu>
  );
};

export { GoMakeMenu };
