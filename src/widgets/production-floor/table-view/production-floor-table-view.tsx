import { StatusTableComponent } from "@/widgets/production-floor/table-view/status-table/status-table-component";
import { useProductionFloorTable } from "@/widgets/production-floor/table-view/use-production-floor-table";
import Stack from "@mui/material/Stack";
import { useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedChipIdsState } from "../state/text-search";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { useTranslation } from "react-i18next";
import { useProductionFloorFilters } from "../filters/use-production-floor-filters";
import { useStorageList } from "@/hooks/use-storage-list";
import {
  allBoardMissionsState,
  pagesCountState,
  pageSizeState,
  pageNumberState,
} from "../state/filter-group";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { EProductionFloorView } from "../state/production-floor-view";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useRouter } from "next/router";
import { useEmployeeList } from "@/hooks/use-employee-list";
import { useVisibleOrderedColumns } from "@/hooks/use-visible-ordered-columns";

const ProductionFloorTableView = ({ connectionId }) => {
  const selectedChipId = useRecoilValue(selectedChipIdsState);
  const {
    data,
    search,
    setFilteredMissionsBySearch,
    getAllBoardMissionsFromSearch,
    getCustomerForEdit,
    openCustomerModal,
    setOpenCustomerModal,
    customer,
    setCustomer,
  } = useProductionFloorTable();
  const { t } = useTranslation();

  const { setFilters, view, getAllData } = useProductionFloorFilters({
    connectionId: connectionId,
    isFetching: false,
  });
  const allBoardMissions = useRecoilValue<any[]>(allBoardMissionsState);
  const [pageNumber, setPageNumber] = useRecoilState<number>(pageNumberState);
  const pagesCount = useRecoilValue<number>(pagesCountState);
  const [pageSize, setPageSize] = useRecoilState<number>(pageSizeState);

  const {
    storageList,
    inputValue,
    defaultValue,
    addPrintHouseJobsStorage,
    handleStorageChange,
    setInputValue,
  } = useStorageList();
  const { employeesCategories } = useEmployeeList();
  const handlePageChange = (event, value) => {
    setPageNumber(value);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, pageNumber: value },
    });
    getAllData(value, pageSize);
  };
  const handlePageSizeChange = (event) => {
    setPageNumber(1);
    setPageSize(event.target.value);
    getAllData(1, event.target.value);
  };

  const filteredDataByMachine = useMemo(() => {
    if (!selectedChipId.length) return data;
    return data.map((item) => {
      const filteredBoardMissions = item.boardMissions.filter((mission) =>
        selectedChipId.some(
          (chipId) =>
            mission?.currentStation?.machineId === chipId ||
            mission?.currentStation?.employeeId === chipId
        )
      );
      return {
        ...item,
        boardMissions: filteredBoardMissions,
      };
    });
  }, [data, selectedChipId]);

  const matchSearch = (mission) => {
    return search
      ? `${mission.boardMissionNumber}\\${mission.orderNumber}`.includes(
          search
        ) ||
          `${mission.clientName?.toLowerCase()}`.includes(
            search.toLowerCase()
          ) ||
          `${mission.productName?.toLowerCase()}`.includes(
            search.toLowerCase()
          ) ||
          mission.automatedTags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          ) ||
          `${mission?.jobName?.toLowerCase()}`.includes(search.toLowerCase())
      : true;
  };
  const allFilteredMissions = filteredDataByMachine.flatMap(
    (statusBoards) => statusBoards.boardMissions
  );
  const filteredMissions = allFilteredMissions.filter(matchSearch);

  useEffect(() => {
    setFilteredMissionsBySearch(filteredMissions);
    const delayFetch = setTimeout(() => {
      if (!!search) {
        getAllBoardMissionsFromSearch().then();
      }
    }, 1000);
    return () => clearTimeout(delayFetch);
  }, [search]);

  const tableHeader = [
    t("boardMissions.image"),
    t("boardMissions.creationDate"),
    t("boardMissions.dueDate"),
    t("boardMissions.clientName"),
    t("boardMissions.missionNumber"),
    t("mailingSettings.orderNumber"),
    t("boardMissions.outSourceType"),
    t("boardMissions.quantity"),
    // t("boardMissions.costFromOrderItem"),
    // t("boardMissions.priceFromOrderItem"),
    t("boardMissions.jobName"),
    // t("boardMissions.numberOfBoardMissionsInOrder"),
    t("boardMissions.productName"),
    t("boardMissions.currentBoardMissionStatus"),
    t("properties.more"),
  ].filter(Boolean);

  const router = useRouter();

  const visibleColumns = useVisibleOrderedColumns();

  useEffect(() => {
    console.log("visibleColumns are :  ", visibleColumns);
  }, [visibleColumns]);

  return (
    <Stack gap={"20px"}>
      {view === EProductionFloorView.DONE_JOBS ? (
        <>
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={"calc(100vh - 250px)"}
            rows={allBoardMissions}
            headers={tableHeader}
            columnWidths={[
              "7%",
              "5%",
              "6%",
              "7%",
              "6%",
              "7%",
              "11%",
              "8%",
              "6%",
              "8%",
              "5%",
              "5%",
              "7%",
              "8%",
              "4%",
            ]}
          />
          <GoMakePagination
            onChangePageNumber={handlePageChange}
            onChangePageSize={handlePageSizeChange}
            page={pageNumber}
            setPage={setPageNumber}
            pagesCount={pagesCount}
            pageSize={pageSize}
            router={router}
            isFromDocumentsOrJobs={true}
          />
        </>
      ) : (
        <>
          {filteredDataByMachine.map((statusBoards, index) => {
            const allBoardMissions = filteredDataByMachine.flatMap(
              (board) => board.boardMissions
            );
            return (
              <StatusTableComponent
                key={index}
                status={statusBoards?.boardMissionStatus?.boardMissionStatus}
                boards={statusBoards?.boardMissions}
                onClickClient={getCustomerForEdit}
                allBoardMissions={allBoardMissions}
                setFilters={setFilters}
                storageList={storageList}
                inputValue={inputValue}
                defaultValue={defaultValue}
                addPrintHouseJobsStorage={addPrintHouseJobsStorage}
                handleStorageChange={handleStorageChange}
                setInputValue={setInputValue}
                employeesCategories={employeesCategories}
                visibleColumns={visibleColumns}
              />
            );
          })}
        </>
      )}

      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Edit}
        typeClient={CLIENT_TYPE.CUSTOMER}
        openModal={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
        customer={customer}
        setCustomer={setCustomer}
      />
    </Stack>
  );
};

export { ProductionFloorTableView };
