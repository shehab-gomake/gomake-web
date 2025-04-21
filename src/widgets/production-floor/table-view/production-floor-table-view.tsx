import { StatusTableComponent } from "@/widgets/production-floor/table-view/status-table/status-table-component";
import { useProductionFloorTable } from "@/widgets/production-floor/table-view/use-production-floor-table";
import Stack from "@mui/material/Stack";
import { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { selectedChipIdsState } from "../state/text-search";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { useTranslation } from "react-i18next";

const ProductionFloorTableView = () => {
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
    setCustomer
  } = useProductionFloorTable();
  const { t } = useTranslation();

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

  return (
    <Stack gap={"20px"}>
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
          />
        );
      })}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Edit}
        typeClient={CLIENT_TYPE.CUSTOMER}
        openModal={openCustomerModal}
        modalTitle={t("suppliers.editModalTitle")}
        onClose={() => setOpenCustomerModal(false)}
        customer={customer}
        setCustomer={setCustomer}
        showUpdateButton={true}
      />
    </Stack>
  );
};

export { ProductionFloorTableView };
