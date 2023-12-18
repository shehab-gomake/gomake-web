import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

export interface IInput {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  parameterKey: string;
  options: {value: any; text: string}[];
  optionsUrl?: string;
  value?: string;
  disabled?: boolean;
  isValid: boolean;
  regex?: RegExp;
  inputs?: IInput[];
  unit?: EMeasurementUnits;
  direction?: string;
}
export interface IFormInput {
  input: IInput;
  changeState: (key: string, value: any) => void;
  error: boolean;
  readonly?: boolean;

}

export interface IFormArrayInputsProps {
  name: string,
  parameterKey: string;
  value: any[];
  inputs: IInput[] | any[];
  updateState: (key: string, value: any) => void;
  isValid: boolean;
  newValue?: (key, value) => void;
  disableUpdateValues?: boolean;
}

