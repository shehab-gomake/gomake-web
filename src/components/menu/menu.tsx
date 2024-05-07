import { Menu } from '@mui/material';
import { useTranslation } from 'react-i18next';

// const GoMakeMenu = ({ handleClose, open, anchorEl, ...props }) => {
//   const { children }: any = props;
//   return (
//     <Menu
//           aria-labelledby="demo-positioned-button"
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           style={props.style}
//         >
//           {children}
//     </Menu>
//   );
// };

// export { GoMakeMenu };



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
    >
      {children}
    </Menu>
  );
};

export { GoMakeMenu };
