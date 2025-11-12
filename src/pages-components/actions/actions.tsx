import { useStyle } from "./style";
import { useActions } from "./use-actions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import { PercentageMaterial } from "@/icons";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

const ActionPageWidget = () => {
  const { clasess } = useStyle();
  const {
    tableHeaders,
    allActions,
    materilasSearched,
    term,
    anchorEl,
    openModal,
    percentageProfit,
    setTerm,
    t,
    handleMoreOptionIconClick,
    handleCloseMenu,
    onOpenModal,
    onCloseModal,
    setPercentageProfit,
    AddNewProfitForActionProfitsApi,
  } = useActions();

  return (
    <div style={clasess.mainContainer}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <HeaderTitleWithSearch
          title={t("products.actions.admin.title")}
          onChange={(e) => setTerm(e)}
        />
        <IconButton onClick={handleMoreOptionIconClick}>
          <SettingsIcon stroke={"#000000"} />
        </IconButton>
      </div>
      {term ? (
        <div style={{ width: "100%" }} data-tour={"actionsTable"}>
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={false}
            rows={materilasSearched}
            headers={tableHeaders}
          />
        </div>
      ) : (
        <div style={{ width: "100%" }} data-tour={"actionsTable"}>
          <PrimaryTable
            data-tour={"actionsTable"}
            stickyFirstCol={false}
            stickyHeader={false}
            rows={allActions}
            headers={tableHeaders}
          />
        </div>
      )}
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        onClick={handleCloseMenu}
      >
        <MenuItem style={clasess.menuContainer} onClick={onOpenModal}>
          <PercentageMaterial />
          <div style={clasess.rowTextStyle}>
            {t("products.profits.admin.updateProfitPercentage")}
          </div>
        </MenuItem>
        {/* <Divider /> */}
      </Menu>
      <GoMakeModal
        modalTitle={t("products.profits.admin.updateProfitPercentage")}
        insideStyle={{ height: "fit-content", width: "30%" }}
        openModal={openModal}
        onClose={onCloseModal}
      >
        <div style={clasess.modalMainContainer}>
          <GomakeTextInput
            style={clasess.multiLineTextInputStyle}
            onChange={(e) => setPercentageProfit(e.target.value)}
            value={percentageProfit}
            placeholder={t("products.profits.admin.profitByPercentage")}
          />
          <GomakePrimaryButton
            style={clasess.btnContainer}
            onClick={AddNewProfitForActionProfitsApi}
          >
            {t("documentingSettings.update")}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </div>
  );
};

export { ActionPageWidget };
