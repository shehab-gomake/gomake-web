import {GoMakeSelect} from "@/components/select/go-make-select";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";

interface Interface {
    disabled?: boolean;
    onChange?: (v: EWorkSource) => void;
    value: EWorkSource;
}
const InOutSourceSelect = ({disabled, onChange, value}: Interface) => {
    const options = [
        {value: EWorkSource.INTERNAL, label: 'internal'},
        {value: EWorkSource.OUT, label: 'Outsource'}
    ]
    const handleOnChange = (v: EWorkSource) => {
        onChange(v)
    }
  return <GoMakeSelect value={value} onSelectWorkSource={handleOnChange} disabled={disabled} options={options}/>
}
export {InOutSourceSelect}