import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const ShowCustomerCard = ({ item , clientType,onClick }: any) => {

  const handleEditClick = async () => {
   onClick(item.id)
  };

  return (
    <>
      <IconButton>
        <EditIcon onClick={handleEditClick} />
      </IconButton>
    </>
  );
};
export { ShowCustomerCard };

