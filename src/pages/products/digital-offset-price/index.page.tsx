import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Slider,
} from "@mui/material";
import { CheckboxCheckedIcon, EditIcon } from "@/icons";
import { useEffect, useState } from "react";
import {
  ChooseShapeModal,
  MakeShapeModal,
} from "@/widgets/shared-admin-customers/digital-offset-price";
import {
  CheckboxIcon,
  DoneIcon,
} from "@/widgets/shared-admin-customers/digital-offset-price/icons";
import { useDigitalOffsetPrice } from "@/hooks";
import { useMaterials } from "@/hooks/use-materials";
import { useRecoilState } from "recoil";
import { digitslPriceState } from "@/hooks/shared-customer-admin/store";
import { Table } from "@/widgets/table/table";
import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { useRouter } from "next/router";
export default function DigitalOffsetPrice() {
  const [digitalPriceData, setDigidatPriceData] =
    useRecoilState<any>(digitslPriceState);
  const { clasess } = useStyle();
  const {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onOpeneChooseShape,
    onOpeneMakeShape,
    onCloseChooseShape,
    onCloseMakeShape,
    onChangeForPrice,
    makeShapeOpen,
    chooseShapeOpen,
    activeIndex,
    // template,
    activeTab,
    tabs,
    defaultPrice,
    setDefaultPrice,
  } = useDigitalOffsetPrice();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | false>("panel_0");
  const { allMaterials } = useMaterials();
  const templateMock: any = {
    id: "2d40c22d-5cdd-4aaa-a223-0b0f26621398",
    name: "Real data test",
    details: "Finally New Real Data ",
    img: "https://gomake-dev.s3.eu-west-3.amazonaws.com/622c884e-ce4c-47a7-b446-66aefd255e0e",
    groups: [
      "34d00281-9282-472c-bbdb-b27f17cecebf",
      "ae94c76a-6d88-42ca-8cdd-e1119d951671",
    ],
    deliveryTime: "25",
    startingPrice: 1000,
    additionPrice: 5000,
    noteColor: "#b81a1a",
    textColor: "#000000",
    productSKUId: "4fa691fe-7c46-436c-b9f2-70732508c6b7",
    templateId: "ab1e5f67-8d54-45aa-9be4-b5372e2331ed",
    status: false,
    sections: [
      {
        id: "fac91536-79e4-4bd8-80a9-c404d5a960e8",
        name: "Printing details",
        icon: "https://gomake-dev.s3.eu-west-3.amazonaws.com/a5bc43f9-c0db-426c-877b-3889cd8fb3cb",
        isAccordion: false,
        parameters: [],
        subSections: [
          {
            id: "f69746b5-8fa9-43af-8578-3115e19a4f34",
            name: "Product category",
            type: "",
            parameters: [
              {
                id: "a330193f-492c-40a8-86f3-8edf5c8f0d5e",
                name: "Job Name",
                isHidden: false,
                parameterType: 2,
                isRequired: true,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b",
                name: "Types",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "4991945c-5e07-4773-8f11-2e3483b70b53",
                name: "Quantity",
                isHidden: false,
                parameterType: 1,
                isRequired: true,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "e7ea235e-b5e2-4f0d-aecf-0f435c24afbb",
                name: "Sets",
                isHidden: false,
                parameterType: 3,
                isRequired: true,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "0fdbca1a-f250-447b-93e3-5b91909da59c",
                name: "Sets Quantity",
                isHidden: false,
                parameterType: 1,
                isRequired: true,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "91d3fe77-b852-4974-beb6-2da7d7616c78",
                name: "Sets Unit",
                isHidden: false,
                parameterType: 1,
                isRequired: true,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "52e81409-6146-417a-acec-77934793382f",
                name: "Reorder",
                isHidden: false,
                parameterType: 3,
                isRequired: true,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "a81ecd5d-c8f6-471a-8af1-77922b76616a",
            name: "Size & Shape",
            type: "",
            parameters: [
              {
                id: "e6cb1b69-d1f9-4319-85e8-4c2ae7c3e7de",
                name: "Shape",
                isHidden: false,
                parameterType: 0,
                isRequired: true,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "758cf08b-5f1f-4752-ab8b-f3515d9bd930",
                    isHidden: false,
                    isDefault: false,
                    updateName: "rectangular",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "e4f6d08a-0c29-4bd3-8f55-b569b8d48ab6",
                    isHidden: false,
                    isDefault: false,
                    updateName: "circular",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "4c172847-e070-4dde-89f6-0308a400ace4",
                    isHidden: false,
                    isDefault: false,
                    updateName: "formal",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4",
                name: "size",
                isHidden: false,
                parameterType: 6,
                isRequired: true,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "4ba9a275-4fbc-4313-b284-e9b1cf8b452e",
                name: "Width",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "d2c965d3-6b08-4380-9d4b-17c361d7e484",
                name: "Height",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "3f1c8cc4-3e65-4d47-bee9-3c75a507234b",
                name: "Formal Shape",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "41df19e8-7bf0-43ec-be3a-3a04d1ec0174",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Simple",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "b242b0a5-296f-4a6e-bcf1-40d68c06742a",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Complex",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "c0ce7e0b-5e12-4f8f-910a-a0a5ae32477e",
                    isHidden: false,
                    isDefault: false,
                    updateName: "decoration",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "a3219ea6-f895-40e1-9cd3-c7af03230b3f",
                name: "size optimizer",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "2bb8d3c1-df95-4ea4-badf-5af2b080bcde",
            name: "Media",
            type: "",
            parameters: [
              {
                id: "d7b058c4-0409-43e8-b446-8f70a7027a02",
                name: "Sheet category",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "c267ecb5-c774-4136-afef-3ed44c3c1f0f",
                name: "Sheet Weight",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "d59a056b-131a-42c2-ac0b-f1f1355f7520",
                name: "Material coating type",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "2dc16089-b0fd-4f5c-9caf-605c12baac36",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Matte",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "f702de5a-06c7-48cd-afdf-515ab9076366",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Glossy",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "07de14a2-50c7-441d-bf39-0dc8cb9a7b45",
                name: "Costumer Paper",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "5b66d1f6-c592-4c5a-aa1a-112196cad6bc",
                name: "Envelop Paper type",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "b1123be7-f519-4102-91f1-eb5ea8a4f1fb",
                name: "Envelop Opening Direction",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "953f3c0e-d273-4784-8b27-1d0bf0461d43",
                name: "Roll type",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "67b51436-0ae8-4a4f-a38b-ce02ec550951",
                name: "Material weight",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "c004c18e-bebe-432b-810d-17ca5c35e6f2",
                name: "Wide printing rolls category",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "afb9cb64-cddc-407e-b594-8e32e8540a4d",
                name: "wide roll Type",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "ccf62e79-4237-4b16-8b37-904e9e11e110",
                name: "Roll color",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "2145e44a-f6a3-4369-9526-56809d6e1fdc",
                name: "Flatbed category",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "4bd2c71e-2b5b-4bbf-9c47-e59ac7584269",
                name: "Flatbed Thickness",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "5ee284f3-b2df-47b4-b8a3-35ac736ea71f",
                name: "Flatbed Color",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "25561c9d-8db5-4fc7-8691-564a3e2520e6",
                name: "Chemical copy",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "1509b93e-b2a8-4ec7-b247-042de29f7e8c",
                name: "Copy Amount",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "5adf6fd4-8914-412b-9ede-6c34be370346",
            name: "Printing",
            type: "",
            parameters: [
              {
                id: "a7cca208-b79a-4d18-ab11-5355ff6b6dea",
                name: "Changing Info",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "e23b341b-2423-425a-8d25-4e7d6d297338",
                name: "Changing DataType",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "12bd74c2-46eb-408a-af8f-5b221fac96c4",
                name: "Printing Sides",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "672ef00e-4026-4c0c-8efb-d538dda9e11a",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "e7deed00-f0b2-4be7-ae53-5c316bc8951a",
                name: "Both side Same print color",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "31b95cef-0d8f-4cb0-8790-90eb80307847",
                name: "Printing Quality",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "5f4b6094-1dc5-40e4-81fd-e1294fca9d10",
                name: "Printing Colors",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "8eff3238-a321-48f3-85eb-c14afaccbff3",
                name: "printing colors Detail",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "beef202e-98dd-472d-979d-337b0ad6ecd9",
                    isHidden: false,
                    isDefault: false,
                    updateName: "C",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "de43d2cd-4835-4eb4-865e-86922a55d52e",
                    isHidden: false,
                    isDefault: false,
                    updateName: "M",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "26b89099-3446-4c8c-b9d9-7631af3356ec",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Y",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "1e842864-0620-460e-a336-e70f5149fe28",
                    isHidden: false,
                    isDefault: false,
                    updateName: "K",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "8b43efba-f28c-4e73-8fa0-cc64f3ea06f8",
                name: "Color load percentage",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "91771ae2-4571-4507-8b0c-d286a4d94a2d",
                name: "Special Colors printing",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "43494273-3777-41ee-b6bf-9a22245ecbac",
                name: "Special Color",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "672ef00e-4026-4c0c-8efb-d538dda9e11a",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "e1dfbaab-977e-4267-9e4e-d733f49ee20d",
                name: "Special Color Layers",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "a45cac8a-0f54-46ef-b63f-c16cacf79922",
                name: "Special Color load percentage",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
        ],
      },
      {
        id: "c66465de-95d6-4ea3-bd3f-7efe60f4cb04",
        name: "Finishing",
        icon: "https://gomake-dev.s3.eu-west-3.amazonaws.com/25fa024c-0586-49aa-a654-ff19c59e0ff7",
        isAccordion: false,
        parameters: [],
        subSections: [
          {
            id: "a74effca-5a23-41f5-93e5-2e9ae42aa71b",
            name: "For sets",
            type: "",
            parameters: [
              {
                id: "dbaa190e-879b-4b44-9e04-94fd11bbd4a8",
                name: "Pasting blocks",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "65a06354-7aef-406d-8127-8172c9826345",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "55e125bd-6522-43a8-9b38-cd5bb87f5d62",
                name: "Glue Type",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "880df105-bdf0-4761-852e-392f56cb7c7a",
                name: "stapler pins",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "fa72da31-038e-419f-9079-1ce20ed67dbb",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "8947722e-408a-4914-84af-30fb33df1ca3",
                name: "Number of Pins",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "47c2fca1-d505-4745-b1ba-715e6eed2d86",
                name: "pin placement",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "8727db0f-104b-40c2-a219-b64880376335",
            name: "Folding, Scoring and Perforation",
            type: "",
            parameters: [
              {
                id: "97f5cba8-fc21-4478-99f1-b5f9488dbe8f",
                name: "Scoring",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "40b9c4a0-6401-40e9-877b-7cbcec415a87",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "d1daa02f-40a1-4c79-bcc5-a2c55dbaaf85",
                name: "Scorings in width",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "1f5f79da-8330-4fa4-8ad5-69da44e13e18",
                name: "Scorings in length",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "63d05bb0-1313-4977-aa31-d5586ec0f398",
                name: "Perforation",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "1d4603d8-f1ab-4cfd-b5ba-6f9e4374f4c2",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "f517ee17-920d-4ae3-9b17-715f507745da",
                name: "Perforations in width",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "0eccc7d5-8d29-466a-99aa-646c33a977e2",
                name: "Perforations in length",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "6191b247-3678-463b-ba7f-ee52734319df",
                name: "Folding",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "aa7a20a3-524f-43a4-b64e-d46ac4fb9aaa",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "92886dfa-f48e-490a-a6b2-3f8396375347",
                name: "Folds in width",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "d69b576b-387f-41e8-9505-6b5539301df6",
                name: "Folds in length",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "4d3ac680-9cd6-41c2-979c-a6fc4580ae31",
            name: "Lamination and Capsulation",
            type: "",
            parameters: [
              {
                id: "7ac619d4-196f-4610-88bb-082c1af586b8",
                name: "Lamination sides",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "a28f0e6c-4a57-40f8-b963-6964922d1a23",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "68fa180d-7d65-4ffd-b95e-c21d60db2b96",
                    isHidden: false,
                    isDefault: false,
                    updateName: "No",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "becc349c-7aa3-4bb6-8b61-9bdd08c262a5",
                    isHidden: false,
                    isDefault: false,
                    updateName: "One Side",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "befd59f9-851c-4aad-924e-4fed4e829082",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Two Sides",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "e499e916-09a0-44f1-add5-01e8d869ae43",
                name: "Lamination type",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "ade02fe5-41f5-4aa2-9094-d84b98d524fb",
                name: "Capsulation",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "4dbbafe1-0983-467d-96b4-8b0cdd844526",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "809a0f84-d8b6-4905-9241-d38a3902b7a4",
                name: "Capsulation Type",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "c6b476bd-b38c-4eb1-910a-3ec5963817c7",
            name: "Punching and rounding corners",
            type: "",
            parameters: [
              {
                id: "6fc8582b-e3c9-4260-b96a-31855ab60c67",
                name: "Puncture",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "b845d22d-6b77-470a-94a7-ae6228b5db79",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "14ded53f-7284-4d1b-8648-547d84ef13c8",
                name: "Puncture Type",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "2045c084-fdfc-407c-87c4-011ebf76a83e",
                name: "Puncture amount",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "fd06242b-1e5a-4218-be3d-c82a32aee11a",
                name: "Puncture Radius",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "6e086695-028e-4a6f-b57b-baaaa240f849",
                    isHidden: false,
                    isDefault: false,
                    updateName: "1",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "eb1badd6-a33c-4732-96ac-7788309f2cdc",
                    isHidden: false,
                    isDefault: false,
                    updateName: "2",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "5348fee8-daf5-4691-8758-e965853c8f84",
                    isHidden: false,
                    isDefault: false,
                    updateName: "3",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "3fae72a4-f7b1-47e6-b493-d7deb36094dc",
                    isHidden: false,
                    isDefault: false,
                    updateName: "4",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "380900f4-1ad6-48d6-a769-ec5d3a8a0d73",
                    isHidden: false,
                    isDefault: false,
                    updateName: "5",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "724821c5-758e-497c-adc2-0141844ecc63",
                name: "Rounding corners",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "77df3207-1be8-4597-b387-88c152959a4e",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "85777a4f-479e-4bb1-8485-9ebc90d341be",
            name: "Attachments",
            type: "",
            parameters: [
              {
                id: "bd42b4db-d55f-4a6a-bca6-4f289944374a",
                name: "Magnet attach",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "97a442b9-b74a-44b3-938c-d8eceaa79552",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "1a7c1f49-f5e0-47d4-8ca8-03215b172058",
                name: "Magnet Quantity per unit",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "6082533b-2cee-432b-8c6b-a90ed7368090",
                name: "MagnetWidth",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "9e25bfb9-6902-434e-980b-4bb991ed3f73",
                name: "MagnetHeight",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "a7ebedbc-1cae-4c79-8405-cbb2d87446b3",
            name: "Folding paste",
            type: "",
            parameters: [
              {
                id: "d2654a06-f2f7-4a25-9543-79d51f8a1ccd",
                name: "Folding paste",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "c1d30c95-104f-4f0a-ba00-5df2ff67c209",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "8205ef6e-6380-4ac8-b033-f6c19c7dcf07",
            name: "Enhancement",
            type: "",
            parameters: [
              {
                id: "2fad7951-dcf6-4102-9558-16b39996681a",
                name: "Enhancement",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "5c755d21-a728-40d5-af2e-c31e02bebc1d",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "4188c69f-ee27-4579-b1bd-49b8e6fd61a5",
                name: "Enhancement Type",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "4ce15a7f-d985-46ab-adba-8b43c1c580b3",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Foil",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "64a11db3-df6c-4f7b-b61d-1d9708e942fa",
                    isHidden: false,
                    isDefault: false,
                    updateName: "embossing selective",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "3f9022a3-528b-47b2-9f03-6e0cfb78fe95",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Embossing",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "994ae265-4253-47da-b82f-03eba9e74bfa",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Debossing",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "01fc98b7-86aa-49ba-8e6f-2f22873d92e3",
                name: "Foil options",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "2f4af6b1-f299-451a-bb2d-b23b9b98bb92",
                    isHidden: false,
                    isDefault: false,
                    updateName: "Flat",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "9836e77c-84b7-4d34-8935-073863f3c057",
                    isHidden: false,
                    isDefault: false,
                    updateName: "hight",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "55241ce1-61b3-4afb-b712-155a6de3b2ae",
                name: "hight levels",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "9e544827-6b08-4a85-bb6f-d63873d16908",
                    isHidden: false,
                    isDefault: false,
                    updateName: "0.1",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "d976012b-8d5b-406b-9661-0d3c5cad9e30",
                    isHidden: false,
                    isDefault: false,
                    updateName: "0.3",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "2b5945f5-e94a-4671-8ee9-939a801a475b",
                    isHidden: false,
                    isDefault: false,
                    updateName: "0.5",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "33bdfda3-9a35-4068-80e2-68a101b9f745",
                name: "complexity",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [
                  {
                    id: "5ce0f87b-dac4-4e06-abb9-7112cc22c557",
                    isHidden: false,
                    isDefault: false,
                    updateName: "simple",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                  {
                    id: "dd461cd5-a18a-4a6c-9d73-5026886778e4",
                    isHidden: false,
                    isDefault: false,
                    updateName: "complex",
                    isDeleted: false,
                    materialValueIds: null,
                  },
                ],
              },
              {
                id: "c8a9ccd8-6b2f-46c5-8a9b-b31d0eb2c676",
                name: "Foil Color",
                isHidden: false,
                parameterType: 5,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "762f8e5d-ac53-47b8-bcea-e200f32476b9",
                name: "Coverage levels",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "4ffdcff9-0847-40ef-936e-d195a1f7074b",
                name: "Enhancement Width",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "b3b02179-8568-47a5-b2cc-94d34098667a",
                name: "Enhancement Length",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "d98cca97-5280-410a-a26e-9ea59a79a9d4",
                name: "Enhancement Data Type",
                isHidden: false,
                parameterType: 0,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
          {
            id: "64986dbd-fc15-4114-8ec6-929d009acf78",
            name: "Manual additions",
            type: "",
            parameters: [
              {
                id: "502a07b8-9e91-4bd5-afe1-52cb04188e34",
                name: "Manual addition",
                isHidden: false,
                parameterType: 3,
                isRequired: false,
                actionId: "b99c6ecd-8de1-409d-be32-40a37ecabda6",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "50ab8fbb-6212-4bb1-bf6a-674d17d20333",
                name: "Manual addition for Unit",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "dc003304-1324-4f30-8e72-287ff1bb93c0",
                name: "Manual addition for set",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "32d143fa-96b3-4cf7-9f49-e4a1c6ba958e",
                name: "Total Manual addition",
                isHidden: false,
                parameterType: 1,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
              {
                id: "fb0ee10a-7ce1-40fb-a864-e5b22b2df931",
                name: "Addition description",
                isHidden: false,
                parameterType: 2,
                isRequired: false,
                actionId: "00000000-0000-0000-0000-000000000000",
                defaultValue: null,
                valuesConfigs: [],
              },
            ],
          },
        ],
      },
      {
        id: "c66465de-95d6-4ea3-bd3f-7efe60f4cb0555",
        name: "Pricing",
        icon: "https://gomake-dev.s3.eu-west-3.amazonaws.com/25fa024c-0586-49aa-a654-ff19c59e0ff7",
        jobDetails:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        actions: [
          {
            actionName: "Action1",
            Flows: [
              {},
              {
                StationName: "StationName",
                ActionType: "ActionType",
                Machine: "Machine",
                SetupTime: "SetupTime",
                RunTime: "RunTime",
                DeliveryTime: "DeliveryTime",
                Cost: "Cost",
                Profit: "Profit",
              },
              {
                StationName: "3,353,42",
                ActionType: "3,353,42",
                Machine: "3,353,42",
                SetupTime: "3,353,42",
                RunTime: "3,353,42",
                DeliveryTime: "3,353,42",
                Cost: "3,353,42",
                Profit: "55%",
              },
              {
                StationName: "3,353,42",
                ActionType: "3,353,42",
                Machine: "3,353,42",
                SetupTime: "3,353,42",
                RunTime: "3,353,42",
                DeliveryTime: "3,353,42",
                Cost: "3,353,42",
                Profit: "55%",
              },
            ],
          },
          {
            actionName: "Action2",
            Flows: [
              {},
              {
                StationName: "StationName",
                ActionType: "ActionType",
                Machine: "Machine",
                SetupTime: "SetupTime",
                RunTime: "RunTime",
                DeliveryTime: "DeliveryTime",
                Cost: "Cost",
                Profit: "Profit",
              },
              {
                StationName: "Station name 3,353,42",
                ActionType: "Station name 3,353,42",
                Machine: "Station name 3,353,42",
                SetupTime: "Setup cost 3,353,42",
                RunTime: "Run cost 3,353,42",
                DeliveryTime: "Total Cost 3,353,42",
                Cost: "Profit 555%",
                Profit: "Price 555",
              },
              {
                StationName: "3,353,42",
                ActionType: "3,353,42",
                Machine: "3,353,42",
                SetupTime: "3,353,42",
                RunTime: "3,353,42",
                DeliveryTime: "3,353,42",
                Cost: "3,353,42",
                Profit: "55%",
              },
            ],
          },
        ],
      },
    ],
  };
  const [clientTypeDefaultValue, setClientTypeDefaultValue] = useState<any>({});
  const [clientDefaultValue, setClientDefaultValue] = useState<any>({});
  console.log("clientDefaultValue", clientDefaultValue);
  const { clientTypesValue, renderOptions, checkWhatRenderArray } =
    useQuoteWidget();
  useEffect(() => {
    setClientTypeDefaultValue(
      clientTypesValue.find(
        (item: any) => item?.id === router?.query?.clientTypeId
      )
    );
    setClientDefaultValue(
      renderOptions().find(
        (item: any) => item?.id === router?.query?.customerId
      )
    );
  }, [clientTypesValue, router]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _renderParameterType = (
    parameter: any,
    subSection: any,
    section: any
  ) => {
    if (parameter?.parameterType === 1) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          onChange={(e: any, item: any) =>
            onChangeForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              { value: e.target.value }
            )
          }
          type="number"
        />
      );
    } else if (parameter?.parameterType === 2) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          onChange={(e: any, value: any) =>
            onChangeForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.id,
              { value: e.target.value }
            )
          }
          type="text"
        />
      );
    } else if (parameter?.parameterType === 0) {
      const defaultObject = parameter.valuesConfigs.find(
        (item) => item.isDefault === true
      );
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          value={defaultObject}
          onChange={(e: any, value: any) => {
            onChangeForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              { valueId: value?.id, valueName: value?.updateName }
            );
          }}
        />
      );
    } else if (parameter?.parameterType === 3) {
      return (
        <SecondSwitch
          defaultChecked={parameter?.defaultValue === "true"}
          onChange={(e: any, value: any) =>
            onChangeForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              { value }
            )
          }
        />
      );
    } else if (parameter?.parameterType === 4) {
      return (
        <GomakePrimaryButton
          style={clasess.dynamicBtn}
          onClick={onOpeneChooseShape}
        >
          {parameter?.name}
        </GomakePrimaryButton>
      );
    } else if (parameter?.parameterType === 5) {
      let options: any = allMaterials;
      if (parameter?.materialPath?.length == 3) {
        options = digitalPriceData?.selectedMaterialLvl2;
      }
      if (parameter?.materialPath?.length == 2) {
        options = digitalPriceData?.selectedMaterialLvl1;
      }
      if (parameter?.materialPath?.length == 1) {
        options = allMaterials.find(
          (material) => material.pathName === parameter?.materialPath[0]
        )?.data;
      }
      return (
        options?.length > 0 && (
          <GoMakeAutoComplate
            options={options}
            placeholder={parameter.updatedName}
            style={clasess.dropDownListStyle}
            getOptionLabel={(option: any) => option.value}
            onChange={(e: any, value: any) => {
              if (parameter?.materialPath?.length == 3) {
                onChangeForPrice(
                  parameter?.id,
                  subSection?.id,
                  section?.id,
                  parameter?.parameterType,
                  { valueId: value?.id, valueName: value.value }
                );
                setDigidatPriceData({
                  ...digitalPriceData,
                  selectedMaterialLvl3: value,
                  selectedOptionLvl3: value,
                });
              }
              if (parameter?.materialPath?.length == 2) {
                onChangeForPrice(
                  parameter?.id,
                  subSection?.id,
                  section?.id,
                  parameter?.parameterType,
                  { valueId: value?.id, valueName: value.value }
                );
                setDigidatPriceData({
                  ...digitalPriceData,
                  selectedMaterialLvl2: value?.data,
                  selectedOptionLvl2: value,
                  selectedMaterialLvl3: null,
                });
              }
              if (parameter?.materialPath?.length == 1) {
                onChangeForPrice(
                  parameter?.id,
                  subSection?.id,
                  section?.id,
                  parameter?.parameterType,
                  { valueId: value?.id, valueName: value.value }
                );
                setDigidatPriceData({
                  ...digitalPriceData,
                  selectedMaterialLvl1: value?.data,
                  selectedOptionLvl1: value,
                  selectedMaterialLvl2: null,
                  selectedMaterialLvl3: null,
                });
              }
            }}
          />
        )
      );
    }
  };
  return (
    <CustomerAuthLayout>
      {templateMock?.sections?.length > 0 && (
        <div style={clasess.mainContainer}>
          <HeaderTitle
            title={t("products.offsetPrice.admin.title2")}
            marginTop={50}
          />
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                {templateMock?.sections?.map((item, index) => {
                  return (
                    <div>
                      <div
                        style={clasess.tabContainer}
                        key={index}
                        onClick={() => handleTabClick(index)}
                      >
                        <div style={{ height: 22, minWidth: 30 }}>
                          {index === activeIndex ? (
                            <img
                              src={item.icon}
                              style={{
                                width: 30,
                                height: 24,
                              }}
                            />
                          ) : index >= activeIndex ? (
                            <img
                              src={item.icon}
                              style={{
                                width: 30,
                                height: 24,
                              }}
                            />
                          ) : (
                            <DoneIcon />
                          )}
                        </div>
                        <div
                          style={
                            index === activeIndex
                              ? clasess.tabNameActiveStyle
                              : clasess.tabNameStyle
                          }
                        >
                          {item.name}
                        </div>
                      </div>
                      {index === activeIndex && (
                        <div style={clasess.selectedTabLine} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div
                style={{ height: "60vh", overflow: "scroll", width: "100%" }}
              >
                <div style={clasess.sectionsContainer}>
                  {templateMock?.sections?.map((section, index) => {
                    console.log("section", section);
                    if (index === activeIndex) {
                      if (section.name === "Pricing") {
                        return (
                          <div style={clasess.pricingSectionContainer}>
                            <div style={clasess.summaryContainer}>
                              <div style={clasess.summaryStyle}>Summary</div>
                              <div style={clasess.jobDetailsContainer}>
                                <div style={clasess.jobDetailsStyle}>
                                  Job details
                                </div>
                                <div style={clasess.jobDetails}>
                                  {section.jobDetails}
                                </div>
                              </div>
                              <div style={{ width: "100%" }}>
                                <Table
                                  tableHeaders={[
                                    "Total cost",
                                    "Total production time",
                                    "Final price",
                                  ]}
                                  tableRows={[
                                    {
                                      "Total cost": "562.00 USD",
                                      "Total production time": "3.14",
                                      "Final price": "2432.00 USD",
                                    },
                                  ]}
                                />
                              </div>
                            </div>
                            <div style={clasess.actionsStyleContainer}>
                              Actions
                            </div>
                            {section.actions?.map((action) => {
                              console.log("action", action);
                              return (
                                <div style={clasess.summaryContainer}>
                                  <div style={clasess.actionNameStyle}>
                                    {action?.actionName}
                                  </div>

                                  <div
                                    style={{ width: "100%", marginTop: -85 }} //when real data delete the  marginTop
                                  >
                                    <Table tableRows={action?.Flows} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      } else {
                        return section?.subSections?.map(
                          (subSection, index) => {
                            if (subSection?.isAccordion) {
                              return (
                                <Accordion
                                  expanded={expanded === `panel_${index}`}
                                  onChange={handleChange(`panel_${index}`)}
                                  key={index}
                                >
                                  <AccordionSummary
                                    style={
                                      expanded === `panel_${index}`
                                        ? clasess.activeTabContainer
                                        : null
                                    }
                                  >
                                    <div
                                      style={clasess.headerAccordionContainer}
                                    >
                                      <EditIcon />
                                      <div
                                        style={
                                          expanded === `panel_${index}`
                                            ? clasess.subSectionAccordionActiveStyle
                                            : clasess.subSectionAccordionStyle
                                        }
                                      >
                                        {subSection.name}
                                      </div>
                                    </div>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <div style={clasess.parametersContainer}>
                                      {subSection?.parameters?.map(
                                        (parameter, index) => {
                                          return (
                                            <div key={index}>
                                              {!parameter?.isHidden ? (
                                                <div
                                                  style={
                                                    clasess.parameterContainer
                                                  }
                                                >
                                                  <div
                                                    style={
                                                      clasess.parameterLabelStyle
                                                    }
                                                  >
                                                    {parameter?.updatedName}
                                                    {parameter?.isRequired ? (
                                                      <span
                                                        style={
                                                          clasess.spanRequierd
                                                        }
                                                      >
                                                        {" "}
                                                        *
                                                      </span>
                                                    ) : null}
                                                  </div>
                                                  <div
                                                    style={
                                                      clasess.renderParameterTypeContainer
                                                    }
                                                  >
                                                    {_renderParameterType(
                                                      parameter,
                                                      subSection,
                                                      section
                                                    )}
                                                  </div>
                                                </div>
                                              ) : null}
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </AccordionDetails>
                                </Accordion>
                              );
                            } else {
                              return (
                                <div
                                  key={index}
                                  style={clasess.subSectionContainer}
                                >
                                  <div style={clasess.subSectionTitleStyle}>
                                    {subSection.name}
                                  </div>
                                  <div style={clasess.parametersContainer}>
                                    {subSection?.parameters?.map(
                                      (parameter, index) => {
                                        return (
                                          <div key={index}>
                                            {!parameter?.isHidden ? (
                                              <div
                                                style={
                                                  clasess.parameterContainer
                                                }
                                              >
                                                <div
                                                  style={
                                                    clasess.parameterLabelStyle
                                                  }
                                                >
                                                  {parameter?.name}
                                                  {parameter?.isRequired ? (
                                                    <span
                                                      style={
                                                        clasess.spanRequierd
                                                      }
                                                    >
                                                      {" "}
                                                      *
                                                    </span>
                                                  ) : null}
                                                </div>
                                                <div
                                                  style={
                                                    clasess.renderParameterTypeContainer
                                                  }
                                                >
                                                  {_renderParameterType(
                                                    parameter,
                                                    subSection,
                                                    section
                                                  )}
                                                </div>
                                              </div>
                                            ) : null}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          }
                        );
                      }
                    }
                  })}
                </div>
              </div>
              <div style={clasess.addPreviousContainer}>
                {activeIndex != 0 ? (
                  <GomakePrimaryButton
                    style={clasess.previousBtnStyle}
                    onClick={handlePreviousClick}
                  >
                    {t("products.offsetPrice.admin.previousBtn")}
                  </GomakePrimaryButton>
                ) : null}
                <GomakePrimaryButton
                  style={clasess.nextBtnStyle}
                  onClick={handleNextClick}
                >
                  {t("products.offsetPrice.admin.nextBtn")}
                </GomakePrimaryButton>
              </div>
            </div>

            <div style={clasess.rightSideContainer}>
              <div style={clasess.headerClientRightSide}>
                <div style={clasess.clientContainer}>
                  <div style={clasess.labelTextStyle}>
                    {t("products.offsetPrice.admin.client")}
                  </div>
                  {clientDefaultValue && (
                    <GoMakeAutoComplate
                      options={renderOptions()}
                      placeholder={t("products.offsetPrice.admin.client")}
                      getOptionLabel={(option: any) =>
                        `${option.name}-${option.code}`
                      }
                      defaultValue={clientDefaultValue}
                      onChangeTextField={checkWhatRenderArray}
                      style={clasess.dropDownListStyle}
                    />
                  )}
                </div>
                <div style={clasess.typeContainer}>
                  <div style={clasess.labelTextStyle}>
                    {t("products.offsetPrice.admin.type")}
                  </div>
                  {clientTypeDefaultValue && (
                    <GoMakeAutoComplate
                      options={clientTypesValue}
                      placeholder={t("products.offsetPrice.admin.type")}
                      getOptionLabel={(option: any) => option.name}
                      defaultValue={clientTypeDefaultValue}
                      style={clasess.dropDownListStyle}
                    />
                  )}
                </div>
              </div>

              <div style={clasess.headerRightSide}>
                <div style={clasess.flyerText}>
                  {t("products.offsetPrice.admin.flyerPoster")}
                </div>
                <div style={clasess.flyerText}>2.00 USD</div>
              </div>
              <div style={clasess.imgProductContainer}>
                <img
                  src={templateMock.img}
                  alt="gomake"
                  style={{ width: "100%", borderRadius: 16 }}
                />
                {/* <Image
                  src={ImgProduct}
                  alt="gomake"
                  style={{ width: "100%" }}
                /> */}
              </div>
              <div style={clasess.urgentEstimateContainer}>
                <div style={clasess.secondText}>
                  {t("products.offsetPrice.admin.takeEstimate", {
                    data: "5 days",
                  })}
                </div>
                <div style={clasess.urgentContainer}>
                  <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                  />
                  <div style={clasess.secondText}>
                    {t("products.offsetPrice.admin.urgentOrder")}
                  </div>
                </div>
              </div>
              <div style={clasess.orderContainer}>
                {t("products.offsetPrice.admin.orderToral", {
                  pieceNum: "15",
                  price: "2.00",
                })}
              </div>
              <div style={clasess.progress}>
                <Slider defaultValue={50} aria-label="Default" />
              </div>
              <div style={clasess.labelBrogressContainer}>
                <div style={clasess.labelStyle}>10.00</div>
                <div style={clasess.labelStyle}>100.00</div>
              </div>
              <div style={clasess.totalContainer}>
                <div style={clasess.totalStyle}>
                  {t("products.offsetPrice.admin.total")}
                </div>
                <div style={clasess.totalStyle}>
                  <GomakeTextInput
                    value={defaultPrice}
                    onChange={(e: any) => setDefaultPrice(e.target.value)}
                    style={clasess.inputPriceStyle}
                  />{" "}
                  USD
                </div>
              </div>
              <div style={clasess.priceRecoveryContainer}>
                <Checkbox
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon />}
                />
                <div style={clasess.secondText}>
                  {t("products.offsetPrice.admin.priceRecovery")}
                </div>
              </div>

              <div style={clasess.switchAdditionsContainer}>
                <div style={clasess.additionsText}>
                  {t("products.offsetPrice.admin.additions")}
                </div>
                <div style={clasess.tabsTypesContainer}>
                  {tabs?.map((tab) => {
                    return (
                      <div
                        onClick={tab.onclick()}
                        style={
                          activeTab === tab.name
                            ? clasess.activeTabStyle
                            : clasess.unActiveTabStyle
                        }
                      >
                        {tab.name}
                      </div>
                    );
                  })}
                </div>
                {activeTab === "Production" ? (
                  <div style={clasess.productionStatus}>
                    <div style={clasess.sampleTypeStyle}>Sample type</div>
                    <div style={clasess.autoCompleteContainer}>
                      <GoMakeAutoComplate
                        options={["q", "w"]}
                        placeholder={t("products.offsetPrice.admin.quote")}
                        style={clasess.dropDownListStyle}
                      />
                    </div>
                    <div style={clasess.multiLineContainer}>
                      <GomakeTextInput
                        multiline={6}
                        style={clasess.multiLineTextInputStyle}
                        placeholder="Production comment"
                      />
                    </div>
                  </div>
                ) : (
                  <div style={clasess.productionStatus}>
                    <div style={clasess.sampleTypeStyle}>Sample type</div>
                    <div style={clasess.autoCompleteContainer}>
                      <GoMakeAutoComplate
                        options={["q", "w"]}
                        placeholder={t("products.offsetPrice.admin.quote")}
                        style={clasess.dropDownListStyle}
                      />
                    </div>
                    <div style={clasess.multiLineContainer}>
                      <GomakeTextInput
                        multiline={6}
                        style={clasess.multiLineTextInputStyle}
                        placeholder="Graphic design comment"
                      />
                    </div>
                  </div>
                )}
              </div>

              <GomakePrimaryButton
                style={clasess.addOrderBtn}
                onClick={onOpeneMakeShape}
              >
                {t("products.offsetPrice.admin.addOrder")}
              </GomakePrimaryButton>
              <div style={clasess.noVatStyle}>
                {t("products.offsetPrice.admin.dontVAT")}
              </div>
            </div>
          </div>
          <MakeShapeModal
            openModal={makeShapeOpen}
            onClose={onCloseMakeShape}
            modalTitle={t("products.offsetPrice.admin.makeShape")}
          />
          <ChooseShapeModal
            openModal={chooseShapeOpen}
            onClose={onCloseChooseShape}
            modalTitle={t("products.offsetPrice.admin.chooseShape")}
          />
        </div>
      )}
    </CustomerAuthLayout>
  );
}
