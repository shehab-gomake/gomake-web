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
  machineInputType?: string;
  isValid: boolean;
  regex?: RegExp;
  inputs: IInput[];
}
export interface IMachineInput {
  input: IInput;
  changeState: (key: string, value: any) => void;
  error: boolean;
  readonly?: boolean;
}

export interface IMachineMultiArrayInput {
  name: string,
  parameterKey: string;
  value: any[];
  inputs: IInput[] | any[];
  updateState: (key: string, value: any) => void;
  machineInputType?: string;
  isValid: boolean;

}


export interface IMachineMultiInput {
  name: string;
  parameterKey: string;
  updateState: (key: string, value: any) => void
  inputs: IInput[]
  machineInputType?: string;
  value?: any
  isValid: boolean;
  disabled?: boolean
}

export interface IMachineInputContainer {
  attribute:  any
  updateState: (key: string, value: any) => void;
  error: boolean;
  newValue?: (key, value) => void;
  disableUpdateValues?: boolean;
}

export type TMachineInput = IMachineMultiInput | IInput | IMachineMultiArrayInput;
