import { useTranslation } from "react-i18next";
import { GoMakeDialog, GomakeTextInput } from "@/components";
import { Skeleton } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface CompositeProduct {
  id: string;
  name: string;
  quantity: number;
  jobName: string;
}

interface CompositeProductsDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  compositeProducts: CompositeProduct[];
  quantityMultiplier: number;
  mainJobName: string;
  compositeErrors: {
    [key: string]: {
      quantity?: string;
      jobName?: string;
    };
  };
  onMultiplierChange: (value: number) => void;
  onMainJobNameChange: (value: string) => void;
  onProductQuantityChange: (index: number, value: number) => void;
  onProductJobNameChange: (index: number, value: string) => void;
}

const CompositeProductsDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  compositeProducts,
  quantityMultiplier,
  mainJobName,
  compositeErrors,
  onMultiplierChange,
  onMainJobNameChange,
  onProductQuantityChange,
  onProductJobNameChange,
}: CompositeProductsDialogProps) => {
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("products.addProduct.admin.compositeProductTitle")}
      primaryButtonLabel={t("products.offsetPrice.admin.addOrderBtn")}
      cancelButtonLabel={t("modal.cancel")}
      onPrimaryAction={onConfirm}
      onCancel={onClose}
      maxWidth="md"
      customStyles={{
        primaryButton: {
          backgroundColor: secondColor(500),
          minWidth: 180,
        },
      }}
    >
      <div
        className={"custom-scrollbar"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minWidth: 500,
          marginTop: 8,
          maxHeight: "600px",
          overflowY: "auto",
          paddingRight: 8,
        }}
      >
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Skeleton for Quantity and Job Name Fields */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                padding: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                }}
              >
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: 1 }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                }}
              >
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: 1 }}
                />
              </div>
            </div>

            {/* Skeleton for Product Cards */}
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 16,
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                }}
              >
                {/* Product Name Skeleton */}
                <Skeleton
                  variant="text"
                  width={200}
                  height={24}
                  style={{ marginBottom: 8 }}
                />

                {/* Quantity and Job Name Fields Skeleton */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                    }}
                  >
                    <Skeleton variant="text" width={70} height={20} />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      sx={{ borderRadius: 1 }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                    }}
                  >
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      sx={{ borderRadius: 1 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : compositeProducts.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center" }}>
            {t("products.addProduct.admin.noCompositeProducts")}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {/* Quantity and Job Name Fields */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                padding: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                }}
              >
                <div style={{ fontWeight: 500 }}>
                  {t("products.addProduct.admin.quantityLabel")}
                </div>
                <GomakeTextInput
                  value={quantityMultiplier.toString()}
                  placeholder={t(
                    "products.addProduct.admin.quantityPlaceholder"
                  )}
                  onChange={(event) => {
                    const value = event.target.value;
                    const numValue = value === "" ? 1 : Number(value);
                    onMultiplierChange(numValue);
                  }}
                  type="number"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                }}
              >
                <div style={{ fontWeight: 500 }}>
                  {t("products.addProduct.admin.jobNameLabel")}
                </div>
                <GomakeTextInput
                  value={mainJobName}
                  placeholder={t(
                    "products.addProduct.admin.jobNamePlaceholder"
                  )}
                  onChange={(event) => {
                    onMainJobNameChange(event.target.value);
                  }}
                />
              </div>
            </div>
            {compositeProducts.map((product, index) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 16,
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}
                >
                  {product.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>
                      {t("products.addProduct.admin.quantityLabel")}
                      <span style={{ color: "red", marginLeft: 4 }}>*</span>
                    </div>
                    <GomakeTextInput
                      value={product.quantity.toString()}
                      placeholder={t(
                        "products.addProduct.admin.quantityPlaceholder"
                      )}
                      onChange={(event) => {
                        const value = event.target.value;
                        const numValue = value === "" ? 0 : Number(value);
                        onProductQuantityChange(index, numValue);
                      }}
                      type="number"
                      error={Boolean(compositeErrors[`${index}`]?.quantity)}
                      helperText={compositeErrors[`${index}`]?.quantity}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>
                      {t("products.addProduct.admin.jobNameLabel")}
                    </div>
                    <GomakeTextInput
                      value={product.jobName}
                      placeholder={t(
                        "products.addProduct.admin.jobNamePlaceholder"
                      )}
                      onChange={(event) => {
                        onProductJobNameChange(index, event.target.value);
                      }}
                      error={Boolean(compositeErrors[`${index}`]?.jobName)}
                      helperText={compositeErrors[`${index}`]?.jobName}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GoMakeDialog>
  );
};

export { CompositeProductsDialog };
export type { CompositeProduct, CompositeProductsDialogProps };

