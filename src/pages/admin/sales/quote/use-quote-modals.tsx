import { useState } from "react";

const useQuoteModals = () => {
  const [selectedContact, setSelectedContact] = useState();
  const [openDeleteModalContact, setOpenDeleteModalContact] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [openDeleteModalAddress, setOpenDeleteModalAddress] = useState(false);
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [isAddNewContactWidget, setIsAddNewContactWidget] = useState(false);
  const [selectedAddressById, setSelectedAddressById] = useState<any>();
  const [isAddNewAddressWidget, setIsAddNewAddressWidget] = useState(false);
  const [openAddNewModalContact, setOpenAddNewModalContact] = useState(false);
  const [openAddNewModalAddress, setOpenAddNewModalAddress] = useState(false);
  const [openNegotiateRequestModal, setOpenNegotiateRequestModal] =
    useState(false);
  const [openAddNewItemModal, setOpenAddNewItemModal] = useState(false);
  const [
    openDuplicateWithDifferentQTYModal,
    setOpenDuplicateWithDifferentQTYModal,
  ] = useState(false);
  const onCloseDuplicateWithDifferentQTY = () => {
    setOpenDuplicateWithDifferentQTYModal(false);
  };
  const onOpenDuplicateWithDifferentQTY = () => {
    setOpenDuplicateWithDifferentQTYModal(true);
  };
  const onCloseNewItem = () => {
    setOpenAddNewItemModal(false);
  };
  const onOpenNewItem = () => {
    setOpenAddNewItemModal(true);
  };
  const onCloseNegotiateRequest = () => {
    setOpenNegotiateRequestModal(false);
  };
  const onOpenNegotiateRequest = () => {
    setOpenNegotiateRequestModal(true);
  };
  const onCloseIsAddNewContactWidget = () => {
    setSelectedContactById({});
    setIsAddNewContactWidget(false);
  };

  const onCloseAddNewContactClient = () => {
    setOpenAddNewModalContact(false);
  };
  const onCloseAddNewAddressClient = () => {
    setOpenAddNewModalAddress(false);
  };
  const onOpenAddNewContactClient = () => {
    setOpenAddNewModalContact(true);
  };
  const onOpenAddNewAddressClient = () => {
    setOpenAddNewModalAddress(true);
  };

  const onCloseIsAddNewAddressWidget = () => {
    setSelectedAddressById({});
    setIsAddNewAddressWidget(false);
  };
  const onOpenDeleteModalContact = (item) => {
    setSelectedContact(item);
    setOpenDeleteModalContact(true);
  };

  const onCloseDeleteModalAddress = () => {
    setOpenDeleteModalAddress(false);
  };
  const onOpenDeleteModalAddress = (item) => {
    setSelectedAddress(item);
    setOpenDeleteModalAddress(true);
  };
  const onCloseDeleteModalContact = () => {
    setOpenDeleteModalContact(false);
  };

  return {
    selectedContact,
    openDeleteModalContact,
    selectedAddress,
    openDeleteModalAddress,
    selectedContactById,
    isAddNewContactWidget,
    selectedAddressById,
    isAddNewAddressWidget,
    openAddNewModalContact,
    openAddNewModalAddress,
    openNegotiateRequestModal,
    openAddNewItemModal,
    openDuplicateWithDifferentQTYModal,
    onCloseDuplicateWithDifferentQTY,
    onOpenDuplicateWithDifferentQTY,
    onCloseNewItem,
    onOpenNewItem,
    onCloseNegotiateRequest,
    onOpenNegotiateRequest,
    onCloseIsAddNewContactWidget,
    onCloseAddNewContactClient,
    onCloseAddNewAddressClient,
    onOpenAddNewContactClient,
    onOpenAddNewAddressClient,
    onCloseIsAddNewAddressWidget,
    onOpenDeleteModalContact,
    onCloseDeleteModalAddress,
    onOpenDeleteModalAddress,
    onCloseDeleteModalContact,
    setSelectedContactById,
    setSelectedAddress,
    setOpenDeleteModalAddress,
    setIsAddNewAddressWidget,
    setIsAddNewContactWidget,
    setSelectedAddressById,
  };
};

export { useQuoteModals };
