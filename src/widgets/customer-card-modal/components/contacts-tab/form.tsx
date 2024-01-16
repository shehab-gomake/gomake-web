import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { contactInputs1 } from "../../inputs/contact-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";

interface IProps {
  contact: {
    id?: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    position?: string;
    address?: string;
    tel1?: number;
    tel2?: number;
    phone?: number;
    fax?: string;
    mail?: string;
    index?: number;
  };
  onDelete: (value: number) => void;
  setContact: any;
}

const ContactForm = ({ contact, onDelete, setContact }: IProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const onChangeInputs = (key, value) => {
    setContact({ ...contact, [key]: value });
  };

  return (
    <div>
      <div style={clasess.customerInfoStyle}>
        {contactInputs1(contact).map((item) => (
          <div style={{ marginBottom: 10 }}>
            <FormInput
              input={item as IInput}
              changeState={onChangeInputs}
              error={item.required && !item.value}
              readonly={false}
            />
          </div>
        ))}
      </div>
      <Stack direction={"row"} marginTop={"10px"} marginBottom={"10px"}>
        <a
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "7px",
            cursor: "pointer",
          }}
          onClick={() => onDelete(contact.index)}
        >
          <RemoveIcon />
          <button style={clasess.buttonsStyle}>
            {t("customers.buttons.remove")}
          </button>
        </a>
      </Stack>
    </div>
  );
};

export { ContactForm };
