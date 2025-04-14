import { GomakePrimaryButton } from "@/components/button";
import { GoMakeModal } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { Checkbox } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

interface IModalFilters {
  openModalDuplicateGroup: boolean;
  onClickCloseModalDuplicateGroup: () => void;
  handleCloseMenu: () => void;
  selectedUsers: string[];
  users: any[];
  handleSelectAllUsers: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserSelect: (userId: string) => void;
  duplicateStationFilterByGroupId: () => void;
}


const ModalFilters = ({
  openModalDuplicateGroup,
  onClickCloseModalDuplicateGroup,
  handleCloseMenu,
  selectedUsers,
  users,
  handleSelectAllUsers,
  handleUserSelect,
  duplicateStationFilterByGroupId }: IModalFilters) => {
  const { t } = useTranslation();
  const { classes } = useStyle()
  return (
    <GoMakeModal
      openModal={openModalDuplicateGroup}
      onClose={() => {
        onClickCloseModalDuplicateGroup()
        handleCloseMenu();
      }}
      insideStyle={classes.modalContainer}
      modalTitle={t("productionFloor.copyToUsers")}
    >
      <div style={classes.modalMainContainer}>
        <div style={classes.checkboxContainer}>
          <Checkbox
            checked={selectedUsers?.length === users?.length}
            onChange={handleSelectAllUsers}
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
          />
          <label htmlFor="selectAll" style={{ ...FONT_FAMILY.Lexend(500, 16) }}>{t("productionFloor.selectAllUsers")}</label>
        </div>
        <div style={classes.usersContainer}>
          {users?.map((user) => {
            return (
              <div key={user?.id} style={classes.userContainer}>
                <Checkbox
                  checked={selectedUsers?.includes(user?.id)}
                  onChange={() => handleUserSelect(user?.id)}
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon />}
                />
                <label htmlFor={`user-${user?.id}`} style={{ ...FONT_FAMILY.Lexend(500, 16) }}>
                  {user?.name}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div style={classes.buttonContainer}>
        <GomakePrimaryButton style={{ height: "40px" }} onClick={duplicateStationFilterByGroupId}>
          {t("products.profits.admin.copy")}
        </GomakePrimaryButton>

        <GomakePrimaryButton onClick={() => {
          onClickCloseModalDuplicateGroup()
          handleCloseMenu();
        }} style={{ height: "40px" }}> {t("sales.quote.cancel")}</GomakePrimaryButton>
      </div>
    </GoMakeModal>
  )
};

export { ModalFilters }