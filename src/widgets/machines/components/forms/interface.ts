export interface IStepFormProps {
    navigateBack: () => void;
    navigateNext: () => void;
    onClickUpdate: () => void;
    onClickAdd: () => void;
    hasBack: boolean;
    hasNext: boolean;
    canUpdate: boolean;
    canAddMachine: boolean;
}