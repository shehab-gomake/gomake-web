interface IEditableData {
    type: EditableDataType;
    value: string | number;
}
export enum EditableDataType {
    TEXT,
    NUMBER,
    SELECT
}
const EditableDataComponent = ({value}: IEditableData) => {
  return(
      <span>{value}</span>
  )
}

export {EditableDataComponent}