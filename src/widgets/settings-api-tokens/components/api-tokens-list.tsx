import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { GoMakeModal } from "@/components";
import { CreateApiTokenModal } from "./create-api-token-modal";
import { ApiTokenCard } from "./api-token-card";
import { useStyle } from "../style";

interface ApiTokensListProps {
  openCreateModal: boolean;
  onCloseCreateModal: () => void;
}

export const ApiTokensList = ({ openCreateModal, onCloseCreateModal }: ApiTokensListProps) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { classes } = useStyle();
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    onCloseCreateModal();
  };

  return (
    <div style={classes.container}>
      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {t("common.loading")}
        </div>
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
        modalTitle={t("apiTokens.createToken")}
        openModal={openCreateModal}
        onClose={onCloseCreateModal}
        insideStyle={classes.modalStyle}
      >
        <CreateApiTokenModal
          onSuccess={handleCreateSuccess}
          onClose={onCloseCreateModal}
        />
      </GoMakeModal>
    </div>
  );
};
