export interface IInput {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  key: string;
}
export interface IInputContainer {
  input: IInput;
  changeState: (key: string, value: any) => void;
  error: boolean;
  placeholder?: string;
  handleKeyPress?: any
}
