export interface IStepFormProps {
    children?: JSX.Element
    navigateBack:()=>void;
    navigateNext:()=>void;
    canAddMachine:boolean;
    canUpdate:boolean;
    onClickAdd:()=>void;
    onClickUpdate:()=>void;
    hasBack:boolean;
    hasNext:boolean;
}