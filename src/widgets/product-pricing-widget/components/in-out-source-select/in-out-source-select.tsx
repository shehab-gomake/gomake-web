import {GoMakeSelect} from "@/components/select/go-make-select";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

interface Interface {
    disabled?: boolean;
    onChange?: (v: EWorkSource) => void;
    value: EWorkSource;
    withPartially?: boolean;
}

const InOutSourceSelect = ({disabled, onChange, value, withPartially}: Interface) => {
    const [state, setState] = useState<{ value: EWorkSource, label: string }[]>([])
    const {t} = useTranslation();
    useEffect(() => {
        const options = [
            {value: EWorkSource.INTERNAL, label: withPartially ? t('pricingWidget.inOutSource') : t('pricingWidget.inSource')},
            {value: EWorkSource.OUT, label: t('pricingWidget.outSource')},
        ]
        setState(options)

    }, [withPartially, t])
    const handleOnChange = (v: EWorkSource) => {
        onChange(v)
    }
    return <GoMakeSelect value={value} onSelectWorkSource={handleOnChange} disabled={disabled} options={state}/>
}
export {InOutSourceSelect}