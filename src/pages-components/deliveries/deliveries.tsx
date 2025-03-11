import QRScannerFab from "@/widgets/qr-scanner/qr-scanner-fab";
import { HeaderTitle } from "@/widgets";
import { useDeliveries } from "./use-deliveries";
import { IconButton, Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeMenu } from "@/components";
import { InputAdornment } from "@mui/material";
import { DotIcon } from "@/icons";
import TuneIcon from "@mui/icons-material/Tune";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect } from "react";

const DeliveriesPageWidget = () => {
  const { classes } = useStyle();
  const {
    t,
    isMobile,
    tableHeaders,
    handlePageSizeChange,
    pageSize,
    page,
    pagesCount,
    setPage,
    router,
    handleClick,
    handleClose,
    open,
    anchorEl,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
    agent,
    setAgent,
    patternSearch,
    setPatternSearch,
    onChangeDocumentSearch,
    onClickClearFilter,
    searchInputRef,
    onClickSearchFilter,
    agentsCategories,
    handleAgentChange,
    deliveryTypeValue,
    setDeliveryTypeValue,
    getAllShipmentTypes,
    shipmentTypes,
  } = useDeliveries();

  useEffect(() => {
    getAllShipmentTypes();
  }, []);

  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        display="flex"
        spacing={2}
        height="100%"
      >
        <div style={classes.mainContainer}>
          {/* header section */}
          <div
            style={{
              ...classes.headerStyle,
              ...(isMobile && { marginTop: "10px" }),
            }}
          >
            <HeaderTitle
              title={t("tabs.deliveries")}
              marginTop={1}
              marginBottom={1}
            />
          </div>
          {/* search */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SearchInputComponent
              searchInputStyle={{ width: isMobile ? "70vw" : "20vw" }}
              filtersButton={
                <InputAdornment position="start">
                  <div>
                    <IconButton onClick={handleClick}>
                      <TuneIcon />
                      {Object.keys(router.query).filter(
                        (key) => key !== "pageNumber"
                      ).length > 0 && (
                        <div
                          style={{ position: "absolute", top: -5, right: -1 }}
                        >
                          <DotIcon />
                        </div>
                      )}
                    </IconButton>
                    <GoMakeMenu
                      handleClose={handleClose}
                      open={open}
                      anchorEl={anchorEl}
                    >
                      <div
                        style={{
                          ...classes.filtersContainer,
                          ...(isMobile && { width: "auto" }),
                        }}
                      >
                        <div style={classes.selectedFilterContainer}>
                          <div style={classes.statusFilterContainer}>
                            <div style={classes.filterLabelStyle}>
                              {t("productionFloor.customer")}
                            </div>
                            <GoMakeAutoComplate
                              key={customer?.id}
                              options={renderOptions() ? renderOptions() : []}
                              getOptionLabel={(option: any) => `${option.name}`}
                              defaultFiltering={false}
                              onChangeTextField={checkWhatRenderArray}
                              style={classes.textInputStyle}
                              placeholder={t("sales.quote.chooseCustomer")}
                              onChange={handleCustomerChange}
                              value={customer}
                              loading={isFetching}
                            />
                          </div>
                          <div style={classes.statusFilterContainer}>
                            <div style={classes.filterLabelStyle}>
                              {t("sales.quote.agent")}
                            </div>
                            <GoMakeAutoComplate
                              key={agent?.id}
                              options={agentsCategories}
                              style={classes.textInputStyle}
                              getOptionLabel={(option: any) => option.label}
                              placeholder={t("sales.quote.ChooseAgent")}
                              onChange={handleAgentChange}
                              value={agent}
                            />
                          </div>

                          <div style={classes.statusFilterContainer}>
                            <div style={classes.filterLabelStyle}>
                              {t("customers.modal.shipmentType")}
                            </div>

                            <GoMakeAutoComplate
                              options={shipmentTypes}
                              value={deliveryTypeValue}
                              placeholder={t(
                                "customers.modal.selectShipmentType"
                              )}
                              style={classes.textInputStyle}
                              onChange={(e: any, value: any) => {
                                setDeliveryTypeValue(value);
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            width: "100%",
                            gap: "10px",
                          }}
                        >
                          <div style={classes.buttonsFilterContainer}>
                            <div style={classes.filterLabelStyle} />
                            <GomakePrimaryButton
                              style={classes.clearBtnStyle}
                              onClick={onClickClearFilter}
                            >
                              {t("sales.quote.clear")}
                            </GomakePrimaryButton>
                          </div>
                          <div style={classes.buttonsFilterContainer}>
                            <div style={classes.filterLabelStyle} />
                            <GomakePrimaryButton
                              style={classes.searchBtnStyle}
                              onClick={onClickSearchFilter}
                            >
                              {t("sales.quote.search")}
                            </GomakePrimaryButton>
                          </div>
                        </div>
                      </div>
                    </GoMakeMenu>
                  </div>
                </InputAdornment>
              }
              onChange={onChangeDocumentSearch}
              value={patternSearch}
              inputRef={searchInputRef}
            />
          </div>
          {/* document table */}
          <PrimaryTable
            stickyHeader={true}
            maxHeight={"calc(100vh - 400px)"}
            rows={[]}
            headers={tableHeaders}
          />
        </div>
        <GoMakePagination
          onChangePageNumber={(event, value) => {
            setPage(value);
            router.push({
              pathname: router.pathname,
              query: { ...router.query, pageNumber: value },
            });
          }}
          onChangePageSize={handlePageSizeChange}
          page={page}
          setPage={setPage}
          pagesCount={pagesCount}
          pageSize={pageSize}
          router={router}
          isFromDocumentsOrJobs={true}
        />
      </Stack>
      <QRScannerFab />
    </>
  );
};

export { DeliveriesPageWidget };
