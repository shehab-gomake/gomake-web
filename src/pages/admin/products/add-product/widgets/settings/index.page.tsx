import React from "react";

import { useStyle } from "./style";
import { useAddProduct } from "../../use-add-product";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

export default function SettingsWidget() {
  const { clasess } = useStyle();
  const {} = useAddProduct();

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.categoryNameStyle}>Product category</div>
      <div style={clasess.firstContainer}>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            Product name <span style={clasess.requierdInput}>*</span>
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={"Product name"}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>Detail</div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={"Detail"}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            Product SKU <span style={clasess.requierdInput}>+</span>
          </div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              options={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
              placeholder={"Product SKU"}
              style={clasess.dropDownListStyle}
              // getOptionLabel={(option: any) => option.updateName}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>Pricing type</div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              options={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
              placeholder={"Pricing type"}
              style={clasess.dropDownListStyle}
              // getOptionLabel={(option: any) => option.updateName}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>Delivery time (days)</div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={"Delivery time (days)"}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>Groups</div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              options={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
              placeholder={"Groups"}
              style={clasess.dropDownListStyle}
              // getOptionLabel={(option: any) => option.updateName}
            />
          </div>
        </div>
      </div>
      <div style={clasess.categoryNameStyle}>Style</div>
      <div style={clasess.firstContainer}>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>Note color</div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={"Note color"}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>Text color</div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={"Text color"}
            />
          </div>
        </div>
      </div>
      <div style={clasess.categoryNameStyle}>Graphics required</div>
      <div style={clasess.firstContainer}>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>Starting price</div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={"Starting price"}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>Addition to type</div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={"Addition to type"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
