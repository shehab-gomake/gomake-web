import {GoMakeSelect} from "@/components/select/go-make-select";

interface Interface {
    disabled?: boolean;
}
const InOutSourceSelect = ({disabled}: Interface) => {
    const options = [
        {value: 1, label: 'internal'},
        {value: 2, label: 'Outsource'}
    ]
  return <GoMakeSelect disabled={disabled} options={options}/>
}
export {InOutSourceSelect}