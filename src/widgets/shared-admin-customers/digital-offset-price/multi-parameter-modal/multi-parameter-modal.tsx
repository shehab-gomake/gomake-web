import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { Checkbox, Select } from "@mui/material";
import { CheckboxIcon } from "../icons";
import { CheckboxCheckedIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { HeaderMapping } from "./header-mapping";
import { ChildrenMapping } from "./children-mapping";

const MultiParameterModal = ({ openModal, onClose, modalTitle }) => {
  const { clasess } = useStyle();
  const paameters = [
    {
      parameterName: "Item name",
      parameterType: 0,
      values: [
        {
          label: "CMYK",
          value: "CMYK",
          subValue: [
            {
              label: "Cyan (C)",
              value: "Cyan (C)",
            },
            {
              label: "Magenta (M)",
              value: "Magenta (M)",
            },
            {
              label: "Yellow (Y)",
              value: "Yellow (Y)",
            },
            {
              label: "Black (k)",
              value: "Black (k)",
            },
          ],
        },
        {
          label: "White",
          value: "White",
        },
        {
          label: "Clear",
          value: "Clear",
        },
        {
          label: "Gold",
          value: "Gold",
        },
        {
          label: "Selver",
          value: "Selver",
        },
        {
          label: "Fluorescent Pink",
          value: "Fluorescent Pink",
        },
        {
          label: "Green",
          value: "Green",
        },
        {
          label: "Orange",
          value: "Orange",
        },
        {
          label: "Pantone",
          value: "Pantone",
        },
      ],
    },
    {
      parameterName: "Load",
      parameterType: 1,
      values: [
        {
          label: "100%",
          value: 100,
          subValue: [
            {
              label: "100%",
              value: 100,
            },
            {
              label: "100%",
              value: 100,
            },
            {
              label: "100%",
              value: 100,
            },
            {
              label: "100%",
              value: 100,
            },
          ],
        },
        {
          label: "100%",
          value: 100,
        },
        {
          label: "100%",
          value: 100,
        },
        {
          label: "100%",
          value: 100,
        },
        {
          label: "100%",
          value: 100,
        },
        {
          label: "100%",
          value: 100,
        },
        {
          label: "100%",
          value: 100,
        },
        {
          label: "100%",
          value: 100,
        },
        {
          label: "100%",
          value: 100,
        },
      ],
    },
    {
      parameterName: "Layers",
      parameterType: 1,
      values: [
        {
          label: "1",
          value: 1,
          subValue: [
            {
              label: "1",
              value: 1,
            },
            {
              label: "1",
              value: 1,
            },
            {
              label: "1",
              value: 1,
            },
            {
              label: "1",
              value: 1,
            },
          ],
        },
        {
          label: "1",
          value: 1,
        },
        {
          label: "1",
          value: 1,
        },
        {
          label: "1",
          value: 1,
        },
        {
          label: "1",
          value: 1,
        },
        {
          label: "1",
          value: 1,
        },
        {
          label: "1",
          value: 1,
        },
        {
          label: "1",
          value: 1,
        },
        {
          label: "1",
          value: 1,
        },
      ],
    },
  ];
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
        withClose={false}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.titleStyle}>Color Settings</div>
          <div style={clasess.multiSelectMainContainer}>
            <Select multiple style={clasess.multiSelectContainer} />
          </div>
          <div style={clasess.tableContainer}>
            <div style={clasess.headerTableContainer}>
              {paameters.map((item, index) => {
                return (
                  <HeaderMapping
                    key={`header_${index}`}
                    item={item}
                    index={index}
                  />
                );
              })}
            </div>
            <div style={clasess.childernTableContainer}>
              <div style={clasess.childernTableRowContainer}>
                {paameters?.map((item, index) => {
                  return (
                    <ChildrenMapping
                      key={`child_${index}`}
                      paameters={paameters}
                      item={item}
                      index={index}
                      clasess={clasess}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <GomakePrimaryButton style={clasess.saveBtnContainerStyle}>
            Save
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};
export { MultiParameterModal };
