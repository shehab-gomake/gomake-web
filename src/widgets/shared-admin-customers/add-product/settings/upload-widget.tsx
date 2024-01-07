import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Avatar, Badge, IconButton } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useRef } from "react";

const UploadImgProduct = ({
  productState,
  onChangeStateProduct,
  UploadProductImage,
}) => {
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: dir === "rtl" ? "left" : "right",
          }}
          badgeContent={
            <IconButton
              onClick={() => inputRef.current?.click()}
              sx={clasess.button}
              size={"small"}
            >
              <CameraAltIcon sx={{ width: 13, height: 18 }} />
            </IconButton>
          }
        >
          <Avatar
            sx={clasess.avatar}
            src={`${productState.img}?${new Date().toString()}`}
          >
            {/* <img
              src={`${productState.img}?${new Date().toString()}`}
              style={{ width: "100%", height: "100%" }}
            /> */}
          </Avatar>
        </Badge>
      </div>
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
