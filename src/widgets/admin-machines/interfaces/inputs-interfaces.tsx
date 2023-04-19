export interface IInput {
  name: string;
  label: string;
  type: 'text' | 'select';
  placeholder: string;
  required: boolean;
  parameterKey: string;
  options: {value: any; text: string}[];
  value?: string;
  disabled?: boolean;
  machineInputType?: MachineInputType;
  inputs: IInput[]
}
export interface IMachineInput {
  input: IInput;
  changeState: (key: string, value: any) => void;
  error: boolean;

}

export interface IMachineMultiArrayInput {
  name: string,
  parameterKey: string;
  value: any[];
  inputs: IInput[];
  updateState: (key: string, value: any) => void;
  machineInputType?: MachineInputType;

}


export interface IMachineMultiInput {
  name: string;
  parameterKey: string;
  updateState: (key: string, value: any) => void
  inputs: IInput[]
  machineInputType?: MachineInputType;
  value?: any

}

export interface IMachineInputContainer {
  attribute:  any
  updateState: (key: string, value: any) => void;
  error: boolean;

}

type MachineInputType = 'input' | 'multiInput' | 'multiArrayInput'