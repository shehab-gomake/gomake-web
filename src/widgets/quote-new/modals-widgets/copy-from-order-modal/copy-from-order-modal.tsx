import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton, SecondSwitch } from "@/components";
import { useStyle } from "./style";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useState } from "react";
import { OrderTableWidget } from "./order-table";

const CopyFromOrderModal = ({ openModal, onClose }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [term, setTerm] = useState("")

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle="Delivery certification test client"
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.headerContainer}>
            <div style={classes.filtersContainer}>
              <div style={classes.searchContainer}>
                <div style={classes.searchLabelStyle}> Search By </div>
                <SearchInputComponent onChange={setTerm} />
              </div>
              <div style={classes.switchiesContainer}>
                <div style={classes.switchLabelContainer}>
                  <SecondSwitch />
                  <div style={classes.labelSwitchStyle}>Read tasks only</div>
                </div>
                <div style={classes.switchLabelContainer}>
                  <SecondSwitch />
                  <div style={classes.labelSwitchStyle}>Read orders only</div>
                </div>
              </div>
            </div>
          </div>
          <div style={classes.bodyContainer}>
            <OrderTableWidget />
          </div>
          <div style={classes.footerModalContainer}>
            <div style={classes.totalStyle}>Total: NIS 555 not including VA</div>
            <GomakePrimaryButton style={classes.btnContainer}>Add to delivery note</GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { CopyFromOrderModal };