import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useQuote } from "./use-quote";

import { useStyle } from "./style";
import { AddPlusIcon, UploadIcon } from "@/icons";

import { quoteState } from "./store/quote";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import { quoteItemState } from "@/store";
import { BusinessWidget } from "@/widgets/quote/business-widget";
import { ContactWidget } from "@/widgets/quote/contact-widget";
import { AddressWidget } from "@/widgets/quote/address-widget";
import { CustomTableWidget } from "@/widgets/quote/custom-table-widget";
import { TotalPriceAndVatWidit } from "@/widgets/quote/total-price-and-vat";
import { AddNewItemModal } from "@/widgets/quote/modals-widgets/add-new-item-modal";

export default function Quote() {
  const { clasess } = useStyle();
  const setQuoteState = useSetRecoilState<any>(quoteState);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [selectDate, setSelectDate] = useState(quoteItemValue?.dueDate);
  const dateRef = useRef(null);
  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };
  useEffect(() => {
    setSelectDate(quoteItemValue?.dueDate);
  }, [quoteItemValue]);
  const {
    tableHeaders,
    tableRowPercent,
    selectedContact,
    openDeleteModalContact,
    selectedContactById,
    isAddNewContactWidget,
    isAddNewAddressWidget,
    selectedAddressById,
    selectedAddress,
    openDeleteModalAddress,
    selectBusiness,
    openAddNewModalContact,
    openAddNewModalAddress,
    openNegotiateRequestModal,
    addClientContactState,
    addClientAddressState,
    openAddNewItemModal,
    openDuplicateWithDifferentQTYModal,
    onCloseDuplicateWithDifferentQTY,
    onOpenDuplicateWithDifferentQTY,
    onCloseNewItem,
    onOpenNewItem,
    onChangeAddClientAddressState,
    addNewClientAddress,
    onChangeAddClientContactState,
    addNewClientContact,
    onCloseNegotiateRequest,
    onOpenNegotiateRequest,
    onCloseAddNewContactClient,
    onCloseAddNewAddressClient,
    onOpenAddNewContactClient,
    onOpenAddNewAddressClient,
    onChangeSelectBusiness,
    setSelectBusiness,
    onClickAddNewAddress,
    onClickDeleteAddress,
    setSelectedAddress,
    setOpenDeleteModalAddress,
    setIsAddNewAddressWidget,
    setIsAddNewContactWidget,
    setSelectedAddressById,
    onCloseDeleteModalAddress,
    onOpenDeleteModalAddress,
    onCloseIsAddNewAddressWidget,
    onCloseIsAddNewContactWidget,
    setSelectedContactById,
    onCloseDeleteModalContact,
    onOpenDeleteModalContact,
    onClickDeleteContact,
    onChangeUpdateClientContact,
    onClickAddNewContact,
    onChangeUpdateClientAddress,
    getCalculateQuoteItem,
    getCalculateQuote,
    t,
  } = useQuote();
  useEffect(() => {
    setQuoteState({
      tableHeaders,
      tableRowPercent,
      selectedContact,
      openDeleteModalContact,
      selectedContactById,
      isAddNewContactWidget,
      isAddNewAddressWidget,
      selectedAddressById,
      selectedAddress,
      openDeleteModalAddress,
      selectBusiness,
      openAddNewModalContact,
      openAddNewModalAddress,
      openNegotiateRequestModal,
      addClientContactState,
      addClientAddressState,
      openAddNewItemModal,
      openDuplicateWithDifferentQTYModal,
      onCloseDuplicateWithDifferentQTY,
      onOpenDuplicateWithDifferentQTY,
      onCloseNewItem,
      onOpenNewItem,
      onChangeAddClientAddressState,
      addNewClientAddress,
      onChangeAddClientContactState,
      addNewClientContact,
      onCloseNegotiateRequest,
      onOpenNegotiateRequest,
      onCloseAddNewContactClient,
      onCloseAddNewAddressClient,
      onOpenAddNewContactClient,
      onOpenAddNewAddressClient,
      onChangeSelectBusiness,
      setSelectBusiness,
      onClickAddNewAddress,
      onClickDeleteAddress,
      setSelectedAddress,
      setOpenDeleteModalAddress,
      setIsAddNewAddressWidget,
      setIsAddNewContactWidget,
      setSelectedAddressById,
      onCloseDeleteModalAddress,
      onOpenDeleteModalAddress,
      onCloseIsAddNewAddressWidget,
      onCloseIsAddNewContactWidget,
      setSelectedContactById,
      onCloseDeleteModalContact,
      onOpenDeleteModalContact,
      onClickDeleteContact,
      onChangeUpdateClientContact,
      onClickAddNewContact,
      onChangeUpdateClientAddress,
      getCalculateQuoteItem,
      getCalculateQuote,
      t,
    });
  }, [
    tableHeaders,
    tableRowPercent,
    selectedContact,
    openDeleteModalContact,
    selectedContactById,
    isAddNewContactWidget,
    isAddNewAddressWidget,
    selectedAddressById,
    selectedAddress,
    openDeleteModalAddress,
    selectBusiness,
    openAddNewModalContact,
    openAddNewModalAddress,
    openNegotiateRequestModal,
    addClientContactState,
    addClientAddressState,
    openAddNewItemModal,
    openDuplicateWithDifferentQTYModal,
    onCloseDuplicateWithDifferentQTY,
    onOpenDuplicateWithDifferentQTY,
    onCloseNewItem,
    onOpenNewItem,
    onChangeAddClientAddressState,
    addNewClientAddress,
    onChangeAddClientContactState,
    addNewClientContact,
    onCloseNegotiateRequest,
    onOpenNegotiateRequest,
    onCloseAddNewContactClient,
    onCloseAddNewAddressClient,
    onOpenAddNewContactClient,
    onOpenAddNewAddressClient,
    onChangeSelectBusiness,
    setSelectBusiness,
    onClickAddNewAddress,
    onClickDeleteAddress,
    setSelectedAddress,
    setOpenDeleteModalAddress,
    setIsAddNewAddressWidget,
    setIsAddNewContactWidget,
    setSelectedAddressById,
    onCloseDeleteModalAddress,
    onOpenDeleteModalAddress,
    onCloseIsAddNewAddressWidget,
    onCloseIsAddNewContactWidget,
    setSelectedContactById,
    onCloseDeleteModalContact,
    onOpenDeleteModalContact,
    onClickDeleteContact,
    onChangeUpdateClientContact,
    onClickAddNewContact,
    onChangeUpdateClientAddress,
    getCalculateQuoteItem,
    getCalculateQuote,
    t,
  ]);
  console.log("quoteItemValue", quoteItemValue);
  return (
    <CustomerAuthLayout>
      {quoteItemValue && (
        <div style={clasess.mainContainer}>
          <div style={clasess.headerContainer}>
            <div style={clasess.titleQuateContainer}>
              <HeaderTitle
                title={t("sales.quote.title")}
                marginBottom={1}
                marginTop={1}
              />
              <div style={clasess.quoteNumberStyle}>
                {quoteItemValue?.number}
              </div>
            </div>
            <div style={clasess.rightSideHeaderContainer}>
              {quoteItemValue && (
                <div
                  style={clasess.deleverdDate}
                  onClick={handleClickSelectDate}
                >
                  {t("sales.quote.deliverOn")}{" "}
                  {selectDate
                    ? DateFormatterDDMMYYYY(selectDate)
                    : "select date"}
                  <div style={clasess.datePickerContainer}>
                    <input
                      type="datetime-local"
                      onChange={(e) => setSelectDate(e.target.value)}
                      ref={dateRef}
                    />
                  </div>
                </div>
              )}

              <div style={clasess.uploadContainer}>
                <UploadIcon />
                <div style={clasess.uploadTextStyle}>
                  {t("sales.quote.upload")}
                </div>
              </div>
            </div>
          </div>
          <BusinessWidget />
          <div style={clasess.scrollContainer}>
            <ContactWidget />
            <AddressWidget />
            <div style={clasess.tableContainer}>
              <CustomTableWidget
                headerTitle={"Order review"}
                tableHeaders={tableHeaders}
                headerWidth={tableRowPercent}
                tableRowPercent={tableRowPercent}
                data={quoteItemValue?.priceListItemsMapping}
              />
            </div>
          </div>
          <div style={clasess.btnsContainer}>
            <div style={clasess.btnContainer}>
              <AddPlusIcon />
              <div style={clasess.btnTitle} onClick={() => onOpenNewItem()}>
                add new item
              </div>
            </div>
            <div style={clasess.btnContainer}>
              <AddPlusIcon />
              <div style={clasess.btnTitle}>add exist item</div>
            </div>
            <div style={clasess.btnContainer}>
              <AddPlusIcon />
              <div style={clasess.btnTitle}>add delivery</div>
            </div>
          </div>
          <TotalPriceAndVatWidit />
        </div>
      )}
      <AddNewItemModal />
    </CustomerAuthLayout>
  );
}
