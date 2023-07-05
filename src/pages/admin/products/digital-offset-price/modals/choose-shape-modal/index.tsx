import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";

import ShapeImg from "./shape.png";
import { useStyle } from "./style";
import Image from "next/image";
import { useState } from "react";

const ChooseShapeModal = ({ openModal, onClose, modalTitle }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [selectedShape, setSelectedShape] = useState("shape-1");
  const data = [
    {
      key: "shape-1",
      img: ShapeImg,
      name: "Item - rectangle",
      width: "500mm",
      height: "500mm",
      onclick: () => setSelectedShape("shape-1"),
    },
    {
      key: "shape-2",
      img: ShapeImg,
      name: "Item - rectangle",
      width: "500mm",
      height: "500mm",
      onclick: () => setSelectedShape("shape-2"),
    },
    {
      key: "shape-3",
      img: ShapeImg,
      name: "Item - rectangle",
      width: "500mm",
      height: "500mm",
      onclick: () => setSelectedShape("shape-3"),
    },
    {
      key: "shape-4",
      img: ShapeImg,
      name: "Item - rectangle",
      width: "500mm",
      height: "500mm",
      onclick: () => setSelectedShape("shape-4"),
    },
    {
      key: "shape-5",
      img: ShapeImg,
      name: "Item - rectangle",
      width: "500mm",
      height: "500mm",
      onclick: () => setSelectedShape("shape-5"),
    },
    {
      key: "shape-6",
      img: ShapeImg,
      name: "Item - rectangle",
      width: "500mm",
      height: "500mm",
      onclick: () => setSelectedShape("shape-6"),
    },
    {
      key: "shape-7",
      img: ShapeImg,
      name: "Item - rectangle",
      width: "500mm",
      height: "500mm",
      onclick: () => setSelectedShape("shape-7"),
    },
    {
      key: "shape-8",
      img: ShapeImg,
      name: "Item - rectangle",
      width: "500mm",
      height: "500mm",
      onclick: () => setSelectedShape("shape-8"),
    },
  ];
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          {data?.map((item, index) => {
            return (
              <div
                style={
                  item.key != selectedShape
                    ? clasess.shapeContainer
                    : clasess.shapeSelectedContainer
                }
                onClick={item.onclick}
              >
                <div style={{ width: "100%" }}>
                  <Image
                    src={item?.img}
                    alt="shape"
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={clasess.shapeNameStyle}>{item?.name}</div>
                <div style={clasess.shapeWidthHeightStyle}>{item?.width}</div>
                <div style={clasess.shapeWidthHeightStyle}>{item?.height}</div>
              </div>
            );
          })}
          <div style={clasess.btnsContainer}>
            <GomakePrimaryButton style={clasess.customizeBtnStyle}>
              Customize
            </GomakePrimaryButton>
            <GomakePrimaryButton style={clasess.chooseBtnStyle}>
              Choose
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { ChooseShapeModal };
