import { EMeasurementUnits } from "@/widgets/machines/enums/measurement-units";

export interface IInput {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  parameterKey: string;
  options: { value: any; text: string }[];
  optionsUrl?: string;
  value?: string;
  values?: string[];
  disabled?: boolean;
  isValid: boolean;
  regex?: RegExp;
  inputs?: IInput[];
  unit?: EMeasurementUnits;
  direction?: string;
  multiple?: boolean;
  materialType?: string;
  disableClearable?: boolean;
  defaultInDocsTypes?: any;
  secondValue?: string;
  isRequired?: boolean;
  iconElement?: React.ReactNode;
  note?: string;
  dropdownStyle?: React.CSSProperties;
}
export interface ICustomStyles {
  textInput?: React.CSSProperties;
  select?: React.CSSProperties;
  autocomplete?: React.CSSProperties;
  colorInput?: React.CSSProperties;
  phoneInput?: React.CSSProperties;
  imageInput?: React.CSSProperties;
  container?: React.CSSProperties;
}

export interface IFormInput {
  input: IInput;
  changeState: (key: string, value: any) => void;
  error: boolean;
  readonly?: boolean;
  disableLabel?: boolean;
  checkWhatRenderArray?: any;
  loading?: any; // loading while fetching data in DropDownList
  keyItem?: any;
  hideLabel?: boolean;
  customStyles?: ICustomStyles;
}

export interface IFormArrayInputsProps {
  name: string;
  parameterKey: string;
  value: any[];
  inputs: IInput[] | any[];
  updateState: (key: string, value: any) => void;
  isValid: boolean;
  newValue?: (key, value) => void;
  disableUpdateValues?: boolean;
  disabled?: boolean;
  disableAddValue?: boolean;
  containerStyle?: React.CSSProperties;
}
