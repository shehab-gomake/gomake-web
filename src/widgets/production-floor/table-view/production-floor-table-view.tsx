import { StatusTableComponent } from "@/widgets/production-floor/table-view/status-table/status-table-component";
import { useProductionFloorTable } from "@/widgets/production-floor/table-view/use-production-floor-table";
import Stack from "@mui/material/Stack";
import { useEffect, useMemo, useState, useCallback } from "react";
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
  currentSortOrderState,
} from "../state/filter-group";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { EProductionFloorView } from "../state/production-floor-view";
import { DocumentPrimaryTable } from "@/components/tables/document-primary-table";
import { useRouter } from "next/router";
import { useEmployeeList } from "@/hooks/use-employee-list";
import { useVisibleOrderedColumns } from "@/hooks/use-visible-ordered-columns";
import { JobsTableColumns } from "@/pages-components/quotes/enums/document-table-columns-enum";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useListPagination } from "@/hooks/use-list-pagination";
import { selectedBoardsMissionsState } from "../state/boards";
import { FloatingBulkActionsMenu } from "./status-table/floating-bulk-actions-menu";
import {
  checkIfCanMakeGroupedBoardMissionsApi,
  groupJobsApi,
  moveBoardMissionListToDoneApi,
  updateBoardMissionListCurrentStationApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { ThreeOptionsModal } from "@/components/modal-deleted/three-options-modal";
import { ModalType } from "@/enums";
import { useModal } from "@/hooks/use-modal";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { isPrintNodeModalOpenState, jobsToPrintState } from "../views/board-missions-view/stations/state";
import { printJobUsingPrintNodeApi } from "@/services/api-service/board-missions/board-missions-table";

const DEBOUNCE_DELAY = 300; // Debounce search and filter operations

const ProductionFloorTableView = ({ connectionId, updateStatus, getData }) => {
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
  const [lastSearch, setLastSearch] = useState("");
  const { setFilters, view, getAllData } = useProductionFloorFilters({
    connectionId: connectionId,
    isFetching: false,
  });
  const allBoardMissions = useRecoilValue<any[]>(allBoardMissionsState);
  const [pageNumber, setPageNumber] = useRecoilState<number>(pageNumberState);
  const pagesCount = useRecoilValue<number>(pagesCountState);
  const [pageSize, setPageSize] = useRecoilState<number>(pageSizeState);
  const { alertFaultUpdate, alertFault } = useSnackBar();
  const { initialPageSize } = useListPagination();

  const {
    storageList,
    inputValue,
    defaultValue,
    addPrintHouseJobsStorage,
    handleStorageChange,
    setInputValue,
  } = useStorageList();
  const { employeesCategories } = useEmployeeList();
  const [isPrintNodeModalOpen, setIsPrintNodeModalOpen] = useRecoilState(isPrintNodeModalOpenState);
  const jobsToPrint = useRecoilValue(jobsToPrintState);

  useEffect(() => {
    if (initialPageSize && initialPageSize !== pageSize) {
      setPageSize(initialPageSize);
    }
  }, [initialPageSize]);

  // Memoized filtered data with performance optimizations
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


  const printJobUsingPrintNode = async (jobId: string, productType?: string) => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    let data = jobId;
    if (productType) {
      //data = data + "?productType=" + productType;
    }
    await printJobUsingPrintNodeApi(callApi, callBack, data);
  };

  // Optimized search matching function
  const matchSearch = useCallback(
    (mission) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      const missionNumber = `${mission.boardMissionNumber}\\${mission.orderNumber}`;
      const clientName = mission.clientName?.toLowerCase() || "";
      const productName = mission.productName?.toLowerCase() || "";
      const jobName = mission?.jobName?.toLowerCase() || "";

      return (
        missionNumber.includes(search) ||
        clientName.includes(searchLower) ||
        productName.includes(searchLower) ||
        jobName.includes(searchLower) ||
        mission.automatedTags?.some((tag) =>
          tag.toLowerCase().includes(searchLower)
        )
      );
    },
    [search]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLastSearch(search);
      if (search != lastSearch) {
        // Only update if search has actually changed
        const missions = filteredDataByMachine.flatMap(
          (statusBoards) => statusBoards.boardMissions
        );
        const filtered = missions.filter(matchSearch);
        setFilteredMissionsBySearch(filtered);

        if (!!search) {
          getAllBoardMissionsFromSearch().then();
        }
        setLastSearch(search);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [
    search,
    filteredDataByMachine,
    matchSearch,
    setFilteredMissionsBySearch,
    getAllBoardMissionsFromSearch,
  ]);

  // Memoized table headers - using keys for DocumentPrimaryTable
  const tableHeader = useMemo(
    () => [
      "image",
      "creationDate",
      "dueDate",
      "readyDate",
      "clientName",
      "missionNumber",
      "orderNumber",
      "outSourceType",
      "quantity",
      "jobName",
      "productName",
      "currentBoardMissionStatus",
      "more",
    ],
    []
  );

  // Transform array-based rows to object-based rows for DocumentPrimaryTable
  const transformedRows = useMemo(() => {
    return allBoardMissions.map((row) => ({
      image: row[0],
      creationDate: row[1],
      dueDate: row[2],
      readyDate: row[3],
      clientName: row[4],
      missionNumber: row[5],
      orderNumber: row[6],
      outSourceType: row[7],
      quantity: row[8],
      jobName: row[9],
      productName: row[10],
      currentBoardMissionStatus: row[11],
      more: row[12],
    }));
  }, [allBoardMissions]);

  const router = useRouter();
  const { callApi } = useGomakeAxios();

  const visibleColumns = useVisibleOrderedColumns();

  const [columnsReady, setColumnsReady] = useState(false);

  const [selectedIds, setSelectedIds] = useRecoilState(
    selectedBoardsMissionsState
  );

  // Backend sorting state - default to readyDate descending for Done Jobs
  const [isDescOrderBE, setIsDescOrderBE] = useState(true);

  // Default sort order: Ready Date descending (useMemo to prevent re-creation)
  const defaultSortOrder = useMemo(
    () => [
      {
        column: JobsTableColumns.ReadyDate,
        dir: "desc",
      },
    ],
    []
  );

  // Track current active sort order (starts with default, updates when user sorts manually)
  // Using Recoil state so it persists across component renders and can be accessed by filters
  const [currentSortOrder, setCurrentSortOrder] = useRecoilState(
    currentSortOrderState
  );

  // Column mappings for backend sorting (Done Jobs)
  const columnMappings: Record<string, number> = {
    creationDate: JobsTableColumns.CreationDate,
    dueDate: JobsTableColumns.DueDate,
    readyDate: JobsTableColumns.ReadyDate,
  };

  const isHeaderSortable = (docType: string, header: string): boolean => {
    return columnMappings.hasOwnProperty(header);
  };

  const handleSortBE = (key: string) => {
    const direction = isDescOrderBE ? "desc" : "asc";
    const columnIndex = columnMappings[key];

    if (columnIndex !== undefined) {
      const sortOrder = [
        {
          column: columnIndex,
          dir: direction,
        },
      ];

      // Update the current sort order so it persists across searches/filters
      setCurrentSortOrder(sortOrder);
      getAllData(pageNumber, pageSize, undefined, sortOrder);
      setIsDescOrderBE(!isDescOrderBE);
    } else {
      console.error("Invalid key for sorting:", key);
    }
  };

  // Memoized pagination handlers
  const handlePageChange = useCallback(
    (event, value) => {
      setPageNumber(value);
      router.push({
        pathname: router.pathname,
        query: { ...router.query, pageNumber: value },
      });
      // Maintain current sort order when changing pages (user's choice or default)
      getAllData(value, pageSize, undefined, currentSortOrder);
    },
    [setPageNumber, router, getAllData, pageSize, currentSortOrder]
  );

  const handlePageSizeChange = useCallback(
    (event) => {
      setPageNumber(1);
      setPageSize(event.target.value);
      // Maintain current sort order when changing page size (user's choice or default)
      getAllData(1, event.target.value, undefined, currentSortOrder);
    },
    [setPageNumber, setPageSize, getAllData, currentSortOrder]
  );

  // Memoized bulk action handlers
  const handleBulkUpdateStatus = useCallback(
    async (selectedJobs, statusId) => {
      try {
        await updateStatus(selectedJobs, statusId);
        setSelectedIds([]);
      } catch (error) {
        console.error("Error updating status:", error);
        alertFaultUpdate();
      }
    },
    [updateStatus, setSelectedIds, alertFaultUpdate]
  );

  const handleBulkMoveToNextStation = useCallback(
    async (selectedJobs) => {
      try {
        const callBack = (res) => {
          if (res?.success) {
            setSelectedIds([]);
            getData();
          } else {
            alertFaultUpdate();
          }
        };
        const jobsData = selectedJobs.map((job) => ({
          boardMissionId: job.id,
          productType: job.productType,
        }));

        await updateBoardMissionListCurrentStationApi(callApi, callBack, {
          stationId: null,
          data: jobsData,
        });
      } catch (error) {
        console.error("Error moving to done:", error);
        alertFaultUpdate();
      }
    },
    [callApi, setSelectedIds, getData, alertFaultUpdate]
  );

  const handleBulkMoveToDone = useCallback(
    async (selectedJobs, sendMessage) => {
      try {
        const callBack = (res) => {
          if (res?.success) {
            setSelectedIds([]);
            getData();
          } else {
            alertFaultUpdate();
          }
        };
        const jobsData = selectedJobs.map((job) => ({
          boardMissionId: job.id,
          productType: job.productType,
        }));

        await moveBoardMissionListToDoneApi(callApi, callBack, {
          sendMessage: sendMessage,
          storage: inputValue,
          data: jobsData,
        });
      } catch (error) {
        console.error("Error moving to done:", error);
        alertFaultUpdate();
      }
    },
    [callApi, setSelectedIds, getData, alertFaultUpdate, inputValue]
  );

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
  }, [setSelectedIds]);

  // Memoized status options
  const statusOptions = useMemo(() => {
    return filteredDataByMachine.map((statusBoard: any) => ({
      id: statusBoard.boardMissionStatus.boardMissionStatus?.id,
      name: statusBoard.boardMissionStatus.boardMissionStatus?.name,
      backgroundColor:
        statusBoard.boardMissionStatus.boardMissionStatus?.backgroundColor,
      textColor: statusBoard.boardMissionStatus.boardMissionStatus?.textColor,
    }));
  }, [filteredDataByMachine]);

  const isOpenGroupJobsModal = useModal();

  const handleCheckIfCanMakeGroupedBoardMissions = useCallback(
    async (selectedJobIds) => {
      const callBack = (res) => {
        if (res?.success) {
          if (res?.data?.item1) {
            isOpenGroupJobsModal.open();
          } else {
            alertFault(res?.data?.item2);
          }
        } else {
          alertFaultUpdate();
        }
      };
      const selectedJobsIdsList = selectedJobIds.map((job) => job.id);

      await checkIfCanMakeGroupedBoardMissionsApi(callApi, callBack, {
        selectedJobsIdsList,
      });
    },
    [callApi, isOpenGroupJobsModal, alertFault, alertFaultUpdate]
  );

  const handleGroupJobs = useCallback(
    async (selectedJobIds) => {
      const selectedJobsIdsList = selectedJobIds.map((job) => job.id);

      const callBack = (res) => {
        if (res?.success) {
          setSelectedIds([]);
          getData();
        } else {
          alertFaultUpdate();
        }
      };

      await groupJobsApi(callApi, callBack, selectedJobsIdsList);
    },
    [callApi, setSelectedIds, getData, alertFaultUpdate]
  );

  const moveToDone = useModal();
  const moveToNextStation = useModal();

  // Memoized content rendering
  const renderContent = useMemo(() => {
    if (view === EProductionFloorView.DONE_JOBS) {
      return (
        <>
          <DocumentPrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={"calc(100vh - 400px)"}
            rows={transformedRows}
            headers={tableHeader}
            columnWidths={[
              "7%",
              "5%",
              "6%",
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
            ]}
            withSortBE={true}
            onClickSortBE={handleSortBE}
            isDescOrderBE={isDescOrderBE}
            isHeaderSortable={isHeaderSortable}
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
            initialPageSize={initialPageSize}
          />
        </>
      );
    }

    // Show loading skeleton while column settings are loading
    /*if (!columnsReady) {
      return (
        <Stack gap={"10px"}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`skeleton-${index}`} variant="rounded" width={"100%"} height={60} />
          ))}
        </Stack>
      );
    }*/

    return (
      <>
        {filteredDataByMachine.map((statusBoards, index) => {
          const allBoardMissions = filteredDataByMachine.flatMap(
            (board) => board.boardMissions
          );
          return (
            <StatusTableComponent
              key={`status-${statusBoards?.boardMissionStatus?.boardMissionStatus?.id}-${index}`}
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
              isVirtualizing={false}
            />
          );
        })}
      </>
    );
  }, [
    view,
    transformedRows,
    tableHeader,
    handlePageChange,
    handlePageSizeChange,
    pageNumber,
    pagesCount,
    pageSize,
    router,
    initialPageSize,
    columnsReady,
    filteredDataByMachine,
    getCustomerForEdit,
    setFilters,
    storageList,
    inputValue,
    defaultValue,
    addPrintHouseJobsStorage,
    handleStorageChange,
    setInputValue,
    employeesCategories,
    visibleColumns,
    handleSortBE,
    isDescOrderBE,
  ]);

  return (
    <Stack gap={"20px"}>
      {renderContent}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Edit}
        typeClient={CLIENT_TYPE.CUSTOMER}
        openModal={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
        customer={customer}
        setCustomer={setCustomer}
      />

      <FloatingBulkActionsMenu
        selectedJobs={selectedIds}
        onUpdateStatus={handleBulkUpdateStatus}
        onMoveToNextStation={moveToNextStation.open}
        onGroupJobs={handleCheckIfCanMakeGroupedBoardMissions}
        onMoveToDone={moveToDone.open}
        onClearSelection={handleClearSelection}
        statusOptions={statusOptions}
        t={t}
      />

      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={moveToDone.isOpen}
        onClose={moveToDone.close}
        onClickYes={() => handleBulkMoveToDone(selectedIds, true)}
        onClickNo={() => handleBulkMoveToDone(selectedIds, false)}
      >
        <div style={{ width: "100%", minWidth: 300 }}>
          <GoMakeAutoComplate
            options={
              storageList?.find(
                (option: any) => option.storage === inputValue
              ) || inputValue === ""
                ? storageList
                : [
                    {
                      storage: `Add "${inputValue}" as a new storage`,
                      id: "new",
                    },
                    ...storageList,
                  ]
            }
            placeholder={t("boardMissions.selectStorage")}
            key={defaultValue}
            style={{ width: "100%", border: "none", height: 45 }}
            getOptionLabel={(option: any) => option?.storage}
            value={defaultValue}
            onChange={(e: any, value: any) => {
              if (value?.id === "new") {
                addPrintHouseJobsStorage(inputValue);
                setInputValue("");
              } else {
                handleStorageChange(e, value);
                setInputValue("");
              }
            }}
            onInputChange={(event: any, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
          />
        </div>
      </ThreeOptionsModal>

      <GoMakeDeleteModal
        hideIcon={true}
        modalType={ModalType.WARNING}
        title={t("customers.modal.nextStationModalTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        cancelBtn={t("modal.no")}
        openModal={moveToNextStation.isOpen}
        onClose={moveToNextStation.close}
        onClickDelete={() => {
          handleBulkMoveToNextStation(selectedIds);
        }}
      />

      <GoMakeDeleteModal
        hideIcon={true}
        modalType={ModalType.WARNING}
        title={t("sales.modals.groupJobsModalTitle")}
        subTitle={t("sales.modals.groupJobsModalSubTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        cancelBtn={t("modal.no")}
        openModal={isOpenGroupJobsModal.isOpen}
        onClose={isOpenGroupJobsModal.close}
        onClickDelete={() => {
          handleGroupJobs(selectedIds);
        }}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.printOrderJobsModalTitle")}
        subTitle={" "}
        yesBtn={t("sales.quote.print")}
        openModal={isPrintNodeModalOpen}
        onClose={() => { setIsPrintNodeModalOpen(false) }}
        style={{
          zIndex: 999999999999999,
        }}
        onClickDelete={() => {
          setIsPrintNodeModalOpen(false);
          printJobUsingPrintNode(jobsToPrint?.boardMissionId as string, jobsToPrint?.productType as string).then();
        }}

        cancelBtn={t("modal.cancel")}
      />
    </Stack>
    // </ZoomWrapper>
  );
};

export { ProductionFloorTableView };
