import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Avatar, Stack } from "@mui/material";
import { useRef } from "react";
import { AddNewButton } from "@/components/button/add-new-button";

const UploadImgProduct = ({
  productState,
  onChangeStateProduct,
  UploadProductImage,
}) => {
  console.log("productState", productState);
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const inputRef = useRef(null);
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        UploadProductImage(productState?.id, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div style={clasess.itemOnFirstContainer}>
      <div style={clasess.labelTitleStyle}>
        {t("products.addProduct.admin.uploadImg")}
      </div>
      <Stack
        style={clasess.attachmentContainer}
        onClick={() => inputRef.current?.click()}
      >
        <Stack style={clasess.attachmentStyle}>
          <Avatar
            sx={clasess.avatar}
            src={`${productState.img}?${new Date().toString()}`}
          />
          <label style={clasess.labelStyle}>
            {productState?.img
              ? "image  uploaded"
              : t("mailingSettings.noAttachment")}
          </label>
        </Stack>
      </Stack>
      {/* <AddNewButton
        onClick={() => inputRef.current?.click()}
        label={t("mailingSettings.addNewAttachment")}
      /> */}
      <input
        type="file"
        accept=".jpg, .jpeg, .png, .gif, .svg"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        ref={inputRef}
      />
    </div>
  );
};
export { UploadImgProduct };
