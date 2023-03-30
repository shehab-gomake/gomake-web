export interface IInput {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  key: string;
  options: {value: any; text: string}[];
  value?: string;
  disabled?: boolean;
}
export interface IInputContainer {
  input: IInput;
  changeState: (key: string, value: any) => void;
  error: boolean;
}

export interface IArrayInput {
  name: string,
  parameterKey: string;
  value: any[];
  inputs: IInput[];
  updateState: (key: string, value: any) => void;
}
