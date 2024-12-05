import { useState, MouseEvent } from "react";
import { MenuItem, Menu, Typography } from "@mui/material";
import { ChangeIcon } from "./icons";
import { useStyle } from "./style";
import { useDeliveryStatusModal } from "./use-delivery-status";
import { GoMakeModal } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { Button } from "@mui/material";

interface ITaskCategoryLabelProps {
  id: string;
  label?: string;
  delStatusColor?: string;
  bgColor?: string;
  documentItem?: any;
}

const ClickableStatusButton = ({
  label = "Delivered",
  delStatusColor = "#099250",
  bgColor = "#099250",
  id,
  documentItem,
}: ITaskCategoryLabelProps) => {
  const {
    t,
    tableHeaders,
    openDeliveryModal,
    onOpenDeliveryModal,
    onCloseDeliveryModal,
  } = useDeliveryStatusModal();
  const dir = t("direction");
  const isRtl = dir === "rtl";
  const { classes } = useStyle({ color: delStatusColor });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeStatusClick = (event: MouseEvent<HTMLElement>) => {
    onOpenDeliveryModal();
    handleMenuClose();
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalRows = 50;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Limit visible pages
  const getVisiblePages = (current: number, total: number) => {
    const visiblePages: (number | string)[] = [];
    const range = 3;

    // Add the first three pages
    for (let i = 1; i <= range; i++) {
      if (i <= total) visiblePages.push(i);
    }

    // Add ellipsis after the first range
    if (current > range + 1) visiblePages.push("...");

    // Add the middle range around the current page
    const start = Math.max(range + 1, current - 1);
    const end = Math.min(total - range, current + 1);

    for (let i = start; i <= end; i++) {
      if (!visiblePages.includes(i)) visiblePages.push(i);
    }

    // Add ellipsis before the last range
    if (current < total - range) visiblePages.push("...");

    // Add the last three pages
    for (let i = total - range + 1; i <= total; i++) {
      if (i > range && !visiblePages.includes(i)) visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages(page, totalPages);
  return (
    <>
      <span onClick={handleMenuClick} style={classes.spanStyle}>
        {label}
      </span>
      <Menu
        key={`Status-menu-${id}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isRtl ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRtl ? "right" : "left",
        }}
        PaperProps={{
          sx: {
            marginTop: "4px",
            border: "1px solid #EAECF0",
            borderRadius: "8px",
            background: "var(--Colors-Background-bg-primary, #FFF)",
            boxShadow:
              "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
          },
        }}
      >
        <MenuItem
          style={classes.menuRowStyle}
          onClick={handleChangeStatusClick}
        >
          <ChangeIcon />
          <Typography style={classes.menuText}>{t("Change status")}</Typography>
        </MenuItem>
      </Menu>
      <GoMakeModal
        modalTitle={`Order #${documentItem?.number}`}
        insideStyle={{ width: "70%", height: "fit-content" }}
        openModal={openDeliveryModal}
        onClose={onCloseDeliveryModal}
        modalTitleStyle={classes.modalTitle}
        withRoundedCloseIcon={false}
      >
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          maxHeight={"calc(100vh - 300px)"}
          rows={[]}
          headers={tableHeaders}
        />
        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            variant="outlined"
            size="small"
          >
            {t("Prev")}
          </Button>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {visiblePages.map((pageNumber, index) =>
              pageNumber === "..." ? (
                <span key={index} style={{ padding: "0 8px" }}>
                  ...
                </span>
              ) : (
                <Button
                  key={index}
                  onClick={() => handlePageClick(pageNumber as number)}
                  variant={page === pageNumber ? "contained" : "outlined"}
                  size="small"
                >
                  {pageNumber}
                </Button>
              )
            )}
          </div>
          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            variant="outlined"
            size="small"
          >
            {t("Next")}
          </Button>
        </div>
      </GoMakeModal>
    </>
  );
};

export { ClickableStatusButton };
