import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakePrimaryButton,
} from "@/components";
import { useQuoteWidget } from "./use-quote-widget";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useStyle } from "./style";
import { Popover } from "@mui/material";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useEffect, useState } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useSetRecoilState } from "recoil";
import {
  QuoteIfExistState,
  QuoteNumberState,
} from "@/pages-components/quote-new/store/quote";
import Stack from "@mui/material/Stack";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal/customer-card";
import { isValidCustomer } from "@/utils/helpers";
import { CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { useClientTypesList } from "@/hooks/use-client-types";
import { GoMakeTreeSelect } from "@/components/auto-complete/test";
import { TreeSelect } from "primereact/treeselect";
 

import 'primereact/resources/themes/saga-blue/theme.css'; // Replace with your preferred theme
import 'primereact/resources/primereact.min.css'; // Core PrimeReact styles
import 'primeicons/primeicons.css'; 

const QuoteWidget = ({ isAdmin = true }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const setQuoteNumber = useSetRecoilState<any>(QuoteNumberState);
  const setQuoteIfExist = useSetRecoilState<any>(QuoteIfExistState);
  const { getClientTypesCategories } = useClientTypesList();

  const {
    clientTypesValue,
    id,
    anchorEl,
    isDisabled,
    handleClick,
    onClickCreateQuote,
    onClickCreateQuoteForCustomer,
    open,
    openModal,
    onClickSaveQuote,
    userQuote,
    selectedClientType,
    selectedClient,
    onClickCloseModal,
    _renderErrorMessage,
    handleClose,
    setSelectedClientType,
    setSelectedClient,
    setSelectedProduct,
    checkWhatRenderArray,
    handleClickToSelectedCustomer,
    renderOptions,
    openCustomerModal,
    customer,
    setCustomer,
    onCustomerAdd,
    onClickAddCustomer,
    onCloseCustomerModal,
    handleCancel,
    setOpenModal,
    QuoteId,
    setQuoteId,
    getAndSetExistQuote,
    getAllClientTypes,
    filteredOptions,
    setSearchQuery,
    combinedData
    } = useQuoteWidget(DOCUMENT_TYPE.quote);

  useEffect(() => {
    if (userQuote) {
      setQuoteId(userQuote.id);
      setQuoteNumber(userQuote.number);
      setQuoteIfExist(true);
      setSelectedClient(userQuote.client);
      const clientType = clientTypesValue.find(
        (c) => c.id == userQuote.client.clientTypeId
      );
      setSelectedClientType(clientType);
    } else {
      setQuoteId(null);
      setQuoteNumber(null);
      setQuoteIfExist(false);
    }
  }, [userQuote]);

  // this for select customer in home page
  useEffect(() => {
    const fetchData = async () => {
      await getAllClientTypes();
      getAndSetExistQuote();
    };
    fetchData();
  }, []);

  useEffect(() => {
    getClientTypesCategories();
  }, []);
  

  const mockOptions = [
    {
      key: '0',
      label: 'Group 1',
      children: [
        { key: '0-0', label: 'Option 1-1' },
        { key: '0-1', label: 'Option 1-2' }
      ]
    },
    {
      key: '1',
      label: 'Group 2',
      children: [
        { key: '1-0', label: 'Option 2-1' },
        { key: '1-1', label: 'Option 2-2' },
        { key: '1-2', label: 'Option 2-3' }
      ]
    }
  ];

  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (value) => {
    console.log("value " , value)
    setSelectedValue(value);
  };

  const handleChangeNew = (e) => {
    const selectedValue = e.value;
  
    // Find the selected node from combinedData
    const findNodeByKey = (key, nodes) => {
      for (const node of nodes) {
        if (node.key === key) {
          return node;
        }
        if (node.children) {
          const found = findNodeByKey(key, node.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };
  
    const selectedNode = findNodeByKey(selectedValue, combinedData);
  
    if (selectedNode && !selectedNode.children) {
      // Node is a leaf
      console.log("Leaf Node Selected: ", selectedNode);
      setSelectedValue(selectedValue); // Update state with the selected value
    } else {
      // Node is not a leaf
      console.log("Cannot select non-leaf node");
      // Reset the value or show an error message
      setSelectedValue(null); // Optionally reset the selection
    }
  };
  

  return (
    <div data-tour="quote-widget" style={classes.mainContainer}>
      <div style={classes.customerSectionStyle}>
        <div style={classes.autoComplateRowContainer}>
          <div data-tour="select-customer" style={{ width: "65%" }}>
            <GoMakeAutoComplate
              disableClearable={true}
              options={renderOptions() ? renderOptions() : []}
              placeholder={t("home.admin.selectCustomer")}
              style={classes.selectCustomerContainer}
              getOptionLabel={(option: any) =>
                option && option.name ? `${option.name}-${option.code}` : ""
              }
              onChangeTextField={checkWhatRenderArray}
              value={selectedClient}
              onChange={(e: any, value: any) => {
                handleClickToSelectedCustomer(
                  userQuote?.client?.id,
                  value
                ).then();
              }}
            />
          </div>
          <div data-tour="select-type" style={{ width: "30%" }}>
            <GoMakeAutoComplate
              options={clientTypesValue}
              placeholder={t("home.admin.selectType")}
              style={classes.selectTypeContainer}
              getOptionLabel={(option: any) => (option?.name ? option.name : "")}
              onChange={(e: any, value: any) => {
                setSelectedClientType(value);
              }}
              value={selectedClientType}
            />
          </div>
        </div>
        <PermissionCheck userPermission={Permissions.ADD_CLIENT}>
          <button style={classes.autoButtonStyle} onClick={onClickAddCustomer} >{t("customers.buttons.AddOrSearch")}</button>
        </PermissionCheck>
      </div>
      <div style={classes.autoComplateRowContainer}>
        <div data-tour="select-product" style={{ width: "65%" }}>
          {/* <GoMakeAutoComplate
            options={filteredOptions}
            placeholder={t("home.admin.selectProductOrMaterial")}
            style={classes.selectTypeContainer}
            getOptionLabel={(option: any) => option.name}
            onChange={(e: any, value: any) => {
              setSelectedProduct(value);
            }}
            //new change
            groupBy={(option) => option.category}
            onChangeTextField={(e) => setSearchQuery(e.target.value)}
          /> */}

          <GoMakeTreeSelect options={combinedData} value={selectedValue}
            onChange={handleChange}
            placeholder="Select an option"
            
            />
            
        </div>
      </div>
      {userQuote ? (
        <Stack direction={"row"} gap={"13px"} width={"100%"}>
          <div style={classes.btnContainer}>
            <PermissionCheck userPermission={Permissions.CREATE_QUOTES}>
              <GomakePrimaryButton
                onClick={
                  isDisabled
                    ? handleClick
                    : isAdmin
                      ? onClickCreateQuote
                      : onClickCreateQuoteForCustomer
                }
                variant="contained"
                style={{ width: "100%", height: 40 }}
              >
                {t("home.admin.AddItemToQuote")}
              </GomakePrimaryButton>
            </PermissionCheck>
          </div>
          <div style={{ width: "50%" }}>
            <SecondaryButton
              variant="contained"
              style={{ width: "100%", height: 40 }}
              onClick={() => {
                onClickSaveQuote(QuoteId)
                  .then(() => setSelectedClient(null))
                  .then(() => setSelectedClientType(null));
              }}
            >
              {t("home.admin.SaveQuote")}
            </SecondaryButton>
          </div>
        </Stack>
      ) : (
        <div data-tour="create-quote" style={{ width: "50%" }}>
          <GomakePrimaryButton
            onClick={
              isDisabled
                ? handleClick
                : isAdmin
                  ? onClickCreateQuote
                  : onClickCreateQuoteForCustomer
            }
            variant="contained"
            style={{ width: "100%", height: 40 }}
          >
            {t("home.admin.createQoute")}
          </GomakePrimaryButton>
        </div>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={classes.errorMsgStyle}>{_renderErrorMessage()}</div>
      </Popover>
      <GoMakeDeleteModal
        subTitle={t("sales.quote.MessageForClient")}
        icon={<WarningAmberIcon style={classes.AmberIconStyle} />}
        title={t("sales.quote.titleMessage")}
        yesBtn={t("sales.quote.Confirm")}
        openModal={openModal}
        onClose={onClickCloseModal}
        onClickDelete={() => onClickSaveQuote(QuoteId)}
        onClickCancel={handleCancel}
      />
      <CustomerCardWidget
        isValidCustomer={isValidCustomer}
        customerAction={CUSTOMER_ACTIONS.Add}
        codeFlag={false}
        typeClient={"C"}
        onCustomerAdd={onCustomerAdd}
        openModal={openCustomerModal}
        modalTitle={t("customers.modal.addTitle")}
        onClose={onCloseCustomerModal}
        showAddButton={true}
        customer={customer}
        setCustomer={setCustomer}
        isFromHomePage={true}
        setOpenOfferModal={setOpenModal}
        userQuote={userQuote}
      />
    </div>
  );
};

export { QuoteWidget };