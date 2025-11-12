import {
  GoMakeDeleteModal,
  GoMakeMenu,
  GomakePrimaryButton,
} from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { useHotFolder } from "./use-hot-folder";
import { IconButton, MenuItem, Typography } from "@mui/material";
import { AddRuleModal } from "@/pages-components/products/profits-new/widgets/add-rule-modal";
import { MoreCircleIcon } from "@/icons";
import { useMenuModal } from "@/hooks";
import { useModal } from "@/hooks/use-modal";
import { ModalType } from "@/enums";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CopyAnotherProductsModal } from "../work-flows-widget/copy-another-products-modal";
import { useParameters } from "@/hooks/use-parameters";

const HotFolderWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    productHotFolderRules,
    openAddNewRuleModal,
    selectedItem,
    onClickCloseAddNewRuleModal,
    onClickOpenAddNewRuleModal,
    getProductHotFolderRules,
    deleteProductHotFolderRule,
    onDragEnd,
    setSelectedItem,
    getHotFolderNameById,
  } = useHotFolder();
  const { open, anchorEl, handleClose, handleClick } = useMenuModal();
  const { isOpen, open: openModal, close: closeModal } = useModal();
  const {
    isOpen: isOpenCopyAnotherProductsModal,
    open: openCopyAnotherProductsModal,
    close: handleCloseCopyAnotherProductsModal,
  } = useModal();
  const { parametersStateValue } = useParameters();


  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerContainer}>
        {productHotFolderRules?.length > 0 && (
          <GomakePrimaryButton
            style={clasess.copyToAnotherProductsButton}
            onClick={openCopyAnotherProductsModal}
          >
            {t("pricingWidget.copyToAnotherProducts")}
          </GomakePrimaryButton>
        )}
        <div
          style={clasess.autoCompleteSelectedSectionName}
          onClick={onClickOpenAddNewRuleModal}
        >
          {t("properties.addNewRule")}
          <ArrowDropDownIcon />
        </div>
      </div>
      <div style={{ width: "100%" }}>
        {productHotFolderRules?.length > 0 ? (
          <div style={{ width: "100%" }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="hotFolderRules">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {productHotFolderRules.map((rule, idx) => (
                      <Draggable
                        key={rule.id}
                        draggableId={rule.id}
                        index={idx}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              marginBottom: "12px",
                              padding: "12px",
                              background: "#fafafd",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 500 }}>
                                  {`${rule.expression}`}
                                </div>
                                <div style={{ fontWeight: 500 }}>
                                  {t("products.profits.exceptions.folderName")}:{" "}
                                  {getHotFolderNameById(rule.hotFolderPath)}
                                </div>
                              </div>
                              <IconButton
                                onClick={(e) => {
                                  handleClick(e);
                                  setSelectedItem(rule);
                                }}
                              >
                                <MoreCircleIcon />
                              </IconButton>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <div style={clasess.noDataContainer}>
            <Typography variant="h6" color="text.secondary">
              {" "}
              {t("pricingWidget.noData")}{" "}
            </Typography>
          </div>
        )}
      </div>
      <AddRuleModal
        openModal={openAddNewRuleModal}
        onCloseModal={onClickCloseAddNewRuleModal}
        isHotFolderWidget={true}
        getProductHotFolderRules={getProductHotFolderRules}
        parametersStateValue={parametersStateValue}
      />

      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            openModal();
            handleClose();
          }}
        >
          <div>{t("navigationButtons.delete")}</div>
        </MenuItem>
      </GoMakeMenu>

      <GoMakeDeleteModal
        openModal={isOpen}
        onClose={closeModal}
        modalType={ModalType.DELETE}
        onClickDelete={() => {
          deleteProductHotFolderRule(selectedItem);
          closeModal();
          setSelectedItem(null);
        }}
      />
      <CopyAnotherProductsModal
        openModal={isOpenCopyAnotherProductsModal}
        onClose={handleCloseCopyAnotherProductsModal}
        isHotFolderWidget={true}
      />
    </div>
  );
};

export { HotFolderWidget };
