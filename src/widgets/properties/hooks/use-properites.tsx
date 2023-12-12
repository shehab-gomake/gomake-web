import { useGomakeAxios } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

const useProperites = () => {
  const router = useRouter();
  const [selectedProperties, setSelectedProperites] = useState();
  const [allProperties, setAllProperites] = useState([]);
  const [actionId, setActionId] = useState("");
  const { callApi } = useGomakeAxios();
  useEffect(() => {
    if (router.query.actionId) {
      getPrintHouseActionById(router.query.actionId as string).then((res) => {
        setAllProperites(res?.data?.data?.data);
        setActionId(router.query.actionId as string);
      });
    }
  }, [router]);

  const getPrintHouseActionById = async (actionId: string) => {
    return await callApi(
      "Get",
      `/v1/printhouse-config/print-house-action/get-properties-by-action-id/${router.query.actionId}`
    );
  };

  const [openAddRule, setOpenAddRule] = useState<boolean>(false);
  const [openEditRule, setOpenEditRule] = useState<boolean>(false);

  const onCloseAddRuleModal = () => {
    setOpenAddRule(false);
  };
  const onOpenAddRuleModal = () => {
    setOpenAddRule(true);
  };
  const onCOpenEditModal = () => {
    setOpenEditRule(true);
  };
  const onCloseEditModal = () => {
    setOpenEditRule(false);
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [filter, setFilter] = useState<string>("");
  const properties = useCallback(() => {
    if (!!filter) {
      return allProperties?.filter((property) =>
        property.propertyName.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return allProperties;
  }, [filter, allProperties]);
  return {
    allProperties,
    actionId,
    openAddRule,
    openEditRule,
    onCloseAddRuleModal,
    onOpenAddRuleModal,
    onCOpenEditModal,
    onCloseEditModal,
    anchorEl,
    open,
    handleClick,
    handleClose,
    selectedProperties,
    setSelectedProperites,
    properties,
    setFilter,
  };
};

export { useProperites };
