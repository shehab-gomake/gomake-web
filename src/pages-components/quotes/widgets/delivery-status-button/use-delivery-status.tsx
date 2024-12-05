import { useTranslation } from "react-i18next";
import { useState } from "react";

const useDeliveryStatusButton = () => {
  const { t } = useTranslation();
  const [openDeliveryModal, setOpenDeliveryModal] = useState<boolean>(false);
  const onOpenDeliveryModal = () => {
    setOpenDeliveryModal(true);
  };

  const onCloseDeliveryModal = () => {
    setOpenDeliveryModal(false);
  };

  // const [page, setPage] = useState(1);
  // const rowsPerPage = 5;
  // const totalRows = 50;
  // const totalPages = Math.ceil(totalRows / rowsPerPage);

  // const handlePrevPage = () => {
  //   if (page > 1) setPage((prev) => prev - 1);
  // };

  // const handleNextPage = () => {
  //   if (page < totalPages) setPage((prev) => prev + 1);
  // };

  // const handlePageClick = (pageNumber: number) => {
  //   setPage(pageNumber);
  // };

  // // Limit visible pages
  // const getVisiblePages = (current: number, total: number) => {
  //   const visiblePages: (number | string)[] = [];
  //   const range = 3;

  //   // Add the first three pages
  //   for (let i = 1; i <= range; i++) {
  //     if (i <= total) visiblePages.push(i);
  //   }

  //   // Add ellipsis after the first range
  //   if (current > range + 1) visiblePages.push("...");

  //   // Add the middle range around the current page
  //   const start = Math.max(range + 1, current - 1);
  //   const end = Math.min(total - range, current + 1);

  //   for (let i = start; i <= end; i++) {
  //     if (!visiblePages.includes(i)) visiblePages.push(i);
  //   }

  //   // Add ellipsis before the last range
  //   if (current < total - range) visiblePages.push("...");

  //   // Add the last three pages
  //   for (let i = total - range + 1; i <= total; i++) {
  //     if (i > range && !visiblePages.includes(i)) visiblePages.push(i);
  //   }

  //   return visiblePages;
  // };

  // const visiblePages = getVisiblePages(page, totalPages);

  return {
    t,
    openDeliveryModal,
    onOpenDeliveryModal,
    onCloseDeliveryModal,
  };
};

export { useDeliveryStatusButton };
