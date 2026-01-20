import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { AddButton } from "@/components/button/add-button";
import { GoMakeModal } from "@/components";
import { CreateApiTokenModal } from "./create-api-token-modal";
import { ApiTokenCard } from "./api-token-card";
import { useStyle } from "../style";

export const ApiTokensList = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { classes } = useStyle();
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await callApi("GET", "/v1/api-tokens", {}, true);
      // Response structure: { success: true, data: { status: "success", message: "...", data: [...] } }
      // So the actual array is at res.data.data
      const tokensData = res?.data?.data || res?.data;
      if (tokensData && Array.isArray(tokensData)) {
        setTokens(tokensData);
      } else {
        setTokens([]);
      }
    } catch (error) {
      console.error("Error fetching API tokens:", error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleCreateSuccess = () => {
    fetchTokens();
    setOpenCreateModal(false);
  };

  return (
    <div style={classes.container}>
      <div style={classes.header}>
        <AddButton
          label={t("apiTokens.createToken")}
          onClick={() => setOpenCreateModal(true)}
        />
      </div>

      {loading ? (
        <div>{t("common.loading")}</div>
      ) : tokens.length === 0 ? (
        <div style={classes.emptyState}>
          {t("apiTokens.noTokens")}
        </div>
      ) : (
        <div style={classes.tokensList}>
          {tokens.map((token) => (
            <ApiTokenCard
              key={token.apiTokenId || token.clientId}
              token={token}
              onRevoke={fetchTokens}
            />
          ))}
        </div>
      )}

      <GoMakeModal
        openModal={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        insideStyle={classes.modalStyle}
      >
        <CreateApiTokenModal
          onSuccess={handleCreateSuccess}
          onClose={() => setOpenCreateModal(false)}
        />
      </GoMakeModal>
    </div>
  );
};
